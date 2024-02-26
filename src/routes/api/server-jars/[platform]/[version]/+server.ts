import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {findByPlatform, findLatestVersion, findVersion} from '$lib/server-jars/server-jar-utils'

export const GET = (async ({params, url}) => {
    const platform: any | null = findByPlatform(params.platform)
    if (!platform) return new Response(null, {
        status: 204,
        statusText: `There is no platform ${params.platform}`
    })

    const version: any | null = params.version === "latest" ? findLatestVersion(platform.jars) : findVersion(platform.jars, params.version)
    if (!version) return new Response(null, {
        status: 204,
        statusText: `No version ${params.version} on ${params.platform}`
    })

    return json({
        platform: platform.platform,
        display: platform.display,
        version: version.version,
        release: version.release,
        size: version.size,
        downloadUrl: `${url.href}/download`,
    })
}) satisfies RequestHandler

