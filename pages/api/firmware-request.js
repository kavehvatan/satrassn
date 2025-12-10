// pages/api/firmware-request.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { product, version, build, target, nameOrOrg, phone } = req.body || {};

  if (!product || !version || !nameOrOrg || !phone) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  try {
    const dataDir = path.join(process.cwd(), "data");
    const dataPath = path.join(dataDir, "firmware-requests.json");

    // مطمئن شو پوشه data وجود داره
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existing = [];
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, "utf8");
      existing = JSON.parse(raw || "[]");
      if (!Array.isArray(existing)) existing = [];
    }

    const entry = {
      product,
      version,
      build: build || null,
      target: target || null,
      nameOrOrg,
      phone,
      createdAt: new Date().toISOString(),
      ip:
        req.headers["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        null,
    };

    existing.push(entry);

    fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2), "utf8");

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error writing firmware-requests.json:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Internal server error while saving data" });
  }
}