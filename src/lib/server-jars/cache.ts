// Stale-while-revalidate cache for upstream server jar data.
//
// Entries live in isolate memory and, when running on Cloudflare, in the Cache API so
// they survive across isolates. Entries are kept long after they go stale: a stale entry
// is served immediately while a refresh runs in the background, and the loader receives
// the previous value so it can reuse anything that hasn't changed upstream.

type Stored<T> = { data: T, fetchedAt: number }

export type WaitUntil = (promise: Promise<unknown>) => void

export const waitUntilFrom = (platform?: App.Platform): WaitUntil | undefined => {
    const context = platform?.context
    return context ? (promise) => context.waitUntil(promise) : undefined
}

const CACHE_KEY_ORIGIN = "https://cache.mcutils.com/server-jars/"
const PERSIST_SECONDS = 60 * 60 * 24 * 30 // 30 days

const memory = new Map<string, Stored<any>>()
const inflight = new Map<string, Promise<any>>()

const persistentCache = (): Cache | undefined => (globalThis as any).caches?.default

const readPersistent = async <T>(key: string): Promise<Stored<T> | undefined> => {
    const cache = persistentCache()
    if (!cache) return undefined
    try {
        const response = await cache.match(CACHE_KEY_ORIGIN + key)
        return response ? await response.json() : undefined
    } catch {
        return undefined
    }
}

const writePersistent = async <T>(key: string, stored: Stored<T>) => {
    const cache = persistentCache()
    if (!cache) return
    try {
        await cache.put(CACHE_KEY_ORIGIN + key, new Response(JSON.stringify(stored), {
            headers: { "Content-Type": "application/json", "Cache-Control": `max-age=${PERSIST_SECONDS}` }
        }))
    } catch {
        // Persisting is best effort, the in-memory copy still works
    }
}

const refresh = <T>(key: string, load: (previous?: T) => Promise<T>, previous?: T): Promise<T> => {
    const existing = inflight.get(key)
    if (existing) return existing

    const promise = (async () => {
        try {
            const stored = { data: await load(previous), fetchedAt: Date.now() }
            memory.set(key, stored)
            await writePersistent(key, stored)
            return stored.data
        } finally {
            inflight.delete(key)
        }
    })()
    inflight.set(key, promise)
    return promise
}

export const cached = async <T>(
    key: string,
    ttlMs: number,
    load: (previous?: T) => Promise<T>,
    waitUntil?: WaitUntil
): Promise<T> => {
    let stored: Stored<T> | undefined = memory.get(key)
    if (!stored) {
        stored = await readPersistent<T>(key)
        if (stored) memory.set(key, stored)
    }

    if (stored && Date.now() - stored.fetchedAt < ttlMs) return stored.data
    if (!stored) return refresh(key, load)

    // Serve the stale copy now and refresh in the background
    const pending = refresh(key, load, stored.data).catch((e) => console.error(`Failed to refresh ${key}`, e))
    waitUntil?.(pending)
    return stored.data
}
