// pages/services/veeam.js
import Head from "next/head";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function VeeamPage() {
  return (
    <>
      <Head>
        <title>Veeam Backup &amp; Replication | ساتراس</title>
        <meta
          name="description"
          content="راهکار قدرتمند بکاپ و ریکاوری برای محیط‌های مجازی، فیزیکی و Cloud با تمرکز روی بازیابی سریع و ساده."
        />
      </Head>

      {/* کل صفحه روشن، فقط بنر مثل گارانتی تیره است */}
      <main className="min-h-screen bg-slate-50">
        {/* بنر بالا شبیه صفحه گارانتی */}
        <section className="bg-[#020617] text-white">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-relaxed">
              <span style={{ color: YELLOW }}>Veeam</span>{" "}
              <span style={{ color: TEAL }}>Backup &amp; Replication</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-200">
              راهکار قدرتمند بکاپ و ریکاوری برای محیط‌های مجازی، فیزیکی و Cloud با
              تمرکز روی بازیابی سریع و ساده.
            </p>
          </div>
        </section>

        {/* محتوای اصلی روی پس‌زمینه روشن */}
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-12 text-slate-800">
          {/* تمرکز اصلی */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-amber-600 mb-4">
              تمرکز اصلی Veeam
            </h2>
            <p className="leading-8">
              Veeam Backup &amp; Replication برای حفاظت از ماشین‌های مجازی،
              سرورهای فیزیکی، سرویس‌های ابری مثل Microsoft 365 و Endpointها
              طراحی شده است.{" "}
              <strong>Inline Dedup &amp; Compression</strong>،{" "}
              <strong>Instant Recovery</strong> و استفاده از Snapshotهای کارآمد،
              زمان بازیابی را به حداقل می‌رسانند.
            </p>
          </section>

          {/* ویژگی‌های کلیدی و سناریوهای رایج */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* ویژگی‌ها */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                ویژگی‌های کلیدی
              </h3>
              <ul className="list-disc pr-5 space-y-2 leading-7">
                <li>
                  <strong>Inline Dedup &amp; Compression</strong> برای کاهش حجم
                  بکاپ و استفاده بهینه از فضای ذخیره‌سازی.
                </li>
                <li>
                  <strong>Instant VM Recovery / Restore در سطح فایل /
                  Application</strong> برای بازگردانی سریع سرویس‌ها.
                </li>
                <li>
                  پشتیبانی از چندین پلتفرم (مجازی، فیزیکی، Cloud) در یک کنسول
                  یکپارچه.
                </li>
                <li>
                  مانیتورینگ، گزارش‌گیری و آلارم‌های سلامت بکاپ برای اطمینان از
                  اجرای صحیح Jobها.
                </li>
              </ul>
            </section>

            {/* سناریوها */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                سناریوهای رایج
              </h3>
              <ul className="list-disc pr-5 space-y-2 leading-7">
                <li>
                  حفاظت از VMها در VMware / Hyper-V با چندین سطح RPO/RTO
                  دقیقه‌ای.
                </li>
                <li>
                  بکاپ و ریکاوری دیتابیس‌ها (Oracle، SQL و...) با قابلیت
                  بازیابی انتخابی.
                </li>
                <li>
                  محافظت از سرویس‌های ابری مثل{" "}
                  <strong>Microsoft 365 (Mail, OneDrive, SharePoint, Teams)</strong>.
                </li>
                <li>
                  سناریوهای Disaster Recovery روی سایت ثانویه یا Cloud با
                  استفاده از Replication.
                </li>
              </ul>
            </section>
          </div>

          {/* جمع‌بندی ساده */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              نتیجه برای سازمان شما
            </h3>
            <p className="leading-8">
              با پیاده‌سازی درست Veeam، می‌توانید پنجرهٔ بکاپ را کوچک نگه دارید،
              RTO/RPO سخت‌گیرانه تعریف کنید و مطمئن باشید در زمان حادثه، سرویس‌ها
              با کمترین وقفه دوباره Online می‌شوند. ساتراس در طراحی سناریو،
              پیاده‌سازی و بهینه‌سازی این راهکار در کنار شماست.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}