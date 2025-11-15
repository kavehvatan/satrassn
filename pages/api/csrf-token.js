// pages/api/csrf-token.js
import { generateCsrfToken, setCsrfCookie } from "../../lib/csrf";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const token = generateCsrfToken();
  setCsrfCookie(res, token);

  return res.status(200).json({ csrfToken: token });
}
