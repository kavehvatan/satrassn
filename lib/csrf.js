import crypto from "crypto";

const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function setCsrfCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";

  const cookie = [
    `${CSRF_COOKIE_NAME}=${token}`,
    "Path=/",
    "SameSite=Lax",
    "HttpOnly",
    isProd ? "Secure" : "",
    "Max-Age=3600",
  ]
    .filter(Boolean)
    .join("; ");

  const prev = res.getHeader("Set-Cookie");
  if (prev) {
    const arr = Array.isArray(prev) ? prev : [prev];
    arr.push(cookie);
    res.setHeader("Set-Cookie", arr);
  } else {
    res.setHeader("Set-Cookie", cookie);
  }
}

export function getCsrfFromCookie(req) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(`${CSRF_COOKIE_NAME}=`)) {
      return p.substring(CSRF_COOKIE_NAME.length + 1);
    }
  }
  return null;
}

export function validateCsrf(req) {
  const cookieToken = getCsrfFromCookie(req);
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return false;
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host && !origin.endsWith(host)) {
    return false;
  }

  return true;
}

export const CSRF_HEADER = CSRF_HEADER_NAME;
