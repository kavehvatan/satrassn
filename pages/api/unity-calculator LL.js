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

function parseSet(setStr) {
  const [aStr, bStr] = String(setStr).split("+");
  const a = parseInt(aStr, 10);
  const b = parseInt(bStr, 10);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b < 0) {
    throw new Error("Invalid 'set' format");
  }
  return { a, b, setSize: a + b };
}

function parseSparePolicy(sparePolicy) {
  const [perSStr, perCntStr] = String(sparePolicy).split("/");
  const perS = parseInt(perSStr, 10);
  const perCnt = parseInt(perCntStr, 10);
  if (!Number.isFinite(perS) || !Number.isFinite(perCnt) || perS <= 0 || perCnt <= 0) {
    throw new Error("Invalid 'sparePolicy' format");
  }
  return { perS, perCnt };
}

/**
 * از روی count, set و sparePolicy برمی‌گردیم به تعداد گروه‌ها و تعداد اسپیرها.
 * سعی می‌کنیم دقیقاً معکوس generateCounts در front-end باشیم.
 */
function deriveGroupsAndSpares(count, setStr, sparePolicy) {
  const { a, b, setSize } = parseSet(setStr);
  const { perS, perCnt } = parseSparePolicy(sparePolicy);

  // brute-force امن؛ تعداد ست‌ها در دنیای واقعی از چند صد بیشتر نمی‌شود.
  for (let groups = 1; groups <= 5000; groups++) {
    const data = groups * setSize;
    const sparesFront = Math.max(perS, Math.ceil(data / perCnt) * perS);
    const total = data + sparesFront;
    if (total === count) {
      return { groups, spares: sparesFront, a, b, setSize };
    }
    if (total > count) break;
  }

  // fallback: اگر count از generateCounts نیامده بود
  const sparesBack = Math.max(perS, Math.ceil(count / perCnt) * perS);
  const effective = Math.max(count - sparesBack, 0);
  const groups = Math.floor(effective / setSize);
  return { groups, spares: sparesBack, a, b, setSize };
}

function fallbackUsable(disk, raid, setStr, count, sparePolicy) {
  const s = normDiskLabel(disk);
  let diskTB;
  if (s.endsWith("TB")) diskTB = parseFloat(s.slice(0, -2));
  else if (s.endsWith("GB")) diskTB = parseFloat(s.slice(0, -2)) / 1000.0;
  else diskTB = parseFloat(s);

  // ضریب تقریبی 0.9 برای overhead
  diskTB *= 0.9;

  const { a, groups, spares } = deriveGroupsAndSpares(count, setStr, sparePolicy);

  const usablePerSet = a * diskTB; // فقط دیسک‌های دیتا در هر ست
  const usableTB = Number((groups * usablePerSet).toFixed(2));

  return {
    perSetTB: Number(usablePerSet.toFixed(2)),
    groups,
    spares,
    usableTB,
  };
}

function loadLookupFlat() {
  const p = path.join(process.cwd(), "data", "unity_lookup_flat.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function keyFor(disk, raid, setStr) {
  return `${normDiskLabel(disk)}|${String(raid).toUpperCase()}|${setStr}`;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is supported" });
  }

  try {
    const { disk, raid, set, count, sparePolicy } = req.body ?? {};

    if (!disk || !raid || !set || !count || !sparePolicy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const c = Number(count);
    if (!Number.isFinite(c) || c <= 0) {
      return res.status(400).json({ error: "Invalid 'count' value" });
    }

    if (!/^\d+\+\d+$/.test(String(set))) {
      return res
        .status(400)
        .json({ error: "Invalid 'set' format, expected like '4+1'" });
    }

    if (!/^\d+\/\d+$/.test(String(sparePolicy))) {
      return res
        .status(400)
        .json({ error: "Invalid 'sparePolicy' format, expected like '1/32'" });
    }

    const lookup = loadLookupFlat();
    const k = keyFor(disk, raid, set);

    // تعداد ست‌ها و اسپیر را از روی count در می‌آوریم (سازگار با front-end)
    const { groups, spares } = deriveGroupsAndSpares(c, set, sparePolicy);

    let result;
    let perSetTB;

    if (Object.prototype.hasOwnProperty.call(lookup, k)) {
      perSetTB = Number(lookup[k]); // perSet usable TB
      const usableTB = Number((groups * perSetTB).toFixed(2));
      result = { perSetTB, groups, spares, usableTB, from: "lookup" };
    } else {
      const calc = fallbackUsable(disk, raid, set, c, sparePolicy);
      result = { ...calc, from: "fallback" };
    }

    return res.status(200).json({
      ok: true,
      raid: String(raid).toUpperCase(),
      set: String(set),
      count: c,
      sparePolicy: String(sparePolicy),
      disk: normDiskLabel(disk),
      ...result,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err?.message || "Internal error" });
  }
}