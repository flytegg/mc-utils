import info from "$lib/server-jars/server-jars.json"
import { cached, type WaitUntil } from "$lib/server-jars/cache"

// Every platform is read live from its own API or Maven repository; server-jars.json only holds
// platform names. Spigot and CraftBukkit are intentionally not served: neither has an official API
// or download source, so they could only be offered by hosting jars ourselves and updating by hand.

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
// Part of every listing's cache key. Bump it whenever what a loader returns changes, so listings
// cached by older code (kept for up to 30 days) are not served after a deploy.
const LISTING_CACHE_VERSION = 2

const VERSION_LABELS: Record<string, string> = {
    velocity: "Version",
    waterfall: "Version",
    quilt: "Installer Version",
}

export const fetchSupportedPlatforms = () => info.map((platform) => {
    return { key: platform.platform, name: platform.display, versionLabel: VERSION_LABELS[platform.platform] ?? "Minecraft Version" }
})

const displayFor = (platform: string) => info.find((item) => item.platform === platform)?.display ?? platform

const getResponse = async (url: string, init?: RequestInit) => {
    const response = await fetch(url, init)
    if (!response.ok) throw new Error(`${url} responded with ${response.status}`)
    return response
}

const getJson = async (url: string, init?: RequestInit) => (await getResponse(url, init)).json()

const getMavenVersions = async (metadataUrl: string): Promise<string[]> =>
    [...(await (await getResponse(metadataUrl)).text()).matchAll(/<version>([^<]+)<\/version>/g)].map((match) => match[1])

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
    forge: async (previous) => withRecentReleaseDates(await fetchForgeEntries(), previous),
    neoforge: async (previous) => withRecentReleaseDates(await fetchNeoforgeEntries(), previous),
    quilt: () => fetchQuiltEntries(),
}

export const fetchListingFor = async (platform: string, waitUntil?: WaitUntil): Promise<JarListing | null> => {
    platform = platform.toLowerCase()
    if (!LOADERS[platform]) return null

    const entries = await cached(`listing:v${LISTING_CACHE_VERSION}:${platform}`, LISTING_TTL, LOADERS[platform], waitUntil)
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

// Maven feeds don't include release dates, but each installer's Last-Modified header does. Looking
// that up is one request per build, so only the newest few versions get a date, and a date is
// reused until that version's build changes.
const RELEASE_DATE_VERSIONS = 5

const withRecentReleaseDates = async (entries: JarEntry[], previous?: JarEntry[]): Promise<JarEntry[]> => {
    const recent = entries.slice(0, RELEASE_DATE_VERSIONS)
    const dated = await Promise.all(recent.map(async (entry) => {
        const cachedEntry = previous?.find((item) => item.version === entry.version && item.build === entry.build)
        if (cachedEntry?.release) return { ...entry, release: cachedEntry.release }
        try {
            const lastModified = (await getResponse(entry.downloadUrl!, { method: "HEAD" })).headers.get("Last-Modified")
            return lastModified ? { ...entry, release: formatDate(new Date(lastModified)) } : entry
        } catch {
            return entry
        }
    }))
    return [...dated, ...entries.slice(RELEASE_DATE_VERSIONS)]
}

// Start Forge

const FORGE_MAVEN_URL = "https://maven.minecraftforge.net/net/minecraftforge/forge"
const FORGE_PROMOTIONS_URL = "https://files.minecraftforge.net/net/minecraftforge/forge/promotions_slim.json"
// Forge only started publishing installers with 1.5.2
const FORGE_FIRST_INSTALLER_VERSION = "1.5.2"

// Promotions list the recommended/latest build for every Minecraft version, and the Maven metadata
// gives each build's full version, which for some older builds has the Minecraft version appended
const fetchForgeEntries = async (): Promise<JarEntry[]> => {
    const [{ promos }, mavenVersions] = await Promise.all([
        getJson(FORGE_PROMOTIONS_URL),
        getMavenVersions(`${FORGE_MAVEN_URL}/maven-metadata.xml`),
    ])
    const minecraftVersions = [...new Set(Object.keys(promos).map((key) => key.slice(0, key.lastIndexOf("-"))))]
        .filter((version) => isNumericVersion(version) && compareNumericVersions(version, FORGE_FIRST_INSTALLER_VERSION) >= 0)
        .sort((a, b) => compareNumericVersions(b, a))

    return minecraftVersions.map((version): JarEntry | null => {
        const build = promos[`${version}-recommended`] ?? promos[`${version}-latest`]
        const mavenVersion = mavenVersions.find((item) => item === `${version}-${build}` || item.startsWith(`${version}-${build}-`))
        if (!mavenVersion) return null
        return {
            version,
            build,
            downloadUrl: `${FORGE_MAVEN_URL}/${mavenVersion}/forge-${mavenVersion}-installer.jar`,
            downloadable: true,
        }
    }).filter((entry): entry is JarEntry => !!entry)
}

// End Forge

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

const isNumericVersion = (version: string) => /^\d+(\.\d+)*$/.test(version)

const compareNumericVersions = (a: string, b: string) => {
    const left = a.split("-")[0].split(".").map(Number)
    const right = b.split("-")[0].split(".").map(Number)
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const difference = (left[i] ?? 0) - (right[i] ?? 0)
        if (difference !== 0) return difference
    }
    return 0
}

// Matches regular NeoForge releases, skipping one-off builds such as 0.25w14craftmine.3-beta
const NEOFORGE_VERSION_PATTERN = /^\d+\.\d+\.\d+(\.\d+)?(-beta)?$/

const neoforgeEntryFor = (neoforgeVersion: string): JarEntry => {
    return {
        version: neoforgeToMinecraftVersion(neoforgeVersion),
        build: neoforgeVersion,
        downloadUrl: `${NEOFORGE_BASE_URL}${NEOFORGE_MAVEN_PATH}/${neoforgeVersion}/neoforge-${neoforgeVersion}-installer.jar`,
        downloadable: true,
    }
}

// One row per Minecraft version, using its newest NeoForge build
const fetchNeoforgeEntries = async (): Promise<JarEntry[]> => {
    const { versions } = await getJson(`${NEOFORGE_BASE_URL}/api/maven/versions${NEOFORGE_MAVEN_PATH}`)
    const latest = new Map<string, string>()
    for (const version of (versions as string[]).filter((item) => NEOFORGE_VERSION_PATTERN.test(item))) {
        const minecraftVersion = neoforgeToMinecraftVersion(version)
        const current = latest.get(minecraftVersion)
        if (!current || compareNumericVersions(version, current) > 0) latest.set(minecraftVersion, version)
    }
    return [...latest.values()]
        .sort((a, b) => compareNumericVersions(b, a))
        .map(neoforgeEntryFor)
}

// Older links refer to any NeoForge build by its own version, not just the newest per Minecraft version
const neoforgeEntry = (neoforgeVersion: string): JarEntry | undefined =>
    NEOFORGE_VERSION_PATTERN.test(neoforgeVersion) ? neoforgeEntryFor(neoforgeVersion) : undefined

// End NeoForge

// Start Quilt

const QUILT_API_URL = "https://meta.quiltmc.org/v3/versions/installer"

// Quilt only publishes an installer, which works for every Minecraft version
const fetchQuiltEntries = async (): Promise<JarEntry[]> => (await getJson(QUILT_API_URL)).map((installer: any) => {
    return {
        version: installer.version,
        downloadUrl: installer.url,
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
