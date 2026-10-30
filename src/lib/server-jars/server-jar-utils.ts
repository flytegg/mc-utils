import info from "$lib/server-jars/server-jars.json"
import { cached, type WaitUntil } from "$lib/server-jars/cache"

// A single downloadable jar. `version` is always the Minecraft version (or the project's own
// version for proxies/installers) and `build` is the platform's build/loader version.
export type JarEntry = {
    version: string
    build?: string
    release?: string
    // Upstream download url. When absent but `downloadable` is true it is resolved on download.
    downloadUrl?: string
    downloadable: boolean
    checkedAt?: number
}

export type JarListing = {
    platform: string
    display: string
    entries: JarEntry[]
}

const MINUTE = 60 * 1000
const DAY = 24 * 60 * MINUTE

// How long a listing is considered fresh before it is refreshed (stale copies are still served
// while refreshing). Refreshes are incremental, so this mostly costs one upstream request.
const LISTING_TTL = 30 * MINUTE
// Older versions very rarely get new builds, so where a refresh would need one request per
// version we only re-check the newest versions every refresh and the rest weekly.
const OLD_VERSION_TTL = 7 * DAY
const ALWAYS_REFRESH_NEWEST = 2

const VERSION_LABELS: Record<string, string> = {
    velocity: "Version",
    waterfall: "Version",
    quilt: "Installer Version",
}

export const fetchSupportedPlatforms = () => info.map((platform) => {
    return { key: platform.platform, name: platform.display, versionLabel: VERSION_LABELS[platform.platform] ?? "Minecraft Version" }
})

const displayFor = (platform: string) => info.find((item) => item.platform === platform)?.display ?? platform

const jarsFor = (platform: string): any[] => (info.find((item) => item.platform === platform) as any)?.jars ?? []

const getJson = async (url: string, init?: RequestInit) => {
    const response = await fetch(url, init)
    if (!response.ok) throw new Error(`${url} responded with ${response.status}`)
    return response.json()
}

const mapInBatches = async <T, R>(items: T[], batchSize: number, mapper: (item: T, index: number) => Promise<R>) => {
    const results: PromiseSettledResult<R>[] = []
    for (let i = 0; i < items.length; i += batchSize) {
        results.push(...await Promise.allSettled(items.slice(i, i + batchSize).map((item, j) => mapper(item, i + j))))
    }
    return results
}

const LOADERS: Record<string, (previous?: JarEntry[]) => Promise<JarEntry[]>> = {
    paper: (previous) => fetchPaperMcEntries("paper", previous),
    folia: (previous) => fetchPaperMcEntries("folia", previous),
    velocity: (previous) => fetchPaperMcEntries("velocity", previous),
    waterfall: (previous) => fetchPaperMcEntries("waterfall", previous),
    purpur: (previous) => fetchPurpurEntries(previous),
    pufferfish: () => fetchPufferfishEntries(),
    fabric: () => fetchFabricEntries(),
    vanilla: () => fetchVanillaEntries(),
}

const STATIC_LOADERS: Record<string, () => JarEntry[]> = {
    spigot: () => manualEntries("spigot"),
    craftbukkit: () => manualEntries("craftbukkit"),
    forge: () => manualEntries("forge"),
    neoforge: () => neoforgeEntries(),
    quilt: () => quiltEntries(),
}

export const fetchListingFor = async (platform: string, waitUntil?: WaitUntil): Promise<JarListing | null> => {
    platform = platform.toLowerCase()

    let entries: JarEntry[]
    if (STATIC_LOADERS[platform]) entries = STATIC_LOADERS[platform]()
    else if (LOADERS[platform]) entries = await cached(`listing:${platform}`, LISTING_TTL, LOADERS[platform], waitUntil)
    else return null

    return { platform, display: displayFor(platform), entries }
}

