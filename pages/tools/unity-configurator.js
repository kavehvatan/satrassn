// pages/tools/unity-configurator.js
import { useMemo, useState } from "react";
import Head from "next/head";

// ---------- ثابت‌ها ----------

const UNITY_MODELS = [
  {
    id: "880",
    label:
      "Unity 880 DPE 25x2.5 Customer Supplied Rack (High Line Power 200V-240V)",
    sku: "[210-ASKU]",
  },
  {
    id: "680",
    label:
      "Unity 680 DPE 25x2.5 Customer Supplied Rack (High Line Power 200V-240V)",
    sku: "[210-ASLB]",
  },
  {
    id: "480",
    label:
      "Unity 480 DPE 25x2.5 Customer Supplied Rack (High Line Power 200V-240V)",
    sku: "[210-ASLN]",
  },
  {
    id: "380",
    label:
      "Unity 380 DPE 25x2.5 Customer Supplied Rack (High Line Power 200V-240V)",
    sku: "[210-ASKK]",
  },
];

const STARTER_PACK_OPTIONS = [
  { label: "D4 SYSPACK 4x400GB FLASH SSD 25x2.5", sku: "[400-BGCN]" },
  { label: "D4 SYSPACK 4x800GB FLASH SSD 25x2.5", sku: "[400-BGCQ]" },
  { label: "D4 SYSPACK 4x1.6TB FLASH SSD 25x2.5", sku: "[400-BGCK]" },
  { label: "D4 SYSPACK 4x3.2TB FLASH SSD 25x2.5", sku: "[400-BGCM]" },
  { label: "Unity SYSPACK 4x600GB 10K SAS 25x2.5", sku: "[400-BGCO]" },
  { label: "Unity SYSPACK 4x1.2TB 10K SAS 25x2.5", sku: "[400-BGCJ]" },
  { label: "Unity SYSPACK 4x1.8TB 10K SAS 25x2.5", sku: "[400-BGCL]" },
];

const SPIO_OPTIONS = [
  { label: "Unity 2x4 port IO 32GB FC", sku: "[405-ABBI]" },
  { label: "UNITY 2x4 PORT IO 10GBASET", sku: "[565-BBID]" },
  { label: "UNITY 2x4 PORT IO 10GBE OPT", sku: "[565-BBIF]" },
  { label: "UNITY 2x4 PORT IO 16GB FC", sku: "[565-BBIC]" },
];

const SSD25_OPTIONS = [
  { label: "D4 800GB SAS FLASH 25x2.5 SSD", sku: "[400-BFXU]" },
  { label: "D4 1.6TB SAS FLASH 25x2.5 SSD", sku: "[400-BFXN]" },
  { label: "D4 3.2TB SAS FLASH 25x2.5 SSD", sku: "[400-BFXQ]" },
  { label: "Unity 7.68TB ALL FLASH 25x2.5 SSD", sku: "[400-BFXT]" },
  { label: "Unity 600GB 10K SAS 25x2.5 DRIVE", sku: "[400-BFXS]" },
  { label: "Unity 1.2TB 10K SAS 25x2.5 DRIVE", sku: "[400-BFXM]" },
  { label: "Unity 1.8TB 10K SAS 25x2.5 DRIVE", sku: "[400-BFXO]" },
];

const HDD35_OPTIONS = [
  { label: "D4 4TB NLSAS 15x3.5 drive", sku: "[400-BFVU]" },
  { label: "D4 6TB NLSAS 15x3.5 drive", sku: "[400-BFVV]" },
  { label: "D4 12TB NLSAS 15x3.5 drive", sku: "[400-BFVT]" },
];

// حداکثر درایوها بر اساس مدل
function getDriveMaxByModel(modelId) {
  switch (modelId) {
    case "880":
      return 1496;
    case "680":
      return 996;
    case "480":
      return 746;
    case "380":
      return 496;
    default:
      return 1496;
  }
}

// حداکثر Fast Cache بر اساس مدل
function getFastCacheMax(modelId) {
  switch (modelId) {
    case "880":
      return 31;
    case "680":
      return 17;
    case "480":
      return 7;
    case "380":
      return 5;
    default:
      return 31;
  }
}

