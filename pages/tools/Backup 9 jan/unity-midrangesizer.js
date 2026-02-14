// pages/tools/unity-midrangesizer.js
import Head from "next/head";
import { useMemo, useState } from "react";

// حداکثر تعداد درایو هر مدل Unity XT
const MODELS = {
  "Unity XT 380": 500,
  "Unity XT 480": 750,
  "Unity XT 680": 1000,
  "Unity XT 880": 1500,
};

// انواع RAID مجاز برای هر Tier
const RAID_OPTIONS = {
  "Extreme Performance": ["RAID5", "RAID6", "RAID10"],
  Performance: ["RAID5", "RAID6", "RAID10"],
  Capacity: ["RAID6"], // فقط RAID6 برای Capacity — طبق درخواست تو
};

// ست‌های RAID
const RAID_SETS = {
  RAID5: ["4+1", "8+1", "12+1"],
  RAID6: ["4+2", "6+2", "8+2", "12+2", "14+2"],
  RAID10: ["1+1", "2+2", "3+3", "4+4"],
};

const TIERS = [
  [
    "Extreme Performance",
    [
      "400GB",
      "800GB",
      "1.6TB",
      "1.92TB",
      "3.2TB",
      "3.84TB",
      "7.68TB",
      "15.36TB",
    ],
  ],
  ["Performance", ["1.2TB", "1.8TB"]],
  ["Capacity", ["4TB", "6TB", "12TB"]],
];

function per32(s) {
  return s === "2/32" ? 2 : 1;
}

function parseSet(v) {
  return v.split("+").map((n) => parseInt(n, 10));
}

function generateCounts(setSize, maxDrives, per) {
  const options = [];
  let i = 1;
  while (true) {
    const data = i * setSize;
    const spares = Math.max(per, per * Math.ceil(data / 32));
    const total = data + spares;
    if (total > maxDrives) break;
    options.push(total);
    i++;
  }
  return options;
}

