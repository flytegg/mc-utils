import { error, redirect } from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import { fetchDetailsFor } from '$lib/server-jars/server-jar-utils'
import {incrementTracker} from "$lib/tracker/tracker";

export const GET: RequestHandler = async ({params, fetch}) => {
    const response: any | null = await fetchDetailsFor(params.platform, params.version)
    if (!response) throw error(404, { message: `Unknown platform or version: ${params.platform}, ${params.version}` })

    fetch(`/api/tracker/server-jars-served`, { // Don't need to wait for this
        method: 'POST'
    });

    throw redirect(302, response.downloadUrl)
}
