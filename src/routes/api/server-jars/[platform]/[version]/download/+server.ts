import { error, redirect } from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import { fetchDetailsFor } from '$lib/server-jars/server-jar-utils'
import { trackEvent } from '$lib/google/gtag'

export const GET: RequestHandler = async ({ params }) => {
    const response: any | null = await fetchDetailsFor(params.platform, params.version)
    if (!response) throw error(404, { message: `Unknown platform or version: ${params.platform}, ${params.version}` })
    
    trackEvent('server-jars-download', 'type', `${params.platform}-${params.version}`);

    throw redirect(302, response.downloadUrl)
}
