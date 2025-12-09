const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function News() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right font-sans">
      {/* هدر تیره شبیه Calculator */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
<h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
  <span style={{ color: TEAL }}>تازه‌ها،</span>{" "}
  <span style={{ color: YELLOW }}>اخبار و مقالات</span>
</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            آخرین خبرها، نکات فنی و مقالات آموزشی ساتراس
          </p>
        </div>
      </section>

      {/* محتوای اصلی تازه‌ها */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4">محتوای تازه به‌زودی…</h2>
        <p className="text-gray-600">
          این بخش برای اخبار، مقالات و یادداشت‌های فنی ساتراس در نظر گرفته شده است.
        </p>
      </section>
    </main>
  );
}