function Calculator() {
  const [model, setModel] = useState(Object.keys(MODELS)[1]);

  // مقدار اولیه—بدون autoSet
  const [rows, setRows] = useState(() => {
    const init = {};
    for (const [tier, sizes] of TIERS) {
      const raid = RAID_OPTIONS[tier][0];

      // پیش‌فرض دیسک‌ها
      const defaultDisk =
        tier === "Extreme Performance"
          ? sizes.find((d) => d === "3.2TB") || sizes[0]
          : sizes[0];

      init[tier] = {
        disk: defaultDisk,
        raid,
        spare: "1/32",
        set: RAID_SETS[raid][0],
        count: 0,
      };
    }
    return init;
  });

  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setRow = (tier, patch) =>
    setRows((prev) => ({ ...prev, [tier]: { ...prev[tier], ...patch } }));

  const usedByOthers = (currentTier) =>
    Object.entries(rows).reduce(
      (sum, [t, r]) => sum + (t === currentTier ? 0 : (r.count || 0)),
      0
    );

  // محاسبه گزینه‌های Count بر اساس ظرفیت مدل
  const suggestions = useMemo(() => {
    const out = {};
    const max = MODELS[model];

    for (const [tier] of TIERS) {
      const r = rows[tier];
      const [a, b] = parseSet(r.set);
      const setSize = a + b;
      const per = per32(r.spare);

      const remaining = Math.max(0, max - usedByOthers(tier));
      const valids = generateCounts(setSize, remaining, per);

      const fullValid = generateCounts(setSize, max, per);

      const base = [{ value: 0, disabled: false }];
      for (const v of fullValid)
        base.push({ value: v, disabled: !valids.includes(v) });

      if (r.count > 0 && !base.some((o) => o.value === r.count)) {
        base.splice(1, 0, { value: r.count, disabled: r.count > remaining });
      }

      out[tier] = base;
    }
    return out;
  }, [rows, model]);

  // مدل جدید → اگر بیش از سقف باشد همه Count صفر شود
  const onModelChange = (m) => {
    const newMax = MODELS[m];

    setRows((prev) => {
      const total = Object.values(prev).reduce(
        (sum, r) => sum + (r.count || 0),
        0
      );

      if (total <= newMax) return prev;

      const cleared = {};
      for (const [tier, row] of Object.entries(prev)) {
        cleared[tier] = { ...row, count: 0 };
      }
      return cleared;
    });

    setModel(m);
  };

  // تغییرات ردیف‌ها بدون autoSet
  const onRowChange = (tier, patch) => {
    setRows((prev) => {
      const current = prev[tier];
      let next = { ...current, ...patch };

      // اگر RAID عوض شود → فقط ست‌ها ریفرش شوند، نه خودکار
      if ("raid" in patch) {
        const sets = RAID_SETS[next.raid] || [];
        // ست قبلی اگر داخل لیست نیست، اولین ست انتخاب شود
        if (!sets.includes(next.set)) next.set = sets[0];
        next.count = 0; // count باید صفر شود
      }

      // اگر Set عوض شود → count صفر شود
      if ("set" in patch) {
        next.count = 0;
      }

      // Spare → Count صفر
      if ("spare" in patch) {
        next.count = 0;
      }

      return { ...prev, [tier]: next };
    });
  };

  async function onCalc() {
    setLoading(true);
    setError(null);
    setResults({});
    try {
      const active = Object.entries(rows).filter(([, r]) => r.count > 0);
      if (active.length === 0) {
        setLoading(false);
        return;
      }

      const outs = await Promise.all(
        active.map(async ([tier, r]) => {
          const res = await fetch("/api/unity-calculator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              disk: r.disk,
              raid: r.raid,
              set: r.set,
              count: r.count,
              sparePolicy: r.spare,
            }),
          });
          const data = await res.json();
          return { tier, ok: res.ok, data };
        })
      );

      const newRes = {};
      for (const o of outs) {
        if (o.ok) newRes[o.tier] = { usableTB: Number(o.data.usableTB || 0) };
      }
      setResults(newRes);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  const totalTb = Object.values(results).reduce(
    (sum, r) => sum + (r?.usableTB || 0),
    0
  );

  const selectStyle = {
    width: "auto",
    minWidth: 100,
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
  };

  const selectClasses =
    "w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <section
      className="unity-calculator"
      style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}
    >
      <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 16 }}>
        Unity XT RAID Calculator
      </h1>

      {/* Model selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ width: 90, fontWeight: 700 }}>Model</div>
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          style={selectStyle}
        >
          {Object.keys(MODELS).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* DESKTOP: جدول با اسکرول افقی (همان مدل قبلی) */}
      <div
        className="hidden md:block"
        style={{ marginTop: 4, overflowX: "auto" }}
      >
        <table
          style={{
            borderCollapse: "separate",
            borderSpacing: "0 6px",
            minWidth: 820,
            margin: "0 auto",
          }}
        >
          <thead>
            <tr style={{ fontSize: 12, color: "#6b7280", textAlign: "left" }}>
              <th style={{ width: 220 }}></th>
              <th>Disk</th>
              <th>RAID</th>
              <th>Spare Policy</th>
              <th>Set</th>
              <th>Count</th>
            </tr>
          </thead>

          <tbody>
            {TIERS.map(([tier, disks]) => {
              const r = rows[tier];
              const setOptions = RAID_SETS[r.raid];
              const items = suggestions[tier] || [{ value: 0, disabled: false }];
              const max = MODELS[model];
              const rem = Math.max(0, max - usedByOthers(tier));
              const [a, b] = parseSet(r.set);

              const minNeeded =
                a +
                b +
                Math.max(
                  per32(r.spare),
                  per32(r.spare) * Math.ceil((a + b) / 32)
                );

              const rowGrey = rem < minNeeded && r.count === 0;

              return (
                <tr key={tier} style={{ opacity: rowGrey ? 0.5 : 1 }}>
                  <td style={{ fontWeight: 700, paddingRight: 6 }}>{tier}</td>

                  <td>
                    <select
                      value={r.disk}
                      onChange={(e) =>
                        onRowChange(tier, { disk: e.target.value })
                      }
                      style={selectStyle}
                    >
                      {disks.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={r.raid}
                      onChange={(e) =>
                        onRowChange(tier, { raid: e.target.value })
                      }
                      style={selectStyle}
                    >
                      {RAID_OPTIONS[tier].map((rt) => (
                        <option key={rt}>{rt}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={r.spare}
                      onChange={(e) =>
                        onRowChange(tier, { spare: e.target.value })
                      }
                      style={selectStyle}
                    >
                      <option>1/32</option>
                      <option>2/32</option>
                    </select>
                  </td>

                  <td>
                    <select
                      value={r.set}
                      onChange={(e) =>
                        onRowChange(tier, { set: e.target.value })
                      }
                      style={selectStyle}
                    >
                      {setOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={String(r.count)}
                      onChange={(e) =>
                        onRowChange(tier, {
                          count: parseInt(e.target.value, 10),
                        })
                      }
                      style={selectStyle}
                    >
                      {items.map((o) => (
                        <option
                          key={o.value}
                          value={o.value}
                          disabled={o.disabled}
                        >
                          {o.value}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE: کارت برای هر Tier، بدون جدول */}
      <div className="md:hidden" style={{ marginTop: 8 }}>
        {TIERS.map(([tier, disks]) => {
          const r = rows[tier];
          const setOptions = RAID_SETS[r.raid];
          const items = suggestions[tier] || [{ value: 0, disabled: false }];
          const max = MODELS[model];
          const rem = Math.max(0, max - usedByOthers(tier));
          const [a, b] = parseSet(r.set);

          const minNeeded =
            a +
            b +
            Math.max(
              per32(r.spare),
              per32(r.spare) * Math.ceil((a + b) / 32)
            );

          const rowGrey = rem < minNeeded && r.count === 0;

          return (
            <div
              key={tier}
              className={`mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 ${
                rowGrey ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-sm">{tier}</div>
                <div className="text-[11px] text-slate-500">
                  Remaining: {rem}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                  gap: 8,
                }}
              >
                {/* Disk */}
                <div>
                  <div className="text-[11px] font-medium mb-1">Disk</div>
                  <select
                    value={r.disk}
                    onChange={(e) =>
                      onRowChange(tier, { disk: e.target.value })
                    }
                    className={selectClasses}
                  >
                    {disks.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* RAID */}
                <div>
                  <div className="text-[11px] font-medium mb-1">RAID</div>
                  <select
                    value={r.raid}
                    onChange={(e) =>
                      onRowChange(tier, { raid: e.target.value })
                    }
                    className={selectClasses}
                  >
                    {RAID_OPTIONS[tier].map((rt) => (
                      <option key={rt}>{rt}</option>
                    ))}
                  </select>
                </div>

                {/* Spare policy */}
                <div>
                  <div className="text-[11px] font-medium mb-1">
                    Spare policy
                  </div>
                  <select
                    value={r.spare}
                    onChange={(e) =>
                      onRowChange(tier, { spare: e.target.value })
                    }
                    className={selectClasses}
                  >
                    <option>1/32</option>
                    <option>2/32</option>
                  </select>
                </div>

                {/* Set */}
                <div>
                  <div className="text-[11px] font-medium mb-1">Set</div>
                  <select
                    value={r.set}
                    onChange={(e) =>
                      onRowChange(tier, { set: e.target.value })
                    }
                    className={selectClasses}
                  >
                    {setOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Count – full width */}
                <div style={{ gridColumn: "span 2 / span 2" }}>
                  <div className="text-[11px] font-medium mb-1">Count</div>
                  <select
                    value={String(r.count)}
                    onChange={(e) =>
                      onRowChange(tier, {
                        count: parseInt(e.target.value, 10),
                      })
                    }
                    className={selectClasses}
                  >
                    {items.map((o) => (
                      <option
                        key={o.value}
                        value={o.value}
                        disabled={o.disabled}
                      >
                        {o.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500">
                Min required with current set/spare: {minNeeded}
              </div>
            </div>
          );
        })}
      </div>

      {/* دکمه */}
      <button
        onClick={onCalc}
        disabled={loading}
        style={{
          marginTop: 18,
          background: "#2563eb",
          color: "#fff",
          border: 0,
          borderRadius: 10,
          padding: "12px 18px",
          fontWeight: 700,
        }}
      >
        {loading ? "Calculating…" : "Calculate"}
      </button>

      {/* نتایج */}
      <div style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
          Results
        </h2>

        <ul>
          {Object.entries(results).map(([t, v]) => (
            <li key={t}>
              <b>{t}:</b> {v.usableTB.toFixed(2)} TB
            </li>
          ))}
        </ul>

        <div style={{ fontWeight: 800, marginTop: 8 }}>
          Total: {totalTb.toFixed(2)} TB
        </div>

        {error && (
          <div
            style={{
              marginTop: 12,
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#7f1d1d",
              borderRadius: 10,
              padding: 12,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </section>
  );
}

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function UnityMidrangeSizer() {
  return (
    <main className="unity-page min-h-screen bg-[#f8fafc] text-right" dir="rtl">
      <Head>
        <title>
          Unity XT MidrangeSizer | Dell EMC Unity RAID & Capacity Calculator
        </title>

        <meta
          name="description"
          content="Unity XT MidrangeSizer؛ ابزار آنلاین محاسبه ظرفیت و RAID برای Dell EMC Unity XT 380 / 480 / 680 / 880. Online RAID & capacity calculator for Dell EMC Unity XT arrays."
        />

        <meta
          name="keywords"
          content="
          midrangesizer,
          Unity MidrangeSizer,
          Unity XT MidrangeSizer,
          Dell EMC Unity XT RAID calculator,
          Unity XT RAID calculator,
          Unity XT RAID6 calculator,
          Unity XT RAID10 calculator,
          EMC Unity sizing,
          ابزار Unity XT
        "
        />

        <link
          rel="canonical"
          href="https://satrass.com/tools/unity-midrangesizer"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Unity XT MidrangeSizer | Dell EMC Unity RAID & Capacity Calculator"
        />
        <meta
          property="og:description"
          content="ابزار Unity XT MidrangeSizer برای محاسبه ظرفیت و RAID در Dell EMC Unity XT."
        />
        <meta
          property="og:url"
          content="https://satrass.com/tools/unity-midrangesizer"
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* بنر صفحه */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>Unity</span>{" "}
            <span style={{ color: YELLOW }}>MidrangeSizer</span>
          </h1>
          <p
            className="text-slate-400 mt-2 text-sm md:text-base"
            dir="ltr"
          >
            Configure Dell EMC Unity XT RAID groups and calculate usable
            capacity.
          </p>
        </div>
      </section>

      {/* ابزار */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        <Calculator />
      </section>
    </main>
  );
}