export const findEntry = (listing: JarListing, version: string): JarEntry | undefined => {
    if (version.toLowerCase() === "latest") return listing.entries[0]
    return listing.entries.find((entry) => entry.version === version)
        // Older links refer to NeoForge jars by their NeoForge version
        ?? listing.entries.find((entry) => entry.build === version)
        ?? (listing.platform === "neoforge" ? neoforgeEntry(version) : undefined)
}

// Kept for API compatibility: PaperMC platforms used to report their version as `<version>-<build>`
export const legacyVersionFor = (platform: string, entry: JarEntry) =>
    PAPERMC_PLATFORMS.has(platform) && entry.build ? `${entry.version}-${entry.build}` : entry.version

export const resolveDownloadUrl = async (platform: string, entry: JarEntry): Promise<string | undefined> => {
    if (!entry.downloadable) return undefined
    if (entry.downloadUrl) return entry.downloadUrl
    if (platform === "vanilla") return fetchVanillaDownloadUrl(entry.version)
    return undefined
}

// Start Manual Platforms

const manualEntries = (platform: string): JarEntry[] => jarsFor(platform).map((jar) => {
    // Forge urls look like .../forge-<mc version>-<forge version>-installer.jar
    const forgeBuild = jar.downloadUrl?.match(/forge-[^/]+?-([^/-]+)-installer\.jar$/)?.[1]
    return {
        version: jar.version,
        build: forgeBuild,
        release: jar.release,
        downloadUrl: jar.downloadUrl ?? `https://cdn.mcutils.com/jars/${platform}-${jar.version}.jar`,
        downloadable: true,
    }
})

// End Manual Platforms

// Start PaperMC Platforms

const PAPERMC_API_URL = "https://fill.papermc.io/v3/projects"
const PAPERMC_PLATFORMS = new Set(["paper", "folia", "velocity", "waterfall"])

// PaperMC requires a non-generic User-Agent header on all requests to the fill API.
// Use a clear identifier and contact URL so requests are accepted by the service.
// Allow overriding via environment variable `PAPERMC_USER_AGENT`. Fall back to a
// sensible default when not provided.
const PAPERMC_USER_AGENT = (typeof process !== "undefined" ? process.env?.PAPERMC_USER_AGENT : undefined) || "mc-utils/1.0 (https://github.com/flytegg/mc-utils)"
const PAPERMC_INIT = { headers: { 'User-Agent': PAPERMC_USER_AGENT } }

// The versions endpoint lists every build id for every version in one request. Builds are
// immutable, so a version only needs another request when its latest build id changes.
const fetchPaperMcEntries = async (platform: string, previous?: JarEntry[]): Promise<JarEntry[]> => {
    const { versions } = await getJson(`${PAPERMC_API_URL}/${platform}/versions`, PAPERMC_INIT)
    const candidates = (versions as any[])
        .filter((item, index) => !(index > 0 && item.version.id.includes("pre") || item.version.id.includes("rc")))
        .filter((item) => item.builds.length > 0)
    const previousByVersion = new Map(previous?.map((entry) => [entry.version, entry]))

    const results = await mapInBatches(candidates, 10, async (item): Promise<JarEntry | null> => {
        const version: string = item.version.id
        const latestBuild = String(Math.max(...item.builds))
        const cachedEntry = previousByVersion.get(version)
        if (cachedEntry?.build === latestBuild) return cachedEntry

        const build = await getJson(`${PAPERMC_API_URL}/${platform}/versions/${version}/builds/${latestBuild}`, PAPERMC_INIT)
        const download = build.downloads?.['server:default']
        if (!download) return null

        return {
            version,
            build: latestBuild,
            release: formatDate(new Date(build.time)),
            downloadUrl: download.url,
            downloadable: true,
        }
    })

    return results.map((result, index) =>
        // Keep the last known build if this check failed
        result.status === 'fulfilled' ? result.value : previousByVersion.get(candidates[index].version.id) ?? null
    ).filter((entry): entry is JarEntry => !!entry)
}

