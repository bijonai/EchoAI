import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://pzkd7i.logto.app/oidc/jwks"));

export default defineEventHandler(async (event) => {

  // const token = getRequestHeader(event, "Authorization")?.split(" ")[1];

  // if (!token) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: "Unauthorized: No token provided",
  //   });
  // }

  // try {
  //   const { payload } = await jwtVerify(token, jwks, {
  //     issuer: "https://pzkd7i.logto.app/oidc",
  //     audience: "http://localhost:3322/api",
  //   });

  //   event["userId"] = payload.sub;
  // } catch (e) {
  //   console.error(e);
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: "Unauthorized: Invalid token",
  //   });
  // }
});
