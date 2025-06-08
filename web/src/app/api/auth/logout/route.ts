import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  // Remove cookies de token e refreshToken
  const response = NextResponse.json({ message: "Logout realizado" });
  response.cookies.set("token", "", { path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
  return response;
}
