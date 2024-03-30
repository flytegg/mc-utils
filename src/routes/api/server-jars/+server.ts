import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import { fetchSupportedPlatforms } from '$lib/server-jars/server-jar-utils'

export const GET: RequestHandler = async ({ url }) => json(fetchSupportedPlatforms().map((platform) => { return { key: platform.key, name: platform.name, url: `${url.href}/${platform.key}` } }))
