import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ fetch, url }) => {
	const username = url.searchParams.get("username")
	let uuid = url.searchParams.get("uuid")

	if ((!username && !uuid) || (username && uuid)) return json({
		status: 400,
		content: "Specify either username or uuid."
	})

	if (!uuid) {
        const request = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        const response = await request.json()
        uuid = response.id
    }

	const request = await fetch(`https://api.ashcon.app/mojang/v2/user/${final}`)
	const response = await request.json()

	return json({
		status: 200,
		content: `data:image/png;base64,${response.textures.skin.data}`
	})
}) satisfies RequestHandler