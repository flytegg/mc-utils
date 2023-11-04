import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import info from "$lib/server-jars.json"

export const GET = (async ({ params }) => {
	const platform: any | null = findByPlatform(params.platform)
	if (!platform) return new Response(null, {
		status: 204,
		statusText: `There is no platform ${params.platform}`
	})

	return json(platform.jars.map((item: any) => item.version))
}) satisfies RequestHandler

const findByPlatform = (platform: string) => {
	for (const i in info) {
		if (info[i].platform === platform) {
			return info[i]
		}
	}
	return null;
}