// End PaperMC Platforms

// Start Purpur

const PURPUR_API_URL = "https://api.purpurmc.org/v2/purpur"

const fetchPurpurEntries = async (previous?: JarEntry[]): Promise<JarEntry[]> => {
    const versions: string[] = (await getJson(PURPUR_API_URL)).versions.reverse()
    const previousByVersion = new Map(previous?.map((entry) => [entry.version, entry]))

    const results = await mapInBatches(versions, 10, async (version, index): Promise<JarEntry> => {
        const cachedEntry = previousByVersion.get(version)
        if (cachedEntry && index >= ALWAYS_REFRESH_NEWEST && Date.now() - (cachedEntry.checkedAt ?? 0) < OLD_VERSION_TTL) return cachedEntry

        const response = await getJson(`${PURPUR_API_URL}/${version}/latest`)
        return {
            version,
            build: response.build,
            release: formatDate(new Date(response.timestamp)),
            downloadUrl: `${PURPUR_API_URL}/${version}/${response.build}/download`,
            downloadable: true,
            checkedAt: Date.now(),
        }
    })

    return results.map((result, index) =>
        result.status === 'fulfilled' ? result.value : previousByVersion.get(versions[index]) ?? null
    ).filter((entry): entry is JarEntry => !!entry)
}

// End Purpur

// Start Pufferfish

const PUFFERFISH_API_URL = "https://ci.pufferfish.host"

// One request for every job and its last successful build
const fetchPufferfishEntries = async (): Promise<JarEntry[]> => {
    const response = await getJson(`${PUFFERFISH_API_URL}/api/json?tree=jobs[name,lastSuccessfulBuild[number,timestamp,artifacts[relativePath]]]`)
    return (response.jobs as any[])
        .filter((job) => job.name.startsWith("Pufferfish-1.") && job.lastSuccessfulBuild?.artifacts?.length)
        .map((job) => {
            const build = job.lastSuccessfulBuild
            return {
                version: job.name.split("-")[1],
                build: String(build.number),
                release: formatDate(new Date(build.timestamp)),
                downloadUrl: `${PUFFERFISH_API_URL}/job/${job.name}/${build.number}/artifact/${build.artifacts[0].relativePath}`,
                downloadable: true,
            }
        })
        .reverse()
}

// End Pufferfish

// Start Fabric

const FABRIC_API_URL = "https://meta.fabricmc.net/v2/versions"

// The latest loader and installer work for every supported game version, so three requests cover everything
const fetchFabricEntries = async (): Promise<JarEntry[]> => {
    const [games, loaders, installers] = await Promise.all([
        getJson(`${FABRIC_API_URL}/game`),
        getJson(`${FABRIC_API_URL}/loader`),
        getJson(`${FABRIC_API_URL}/installer`),
    ])
    const loader = (loaders.find((item: any) => item.stable) ?? loaders[0]).version
    const installer = (installers.find((item: any) => item.stable) ?? installers[0]).version

    return games.filter((game: any) => game.stable).map((game: any) => {
        return {
            version: game.version,
            build: loader,
            downloadUrl: `${FABRIC_API_URL}/loader/${game.version}/${loader}/${installer}/server/jar`,
            downloadable: true,
        }
    })
}

// End Fabric

// Start NeoForge

const NEOFORGE_BASE_URL = "https://maven.neoforged.net"
const NEOFORGE_MAVEN_PATH = "/releases/net/neoforged/neoforge"

// NeoForge versions encode the Minecraft version they target:
//   20.x/21.x:        <mc minor>.<mc patch>.<build>          e.g. 21.1.77 -> 1.21.1, 21.0.10 -> 1.21
//   26.1 and later:   <mc year>.<mc drop>.<mc hotfix>.<build> e.g. 26.1.0.5 -> 26.1, 26.1.2.3 -> 26.1.2
export const neoforgeToMinecraftVersion = (neoforgeVersion: string) => {
    const [major, minor, patch] = neoforgeVersion.split("-")[0].split(".")
    if (Number(major) < 25) return minor === "0" ? `1.${major}` : `1.${major}.${minor}`
    return patch === "0" ? `${major}.${minor}` : `${major}.${minor}.${patch}`
}

