import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { findByPlatform } from '$lib/server-jars/server-jar-utils'

export const GET = (async ({ params }) => {
	const platform: any | null = findByPlatform(params.platform)
	if (!platform) return new Response(null, {
		status: 204,
		statusText: `There is no platform ${params.platform}`
	})

	return json(platform.jars.map((item: any) => item.version))
}) satisfies RequestHandler
