import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchVersionsFor } from "$lib/server-jars/server-jar-utils";
import { corsMiddleware } from "$lib/cors";

export const GET: RequestHandler = corsMiddleware(async ({ params, url }) => {
  if (!params.platform) {
    throw error(400, { message: "Platform parameter is required" });
  }

  const versions: any | null = await fetchVersionsFor(params.platform);

  if (!versions)
    throw error(404, { message: `Unknown platform: ${params.platform}` });

  return json(
    versions.map((version: string) => {
      return { version: version, url: `${url.href}/${version}` };
    })
  );
});
