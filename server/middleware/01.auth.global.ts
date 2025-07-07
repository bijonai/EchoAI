import { createRemoteJWKSet, jwtVerify } from "jose";
import { LOGTO_ENDPOINT, LOGTO_RESOURCE } from "~/utils";

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
