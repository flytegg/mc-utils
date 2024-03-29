import {error, json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import { fetchDetailsFor } from '$lib/server-jars/server-jar-utils'

export const GET: RequestHandler = async ({ params, url }) => {
    const response: any | null = await fetchDetailsFor(params.platform, params.version)
    if (!response) throw error(404, { message: `Unknown platform or version: ${params.platform}, ${params.version}` })
    return json({
        platform: response.platform,
        display: response.display,
        version: response.version,
        release: response.release,
        size: response.size,
        downloadUrl: `${url.href}/download`,
    })
}

