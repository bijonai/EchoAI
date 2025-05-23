import {
  LOGTO_ENDPOINT,
  LOGTO_APP_ID,
  LOGTO_APP_SECRET,
  LOGTO_BASE_URL,
  LOGTO_COOKIE_SECRET,
} from "@echoai/utils";
import { UserScope, LogtoNextConfig } from "@logto/next";

export const logtoConfig: LogtoNextConfig = {
  endpoint: LOGTO_ENDPOINT,
  appId: LOGTO_APP_ID,
  appSecret: LOGTO_APP_SECRET,
  baseUrl: LOGTO_BASE_URL,
  cookieSecret: LOGTO_COOKIE_SECRET,
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: [UserScope.Email],
};
