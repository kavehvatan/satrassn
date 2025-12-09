// pages/api/warranty-save.js
import { readStore, writeStore } from "../../lib/dataStore";

// نرمال‌سازی سریال: حذف فاصله و خط‌تیره و حروف کوچک
const normalize = (s) =>
  String(s || "")
    .toUpperCase()
    .replace(/[^\w]/g, "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // احراز هویت ادمین از Authorization: Bearer <token>
  const sent = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!sent || !process.env.ADMIN_TOKEN || sent !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const body = req.body || {};
  const rows = Array.isArray(body.rows) ? body.rows : [];

  if (!rows.length) {
    return res.status(400).json({ error: "no_rows" });
  }

  // اعتبارسنجی حداقلی
  for (const r of rows) {
    if (!r.serial || !String(r.serial).trim()) {
      return res.status(400).json({ error: "serial is required" });
    }
    if (!r.expireAt || !String(r.expireAt).trim()) {
      return res.status(400).json({ error: "expireAt is required" });
    }
  }

  // خواندن داده‌ی فعلی
  const current = (await readStore()) || {};
  const rowsOld = Array.isArray(current.rows) ? current.rows : [];

  // merge با key = سریال نرمال‌شده
  const map = new Map();
  for (const r of rowsOld) {
    map.set(normalize(r.serial), r);
  }

  for (const r of rows) {
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

  return res.json({
    ok: true,
    saved: rows.length,
    total: merged.length,
    updated,
  });
}