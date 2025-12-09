// pages/tools/powerstore-calculatore.js
import Head from "next/head";
import { useMemo, useState } from "react";

// ====== Data / constants ======

const APPLIANCES = {
  "PowerStore 500T": 97,
  "PowerStore 1200T": 93,
  "PowerStore 3200T/Q": 93,
  "PowerStore 5200T/Q": 93,
  "PowerStore 9200T": 93,
};

// NVMe-only – SCM removed
const DRIVES = [
  { id: "nvme-1.92", label: "NVMe TLC 1.92 TB", sizeTiB: 1.7466 },
  { id: "nvme-3.84", label: "NVMe TLC 3.84 TB", sizeTiB: 3.4931 },
  { id: "nvme-7.68", label: "NVMe TLC 7.68 TB", sizeTiB: 6.9863 },
  { id: "nvme-15.36", label: "NVMe TLC 15.36 TB", sizeTiB: 13.9707 },
  { id: "nvme-15.36-qlc", label: "NVMe QLC 15.36 TB", sizeTiB: 13.9707 },
];

const TOLERANCE_LEVELS = [
  { id: "single", label: "Single Drive Failure (RAID5-like)" },
  { id: "double", label: "Double Drive Failure (RAID6-like)" },
];

const numberFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: false,
});

// ====== Helpers ======

function formatTiB(value) {
  if (!Number.isFinite(value)) return "-";
  let digits = 2;
  if (Math.abs(value) >= 10) digits = 1;
  const n = numberFormatter.format(Number(value.toFixed(digits)));
  return `${n} TiB`;
}

function computeResiliency(driveCount, level) {
  if (!driveCount || driveCount <= 0) {
    return { error: "Enter a valid drive count." };
  }

  // Single drive failure (RAID5-like)
  if (level === "single") {
    const maxPerSet = 25;
    if (driveCount < 6) {
      return {
        error: "Single drive failure requires at least 6 drives (4+1).",
      };
    }

    const sets = Math.ceil(driveCount / maxPerSet);
    const virtualSpares = sets; // one spare per resiliency set
    const effectiveDrives = driveCount - virtualSpares;
    const drivesPerSet = Math.min(driveCount, maxPerSet);

    let width = "4+1";
    let dataDrives = 4;
    let parityDrives = 1;

    // With more drives per set we move to wider width
    if (drivesPerSet >= 10) {
      width = "8+1";
      dataDrives = 8;
      parityDrives = 1;
    }

    const raidEfficiency = dataDrives / (dataDrives + parityDrives);

    return {
      levelLabel: "Single Drive Failure",
      maxPerSet,
      sets,
      virtualSpares,
      effectiveDrives,
      drivesPerSet,
      width,
      dataDrives,
      parityDrives,
      raidEfficiency,
    };
  }

  // Double drive failure (RAID6-like)
  const maxPerSet = 50;
  if (driveCount < 7) {
    return {
      error: "Double drive failure requires at least 7 drives (4+2).",
    };
  }

  const sets = Math.ceil(driveCount / maxPerSet);
  const virtualSpares = sets; // one spare per resiliency set
  const effectiveDrives = driveCount - virtualSpares;
  const drivesPerSet = Math.min(driveCount, maxPerSet);

  let width;
  let dataDrives;
  let parityDrives;

  if (drivesPerSet >= 19) {
    width = "16+2";
    dataDrives = 16;
    parityDrives = 2;
  } else if (drivesPerSet >= 11) {
    width = "8+2";
    dataDrives = 8;
    parityDrives = 2;
  } else {
    width = "4+2";
    dataDrives = 4;
    parityDrives = 2;
  }

  const raidEfficiency = dataDrives / (dataDrives + parityDrives);

  return {
    levelLabel: "Double Drive Failure",
    maxPerSet,
    sets,
    virtualSpares,
    effectiveDrives,
    drivesPerSet,
    width,
    dataDrives,
    parityDrives,
    raidEfficiency,
  };
}

// ====== Main calculator component (inside content area) ======

