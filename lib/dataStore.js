// lib/dataStore.js
import fs from "fs/promises";
import path from "path";

const TMP_PATH = process.env.WARRANTY_TMP_PATH || "/tmp/warranty.json";
const SEED_PATH = path.join(process.cwd(), "data", "warranty.json");

export async function readStore() {
  // 1) اول /tmp
  try {
    const txt = await fs.readFile(TMP_PATH, "utf8");
    return { ...(JSON.parse(txt) || {}), __source: TMP_PATH };
  } catch {}

  // 2) بعد seed داخل ریپو
  try {
    const txt = await fs.readFile(SEED_PATH, "utf8");
    return { ...(JSON.parse(txt) || {}), __source: SEED_PATH };
  } catch {}

  return { rows: [], updated: null, __source: "memory" };
}

export async function writeStore(obj) {
  const data = JSON.stringify(obj, null, 2);
  await fs.writeFile(TMP_PATH, data, "utf8");
  return { path: TMP_PATH, count: Array.isArray(obj.rows) ? obj.rows.length : 0 };
}