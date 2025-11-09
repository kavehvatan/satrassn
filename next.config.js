/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  output: 'standalone',
};
module.exports = nextConfig;

/** Security headers (SSR fallback to middleware) */
const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
];
module.exports.headers = async () => {
  return [
    { source: '/(.*)', headers: securityHeaders },
  ];
};
