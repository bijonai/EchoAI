"use server";
import {
  getAccessToken,
  getLogtoContext,
  LogtoContext,
  signIn,
  signOut,
} from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function signInAction() {
  await signIn(logtoConfig, {
    redirectUri: "http://localhost:3323/auth/callback",
  });
}

export async function signOutAction() {
  await signOut(logtoConfig, "http://localhost:3323/");
}

export async function getAccessTokenAction(): Promise<string> {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    await signInAction();
  }

  return await getAccessToken(logtoConfig, "http://localhost:3322/api");
}

export async function getUserInfoAction(): Promise<LogtoContext> {
  return await getLogtoContext(logtoConfig);
}