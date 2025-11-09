// pages/tools/index.js
import Head from "next/head";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

const TOOLS = [
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "/tools/powerstore-configurator",
  },
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "/tools/unity-midrangesizer",
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "", // فعلاً نداریم؛ غیرفعال نمایش بده
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "/tools/unity-configurator",
  },
];

function variantForIndex(i) {
  const mod = i % 4;
  if (mod === 0) return { type: "filled", color: TEAL };
  if (mod === 1) return { type: "outlined", color: TEAL };
  if (mod === 2) return { type: "filled", color: YELLOW };
  return { type: "outlined", color: YELLOW };
}

export default function ToolsIndex() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>ابزارها | Satrass</title>
      </Head>

      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl font-extrabold mb-6 text-slate-900">ابزارها</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((t, i) => {
            const v = variantForIndex(i);
            const isFilled = v.type === "filled";
            const isYellow = v.color === YELLOW;

            const btnClass =
              "rounded-full px-5 py-2.5 font-bold transition inline-flex items-center";
            const btnStyle = isFilled
              ? { backgroundColor: v.color, color: isYellow ? "#000" : "#fff" }
              : { border: `1px solid ${v.color}`, color: v.color, backgroundColor: "transparent" };

            const onEnter = !isFilled
              ? (e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)")
              : undefined;
            const onLeave = !isFilled
              ? (e) => (e.currentTarget.style.backgroundColor = "transparent")
              : undefined;

            const isDisabled = !t.href;

            return (
              <article key={t.title} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white">
                <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
                <p className="mt-2 text-gray-600">{t.desc}</p>

                <div className="mt-5">
                  {isDisabled ? (
                    <span
                      className={`${btnClass} opacity-50 cursor-not-allowed select-none`}
                      style={btnStyle}
                      aria-disabled="true"
                      title="به‌زودی"
                    >
                      به‌زودی
                    </span>
                  ) : (
                    <Link
                      href={t.href}
                      className={btnClass}
                      style={btnStyle}
                      onMouseEnter={onEnter}
                      onMouseLeave={onLeave}
                    >
                      باز کردن ابزار
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}