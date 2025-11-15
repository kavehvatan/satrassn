import path from "path";
import fs from "fs";

function normDiskLabel(s) {
  let v = String(s ?? "").trim().toUpperCase().replace(/\s+/g, "");
  if (v.endsWith("G")) v = v + "B";
  v = v.replace("GIB", "GB");
  if (v === "600G") v = "600GB";
  if (!/(TB|GB)$/.test(v)) {
    if (!isNaN(Number(v))) v = `${v}TB`;
  }
  return v;
}

function parseSet(set) {
  const raw = String(set || "").trim();
  const parts = raw.split("+");
  if (parts.length !== 2) {
    throw new Error("Invalid set format, expected like 4+1");
  }
  const data = Number(parts[0]);
  const parity = Number(parts[1]);
  if (!Number.isFinite(data) || !Number.isFinite(parity) || data <= 0 || parity <= 0) {
    throw new Error("Invalid set numbers");
  }
  const total = data + parity;
  return { data, parity, total };
}

function parseSpare(sparePolicy) {
  const raw = String(sparePolicy || "").trim();
  const parts = raw.split("/");
  if (parts.length !== 2) {
    throw new Error("Invalid spare policy, expected like 1/32");
  }
  const num = Number(parts[0]);
  const denom = Number(parts[1]);
  if (!Number.isFinite(num) || !Number.isFinite(denom) || num < 0 || denom <= 0) {
    throw new Error("Invalid spare policy numbers");
  }
  return { num, denom };
}

function diskSizeTB(label) {
  const v = normDiskLabel(label);
  if (v.endsWith("TB")) {
    const n = Number(v.replace("TB", ""));
    return Number.isFinite(n) ? n : 0;
  }
  if (v.endsWith("GB")) {
    const n = Number(v.replace("GB", ""));
    return Number.isFinite(n) ? n / 1000 : 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function loadLookupFlat() {
  const p = path.join(process.cwd(), "data", "unity_lookup_flat.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function fallbackUsable(disk, raid, set, count, sparePolicy) {
  const sizeTB = diskSizeTB(disk);
  const { data, total } = parseSet(set);
  const { num, denom } = parseSpare(sparePolicy);
  const c = Number(count) || 0;
  const spares = Math.floor((c * num) / denom);
  const effective = Math.max(c - spares, 0);
  const groups = Math.floor(effective / total);
  const perSetTB = sizeTB * data;
  const usableTB = Number((groups * perSetTB).toFixed(2));
  return { perSetTB, groups, spares, usableTB };
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is supported" });
  }

  try {
    const { disk, raid, set, count, sparePolicy } = req.body || {};
    if (!disk || !raid || !set) {
      return res.status(400).json({ error: "disk, raid and set are required" });
    }

    const lookup = loadLookupFlat();
    const setStr = String(set);
    const raidStr = String(raid).toUpperCase();
    const diskLabel = normDiskLabel(disk);
    const key = `${diskLabel}|${raidStr}|${setStr}`;
    const perSetTB = lookup[key];

    const { total } = parseSet(setStr);
    const c = Number(count) || 0;
    const { num, denom } = parseSpare(sparePolicy || "1/32");
    const spares = Math.floor((c * num) / denom);
    const effective = Math.max(c - spares, 0);
    const groups = Math.floor(effective / total);

    let result;
    if (perSetTB !== undefined) {
      const usableTB = Number((groups * perSetTB).toFixed(2));
      result = { perSetTB, groups, spares, usableTB, from: "lookup" };
    } else {
      const calc = fallbackUsable(diskLabel, raidStr, setStr, c, sparePolicy || "1/32");
      result = { ...calc, from: "fallback" };
    }

    return res.status(200).json({
      ok: true,
      raid: raidStr,
      set: setStr,
      count: c,
      sparePolicy: String(sparePolicy || "1/32"),
      disk: diskLabel,
      ...result,
    });
  } catch (err) {
    console.error("unity-calculator error", err);
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
