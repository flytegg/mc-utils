import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import { fetchSupportedPlatforms } from '$lib/server-jars/server-jar-utils'

export const GET: RequestHandler = async () => json(fetchSupportedPlatforms())
