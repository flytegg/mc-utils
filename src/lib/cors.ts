import type { RequestHandler } from "@sveltejs/kit";

export const corsMiddleware = (handler: RequestHandler): RequestHandler => {
  return async (event) => {
    const response = await handler(event);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return response;
  };
};
