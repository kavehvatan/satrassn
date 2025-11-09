import { withCsrf } from '@/lib/withCsrf';
// pages/api/admin-login.js
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const { token } = req.body || {};
    const good = process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;

    if (!good) {
      return res.status(401).json({ ok: false, error: "invalid_token" });
    }

    // ست‌کردن کوکی لاگین (HttpOnly)
    const twoHours = 60 * 60 * 2;
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader("Set-Cookie", [
      `sat_admin=${encodeURIComponent(token)}; Max-Age=${twoHours}; Path=/; HttpOnly; SameSite=Lax; ${
        isProd ? "Secure;" : ""
      }`,
    ]);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
}
export default withCsrf(handler);
