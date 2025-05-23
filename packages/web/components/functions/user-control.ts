"use server";
import { signIn, signOut } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function signInAction() {
  await signIn(logtoConfig, {
    redirectUri: "http://localhost:3323/auth/callback",
  });
}

export async function signOutAction() {
  await signOut(logtoConfig, "http://localhost:3323/");
}
