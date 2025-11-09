import { NextResponse } from 'next/server';
export function middleware(req){
  const res=NextResponse.next();
  const csp=[
    "default-src 'self';",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
    "style-src 'self' 'unsafe-inline';",
    "img-src 'self' data: https:;",
    "font-src 'self' data:;",
    "connect-src 'self';",
    "frame-ancestors 'self';"
  ].join(' ');
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  return res;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|public).*)']};