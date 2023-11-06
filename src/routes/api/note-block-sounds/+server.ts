import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET = (async () => {
	const request = await fetch("https://api.github.com/repos/flytegg/nbs-songs/contents")
	const response = await request.json()

	if (!request.ok) throw error(request.status, { message: request.statusText })

	return json(response
		.filter((file: any) => file.type === 'file')
		.map((file: any) => ({
			name: file.name,
			downloadUrl: file.download_url,
		})))
}) satisfies RequestHandler
