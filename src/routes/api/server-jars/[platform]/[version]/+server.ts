import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchDetailsFor } from "$lib/server-jars/server-jar-utils";
import { corsMiddleware } from "$lib/cors";

export const GET: RequestHandler = corsMiddleware(async ({ params, url }) => {
  if (!params.platform || !params.version) {
    throw error(400, {
      message: "Platform and version parameters are required",
    });
  }
  const response: any | null = await fetchDetailsFor(
    params.platform,
    params.version
  );
  if (!response)
    throw error(404, {
      message: `Unknown platform or version: ${params.platform}, ${params.version}`,
    });
  return json({
    platform: response.platform,
    display: response.display,
    version: response.version,
    release: response.release,
    size: response.size,
    downloadUrl: `${url.href}/download`,
  });
});
