import info from "$lib/server-jars/server-jars.json"

export const findVersion = (versions: any, version: string) => versions.find((item: any) => item.version === version)

export const findLatestVersion = (versions: any) => versions[0]

export const fetchSupportedPlatforms = () => info.map((platform) => { return { key: platform.platform, name: platform.display } })

export const fetchVersionsFor = async (platform: string) => await handle(true, platform, null)

export const fetchDetailsFor = async (platform: string, version: string) => await handle(false, platform, version)

const handleVersion = async (version: string, versions: string[]) => version.toLowerCase() === "latest" ? findLatestVersion(versions) : version

const handle = async (handleVersions: boolean, platform: string, version: string | null) => {
    let versions

    switch (platform.toLowerCase()) {
        case "paper":
        case "waterfall":
        case "velocity":
        case "folia":
            versions = await fetchPaperMcVersionsFor(platform)
            return handleVersions ? versions : fetchPaperMcDetailsFor(platform, await handleVersion(version!!, versions))

        case "purpur":
            versions = await fetchPurpurVersions()
            return handleVersions ? versions : fetchPurpurDetailsFor(await handleVersion(version!!, versions))

        case "pufferfish":
            versions = await fetchPufferfishVersions()
            return handleVersions ? versions : fetchPufferfishDetailsFor(await handleVersion(version!!, versions))

        case "fabric":
            versions = await fetchFabricVersions()
            return handleVersions ? versions : fetchFabricDetailsFor(await handleVersion(version!!, versions))

        case "vanilla":
            versions = await fetchVanillaVersions()
            return handleVersions ? versions : fetchVanillaDetailsFor(await handleVersion(version!!, versions))

        case "spigot":
        case "craftbukkit":
        case "forge":
            versions = await fetchManualVersionsFor(platform)
            return handleVersions ? versions : fetchManualDetailsFor(platform, await handleVersion(version!!, versions))
        case "neoforge":
            versions = await fetchNeoforgeVersions()
            return handleVersions ? versions : fetchNeoforgeDetailsFor(await handleVersion(version!!, versions))
        case "quilt":
            versions = await fetchQuiltVersions()
            return handleVersions ? versions: fetchQuiltDetailsFor(await handleVersion(version!!, versions))
        default:
            return null
    }
}

// Start Manual Platforms

// @ts-ignore
export const fetchManualVersionsFor = async (platform: string) => info.find((item) => item.platform === platform).jars.map((version: any) => version.version)

export const fetchManualDetailsFor = async (platform: string, version: string) => {
    // @ts-ignore
    const platformResponse = info.find((item) => item.platform === platform)!!
    // @ts-ignore
    const versionResponse = platformResponse.jars.find((item) => item.version === version)!!
    return {
        platform: platformResponse.platform,
        display: platformResponse.display,
        version: versionResponse.version,
        release: versionResponse.release,
        // @ts-ignore
        downloadUrl: versionResponse.downloadUrl ?? `https://cdn.mcutils.com/jars/${platformResponse.platform}-${versionResponse.version}.jar`
    }
}

// End Manual Platforms

// Start PaperMC Platforms 

const PAPERMC_API_URL = "https://api.papermc.io/v2/projects"

export const fetchPaperMcVersionsFor = async (platform: string) => (await (await fetch(`${PAPERMC_API_URL}/${platform}`)).json()).versions.reverse()

export const fetchPaperMcDetailsFor = async (platform: string, version: string) => {
    const url = `${PAPERMC_API_URL}/${platform}/versions/${version}`;
    const response = await (await fetch(`${url}/builds/${(await (await fetch(url)).json()).builds.reverse()[0]}`)).json()
    return {
        platform: response.project_id,
        display: response.project_name,
        version: response.version,
        release: formatDate(new Date(response.time)),
        downloadUrl: `${url}/builds/${response.build}/downloads/${response.downloads.application.name}`
    }
}

// End PaperMC Platforms

// Start Purpur

const PURPUR_API_URL = "https://api.purpurmc.org/v2/purpur"

export const fetchPurpurVersions = async () => (await (await fetch(PURPUR_API_URL)).json()).versions.reverse()

export const fetchPurpurDetailsFor = async (version: string) => {
    const url = `${PURPUR_API_URL}/${version}/latest`
    const response = await (await fetch(url)).json()
    return {
        platform: "purpur",
        display: "Purpur",
        version: response.version,
        release: formatDate(new Date(response.timestamp)),
        downloadUrl: `${url}/download`
    }
}

