import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import info from "$lib/server-jars.json"

export const GET = (async ({ params, url }) => {
	const platform: any | null = findByPlatform(params.platform)
	if (!platform) return new Response(null, {
		status: 204,
		statusText: `There is no platform ${params.platform}`
	})

	const version: any | null = findVersion(platform.jars, params.version)
	if (!version) return new Response(null, {
		status: 204,
		statusText:  `No version ${params.version} on ${params.platform}`
	})

	return json({
		platform: platform.platform,
		display: platform.display,
		version: version.version,
		release: version.release,
		size: version.size,
		downloadUrl: `${url.href}/download`,
	})
}) satisfies RequestHandler

const findByPlatform = (platform: string) => {
	return info.find((item) => item.platform === platform)
}

const findVersion = (versions: any, version: string) => {
	return versions.find((item: any) => item.version === version)
}