// /app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth";

export function GET() {
  const cookie = clearTokenCookie();
  return NextResponse.json({ ok: true, message: "Logged out" }, {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
