import withCsrf from '../../lib/withCsrf';
// pages/api/warranty-save.js
import { readStore, writeStore } from "../../lib/dataStore";

const normalize = (s) =>
  String(s || "")
    .toUpperCase()
    .replace(/[^\w]/g, ""); // حذف خط تیره/فاصله/...

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  // توکن ادمین
  const sent = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!sent || sent !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
  if (!rows.length) return res.json({ ok: true, saved: 0 });

  // خواندن فعلی (اول /tmp، بعد seed)
  const store = await readStore();
  const map = new Map((store.rows || []).map((r) => [normalize(r.serial), r]));

  for (const r of rows) {
    if (!r?.serial || !r?.expireAt) continue;
    const key = normalize(r.serial);
    map.set(key, {
      vendor: r.vendor || "",
      model: r.model || "",
      serial: r.serial || "",
      expireAt: r.expireAt,
      status: r.status || "فعال",
      notes: r.notes || "",
    });
  }

  const merged = Array.from(map.values());
  const updated = new Date().toISOString();

  await writeStore({ rows: merged, updated });
  return res.json({ ok: true, saved: rows.length, total: merged.length, updated });
}
export default withCsrf(handler);
