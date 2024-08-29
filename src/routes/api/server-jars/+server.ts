import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { fetchSupportedPlatforms } from "$lib/server-jars/server-jar-utils";
import { corsMiddleware } from "$lib/cors";

export const GET: RequestHandler = corsMiddleware(async ({ url }) =>
  json(
    fetchSupportedPlatforms().map((platform) => {
      return {
        key: platform.key,
        name: platform.name,
        url: `${url.href}/${platform.key}`,
      };
    })
  )
);
