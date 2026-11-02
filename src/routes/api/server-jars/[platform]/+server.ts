import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchListingFor } from "$lib/server-jars/server-jar-utils";
import { waitUntilFrom } from "$lib/server-jars/cache";
import { corsMiddleware } from "$lib/cors";

// Everything the server jars page needs for a platform in a single request
export const GET: RequestHandler = corsMiddleware(async ({ params, url, platform }) => {
  if (!params.platform) {
    throw error(400, { message: "Platform parameter is required" });
  }

  const listing = await fetchListingFor(params.platform, waitUntilFrom(platform));

  if (!listing)
    throw error(404, { message: `Unknown platform: ${params.platform}` });

  return json(
    listing.entries.map((entry) => {
      const versionUrl = `${url.origin}${url.pathname}/${entry.version}`;
      return {
        version: entry.version,
        build: entry.build,
        release: entry.release,
        url: versionUrl,
        downloadUrl: entry.downloadable ? `${versionUrl}/download` : undefined,
      };
    }),
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
});
