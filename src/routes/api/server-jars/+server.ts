import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import info from "$lib/server-jars/server-jars.json"

export const GET = (async () => {
    return json(info.map((item) => {
        return {
            key: item.platform,
            name: item.display
        }
    }))
}) satisfies RequestHandler
