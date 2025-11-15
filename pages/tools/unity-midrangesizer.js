import React, { useState } from "react";

const MODELS = [
  "Unity XT 380",
  "Unity XT 480",
  "Unity XT 680",
  "Unity XT 880",
  "Unity XT 480F",
  "Unity XT 680F",
  "Unity XT 880F",
];

// From legacy / pro calculator
const DISK_OPTIONS = [
  "400GB",
  "600GB",
  "1.2TB",
  "1.8TB",
  "3.2TB",
  "4TB",
  "8TB",
  "10TB",
  "12TB",
  "14TB",
  "16TB",
  "18TB",
  "20TB",
];

const RAID_OPTIONS = ["RAID5", "RAID6", "RAID10"];

const SPARE_OPTIONS = ["1/32", "1/30", "2/32", "1/46", "2/46"];

const RAID_SET_OPTIONS = {
  RAID5: ["4+1", "8+1", "12+1"],
  RAID6: ["4+2", "6+2", "8+2", "12+2", "14+2"],
  RAID10: ["1+1", "2+2", "3+3", "4+4"],
};

const TIERS = [
  { key: "extreme", label: "Extreme Performance" },
  { key: "performance", label: "Performance" },
  { key: "capacity", label: "Capacity" },
];

// Model capacity in number of drives, based on legacy JS
const MODEL_CAPS = {
  "Unity XT 380": 500,
  "Unity XT 480": 750,
  "Unity XT 680": 1000,
  "Unity XT 880": 1500,
  // F models follow same caps as their non-F siblings
  "Unity XT 480F": 750,
  "Unity XT 680F": 1000,
  "Unity XT 880F": 1500,
};

const initialRows = {
  extreme: { disk: "400GB", raid: "RAID5", spare: "1/32", set: "4+1", count: 0 },
  performance: { disk: "1.2TB", raid: "RAID5", spare: "1/32", set: "4+1", count: 0 },
  capacity: { disk: "4TB", raid: "RAID5", spare: "1/32", set: "4+1", count: 0 },
};

function parseSet(setStr) {
  const [aStr, bStr] = String(setStr || "").split("+");
  const a = parseInt(aStr || "0", 10);
  const b = parseInt(bStr || "0", 10);
  return { a, b, size: a + b };
}

// per32 from legacy: 1/32 -> 1, 2/32 -> 2, others treated as 1 or 2 depending on numerator
function per32(sparePolicy) {
  const val = String(sparePolicy || "").trim();
  if (val === "2/32") return 2;
  if (val.startsWith("2/")) return 2;
  return 1;
}

// validCounts copied from legacy logic
function validCounts(maxN, setSize, per) {
  const out = [0];
  for (let n = 1; n <= maxN; n += 1) {
    const sp = Math.max(per, Math.ceil(n / 32) * per);
    const eff = n - sp;
    if (eff >= setSize && eff % setSize === 0) {
      out.push(n);
    }
  }
  return out;
}

function getCountOptions(model, setStr, sparePolicy) {
  const cap = MODEL_CAPS[model] || 1500;
  const { size } = parseSet(setStr);
  const per = per32(sparePolicy);
  return validCounts(cap, size, per);
}

