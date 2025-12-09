// pages/sitemap.xml.js

export async function getServerSideProps({ res }) {
  const baseUrl = "https://satrass.com";
  const lastmod = new Date().toISOString();

  /**
   * فقط صفحات واقعی کاربری
   * API، admin، فایل‌های تستی / copy / بکاپ عمداً اینجا نیستند
   */
  const routes = [
    // صفحات اصلی
    { path: "", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.7" },
    { path: "/contact", changefreq: "monthly", priority: "0.7" },
    { path: "/downloads", changefreq: "weekly", priority: "0.6" },
    { path: "/warranty", changefreq: "monthly", priority: "0.6" },

    // هاب ابزارها (الان که index.js برگشته، باید باشه)
    { path: "/tools", changefreq: "weekly", priority: "0.7" },

    // ابزارها (فقط همین ۳ تا)
    { path: "/tools/unity-midrangesizer", changefreq: "weekly", priority: "0.9" },
    { path: "/tools/unity-configurator", changefreq: "weekly", priority: "0.8" },
    { path: "/tools/powerstore-configurator", changefreq: "weekly", priority: "0.9" },

    // Solutions
    { path: "/solutions/businesscontinuty", changefreq: "monthly", priority: "0.5" },
    { path: "/solutions/sandesign", changefreq: "monthly", priority: "0.5" },
    { path: "/solutions/storage optimization", changefreq: "monthly", priority: "0.5" },

    // Services (صفحهٔ اصلی)
    { path: "/services", changefreq: "weekly", priority: "0.7" },

    // Services (تک‌صفحه‌ها)
    { path: "/services/ai", changefreq: "monthly", priority: "0.6" },
    { path: "/services/monitoring", changefreq: "monthly", priority: "0.6" },
    { path: "/services/commvault", changefreq: "monthly", priority: "0.6" },
    { path: "/services/business-continuity", changefreq: "monthly", priority: "0.6" },
    { path: "/services/end-user-computing", changefreq: "monthly", priority: "0.6" },
    { path: "/services/virtualization-cloud", changefreq: "monthly", priority: "0.6" },
    { path: "/services/consulting-design", changefreq: "monthly", priority: "0.6" },
    { path: "/services/netbackup", changefreq: "monthly", priority: "0.6" },
    { path: "/services/veeam", changefreq: "monthly", priority: "0.6" },
    { path: "/services/virtual-desktop", changefreq: "monthly", priority: "0.6" },
    { path: "/services/install", changefreq: "monthly", priority: "0.6" },
    { path: "/services/training", changefreq: "monthly", priority: "0.6" },
    { path: "/services/operations", changefreq: "monthly", priority: "0.6" },

    // بخش‌های دیگر
    { path: "/news", changefreq: "weekly", priority: "0.5" },
    { path: "/Backup", changefreq: "monthly", priority: "0.4" },
    { path: "/brands", changefreq: "monthly", priority: "0.4" },
  ];

  const urls = routes
    .map(({ path, changefreq, priority }) => {
      const loc = path === "" ? baseUrl : `${baseUrl}${path}`;
      return `
      <url>
        <loc>${loc}</loc>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
        <lastmod>${lastmod}</lastmod>
      </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap.trim());
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  return null;
}