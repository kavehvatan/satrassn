import withCsrf from '../../lib/withCsrf';
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

async function handler(req, res) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = parseCookie(cookieHeader);
  const token = cookies["sat_admin"];

  const ok = Boolean(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
  return res.status(200).json({ ok });
}
export default withCsrf(handler);
