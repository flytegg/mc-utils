import info from "$lib/server-jars/server-jars.json"

export const findByPlatform = (platform: string) => {
	return info.find((item) => item.platform === platform)
}

export const findVersion = (versions: any, version: string) => {
	return versions.find((item: any) => item.version === version)
}