import { withCsrf } from '@/lib/withCsrf';
// pages/api/admin-logout.js
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const isProd = process.env.NODE_ENV === "production";
  // پاک کردن کوکی
  res.setHeader(
    "Set-Cookie",
    `sat_admin=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; ${isProd ? "Secure;" : ""}`
  );
  return res.status(200).json({ ok: true });
}
export default withCsrf(handler);
