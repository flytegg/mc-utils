import type { PageLoad  } from './$types';
 
export const load = (async ({ fetch, params }) => {
  const response = await fetch(`/api/util-parser?path=${params.util}`);
  const json = await response.json();
  return { 
    status: json.status,
    util: json.content
  }
}) satisfies PageLoad;