function oddListDown(max) {
  const out = [];
  for (let n = max; n >= 3; n -= 2) out.push(n);
  return out;
}

// منطق clamp SSD/HDD
function clampTotals(source, modelId, ssd, hdd) {
  const maxTotal = getDriveMaxByModel(modelId);

  let s = Number.isFinite(ssd) ? ssd : 0;
  let h = Number.isFinite(hdd) ? hdd : 0;
  if (s < 0) s = 0;
  if (h < 0) h = 0;

  if (source === "ssd25") {
    const allowed = Math.max(0, maxTotal - h);
    if (s > allowed) s = allowed;
  } else if (source === "hdd35") {
    const allowed = Math.max(0, maxTotal - s);
    if (h > allowed) h = allowed;
  } else if (source === "model") {
    const total = s + h;
    if (total > maxTotal) {
      const allowedSSD = Math.max(0, maxTotal - h);
      if (s > allowedSSD) s = allowedSSD;
    }
  }

  return { ssd: s, hdd: h };
}

// فقط رقم‌های لاتین 0-9 را از ورودی نگه می‌داریم
function parseNumericInput(value) {
  const digits = (value || "").replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}

// ---------- صفحه اصلی ----------

export default function UnityConfiguratorPage() {
  const [modelId, setModelId] = useState("880");
  const [starterIndex, setStarterIndex] = useState(0);
  const [spioIndex, setSpioIndex] = useState(0);

  const [ssd25Index, setSsd25Index] = useState(0);
  const [hdd35Index, setHdd35Index] = useState(0);

  const [ssd25Qty, setSsd25Qty] = useState(1);
  const [hdd35Qty, setHdd35Qty] = useState(1);

  // Fast Cache
  const fastCacheOptions = useMemo(
    () => oddListDown(getFastCacheMax(modelId)),
    [modelId]
  );
  const [fastCacheQty, setFastCacheQty] = useState(() =>
    oddListDown(getFastCacheMax("880"))[0]
  );

  const handleModelChange = (e) => {
    const newModelId = e.target.value;
    const clamped = clampTotals("model", newModelId, ssd25Qty, hdd35Qty);
    setModelId(newModelId);
    setSsd25Qty(clamped.ssd);
    setHdd35Qty(clamped.hdd);

    const list = oddListDown(getFastCacheMax(newModelId));
    setFastCacheQty(list[0] ?? 3);
  };

  const handleSsdChange = (e) => {
    const raw = parseNumericInput(e.target.value);
    const clamped = clampTotals("ssd25", modelId, raw, hdd35Qty);
    setSsd25Qty(clamped.ssd);
  };

  const handleHddChange = (e) => {
    const raw = parseNumericInput(e.target.value);
    const clamped = clampTotals("hdd35", modelId, ssd25Qty, raw);
    setHdd35Qty(clamped.hdd);
  };

  const selectedModel =
    UNITY_MODELS.find((m) => m.id === modelId) || UNITY_MODELS[0];
  const starterOpt =
    STARTER_PACK_OPTIONS[starterIndex] || STARTER_PACK_OPTIONS[0];
  const spioOpt = SPIO_OPTIONS[spioIndex] || SPIO_OPTIONS[0];
  const ssd25Opt = SSD25_OPTIONS[ssd25Index] || SSD25_OPTIONS[0];
  const hdd35Opt = HDD35_OPTIONS[hdd35Index] || HDD35_OPTIONS[0];

  const dae25Qty = Math.max(1, Math.ceil(ssd25Qty / 25));
  const dae35Qty = Math.max(1, Math.ceil(hdd35Qty / 15));

  const buildExportRows = () => {
    const rows = [];

    rows.push({
      module: "Dell EMC Unity XT",
      option: selectedModel.label,
      sku: selectedModel.sku,
      qty: "1",
    });

    rows.push({
      module: "Operating Environment",
      option: "Unity HFA Base Software-IC",
      sku: "[528-CNRZ]",
      qty: "1",
    });

    rows.push({
      module: "Starter Pack Drives",
      option: starterOpt.label,
      sku: starterOpt.sku,
      qty: "1",
    });

    rows.push({
      module: "Fast Cache Drives",
      option: "Unity 400GB FAST CACHE 25x2.5 SSD",
      sku: "[400-BFXP]",
      qty: String(fastCacheQty),
    });

    rows.push({
      module: "SPIO",
      option: spioOpt.label,
      sku: spioOpt.sku,
      qty: "1",
    });

    rows.push({
      module: "SAS Backend Expansion",
      option: "UNITY 2x4 PORT SAS EXP FLD RCK",
      sku: "[403-BCCW]",
      qty: "1",
    });

    rows.push({
      module: "Install Kits",
      option: "Unity XT HFA Field Install Kit",
      sku: "[343-BBMN]",
      qty: "1",
    });

    rows.push({
      module: "Power Cords",
      option:
        "Pair of C13/C14 cables (Highline Power) or C19/C20 cables (480/680 Lowline Power) included with DPE",
      sku: "[379-BDOI]",
      qty: "1",
    });

    rows.push({
      module: "Dell Services: Hardware Support",
      option: "Parts Only Warranty 12Months-ACDTS, 12 Month(s)",
      sku: "[709-BBJP]",
      qty: "1",
    });

    rows.push({
      module: "Dell Services:Deployment Services",
      option: "No Installation Services Selected",
      sku: "[683-12965]",
      qty: "1",
    });

    rows.push({
      module: 'Dell EMC Unity XT HFA 25x2.5" DAE',
      option:
        "Unity 2U 25x2.5 DAE Customer Supplied Rack (Pair of SAS Cables Included)",
      sku: "[210-ASLF]",
      qty: String(dae25Qty),
    });

    rows.push({
      module: 'Hard Drives (2.5")',
      option: ssd25Opt.label,
      sku: ssd25Opt.sku,
      qty: String(ssd25Qty),
    });

    rows.push({
      module: "Power Cords",
      option: "C13 Power Cord Pair BSI 1363 plugs 2Metr",
      sku: "[450-AILC]",
      qty: "1",
    });

    rows.push({
      module: "TLA",
      option: "Non TLA Order",
      sku: "[800-BBQV]",
      qty: "1",
    });

    rows.push({
      module: "Dell Services: Hardware Support",
      option: "Parts Only Warranty 12Months-ACDTS, 12 Month(s)",
      sku: "[709-BBJP]",
      qty: "1",
    });

    rows.push({
      module: "Dell Services:Deployment Services",
      option: "No Installation Services Selected",
      sku: "[683-12965]",
      qty: "1",
    });

    rows.push({
      module: "Dell EMC Unity XT 15x3.5 DAE",
      option:
        "Unity 3U 15x3.5 DAE Customer Supplied Rack (Pair of SAS Cables Included)",
      sku: "[210-ASLH]",
      qty: String(dae35Qty),
    });

    rows.push({
      module: 'Hard Drives (3.5")',
      option: hdd35Opt.label,
      sku: hdd35Opt.sku,
      qty: String(hdd35Qty),
    });

    rows.push({
      module: "Power Cords",
      option: "C13 Power Cord Pair BSI 1363 plugs 2Metr",
      sku: "[450-AILC]",
      qty: "1",
    });

    rows.push({
      module: "TLA",
      option: "Non TLA Order",
      sku: "[800-BBQV]",
      qty: "1",
    });

    rows.push({
      module: "Dell Services: Hardware Support",
      option: "Parts Only Warranty 12Months-ACDTS, 12 Month(s)",
      sku: "[709-BBJP]",
      qty: "1",
    });

    rows.push({
      module: "Dell Services:Deployment Services",
      option: "No Installation Services Selected",
      sku: "[683-12965]",
      qty: "1",
    });

    rows.push({
      module: "Freight Charges",
      option: "EMC02 Freight Charges (DDD)",
      sku: "[990-27554]",
      qty: "1",
    });

    return rows;
  };

    const handleExportExcel = () => {
    const rows = buildExportRows();

    // هدر ستون‌ها مثل جدول صفحه
    const header = ["Module Name", "Option Name", "SKUs / Part Number", "Qty"];
    const dataRows = rows.map((r) => [
      r.module,
      r.option,
      r.sku,
      String(r.qty ?? ""),
    ]);

    const escapeCell = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;");

    const html =
      '<html><head><meta charset="utf-8"></head><body><table>' +
      [header, ...dataRows]
        .map(
          (row) =>
            "<tr>" +
            row.map((cell) => `<td>${escapeCell(cell)}</td>`).join("") +
            "</tr>"
        )
        .join("") +
      "</table></body></html>";

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unity_config_full.xls"; // شبیه PowerStore
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="unity-configurator min-h-screen bg-[#f8fafc]">
      <Head>
        <title>Dell EMC Unity XT Configurator | BOM & Part Numbers</title>
        <meta
          name="description"
          content="Unity XT Configurator برای ساخت BOM و انتخاب پارت‌نامبرهای Dell EMC Unity XT (380/480/680/880) و تهیه خروجی Excel."
        />
        <meta
          name="keywords"
          content="Unity XT, Dell EMC Unity XT, Unity Configurator, BOM, Bill of Materials, Part Number, Unity 380, Unity 480, Unity 680, Unity 880"
        />
      </Head>

      {/* بنر شبیه MidrangeSizer */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span className="text-teal-400">Unity</span>{" "}
            <span className="text-yellow-400">Configurator</span>
          </h1>
          <p className="text-slate-300 mt-2 text-sm md:text-base">
            Configure Dell EMC Unity XT systems and export the full bill of
            materials to Excel.
          </p>
        </div>
      </section>

      {/* بدنه جدول */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        <div className="overflow-x-auto rounded-2xl bg-white shadow border border-slate-200">
          <table className="w-full text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left w-[28%]">
                  Module Name
                </th>
                <th className="border border-slate-200 px-4 py-3 text-left w-[50%]">
                  Option Name
                </th>
                <th className="border border-slate-200 px-2 py-3 text-center w-[12%]">
                  SKUs / Part Number
                </th>
                <th className="border border-slate-200 px-2 py-3 text-center w-[10%]">
                  Qty
                </th>
              </tr>
            </thead>

            <tbody>
              {/* DPE */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell EMC Unity XT
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  <select
                    value={modelId}
                    onChange={handleModelChange}
                    className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                  >
                    {UNITY_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center align-middle whitespace-nowrap">
                  {selectedModel.sku}
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center align-middle">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Operating Environment */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Operating Environment
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Unity HFA Base Software-IC
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [528-CNRZ]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Starter Pack Drives */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Starter Pack Drives
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  <select
                    className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                    value={starterIndex}
                    onChange={(e) =>
                      setStarterIndex(parseInt(e.target.value, 10) || 0)
                    }
                  >
                    {STARTER_PACK_OPTIONS.map((o, idx) => (
                      <option key={o.sku} value={idx}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  {starterOpt.sku}
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Fast Cache */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Fast Cache Drives
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Unity 400GB FAST CACHE 25x2.5 SSD
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [400-BFXP]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <select
                    className="mx-auto block w-16 h-8 border rounded-md text-center text-sm"
                    value={fastCacheQty}
                    onChange={(e) =>
                      setFastCacheQty(parseInt(e.target.value, 10) || 0)
                    }
                  >
                    {fastCacheOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* SPIO */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">SPIO</td>
                <td className="border border-slate-200 px-4 py-2">
                  <select
                    className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                    value={spioIndex}
                    onChange={(e) =>
                      setSpioIndex(parseInt(e.target.value, 10) || 0)
                    }
                  >
                    {SPIO_OPTIONS.map((o, idx) => (
                      <option key={o.sku} value={idx}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  {spioOpt.sku}
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* SAS Backend Expansion */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  SAS Backend Expansion
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  UNITY 2x4 PORT SAS EXP FLD RCK
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [403-BCCW]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Install Kits */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Install Kits
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Unity XT HFA Field Install Kit
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [343-BBMN]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Power Cords (block 1) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Power Cords
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Pair of C13/C14 cables (Highline Power) or C19/C20 cables
                  (480/680 Lowline Power) included with DPE
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [379-BDOI]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Hardware Support (block 1) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell Services: Hardware Support
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Parts Only Warranty 12Months-ACDTS, 12 Month(s)
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [709-BBJP]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Deployment (block 1) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell Services:Deployment Services
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  No Installation Services Selected
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [683-12965]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* DAE 25x2.5 */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell EMC Unity XT HFA 25x2.5&quot; DAE
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Unity 2U 25x2.5 DAE Customer Supplied Rack (Pair of SAS Cables
                  Included)
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [210-ASLF]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md"
                    min={1}
                    value={String(dae25Qty)}
                    readOnly
                  />
                </td>
              </tr>

              {/* 2.5" Drives */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Hard Drives (2.5")
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  <select
                    className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                    value={ssd25Index}
                    onChange={(e) =>
                      setSsd25Index(parseInt(e.target.value, 10) || 0)
                    }
                  >
                    {SSD25_OPTIONS.map((o, idx) => (
                      <option key={o.sku} value={idx}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  {ssd25Opt.sku}
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-16 h-8 text-center border rounded-md"
                    value={String(ssd25Qty)}
                    onChange={handleSsdChange}
                  />
                </td>
              </tr>

              {/* Power Cords (block 2) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Power Cords
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  C13 Power Cord Pair BSI 1363 plugs 2Metr
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [450-AILC]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* TLA */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">TLA</td>
                <td className="border border-slate-200 px-4 py-2">
                  Non TLA Order
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [800-BBQV]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Hardware Support (block 2) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell Services: Hardware Support
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Parts Only Warranty 12Months-ACDTS, 12 Month(s)
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [709-BBJP]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Deployment (block 2) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell Services:Deployment Services
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  No Installation Services Selected
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [683-12965]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* DAE 15x3.5 */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell EMC Unity XT 15x3.5 DAE
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Unity 3U 15x3.5 DAE Customer Supplied Rack (Pair of SAS Cables
                  Included)
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [210-ASLH]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md"
                    min={1}
                    value={String(dae35Qty)}
                    readOnly
                  />
                </td>
              </tr>

              {/* 3.5" Drives */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Hard Drives (3.5")
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  <select
                    className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                    value={hdd35Index}
                    onChange={(e) =>
                      setHdd35Index(parseInt(e.target.value, 10) || 0)
                    }
                  >
                    {HDD35_OPTIONS.map((o, idx) => (
                      <option key={o.sku} value={idx}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  {hdd35Opt.sku}
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-16 h-8 text-center border rounded-md"
                    value={String(hdd35Qty)}
                    onChange={handleHddChange}
                  />
                </td>
              </tr>

              {/* Power Cords (block 3) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Power Cords
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  C13 Power Cord Pair BSI 1363 plugs 2Metr
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [450-AILC]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* TLA (block 2) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">TLA</td>
                <td className="border border-slate-200 px-4 py-2">
                  Non TLA Order
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [800-BBQV]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Hardware Support (block 3) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell Services: Hardware Support
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  Parts Only Warranty 12Months-ACDTS, 12 Month(s)
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [709-BBJP]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Deployment (block 3) */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Dell Services:Deployment Services
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  No Installation Services Selected
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [683-12965]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>

              {/* Freight Charges */}
              <tr>
                <td className="border border-slate-200 px-4 py-2">
                  Freight Charges
                </td>
                <td className="border border-slate-200 px-4 py-2">
                  EMC02 Freight Charges (DDD)
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center whitespace-nowrap">
                  [990-27554]
                </td>
                <td className="border border-slate-200 px-2 py-2 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="mx-auto block w-14 h-8 text-center border rounded-md bg-slate-50"
                    value="1"
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* دکمه اکسل */}
          <div className="flex justify-end px-4 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-teal-500 text-white text-sm font-semibold hover:bg-teal-400 transition shadow-sm"
            >
              📥 Download Excel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}