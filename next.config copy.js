/** @type {import('next').NextConfig} */

// Security headers + CSP
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  // برای استایل‌ها (Tailwind/Next) هنوز به 'unsafe-inline' نیاز داریم
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // فقط تصاویر از خود سایت و data URI
  "img-src 'self' data:",
  // فونت فقط از خود سایت، gstatic و data URI
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "upgrade-insecure-requests"
].join('; ');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
        ],
      },
    ];
  },
};

module.exports = nextConfig;