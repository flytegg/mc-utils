import {error, json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import { fetchVersionsFor } from '$lib/server-jars/server-jar-utils'

export const GET: RequestHandler = async ({ params, url }) => {
    const versions: any | null = await fetchVersionsFor(params.platform)

    if (!versions) throw error(404, { message: `Unknown platform: ${params.platform}` })

    return json(versions.map((version: string) => { return { version: version, url: `${url.href}/${version}` } }))
}
