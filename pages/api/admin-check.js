// pages/api/admin-check.js

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // توکن رو از هدر می‌گیریم: یا Authorization: Bearer X یا X-Admin-Token
  const authHeader = req.headers.authorization || "";
  let token = "";

  if (authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim();
  } else if (req.headers["x-admin-token"]) {
    token = String(req.headers["x-admin-token"]);
  }

  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return res
      .status(500)
      .json({ error: "admin_token_not_configured" });
  }

  if (token !== expected) {
    return res.status(401).json({ error: "invalid_token" });
  }

  return res.status(200).json({ ok: true });
}