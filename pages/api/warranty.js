// pages/api/warranty.js
import fs from "fs/promises";
import path from "path";
import { withCsrf } from '@/lib/withCsrf';

const TMP_FILE = "/tmp/warranty.json";
const DATA_FILE = path.join(process.cwd(), "data", "warranty.json");

// تبدیل اعداد فارسی/عربی به لاتین و یکدست‌سازی سریال
const faMap = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9' };
const arMap = { '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
function normalize(s) {
  return String(s || "")
    .replace(/[۰-۹]/g, d => faMap[d])
    .replace(/[٠-٩]/g, d => arMap[d])
    .toUpperCase()
    .replace(/[^\w]/g, ""); // حذف فاصله/خط‌تیره/…
}

async function readJsonSafely(file) {
  try {
    const raw = await fs.readFile(file, "utf8");
    const obj = JSON.parse(raw || "{}");
    obj.__source = file;
    return obj;
  } catch {
    return { rows: [], updated: null, __source: file + " (missing)" };
  }
}

function toArray(x) {
  return Array.isArray(x) ? x : (x ? [x] : []);
}

// ادغام: رکوردهای /tmp بر data/warranty.json غلبه دارند
function mergeRows(baseRows, tmpRows) {
  const map = new Map(); // key: normalized serial
  for (const r of toArray(baseRows)) {
    if (!r || !r.serial) continue;
    map.set(normalize(r.serial), r);
  }
  for (const r of toArray(tmpRows)) {
    if (!r || !r.serial) continue;
    map.set(normalize(r.serial), r);
  }
  return Array.from(map.values());
}

async function handler(req, res) {
  const dbg = "debug" in req.query;
  const all = "all" in req.query;
  const rawQ = String(req.query.q || "").trim();

  // خواندن منابع
  const base = await readJsonSafely(DATA_FILE);
  const tmp  = await readJsonSafely(TMP_FILE);
  const rowsAll = mergeRows(base.rows || [], tmp.rows || []);

  // اگر all نیست و q خالیست → خروجی خالی
  if (!all && !rawQ) {
    return res.status(200).json({
      rows: [],
      meta: dbg ? {
        total: rowsAll.length,
        updated: tmp.updated || base.updated || null,
        sources: [tmp.__source, base.__source],
        note: "empty_query"
      } : undefined
    });
  }

  // حالت all=1 → همهٔ رکوردها
  if (all) {
    const body = { rows: rowsAll };
    if (dbg) {
      body.meta = {
        total: rowsAll.length,
        updated: tmp.updated || base.updated || null,
        sources: [tmp.__source, base.__source],
        mode: "all"
      };
    }
    return res.status(200).json(body);
  }

  // چند سریال: خط جدید/کاما/فاصله
  const terms = rawQ
    .split(/\r?\n|,|،|؛|\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const out = [];
  for (const t of terms) {
    const key = normalize(t);
    const found = rowsAll.find(r => normalize(r.serial) === key);
    if (found) {
      out.push(found);
    } else {
      out.push({
        serial: t,
        brand: "-",
        model: "-",
        status: "not_found",
        end: "-",
        notes: "-"
      });
    }
  }

  const body = { rows: out };
  if (dbg) {
    body.meta = {
      total: rowsAll.length,
      updated: tmp.updated || base.updated || null,
      sources: [tmp.__source, base.__source],
      mode: "query",
      terms
    };
  }
  return res.status(200).json(body);
}
export default withCsrf(handler);
