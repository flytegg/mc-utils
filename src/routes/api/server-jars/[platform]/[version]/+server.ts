import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import info from "$lib/server-jars.json"

export const GET = (async ({ params }) => {
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

	const downloadUrl = version.downloadURL ?? `https://cdn.mcutils.com/jars/${params.platform}-${params.version}.jar`
	throw redirect(302, downloadUrl)
}) satisfies RequestHandler

const findByPlatform = (platform: string) => {
	for (const i in info) {
		if (info[i].platform === platform) {
			return info[i]	
		}
	}
	return null;
}

const findVersion = (versions: any, version: string) => {
	for (const i in versions) {
		if (versions[i].version === version) {
			return versions[i]	
		}
	}
	return null;
}