export default function UnityMidrangeSizerPage() {
  const [model, setModel] = useState("Unity XT 480");
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});

  function handleRowChange(tierKey, field, value) {
    setRows((prev) => {
      const next = { ...prev, [tierKey]: { ...prev[tierKey], [field]: value } };
      if (field === "raid") {
        const raid = value;
        const allowedSets = RAID_SET_OPTIONS[raid] || [];
        if (allowedSets.length > 0 && !allowedSets.includes(next[tierKey].set)) {
          next[tierKey].set = allowedSets[0];
        }
      }
      return next;
    });
  }

  async function calcRow(row) {
    const res = await fetch("/api/unity-calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disk: row.disk,
        raid: row.raid,
        set: row.set,
        count: row.count,
        sparePolicy: row.spare,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Calculation error");
    }
    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResults({});
    setLoading(true);
    try {
      const newResults = {};
      for (const tier of TIERS) {
        const row = rows[tier.key];
        if (!row.count || row.count <= 0) continue;
        const out = await calcRow(row);
        newResults[tier.key] = out;
      }
      setResults(newResults);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  const totalUsable = Object.values(results).reduce((sum, r) => {
    if (!r || typeof r.usableTB !== "number") return sum;
    return sum + r.usableTB;
  }, 0);

  return (
    <main dir="ltr" className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md px-6 py-8 text-left">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900">
          Unity XT RAID Calculator
        </h1>
        <p className="text-sm md:text-base text-slate-600 mb-6">
          Quick sizing helper for Unity XT / midrange configurations. Results are approximate and must be
          validated against Dell EMC documentation and your own design rules.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Model */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Model
            </label>
            <select
              className="w-60 border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base bg-slate-50"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Tiers */}
          {TIERS.map((tier) => {
            const row = rows[tier.key];
            const raidSets = RAID_SET_OPTIONS[row.raid] || RAID_SET_OPTIONS.RAID5;
            const counts = getCountOptions(model, row.set, row.spare);
            return (
              <div key={tier.key} className="mb-4">
                <div className="font-semibold text-slate-800 mb-2">
                  {tier.label}
                </div>
                <div className="grid grid-cols-5 gap-3 items-center">
                  {/* Disk */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                      Disk
                    </label>
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={row.disk}
                      onChange={(e) =>
                        handleRowChange(tier.key, "disk", e.target.value)
                      }
                    >
                      {DISK_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* RAID */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                      RAID
                    </label>
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={row.raid}
                      onChange={(e) =>
                        handleRowChange(tier.key, "raid", e.target.value)
                      }
                    >
                      {RAID_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Spare Policy */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                      Spare Policy
                    </label>
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={row.spare}
                      onChange={(e) =>
                        handleRowChange(tier.key, "spare", e.target.value)
                      }
                    >
                      {SPARE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Set */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                      Set
                    </label>
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={row.set}
                      onChange={(e) =>
                        handleRowChange(tier.key, "set", e.target.value)
                      }
                    >
                      {raidSets.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Count */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">
                      Count
                    </label>
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      value={row.count}
                      onChange={(e) =>
                        handleRowChange(
                          tier.key,
                          "count",
                          parseInt(e.target.value || "0", 10)
                        )
                      }
                    >
                      {counts.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-sm md:text-base font-semibold bg-slate-200 text-slate-800"
              onClick={() => {
                setRows(initialRows);
                setResults({});
                setError(null);
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm md:text-base font-semibold bg-teal-500 text-white disabled:opacity-60"
            >
              {loading ? "Calculating…" : "Calculate"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error: {error}
          </div>
        )}

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Results
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {TIERS.map((tier) => {
                const r = results[tier.key];
                if (!r) return null;
                return (
                  <div
                    key={tier.key}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  >
                    <div className="font-semibold mb-2 text-slate-800">
                      {tier.label}
                    </div>
                    <ul className="space-y-1 text-slate-700">
                      <li><b>Disk:</b> {r.disk}</li>
                      <li><b>RAID:</b> {r.raid}</li>
                      <li><b>Set:</b> {r.set}</li>
                      <li><b>Count:</b> {r.count}</li>
                      <li><b>Spare policy:</b> {r.sparePolicy}</li>
                      <li><b>Spare disks:</b> {r.spares}</li>
                      <li><b>Groups:</b> {r.groups}</li>
                      <li><b>Usable per set (TB):</b> {r.perSetTB}</li>
                      <li><b>Total usable (TB):</b> {r.usableTB}</li>
                      <li><b>Source:</b> {r.from}</li>
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-sm md:text-base font-semibold text-slate-900">
              Total usable (all tiers): {totalUsable.toFixed(2)} TB
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
