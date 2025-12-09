// pages/sitemap.xml.js

export async function getServerSideProps({ res }) {
  const baseUrl = "https://satrass.com";

  const staticPages = [
    "",
    "/contact",
    "/warranty",
    "/downloads",
    "/tools",
    "/tools/unity-midrangesizer",
    "/tools/unity-configurator",
    "/tools/powerstore-configurator",
    "/tools/powerstore-raid-calculator"
  ];

  const urls = staticPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  // هیچ کامپوننتی لازم نیست
  return null;
}