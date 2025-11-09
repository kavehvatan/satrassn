// pages/api/warranty-save.js
import { readStore, writeStore } from "../../lib/dataStore";
import { withCsrf } from '@/lib/withCsrf';

const norm = (s) => String(s || "").replace(/[\s-]+/g, "").toUpperCase();

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // احراز هویت ادمین
  const token = req.headers["x-admin-token"] || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }

  let body;
  try {
    body = req.body || {};
  } catch {
    return res.status(400).json({ error: "bad_json" });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (!rows.length) return res.status(400).json({ error: "no_rows" });

  // اعتبارسنجی حداقلی
  for (const r of rows) {
    if (!r.serial || !String(r.serial).trim()) {
      return res.status(400).json({ error: "serial is required" });
    }
    if (!r.expireAt || !String(r.expireAt).trim()) {
      return res.status(400).json({ error: "expireAt is required" });
    }
  }

  const store = readStore();
  store.rows ||= [];

  const indexBySerial = new Map(
    store.rows.map((r, i) => [norm(r.serial), i])
  );

  for (const r of rows) {
    const key = norm(r.serial);
    const next = {
      serial: String(r.serial).toUpperCase(),
      vendor: r.vendor || "",
      model: r.model || "",
      status: r.status || "active",
      expireAt: r.expireAt,
      notes: r.notes || "",
    };

    if (indexBySerial.has(key)) {
      store.rows[indexBySerial.get(key)] = next;
    } else {
      store.rows.push(next);
    }
  }

  store.updated = new Date().toISOString();
  const targetPath = writeStore(store);

  return res.json({ ok: true, count: rows.length, target: targetPath });
}
export default withCsrf(handler);
