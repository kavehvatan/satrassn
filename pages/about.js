export default function About() {
  return (
    <main className="min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold">درباره ساتراس</h1>
          <p className="mt-3 text-gray-300 max-w-3xl">
            ساتراس سامانه‌گسترانِ سانا با تکیه بر تیمی متخصص، مأموریت دارد از
            «مشاوره و نیازسنجی» تا «تأمین، استقرار، آموزش و پشتیبانی» کنار شما
            بایستد تا زیرساخت‌ فناوری اطلاعات‌تان پایدار، امن و مقیاس‌پذیر رشد کند.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-8 leading-8 text-gray-800" dir="rtl">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">رویکرد ما</h2>
          <p>
            همکاری با ساتراس با دریافت نیاز و شناخت دقیق شرایط شما آغاز می‌شود؛
            سپس پس از نیازسنجی، بهترین راهکار عملیاتی پیشنهاد و در قالب
            پروپوزال فنی/مالی ارائه می‌گردد. در صورت تأیید، تجهیزات از برندهای
            معتبر تهیه، زیرساخت‌های لازم آماده و استقرار در سریع‌ترین زمان انجام
            می‌شود. بعد از راه‌اندازی، آموزش کامل بهره‌برداری ارائه شده و
            پشتیبانی مداوم و گارانتی معتبر ادامه مسیر را تضمین می‌کند.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-5">
            <h3 className="font-bold mb-3">چرخهٔ همکاری</h3>
            <ol className="list-decimal pr-5 space-y-2">
              <li>مشاوره و نیازسنجی</li>
              <li>طراحی راهکار و ارائهٔ پروپوزال فنی/مالی</li>
              <li>تأمین تجهیزات از برندهای معتبر</li>
              <li>آماده‌سازی زیرساخت و استقرار</li>
              <li>آموزش بهره‌برداری</li>
              <li>پشتیبانی، نگهداری و گارانتی</li>
            </ol>
          </div>

          <div className="bg-white border rounded-lg p-5">
            <h3 className="font-bold mb-3">آنچه برایمان مهم است</h3>
            <ul className="list-disc pr-5 space-y-2">
              <li>رضایت و همراهی بلندمدت مشتری</li>
              <li>کیفیت اجرای پایدار و امن</li>
              <li>پاسخ‌گویی سریع و شفاف</li>
              <li>انتخاب راهکار بهینه و مقرون‌به‌صرفه</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <h3 className="font-bold mb-2">چرا ساتراس؟</h3>
          <p>
            ما تنها به راه‌اندازی سیستم اکتفا نمی‌کنیم؛ آموزش، پشتیبانی و
            خدمات پس از فروش در کنار گارانتی معتبر باعث می‌شود کسب‌وکار شما از
            سرمایه‌گذاری انجام‌شده بهترین نتیجه را بگیرد. این مسیر «از ابتدا و
            بدون انتها» کنار شما ادامه دارد.
          </p>
        </div>

        {/* Contact summary pulled from legacy site */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="font-bold mb-2">دفتر ساتراس</h3>
          <p>ونک، ملاصدرا، شیراز جنوبی، خیابان وحدت، پلاک ۲، طبقه ۴</p>

          {/* Phone (click-to-call) */}
          <p className="mt-2">
            <span className="text-gray-600">تلفن:</span>{" "}
            <a
              href="tel:+982188066022"
              className="hover:underline"
              aria-label="تماس با ساتراس"
            >
              <bdi dir="ltr" className="inline-block font-mono tracking-wide">
                +98 (21) 88066022
              </bdi>
            </a>
          </p>

          {/* Email (click-to-email) */}
          <p className="mt-2">
            ایمیل:{" "}
            <a
              href="mailto:info@satrass.com"
              className="hover:underline"
              aria-label="ارسال ایمیل به ساتراس"
            >
              info@satrass.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}