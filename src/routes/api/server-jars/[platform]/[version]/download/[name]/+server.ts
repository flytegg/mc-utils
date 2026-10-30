import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchListingFor, findEntry, resolveDownloadUrl } from "$lib/server-jars/server-jar-utils";
import { waitUntilFrom } from "$lib/server-jars/cache";
import { corsMiddleware } from "$lib/cors";

export const GET: RequestHandler = corsMiddleware(async ({ params, fetch, platform }) => {
  if (!params.platform || !params.version) {
    throw error(400, {
      message: "Platform and version parameters are required",
    });
  }
  const listing = await fetchListingFor(params.platform, waitUntilFrom(platform));
  const entry = listing && findEntry(listing, params.version);
  const downloadUrl = entry && await resolveDownloadUrl(listing.platform, entry);
  if (!downloadUrl)
    throw error(404, {
      message: `Unknown platform or version: ${params.platform}, ${params.version}`,
    });

  fetch(`/api/tracker/server-jars-served`, {
    method: "POST",
  });

  throw redirect(302, downloadUrl);
});
