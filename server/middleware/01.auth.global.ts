import { createRemoteJWKSet, jwtVerify } from "jose";
import { LOGTO_ENDPOINT, LOGTO_RESOURCE, UNAUTHORIZED_USER } from "~/utils";

const jwks = createRemoteJWKSet(new URL(LOGTO_ENDPOINT + 'oidc/jwks'));

export default defineEventHandler(async (event) => {

  if (UNAUTHORIZED_USER) {
    (event as any).userId = UNAUTHORIZED_USER
    return
  }

  if (!event.path.startsWith("/api/")) {
    return;
  }

  const token = getRequestHeader(event, "Authorization")?.split(" ")[1];

  if (!token && !UNAUTHORIZED_USER) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: No token provided",
    });
  }
  
  if (!token) return

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: LOGTO_ENDPOINT + 'oidc',
      audience: LOGTO_RESOURCE,
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
