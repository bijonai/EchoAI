import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  sendError,
  createError,
  setResponseHeaders,
  getRequestHeader,
  setHeader,
} from "h3";

const jwks = createRemoteJWKSet(new URL("https://pzkd7i.logto.app/oidc/jwks"));

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, corsHeaders);

  if (event.method === "OPTIONS") {
    return "OK";
  }

  const token = getRequestHeader(event, "Authorization")?.split(" ")[1];

  if (!token) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Unauthorized: Missing token",
      })
    );
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "https://pzkd7i.logto.app/oidc",
      audience: "http://localhost:3322/api",
    });

    event["userId"] = payload.sub;
  } catch (e) {
    console.error(e);
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Unauthorized: Invalid token",
      })
    );
  }
});
