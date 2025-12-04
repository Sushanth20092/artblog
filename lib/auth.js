// /lib/auth.js
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

/**
 * Configuration
 * Put these in .env.local in production:
 *  - JWT_SECRET (required)
 *  - JWT_EXPIRES_IN (optional, default '7d')
 */
const JWT_SECRET = process.env.JWT_SECRET || "please_change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // e.g. '7d', '1h'
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "artblog_token";

/**
 * Cookie options used for serialize()
 * - httpOnly: prevents JS access to cookie
 * - secure: only send over HTTPS in production
 * - sameSite: lax is fine for login flows
 * - path: root
 * - maxAge: seconds (kept in sync with token expiry)
 */
const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds (default)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: DEFAULT_MAX_AGE,
};

/**
 * signToken(payload)
 * - Signs a JWT with `payload` and returns a string token.
 * - Include only non-sensitive claims (e.g. adminId, email)
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * verifyToken(token)
 * - Verifies token and returns decoded payload.
 * - Throws if token is invalid/expired.
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * serializeTokenCookie(token, [maxAgeSeconds])
 * - Returns a serialized Set-Cookie string that you can send as the
 *   `Set-Cookie` header in a NextResponse or Node response.
 */
export function serializeTokenCookie(token, maxAgeSeconds = cookieOptions.maxAge) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: maxAgeSeconds,
  });
}

/**
 * clearTokenCookie()
 * - Returns a serialized Set-Cookie string which clears the cookie.
 * - Use this when you want to logout the admin.
 */
export function clearTokenCookie() {
  return serialize(COOKIE_NAME, "", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: 0,
  });
}

/**
 * getCookieName()
 * - Small helper if you need to read cookie name elsewhere.
 */
export function getCookieName() {
  return COOKIE_NAME;
}