// End Purpur

// Start Pufferfish

const PUFFERFISH_API_URL = "https://ci.pufferfish.host"

export const fetchPufferfishVersions = async () => (await (await fetch(`${PUFFERFISH_API_URL}/api/json`)).json()).jobs.filter((job: any) => job.name.startsWith("Pufferfish-1.")).map((job: any) => job.name.split("-")[1]).reverse()

export const fetchPufferfishDetailsFor = async (version: string) => {
    const url = `${PUFFERFISH_API_URL}/job/Pufferfish-${version}/lastSuccessfulBuild`
    const response = await (await fetch(`${url}/api/json`)).json()
    return {
        platform: "pufferfish",
        display: "Pufferfish",
        version: version,
        release: formatDate(new Date(response.timestamp)),
        downloadUrl: `${url}/artifact/${response.artifacts[0].relativePath}`
    }
}

// End Pufferfish

// Start Fabric

const FABRIC_API_URL = "https://meta.fabricmc.net/v2/versions"

export const fetchFabricVersions = async () => (await (await fetch(`${FABRIC_API_URL}/game`)).json()).filter((version: any) => version.stable).map((version: any) => version.version)

export const fetchFabricDetailsFor = async (version: string) => {
    const url = `${FABRIC_API_URL}/loader/${version}`
    const loader = (await (await fetch(url)).json())[0].loader.version
    const response = (await (await fetch(`${url}/${loader}/server/json`)).json())
    return {
        platform: "fabric",
        display: "Fabric",
        version: version,
        release: formatDate(new Date(response.releaseTime)),
        downloadUrl: `${url}/${loader}/${(await (await fetch(`${FABRIC_API_URL}/installer`)).json())[0].version}/server/jar`
    }
}

// End Fabric

// Start NeoForge
const NEOFORGE_BASE_URL = "https://maven.neoforged.net"
const NEOFORGE_MAVEN_PATH = "/releases/net/neoforged/neoforge"

export const fetchNeoforgeVersions = async () => {
    // @ts-ignore
    return info.find((item) => item.platform === "neoforge").jars.map((version: any) => version.version)
}

export const fetchNeoforgeDetailsFor = async (version: string) => {
    // @ts-ignore
    const platformResponse = info.find((item) => item.platform === "neoforge")!!
    // @ts-ignore
    const versionResponse = platformResponse.jars.find((item) => item.version === version)!!

    return {
        platform: platformResponse.platform,
        display: platformResponse.display,
        version: versionResponse.version,
        release: versionResponse.release,
        downloadUrl: `${NEOFORGE_BASE_URL}${NEOFORGE_MAVEN_PATH}/${version}/neoforge-${version}-installer.jar`
    }
}

// End NeoForge

// Start Quilt
const QUILT_API_URL = "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-installer"

export const fetchQuiltVersions = async () => {
    // @ts-ignore
    return info.find((item) => item.platform === "quilt").jars.map((version: any) => version.version)
}

export const fetchQuiltDetailsFor = async (version: string) => {
    // @ts-ignore
    const platformResponse = info.find((item) => item.platform === "quilt")!!
    // @ts-ignore
    const versionResponse = platformResponse.jars.find((item) => item.version === version)!!

    return {
        platform: platformResponse.platform,
        display: platformResponse.display,
        version: versionResponse.version,
        release: versionResponse.release,
        downloadUrl: `${QUILT_API_URL}/${version}/quilt-installer-${version}.jar`
    }
}
// End Quilt


// Start Vanilla

const VANILLA_VERSIONS_API_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json"

export const fetchVanillaVersions = async () => (await (await fetch(VANILLA_VERSIONS_API_URL)).json()).versions.filter((version: any) => version.type === "release").map((version: any) => version.id)

export const fetchVanillaDetailsFor = async (version: string) => {
    const response = (await (await fetch(VANILLA_VERSIONS_API_URL)).json()).versions.filter((ver: any) => ver.type === "release").filter((ver: any) => ver.id === version)[0]
    const details = (await (await fetch(response.url)).json())
    return {
        platform: "vanilla",
        display: "Vanilla",
        version: version,
        release: formatDate(new Date(response.releaseTime)),
        downloadUrl: details.downloads.server.url
    }
}

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
