// pages/downloads.js
import { useEffect, useState } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// جابه‌جایی نوبتی رنگ دکمه‌ها (مشابه صفحهٔ اول)
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW);   // Filled
  const [secondary, setSecondary] = useState(TEAL); // Outlined
  useEffect(() => {
    try {
      const last = localStorage.getItem("satrass_btn_pair") === "1";
      const next = !last;
      localStorage.setItem("satrass_btn_pair", next ? "1" : "0");
      if (next) { setPrimary(TEAL); setSecondary(YELLOW); }
      else { setPrimary(YELLOW); setSecondary(TEAL); }
    } catch {}
  }, []);
  const swap = () => {
    setPrimary((p) => {
      const np = p === TEAL ? YELLOW : TEAL;
      setSecondary(np === TEAL ? YELLOW : TEAL);
      try { localStorage.setItem("satrass_btn_pair", np === TEAL ? "1" : "0"); } catch {}
      return np;
    });
  };
  return { primary, secondary, swap };
}

// ✏️ این لیست را هر زمان با آیتم‌های جدید به‌روزرسانی کنید
const DOWNLOADS = [
  {
    title: "Unity OE",
    vendor: "Dell EMC",
    version: "5.4.x",
    size: "2.1 GB",
    md5: "d41d8cd98f00b204e9800998ecf8427e",
    file: "/downloads/unity-oe-5.4.x.iso",
    notes: "آپدیت رسمی Unity OE برای استوریج‌های Unity XT. قبل از ارتقا، Release Notes را کامل مطالعه کنید.",
  },
  {
    title: "PowerStoreOS",
    vendor: "Dell EMC",
    version: "3.x",
    size: "3.4 GB",
    md5: "00000000000000000000000000000000",
    file: "/downloads/powerstore-os-3.x.iso",
    notes: "ایمیج سیستم‌عامل PowerStore. حتماً قبل از ارتقا، سازگاری نسخه را با کد دستگاه و لایسنس بررسی کنید.",
  },
];

export default function DownloadsPage() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert("کپی شد ✅");
    } catch {
      alert(txt);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right font-sans">
      {/* هدر تیره شبیه Calculator */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>دانلودها</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            فایل‌ها، مستندات و ابزارهای قابل دانلود ساتراس
          </p>
        </div>
      </section>

      {/* محتوای اصلی دانلودها */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6">فهرست دانلودها</h2>

        <div className="flex flex-col gap-4">
          {DOWNLOADS.map((d) => (
            <article
              key={d.title}
              dir="rtl"
              className="w-full border bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4" dir="ltr">
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-900">{d.title}</h2>
                  <div className="mt-1 text-sm text-gray-500">
                    {d.vendor} • Version {d.version} • {d.size}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm" dir="ltr">
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  MD5
                </span>
                <code className="select-all text-gray-800">{d.md5}</code>
                <button
                  onClick={() => copy(d.md5)}
                  className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                >
                  کپی
                </button>
              </div>

              {d.notes && (
                <p className="mt-4 text-gray-700 leading-7 text-right" dir="rtl">
                  {d.notes}
                </p>
              )}

              <div className="mt-5">
                <a
                  href={d.file}
                  onClick={swap}
                  className="rounded-full px-5 py-2.5 font-bold transition inline-block"
                  style={{
                    backgroundColor: primary,
                    color: primaryIsYellow ? "#000" : "#fff",
                    border: `1px solid ${secondary}`,
                  }}
                  download
                >
                  دانلود
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}