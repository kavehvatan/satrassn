// pages/tools/index.js
import Link from "next/link";

const TOOLS = [
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "/tools/powerstore-configurator",
    tone: "yellow",
  },
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "/tools/unity-midrangesizer",
    tone: "teal",
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "#",
    tone: "yellow",
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "/tools/unity-configurator",
    tone: "teal",
  },
];

export default function Tools() {
  return (
    <main>
      {/* بنر بالای صفحه */}
      <section className="bg-[#0f172a] py-10 text-center">
        <h1 className="text-3xl font-extrabold">
          <span className="text-yellow-400">ابزار</span>
          <span className="text-teal-400">ها</span>
        </h1>
        <p className="mt-2 text-slate-300 text-sm md:text-base">
          مجموعه ابزارهای کمکی ساتراس برای برآورد، پیکربندی و محاسبه
        </p>
      </section>

      {/* گرید ابزارها */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((tool, i) => (
            <Link key={i} href={tool.href}>
              <div
                className={`
                  rounded-2xl p-6 w-[90%] md:w-[80%] mx-auto
                  text-center shadow-md cursor-pointer
                  transition-all duration-300
                  ${tool.tone === "teal"
                    ? "bg-teal-500 hover:bg-teal-400"
                    : "bg-yellow-400 hover:bg-yellow-300"}
                `}
              >
                <h2 className="text-lg md:text-xl font-extrabold text-slate-800">
                  {tool.title}
                </h2>
                <p className="mt-2 text-slate-700">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}