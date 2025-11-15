import React, { useState } from "react";

const RAID_OPTIONS = ["RAID5", "RAID6"];
const SET_OPTIONS = ["4+1", "8+1", "12+1", "6+2", "8+2", "10+2"];

export default function UnityMidrangeSizerPage() {
  const [disk, setDisk] = useState("1.92TB");
  const [raid, setRaid] = useState("RAID5");
  const [setStr, setSetStr] = useState("4+1");
  const [count, setCount] = useState(25);
  const [spare, setSpare] = useState("1/32");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/unity-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disk, raid, set: setStr, count, sparePolicy: spare }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Calculation error");
      }
      setResult(data);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">
          Unity Midrange Sizer
        </h1>
        <p className="text-sm md:text-base text-slate-600 mb-6">
          این ابزار برای سایزبندی سریع Unity XT / Midrange طراحی شده و خارج از دیتاشیت رسمی است؛
          لطفاً همیشه نتایج را با مستندات DellEMC و تجربه خودت اعتبارسنجی کن.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Disk size</label>
            <input
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base"
              value={disk}
              onChange={(e) => setDisk(e.target.value)}
              placeholder="مثل 1.92TB یا 3.84TB"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">RAID</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base"
              value={raid}
              onChange={(e) => setRaid(e.target.value)}
            >
              {RAID_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Set (width+parity)</label>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base"
              value={setStr}
              onChange={(e) => setSetStr(e.target.value)}
            >
              {SET_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Disk count</label>
            <input
              type="number"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base"
              value={count}
              min={0}
              onChange={(e) => setCount(parseInt(e.target.value || "0", 10))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Spare policy</label>
            <input
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm md:text-base"
              value={spare}
              onChange={(e) => setSpare(e.target.value)}
              placeholder="مثل 1/32 یا 2/32"
            />
          </div>

          <div className="flex items-end">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl text-sm md:text-base font-semibold bg-teal-500 text-white disabled:opacity-60"
              >
                {loading ? "Calculating…" : "Calculate"}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm md:text-base font-semibold bg-amber-400 text-slate-900"
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm md:text-base">
            <h2 className="font-semibold mb-2 text-slate-800">Results</h2>
            <ul className="space-y-1 text-slate-700">
              <li>
                <b>Disk:</b> {result.disk}
              </li>
              <li>
                <b>RAID:</b> {result.raid}
              </li>
              <li>
                <b>Set:</b> {result.set}
              </li>
              <li>
                <b>Count:</b> {result.count}
              </li>
              <li>
                <b>Spare policy:</b> {result.sparePolicy}
              </li>
              <li>
                <b>Spare disks:</b> {result.spares}
              </li>
              <li>
                <b>Groups:</b> {result.groups}
              </li>
              <li>
                <b>Usable per set (TB):</b> {result.perSetTB}
              </li>
              <li>
                <b>Total usable (TB):</b> {result.usableTB}
              </li>
              <li>
                <b>Source:</b> {result.from}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
