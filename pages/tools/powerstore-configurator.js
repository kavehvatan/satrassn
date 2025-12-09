// pages/tools/powerstore-configurator.js
import { useMemo, useState } from "react";
import Head from "next/head";

// -------------------- ثابت‌ها از روی app.py --------------------

const MOD_COL = "Module Name";
const OPT_COL = "Option Name";
const SKU_COL = "SKUs";
const QTY_COL = "Qty";

const BASE_MODELS = [
  {
    label: "PowerStore 1200T Base Dell Customer Racked",
    sku: "[210-BCZJ]",
    memText: "384GB Appliance DIMM (192GB Per Node)",
    memSku: "[370-AEZP]",
  },
  {
    label: "PowerStore 3200T Base Dell Customer Racked",
    sku: "[210-BDBC]",
    memText: "768GB Appliance DIMM (384GB Per Node)",
    memSku: "[370-AEZQ]",
  },
  {
    label: "PowerStore 5200T Base Dell Customer Racked",
    sku: "[210-BDBX]",
    memText: "1152GB Appliance DIMM (576GB Per Node)",
    memSku: "[370-AEZR]",
  },
  {
    label: "PowerStore 9200T Base Dell Customer Racked",
    sku: "[210-BDCP]",
    memText: "2560GB Appliance DIMM 1280GB Per Node",
    memSku: "[370-AHFI]",
  },
];

const DRIVE_OPTIONS = [
  { label: "1.92TB NVMe SSD FIPS", sku: "[400-BGGI]" },
  { label: "3.84TB NVMe SSD FIPS", sku: "[400-BGGM]" },
  { label: "7.68TB NVMe SSD FIPS", sku: "[400-BGGP]" },
  { label: "15.36TB NVMe SED FIPS", sku: "[400-BGGK]" },
];

const SFP_OPTIONS = [
  { label: "10GBE Optical SFP Pair", sku: "[407-BCGF]" },
  { label: "25GBE Optical SFP Pair", sku: "[407-BCGB]" },
];

// بلاک سرویس‌های Expansion
function expServicesBlock() {
  return [
    {
      module: "Dell Services: Hardware Support",
      option: "Parts Only Warranty 36Months-ACDTS, 36 Month(s)",
      sku: "[709-BDLH]",
      qty: 1,
    },
    {
      module: "Dell Services: Extended Service",
      option:
        "ProSupport and Next Business Day Onsite Service-ACDTS, 36 Month(s)",
      sku: "[199-BJKM]",
      qty: 1,
    },
    {
      module: "Dell Services:Deployment Services",
      option: "Infrastructure Deployment Selected",
      sku: "[683-18894]",
      qty: 1,
    },
    {
      module: "Dell Services:Deployment Services",
      option: "No Field Deployment  Customer Install Required",
      sku: "[683-18894]",
      qty: 1,
    },
  ];
}

function expSetQty1() {
  return [
    {
      module: "Config Kits",
      option: "PowerStore ENS24 Exp Kit FLD QTY 1 (1200-9200)",
      sku: "[343-BBTM]",
      qty: 1,
    },
    {
      module: "Install Kits",
      option: "PowerStore NVMe EXP Install Kit",
      sku: "[343-BBTL]",
      qty: 1,
    },
    ...expServicesBlock(),
  ];
}

function expSetQty23() {
  return [
    {
      module: "Config Kits",
      option: "PowerStore ENS24 Exp Kit FLD QTY 2-3 (1200-9200)",
      sku: "[343-BBTK]",
      qty: 1,
    },
    {
      module: "Install Kits",
      option: "PowerStore NVMe EXP Install Kit",
      sku: "[343-BBTL]",
      qty: 1,
    },
    ...expServicesBlock(),
  ];
}

