// pages/warranty.js
import { useCallback, useMemo, useState } from "react";
import Head from "next/head";

function toFaStatus(s) {
  const v = String(s || "").toLowerCase();
  if (v === "active" || v === "فعال") return "فعال";
  if (v === "not_found") return "ثبت نشده";
  return v || "ثبت نشده";
}

function chipClass(s) {
  const v = String(s || "").toLowerCase();
  if (v === "active" || v === "فعال")
    return "inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700";
  return "inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700";
}

function asCSV(rows) {
  const header = ["serial", "brand", "model", "status", "end", "notes"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const row = [
      r.serial ?? "",
      r.brand ?? "",
      r.model ?? "",
      r.status ?? "",
      r.end ?? r.expireAt ?? "",
      r.notes ?? ""
    ].map(v => {
      const s = String(v ?? "");
      return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    });
    lines.push(row.join(","));
  }
  return lines.join("\n");
}

export default function WarrantyPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  const fetchQuery = useCallback(async () => {
    const query = q.trim();
    if (!query) {
      setRows([]);
      setHint("لطفاً حداقل یک سریال وارد کنید.");
      return;
    }
    setHint("");
    setLoading(true);
    try {
      const r = await fetch(`/api/warranty?q=${encodeURIComponent(query)}`);
      const j = await r.json();
      setRows(Array.isArray(j.rows) ? j.rows : []);
    } catch (e) {
      setHint("خطا در ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  }, [q]);

  const downloadCSV = useCallback(async () => {
    setLoading(true);
    setHint("");
    try {
      const r = await fetch("/api/warranty?all=1");
      const j = await r.json();
      const csv = asCSV(Array.isArray(j.rows) ? j.rows : []);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "warranty.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setHint("خطا در دریافت CSV.");
    } finally {
      setLoading(false);
    }
  }, []);

  const empty = useMemo(() => !rows || rows.length === 0, [rows]);

  return (
    <>
      <Head>
        <title>استعلام گارانتی</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
        <h1 className="text-3xl font-extrabold mb-6">استعلام گارانتی</h1>
        <p className="text-gray-600 mb-4">
          سریال‌ها را وارد کنید (هر خط جداگانه، یا با کاما). داده‌ها از پایگاه داخلی
          ساتراس خوانده می‌شود.
        </p>

        {/* کنترل‌ها */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="مثال: HPE-9J1234 یا چند سریال با کاما/خط جدید"
              className="w-full rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none bg-gray-50 placeholder:text-gray-400 text-gray-800 p-4"
              style={{ minHeight: 120 }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={downloadCSV}
              className="px-5 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
              disabled={loading}
            >
              خروجی CSV
            </button>
            <button
              onClick={fetchQuery}
              className="px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-900 disabled:opacity-60"
              disabled={loading}
            >
              استعلام
            </button>
          </div>
        </div>

        {/* پیام ریز */}
        {hint ? (
          <div className="text-sm text-gray-500 mb-2">{hint}</div>
        ) : null}

        {/* جدول */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="px-4 py-3 font-semibold">سریال</th>
                <th className="px-4 py-3 font-semibold">برند</th>
                <th className="px-4 py-3 font-semibold">مدل</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
                <th className="px-4 py-3 font-semibold">تاریخ پایان</th>
                <th className="px-4 py-3 font-semibold">یادداشت</th>
              </tr>
            </thead>
            <tbody>
              {empty ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    نتیجه‌ای برای نمایش نیست.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3">{r.serial || "-"}</td>
                    <td className="px-4 py-3">{r.brand || "-"}</td>
                    <td className="px-4 py-3">{r.model || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={chipClass(r.status)}>
                        {toFaStatus(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.end || r.expireAt || "-"}</td>
                    <td className="px-4 py-3">{r.notes || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          * منبع داده:{" "}
          <code className="bg-gray-100 rounded px-2 py-1">data/warranty.json</code>{" "}
          — برای به‌روزرسانی، فایل را ادیت و دیپلوی کنید.
        </p>

        <p className="mt-6 text-gray-700 text-sm leading-relaxed">
          شرکت ساتراس برای تمامی تجهیزاتی که عرضه می‌کند،{" "}
          <span className="font-semibold">گارانتی معتبر</span> و{" "}
          <span className="font-semibold">خدمات پس از فروش</span> ارائه می‌کند. در
          صورت بروز هرگونه مشکل، تیم پشتیبانی ما متعهد به رفع سریع ایراد و در صورت
          نیاز <span className="font-semibold">جایگزینی تجهیز</span> خواهد بود تا
          سرویس مشتریان بدون وقفه ادامه یابد.
        </p>
      </div>
    </>
  );
}