import { findUtilByPath } from "$lib/utils"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ cookies, params }) => {
	const util = await findUtilByPath(params.util);
	if (!util) return json({
		status: 204
	})

	const cookiesFavourites: string | undefined = cookies.get("mcu-favourites")

	let favourites: string[] = []

	if (cookiesFavourites) favourites = cookiesFavourites.split(";")

	if (favourites.includes(util.path)) {
		const index = favourites.indexOf(util.path)
		favourites = favourites.splice(index, index)
	} else {
		favourites.push(util.path)
	}

	cookies.set("mcu-favourites", favourites.join(";"))

	return json({
		status: 200
	})
}) satisfies RequestHandler