function PowerStoreCalculator() {
  const [appliance, setAppliance] = useState("PowerStore 500T");
  const [driveId, setDriveId] = useState("nvme-3.84");
  const [toleranceLevel, setToleranceLevel] = useState("double");
  const [driveCount, setDriveCount] = useState(24);
  const [dataReduction, setDataReduction] = useState(3); // 3:1 typical

  const maxDrivesForModel = APPLIANCES[appliance];

  const selectedDrive = useMemo(
    () => DRIVES.find((d) => d.id === driveId),
    [driveId]
  );

  const result = useMemo(() => {
    if (!selectedDrive) return null;

    const count = Number(driveCount) || 0;
    if (count <= 0) return null;

    if (maxDrivesForModel && count > maxDrivesForModel) {
      return {
        error: `Maximum drive count for ${appliance} is ${maxDrivesForModel}.`,
      };
    }

    const resil = computeResiliency(count, toleranceLevel);
    if (resil.error) {
      return { error: resil.error };
    }

    const perDrive = selectedDrive.sizeTiB;
    const rawTotal = count * perDrive;
    const rawAfterSpare = resil.effectiveDrives * perDrive;
    const usableAfterRAID = rawAfterSpare * resil.raidEfficiency;

    const drRatio = Number(dataReduction) > 0 ? Number(dataReduction) : 1;
    const effectiveLogical = usableAfterRAID * drRatio;

    return {
      ...resil,
      rawTotal,
      rawAfterSpare,
      usableAfterRAID,
      effectiveLogical,
      drRatio,
    };
  }, [
    appliance,
    driveCount,
    toleranceLevel,
    selectedDrive,
    maxDrivesForModel,
    dataReduction,
  ]);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      {/* INPUTS COLUMN */}
      <div className="space-y-4">
        {/* Appliance & drive config */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5">
          <h2 className="font-semibold text-lg mb-3">
            1. Appliance &amp; drive configuration
          </h2>

          {/* Appliance */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              PowerStore appliance
            </label>
            <select
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={appliance}
              onChange={(e) => setAppliance(e.target.value)}
            >
              {Object.keys(APPLIANCES).map((name) => (
                <option key={name} value={name}>
                  {name} (max {APPLIANCES[name]} drives)
                </option>
              ))}
            </select>
          </div>

          {/* Drive type & count */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                NVMe drive type
              </label>
              <select
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={driveId}
                onChange={(e) => setDriveId(e.target.value)}
              >
                {DRIVES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} ({d.sizeTiB.toFixed(4)} TiB)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Number of NVMe drives
              </label>
              <input
                type="number"
                min={1}
                max={maxDrivesForModel}
                value={driveCount}
                onChange={(e) => setDriveCount(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Max for {appliance}: {maxDrivesForModel} drives
              </p>
            </div>
          </div>

          {/* Tolerance level */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Resiliency (tolerance level)
            </label>
            <div className="flex flex-wrap gap-2">
              {TOLERANCE_LEVELS.map((lvl) => {
                const active = toleranceLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setToleranceLevel(lvl.id)}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition
                      ${
                        active
                          ? "border-teal-500 bg-teal-500/10 text-teal-700"
                          : "border-slate-300 bg-white text-slate-700 hover:border-teal-500"
                      }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Single = tolerate 1 drive failure per resiliency set, Double =
              tolerate 2 drive failures per resiliency set.
            </p>
          </div>
        </div>

        {/* Data reduction slider */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5">
          <h2 className="font-semibold text-lg mb-3">
            2. Data reduction assumption
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1">
                Data reduction ratio (compression + dedupe)
              </label>
              <input
                type="range"
                min={1}
                max={6}
                step={0.5}
                value={dataReduction}
                onChange={(e) => setDataReduction(e.target.value)}
                className="w-full"
              />
              <p className="mt-1 text-xs text-slate-500">
                Typical values for PowerStore are around 3:1 – 4:1, but this is
                workload-dependent.
              </p>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Ratio</div>
              <div className="text-2xl font-bold">
                {Number(dataReduction).toFixed(1)}:1
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS COLUMN */}
      <div className="space-y-4">
        {/* Capacity summary */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5">
          <h2 className="font-semibold text-lg mb-3">Capacity summary</h2>

          {result?.error ? (
            <div className="rounded-xl border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {result.error}
            </div>
          ) : !result ? (
            <p className="text-sm text-slate-600">
              Enter the configuration on the left to calculate capacity.
            </p>
          ) : (
            <>
              {/* Big numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3">
                  <div className="text-xs text-slate-500 mb-1">
                    Raw capacity (all NVMe)
                  </div>
                  <div
                    className="text-xl font-semibold"
                    dir="ltr"
                    lang="en"
                  >
                    {formatTiB(result.rawTotal)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3">
                  <div className="text-xs text-slate-500 mb-1">
                    Usable after RAID &amp; virtual spares
                  </div>
                  <div
                    className="text-xl font-semibold"
                    dir="ltr"
                    lang="en"
                  >
                    {formatTiB(result.usableAfterRAID)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3 sm:col-span-2">
                  <div className="text-xs text-slate-500 mb-1">
                    Effective logical capacity (with{" "}
                    {result.drRatio.toFixed(1)}:1 data reduction)
                  </div>
                  <div
                    className="text-xl font-semibold"
                    dir="ltr"
                    lang="en"
                  >
                    {formatTiB(result.effectiveLogical)}
                  </div>
                </div>
              </div>

              {/* Layout details */}
              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tolerance level</span>
                  <span>{result.levelLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected width</span>
                  <span>
                    {result.width} ({result.dataDrives} data /{" "}
                    {result.parityDrives} parity)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Resiliency sets (max {result.maxPerSet} drives)</span>
                  <span>{result.sets}</span>
                </div>
                <div className="flex justify-between">
                  <span>Virtual spare drives (1 per set)</span>
                  <span>{result.virtualSpares}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drives used for RAID stripes</span>
                  <span>{result.effectiveDrives}</span>
                </div>
                <div className="flex justify-between">
                  <span>RAID efficiency (data / total)</span>
                  <span>
                    {(result.raidEfficiency * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Executive summary */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 text-xs sm:text-sm text-slate-600 space-y-2">
          <h3 className="font-semibold text-sm mb-1">Executive summary</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Configuration: <b>{appliance}</b>, {driveCount}×{" "}
              {selectedDrive?.label}
            </li>
            {result && !result.error && (
              <>
                <li>
                  Usable NVMe capacity ≈{" "}
                  <b>{formatTiB(result.usableAfterRAID)}</b>.
                </li>
                <li>
                  With data reduction {result.drRatio.toFixed(1)}
                  :1, effective logical capacity ≈{" "}
                  <b>{formatTiB(result.effectiveLogical)}</b>.
                </li>
                <li>
                  Layout: {result.sets} resiliency set(s), width{" "}
                  {result.width}, virtual spares: {result.virtualSpares}.
                </li>
              </>
            )}
            <li>
              Numbers are approximate and intended for initial sizing and
              presentations, not final design.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ====== Page wrapper (banner + layout like Unity) ======

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function PowerStoreCalculatorePage() {
  return (
    <main
      className="min-h-screen bg-[#f8fafc] text-right"
      dir="rtl"
    >
      <Head>
        <title>
          PowerStore Calculator | Dell EMC PowerStore NVMe Capacity &amp; RAID
        </title>
        <meta
          name="description"
          content="Online NVMe capacity & RAID calculator for Dell EMC PowerStore 500T / 1200T / 3200T / 5200T / 9200T appliances."
        />
        <link
          rel="canonical"
          href="https://satrass.com/tools/powerstore-calculatore"
        />
      </Head>

      {/* banner exactly like Unity style */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>PowerStore</span>{" "}
            <span style={{ color: YELLOW }}>Calculator</span>
          </h1>
          <p
            className="text-slate-400 mt-2 text-sm md:text-base"
            dir="ltr"
          >
            NVMe-only sizing for Dell EMC PowerStore: estimate RAID-protected
            usable and effective capacity.
          </p>
        </div>
      </section>

            {/* content */}
      <section
        className="powerstore-calculator max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10"
        lang="en"
      >
        <PowerStoreCalculator />
      </section>
    </main>
  );
}