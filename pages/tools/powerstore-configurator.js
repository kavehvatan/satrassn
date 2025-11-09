// pages/tools/powerstore-configurator.js
import Head from "next/head";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function PowerStoreConfigurator() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>PowerStore Configurator | Satrass</title>
        <meta
          name="description"
          content="انتخاب و پیکربندی کامل مدل‌های PowerStore"
        />
      </Head>

      {/* 🔹 بنر سرمه‌ای با تیتر رنگی */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>PowerStore</span>{" "}
            <span style={{ color: YELLOW }}>Configurator</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            انتخاب و پیکربندی کامل مدل‌های PowerStore
          </p>
        </div>
      </section>

      {/* 🔹 iframe بدون پس‌زمینه سفید */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        <iframe
          src="https://powerstoreconfigurator.onrender.com/"
          title="PowerStore Configurator"
          className="w-full"
          style={{ height: "calc(100vh - 200px)", border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  );
}