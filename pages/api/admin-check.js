// pages/api/admin-check.js

function parseCookie(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => v.split("="))
  );
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "");

  const cookieHeader = req.headers.cookie || "";
  const cookies = parseCookie(cookieHeader);
  const cookieToken = cookies["sat_admin"];

  const token = bearer || cookieToken || "";
  const ok =
    Boolean(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);

  if (!ok) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  return res.status(200).json({ ok: true });
}