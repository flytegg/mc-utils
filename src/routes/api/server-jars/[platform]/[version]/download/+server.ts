import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchDetailsFor } from "$lib/server-jars/server-jar-utils";
import { corsMiddleware } from "$lib/cors";

export const GET: RequestHandler = corsMiddleware(async ({ params, fetch }) => {
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

  fetch(`/api/tracker/server-jars-served`, {
    method: "POST",
  });

  throw redirect(302, response.downloadUrl);
});
