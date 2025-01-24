import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchDetailsFor } from "$lib/server-jars/server-jar-utils";
import { corsMiddleware } from "$lib/cors";

const VANILLA_PROBLEMATIC_VERSIONS = new Set(['1.0', '1.1', '1.2.1', '1.2.2', '1.2.3', '1.2.4']);

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

  const responseData = {
    platform: response.platform,
    display: response.display,
    version: response.version,
    release: response.release,
  };
  if (params.platform === 'vanilla' && VANILLA_PROBLEMATIC_VERSIONS.has(params.version)) {
    return json({
      ...responseData,
      size: undefined,
      downloadUrl: undefined
    });
  }
  return json({
    ...responseData,
    size: response.size,
    downloadUrl: `${url.href}/download`
  });
});