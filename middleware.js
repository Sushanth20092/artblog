// middleware.js
import { NextResponse } from "next/server";
import { getCookieName } from "@/lib/auth";

/**
 * Protect /admin routes but EXCLUDE /admin/login.
 * Only checks if token exists (Edge Runtime doesn't support crypto for verification).
 * Actual verification happens on the protected page (dashboard) which runs in Node.js runtime.
 */

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow internals and API (don't interfere)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Allow the admin login page
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // Only protect other /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check if token cookie exists
  const cookieName = getCookieName();
  const token = req.cookies.get(cookieName)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, let the page verify it (pages run in Node.js runtime)
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
