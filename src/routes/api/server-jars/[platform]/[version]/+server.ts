import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchListingFor, findEntry, legacyVersionFor } from "$lib/server-jars/server-jar-utils";
import { waitUntilFrom } from "$lib/server-jars/cache";
import { corsMiddleware } from "$lib/cors";

export const GET: RequestHandler = corsMiddleware(async ({ params, url, platform }) => {
  if (!params.platform || !params.version) {
    throw error(400, {
      message: "Platform and version parameters are required",
    });
  }
  const listing = await fetchListingFor(params.platform, waitUntilFrom(platform));
  const entry = listing && findEntry(listing, params.version);
  if (!listing || !entry)
    throw error(404, {
      message: `Unknown platform or version: ${params.platform}, ${params.version}`,
    });

  return json({
    platform: listing.platform,
    display: listing.display,
    version: legacyVersionFor(listing.platform, entry),
    minecraftVersion: entry.version,
    build: entry.build,
    release: entry.release,
    downloadUrl: entry.downloadable ? `${url.origin}${url.pathname}/download` : undefined
  });
});
