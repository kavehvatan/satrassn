/** @type {import('next').NextConfig} */

// هدرهای امنیتی
const securityHeaders = [
  // Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // جلوگیری از لود شدن سایت داخل iframe دامنه‌های دیگه
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // جلوگیری از content sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // CORP: محدود کردن استفاده از ریسورس‌ها به همون origin
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  // HSTS: اجبار استفاده از HTTPS (توی محیطی که HTTPS فعاله)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP برای جلوگیری از XSS و تزریق کد
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self';",
      "script-src 'self';",
      "style-src 'self' 'unsafe-inline';",
      "img-src 'self' data: blob:;",
      "font-src 'self';",
      "connect-src 'self';",
      "frame-ancestors 'self';",
      "base-uri 'self';",
      "form-action 'self';",
    ].join(" "),
  },
  // اختیاری ولی خوب: محدود کردن قابلیت‌های مرورگر
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  output: 'standalone',

  // 4. یک لایه‌ی کوچک hardening: حذف X-Powered-By
  poweredByHeader: false,

  // اعمال همه هدرها روی تمام مسیرها
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;