// یک Expansion کامل (Enclosure + Drives + Config/Install/Services)
function buildExpansionBlock(bundleType, expansionId) {
  const bundleRows =
    bundleType === "1" ? expSetQty1() : expSetQty23();

  return [
    {
      module: "Dell PowerStore 24x2.5 NVMe Expansion Enclosure",
      option: "PowerStore NVMe Expansion 24x2.5 Customer Racked",
      sku: "[210-BDCY]",
      qty: 1,
    },
    {
      module: "Drives",
      option: "7.68TB NVMe SSD",
      sku: "[400-BGGP]",
      qty: 24,
      qtyMax: 24,
      kind: `expansion-drives-${expansionId}`,
    },
    ...bundleRows,
  ];
}

// ردیف‌های Appliance اصلی (پیش‌فرض 9200T)
function buildInitialRows() {
  const base = BASE_MODELS[3]; // 9200T

  const rows = [
    {
      module: "Dell PowerStore",
      option: base.label,
      sku: base.sku,
      qty: 1,
    },
    {
      module: "Memory Capacity",
      option: base.memText,
      sku: base.memSku,
      qty: 1,
    },
    {
      module: "Drives",
      option: "7.68TB NVMe SSD",
      sku: "[400-BGGP]",
      qty: 21,
      qtyMax: 21, // برای Appliance (بعداً بسته به مدل می‌شود 21 یا 23)
      kind: "appliance-drives",
    },
    {
      module: "NVRAM Caching Device",
      option: "PowerStore NVRAM FIPS QTY 2",
      sku: "[400-BOBK]",
      qty: 2,
    },
    {
      module: "Operating Environment",
      option: "PowerStore Base SW",
      sku: "[528-BTZK]",
      qty: 1,
    },
    {
      module: "4 Port Mezz Cards",
      option: "25GBE Optical 4 Port Card Pair (SFPs not included)",
      sku: "[406-BBOO]",
      qty: 1,
    },
    {
      module: "2 Port Mezz Card (Required for NVMe Expansion)",
      option: "PowerStore 100GB MEZZ Pair (SPFs not included)",
      sku: "[406-BBSJ]",
      qty: 1,
    },
    {
      module: "Optional Appliance IO Module",
      option: "32GB FC 4 Port IO Module Pair (SFPs included)",
      sku: "[565-BBJS]",
      qty: 2,
    },
    {
      module: "Optional SFPs",
      option: "10GBE Optical SFP Pair",
      sku: "[407-BCGF]",
      qty: 4,
      kind: "optional-sfp",
    },
    {
      module: "Power Supply",
      option:
        "Dual 2200W (200-240V) Power Supply, includes C19/C20 Power Cords",
      sku: "[450-AION]",
      qty: 1,
    },
    {
      module: "Install Kits",
      option: "PowerStore Base Enclosure Install Kit",
      sku: "[343-BBTN]",
      qty: 1,
    },
    {
      module: "Dell Services: Hardware Support",
      option: "Parts Only Warranty 36Months-ACDTS, 36 Month(s)",
      sku: "[709-BDLB]",
      qty: 1,
    },
    {
      module: "Dell Services: Extended Service",
      option:
        "ProSupport and Next Business Day Onsite Service-ACDTS, 36 Month(s)",
      sku: "[199-BJKM]",
      qty: 1,
    },
    {
      module: "Storage Configuration",
      option: "Clustered Storage",
      sku: "[800-BBQV]",
      qty: 1,
    },
    {
      module: "Dell Services:Deployment Services",
      option: "Custom Installation Required with this order",
      sku: "[683-18894]",
      qty: 1,
    },
  ];

  // سه Expansion مثل app.py
  rows.push(...buildExpansionBlock("1", 1));   // DAE #1
  rows.push(...buildExpansionBlock("23", 2));  // DAE #2
  rows.push(...buildExpansionBlock("23", 3));  // DAE #3

  return rows;
}

const INITIAL_ROWS = buildInitialRows();

// ایندکس‌هایی که بعداً لازم می‌شود
const APPLIANCE_DRIVES_INDEX = INITIAL_ROWS.findIndex(
  (r) => r.kind === "appliance-drives"
);
const OPTIONAL_SFP_INDEX = INITIAL_ROWS.findIndex(
  (r) => r.kind === "optional-sfp"
);

