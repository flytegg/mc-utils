import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET = (async ({ fetch, params }) => {
	const request = await fetch("/api/note-block-sounds")
	const response = await request.json()

	if (!request.ok) throw error(request.status, { message: request.statusText })

	const file: any | null = response.find((item: any) => item.name === params.name)
	if (!file) return new Response(null, {
		status: 204,
		statusText: `There is no song ${params.name}`
	})
	
	throw redirect(302, file.downloadUrl)
}) satisfies RequestHandler
