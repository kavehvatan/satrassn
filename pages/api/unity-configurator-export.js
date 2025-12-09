// pages/api/unity-configurator-export.js
const ExcelJS = require("exceljs");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let rows = req.body;

  // اگر بدنه به صورت رشته JSON رسیده باشد، اصلاحش می‌کنیم
  if (typeof rows === "string") {
    try {
      rows = JSON.parse(rows);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "No data provided" });
  }

  // مطمئن شو هر ردیف آبجکت باشه
  rows = rows.map((r) => (r && typeof r === "object" ? r : {}));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Configuration");

  const headers = Object.keys(rows[0] || { module: "", option: "", sku: "", qty: "" });

  // ستون‌ها بر اساس کلیدها
  sheet.columns = headers.map((key) => ({
    header: key,
    key,
  }));

  // ردیف‌ها
  rows.forEach((row) => {
    const normalized = {};
    headers.forEach((key) => {
      normalized[key] = row[key] ?? "";
    });
    sheet.addRow(normalized);
  });

  // تنظیم عرض ستون‌ها (تقریباً شبیه openpyxl)
  sheet.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value ?? "";
      const len = value.toString().length;
      if (len > maxLength) maxLength = len;
    });
    column.width = maxLength + 2;
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="unity_config_full.xlsx"'
  );

  await workbook.xlsx.write(res);
  res.end();
}