// -------------------- کامپوننت اصلی --------------------

export default function PowerStoreConfiguratorPage() {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [baseIndex, setBaseIndex] = useState(3); // 9200T

  const applianceDrivesRow = useMemo(
    () => rows[APPLIANCE_DRIVES_INDEX],
    [rows]
  );

  // تغییر مدل پایه (مثل dd-base + script.js)
  const handleBaseChange = (event) => {
    const newIndex = parseInt(event.target.value, 10);
    const base = BASE_MODELS[newIndex];
    const isLowBase = /1200T|3200T/.test(base.label);

    setBaseIndex(newIndex);

    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));

      // Dell PowerStore row
      const baseRowIndex = next.findIndex(
        (r) => r.module === "Dell PowerStore"
      );
      if (baseRowIndex !== -1) {
        next[baseRowIndex].option = base.label;
        next[baseRowIndex].sku = base.sku;
      }

      // Memory Capacity row
      const memIndex = next.findIndex(
        (r) => r.module === "Memory Capacity"
      );
      if (memIndex !== -1) {
        next[memIndex].option = base.memText;
        next[memIndex].sku = base.memSku;
      }

      // NVRAM Caching Device row → Qty ثابت ۱ یا ۲
      const nvrIndex = next.findIndex(
        (r) => r.module === "NVRAM Caching Device"
      );
      if (nvrIndex !== -1) {
        next[nvrIndex].qty = isLowBase ? 1 : 2;
      }

      // Drives اصلی Appliance → Max 21 یا 23
      if (APPLIANCE_DRIVES_INDEX !== -1) {
        const row = next[APPLIANCE_DRIVES_INDEX];
        const newMax = isLowBase ? 23 : 21;
        const newQty =
          row.qty > newMax ? newMax : row.qty || (isLowBase ? 23 : 21);
        row.qtyMax = newMax;
        row.qty = newQty;
      }

      return next;
    });
  };

  // تغییر دراپ‌داون Drives (هم Appliance هم Expansion)
  const handleDriveChange = (rowIndex, value) => {
    const drive = DRIVE_OPTIONS.find((d) => d.label === value);
    if (!drive) return;
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));
      next[rowIndex].option = drive.label;
      next[rowIndex].sku = drive.sku;
      return next;
    });
  };

  // تغییر Optional SFPs
  const handleSfpChange = (rowIndex, value) => {
    const sfp = SFP_OPTIONS.find((s) => s.label === value);
    if (!sfp) return;
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));
      next[rowIndex].option = sfp.label;
      next[rowIndex].sku = sfp.sku;
      return next;
    });
  };

  // تغییر Qty برای Drives
  const handleQtyChange = (rowIndex, value) => {
    const num = parseInt(value || "1", 10);
    if (!Number.isFinite(num)) return;
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));
      next[rowIndex].qty = num;
      return next;
    });
  };

  // Export به Excel مثل script.js
  const handleExportExcel = () => {
    const header = [MOD_COL, OPT_COL, SKU_COL, QTY_COL];
    const dataRows = rows.map((r) => [
      r.module,
      r.option,
      r.sku,
      String(r.qty ?? ""),
    ]);

    const html =
      '<html><head><meta charset="utf-8"></head><body><table>' +
      [header, ...dataRows]
        .map(
          (row) =>
            "<tr>" +
            row
              .map((cell) =>
                `<td>${String(cell)
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")}</td>`
              )
              .join("") +
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
    a.download = "powerstore-config.xls";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="powerstore-configurator min-h-screen bg-[#f8fafc]">
      <Head>
  <title>
    Dell EMC PowerStore Configurator | کانفیگ NVMe و Bill of Materials
  </title>
  <meta
    name="description"
    content="ابزار آنلاین کانفیگ Dell EMC PowerStore برای مدل‌های 1200T، 3200T، 5200T و 9200T با درایوهای NVMe، Expansion Enclosure و خروجی کامل Bill of Materials (BoM) به صورت فایل Excel."
  />
  <meta
    name="keywords"
    content="Dell EMC PowerStore, PowerStore Configurator, PowerStore 1200T, PowerStore 3200T, PowerStore 5200T, PowerStore 9200T, NVMe SSD, BoM, Bill of Materials, کانفیگ پاوراستور, پاوراستور NVMe"
  />
</Head>

      {/* بنر شبیه Unity Configurator */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span className="text-teal-400">PowerStore</span>{" "}
            <span className="text-yellow-400">Configurator</span>
          </h1>
          <p className="text-slate-300 mt-2 text-sm md:text-base">
            Configure Dell PowerStore T-appliances with NVMe expansions and
            export the full bill of materials to Excel.
          </p>
        </div>
      </section>

      {/* جدول اصلی */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        <div className="overflow-x-auto rounded-2xl bg-white shadow border border-slate-200">
          <table
            className="min-w-full text-sm text-slate-900"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-4 py-3 text-left w-[28%]">
                  {MOD_COL}
                </th>
                <th className="border border-slate-200 px-4 py-3 text-left w-[50%]">
                  {OPT_COL}
                </th>
               <th className="border border-slate-200 px-2 py-3 text-center w-[8%]">
  SKUs / Part Number
</th>
                <th className="border border-slate-200 px-2 py-3 text-center w-[9%]">
                  {QTY_COL}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => {
                const isBaseRow =
                  row.module === "Dell PowerStore";
                const isDrives = row.module === "Drives";
                const isOptionalSfp =
                  row.module === "Optional SFPs";
                const isApplianceDrives =
                  row.kind === "appliance-drives";

                // برای Qty — فقط Drives dropdown دارد
                const qtyContent = isDrives ? (
                  <select
                    className="mx-auto block w-16 h-8 border rounded-md text-center text-sm"
                    value={row.qty}
                    onChange={(e) =>
                      handleQtyChange(idx, e.target.value)
                    }
                  >
                    {Array.from(
                      {
                        length:
                          isApplianceDrives && row.qtyMax
                            ? row.qtyMax
                            : row.qtyMax || 24,
                      },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="qty-fixed">
                    {row.qty != null ? row.qty : ""}
                  </span>
                );

                // Option Name cell با توجه به نوع ردیف
                let optionCell = row.option;
                if (isBaseRow) {
                  optionCell = (
                    <select
                      className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                      value={String(baseIndex)}
                      onChange={handleBaseChange}
                    >
                      {BASE_MODELS.map((m, i) => (
                        <option key={m.sku} value={i}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  );
                } else if (isDrives) {
                  optionCell = (
                    <select
                      className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                      value={row.option}
                      onChange={(e) =>
                        handleDriveChange(idx, e.target.value)
                      }
                    >
                      {DRIVE_OPTIONS.map((d) => (
                        <option key={d.sku} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  );
                } else if (isOptionalSfp) {
                  optionCell = (
                    <select
                      className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                      value={row.option}
                      onChange={(e) =>
                        handleSfpChange(idx, e.target.value)
                      }
                    >
                      {SFP_OPTIONS.map((s) => (
                        <option key={s.sku} value={s.label}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  );
                }

                return (
                  <tr key={idx}>
                    <td className="border border-slate-200 px-4 py-2 align-middle">
                      {row.module}
                    </td>
                    <td className="border border-slate-200 px-4 py-2 align-middle">
                      {optionCell}
                    </td>
                    <td className="border border-slate-200 px-2 py-2 text-center align-middle whitespace-nowrap">
                      {row.sku}
                    </td>
                    <td className="border border-slate-200 px-2 py-2 text-center align-middle">
                      {qtyContent}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* دکمه Excel */}
          <div className="flex justify-end px-4 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-teal-500 text-white text-sm font-semibold hover:bg-teal-400 transition shadow-sm"
            >
              📥 Export as Excel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}