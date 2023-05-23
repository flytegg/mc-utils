import { utilList, findUtilByPath } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const GET = (async ({ url }) => {
	const path = url.searchParams.get("path");
	if (!path) return json({
		status: 200,
		content: await utilList()
	});

	const util = await findUtilByPath(path);
	if (!util) return json({
		status: 204,
		content: {
			path: ""
		}
	});

	return json({
		status: 200,
		content: util
	});
}) satisfies RequestHandler;