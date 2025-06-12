import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://pzkd7i.logto.app/oidc/jwks"));

export default defineEventHandler(async (event) => {

  if (!event.path.startsWith("/api/")) {
    return;
  }

  const token = getRequestHeader(event, "Authorization")?.split(" ")[1];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: No token provided",
    });
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: process.env.LOGTO_ENDPOINT + 'oidc',
      audience: process.env.LOGTO_BASE_URL + '/api',
    });

    (event as any).userId = payload.sub;

  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Invalid token",
    });
  }
});
