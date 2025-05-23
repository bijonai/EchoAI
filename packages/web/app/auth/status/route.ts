import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
    return NextResponse.json({ isAuthenticated, claims });
  } catch (error) {
    console.error("Error getting auth status:", error);
    return NextResponse.json(
      { isAuthenticated: false, claims: null },
      { status: 500 }
    );
  }
}
