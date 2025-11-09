// pages/tools/unity-configurator.js
import Head from "next/head";

const MOBILE_IFRAME_WIDTH = 1280; // اگر باز هم تنگ بود 1400 یا 1500 کن
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function UnityConfigurator() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>Unity Configurator | Satrass</title>
        <meta
          name="description"
          content="طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT"
        />
      </Head>

      {/* 🔹 بنر سرمه‌ای با تیتر رنگی */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>Unity</span>{" "}
            <span style={{ color: YELLOW }}>Configurator</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT
          </p>
        </div>
      </section>

      {/* 🔹 iframe بدون پس‌زمینه سفید */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        {/* موبایل: اسکرول افقی */}
        <div
          className="relative w-full md:hidden overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="inline-block" style={{ width: MOBILE_IFRAME_WIDTH }}>
            <iframe
              src="https://unity-configurator.onrender.com/"
              title="Unity Configurator"
              className="block"
              style={{
                width: MOBILE_IFRAME_WIDTH,
                height: "80vh",
                border: 0,
              }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* دسکتاپ */}
        <iframe
          src="https://unity-configurator.onrender.com/"
          title="Unity Configurator"
          className="hidden md:block w-full"
          style={{ height: "calc(100vh - 200px)", border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  );
}