const compareNumericVersions = (a: string, b: string) => {
    const left = a.split("-")[0].split(".").map(Number)
    const right = b.split("-")[0].split(".").map(Number)
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const difference = (left[i] ?? 0) - (right[i] ?? 0)
        if (difference !== 0) return difference
    }
    return 0
}

const neoforgeEntryFor = (jar: any): JarEntry => {
    return {
        version: neoforgeToMinecraftVersion(jar.version),
        build: jar.version,
        release: jar.release,
        downloadUrl: `${NEOFORGE_BASE_URL}${NEOFORGE_MAVEN_PATH}/${jar.version}/neoforge-${jar.version}-installer.jar`,
        downloadable: true,
    }
}

// One row per Minecraft version, using its newest NeoForge build
const neoforgeEntries = (): JarEntry[] => {
    const latest = new Map<string, any>()
    for (const jar of jarsFor("neoforge")) {
        const minecraftVersion = neoforgeToMinecraftVersion(jar.version)
        const current = latest.get(minecraftVersion)
        if (!current || compareNumericVersions(jar.version, current.version) > 0) latest.set(minecraftVersion, jar)
    }
    return [...latest.values()]
        .sort((a, b) => compareNumericVersions(b.version, a.version))
        .map(neoforgeEntryFor)
}

const neoforgeEntry = (neoforgeVersion: string): JarEntry | undefined => {
    const jar = jarsFor("neoforge").find((item) => item.version === neoforgeVersion)
    return jar ? neoforgeEntryFor(jar) : undefined
}

// End NeoForge

// Start Quilt
const QUILT_API_URL = "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-installer"

// Quilt only publishes an installer, which works for every Minecraft version
const quiltEntries = (): JarEntry[] => jarsFor("quilt").map((jar) => {
    return {
        version: jar.version,
        release: jar.release,
        downloadUrl: `${QUILT_API_URL}/${jar.version}/quilt-installer-${jar.version}.jar`,
        downloadable: true,
    }
})

// End Quilt

// Start Vanilla

const VANILLA_VERSIONS_API_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
const VANILLA_PROBLEMATIC_VERSIONS = new Set(['1.0', '1.1', '1.2.1', '1.2.2', '1.2.3', '1.2.4'])

const fetchVanillaReleases = async () => (await getJson(VANILLA_VERSIONS_API_URL)).versions.filter((version: any) => version.type === "release")

// The manifest has every release and its date; download urls are resolved when a jar is actually downloaded
const fetchVanillaEntries = async (): Promise<JarEntry[]> => (await fetchVanillaReleases()).map((version: any) => {
    return {
        version: version.id,
        release: formatDate(new Date(version.releaseTime)),
        downloadable: !VANILLA_PROBLEMATIC_VERSIONS.has(version.id),
    }
})

// A released version's metadata never changes, so it can be cached for a long time
const fetchVanillaDownloadUrl = (version: string) => cached<string | undefined>(`vanilla-download:${version}`, 30 * DAY, async () => {
    const release = (await fetchVanillaReleases()).find((item: any) => item.id === version)
    if (!release) return undefined
    return (await getJson(release.url)).downloads?.server?.url
})

// End Vanilla

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export const formatDate = (date: Date) => {
    const day = date.getDate()

    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st'
    else if (day % 10 === 2 && day !== 12) suffix = 'nd'
    else if (day % 10 === 3 && day !== 13) suffix = 'rd'

    return `${MONTH_NAMES[date.getMonth()]} ${day}${suffix} ${date.getFullYear()}`
}
