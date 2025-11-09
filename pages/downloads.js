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
// فایل‌ها را داخل public/downloads/ بگذارید و مسیرشان را در فیلد `file` بنویسید.
const DOWNLOADS = [
  {
    title: "Unity OE 5.4.1",
    vendor: "Dell EMC",
    version: "5.4.1",
    size: "2.1 GB",
    md5: "d41d8cd98f00b204e9800998ecf8427e",
    file: "/downloads/unity-oe-5.4.1.iso",
    notes: "آپدیت رسمی Unity OE. قبل از ارتقا، Release Notes را مطالعه کنید.",
  },
  // { title, vendor, version, size, md5, file, notes }
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
    <main className="font-sans">
      {/* پدینگ پایینی کم شده تا فوتر خیلی پایین از دید خارج نشه */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">دانلودها</h1>
        <p className="text-gray-600 mb-8">
          فایل‌ها را داخل{" "}
          <code className="mx-1 px-2 py-0.5 rounded bg-gray-100">
            public/downloads/
          </code>{" "}
          قرار بده؛ متادیتا را هم همین‌جا در لیست پایین اضافه کن.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {DOWNLOADS.map((d) => (
            <article
              key={d.title}
              className="border bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{d.title}</h2>
                  <div className="mt-1 text-sm text-gray-500">
                    {d.vendor} • نسخه {d.version} • {d.size}
                  </div>
                </div>
              </div>

              {d.notes && (
                <p className="mt-3 text-gray-700 leading-7">{d.notes}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
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