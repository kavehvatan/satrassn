// pages/services/netbackup.js
import Head from "next/head";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function NetBackupPage() {
  return (
    <>
      <Head>
        <title>Veritas NetBackup | ساتراس</title>
        <meta
          name="description"
          content="پلتفرم بکاپ سازمانی Veritas NetBackup با پوشش عمیق مجازی‌سازی و دیتابیس و Inline Dedup برای پنجرهٔ بکاپ کوچک."
        />
      </Head>

      <main className="min-h-screen bg-slate-50">
        {/* بنر بالا با دو رنگ برند */}
        <section className="bg-[#020617] text-white">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-relaxed">
              <span style={{ color: YELLOW }}>Veritas</span>{" "}
              <span style={{ color: TEAL }}>NetBackup</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-200">
              پلتفرم بکاپ سازمانی با پوشش عمیق محیط‌های مجازی و دیتابیس، همراه با{" "}
              Inline Dedup برای کوچک نگه‌داشتن پنجرهٔ بکاپ.
            </p>
          </div>
        </section>

        {/* بدنه روشن */}
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-12 text-slate-800">
          {/* معرفی و تمرکز اصلی */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-amber-600 mb-4">
              تمرکز اصلی NetBackup
            </h2>
            <p className="leading-8">
              NetBackup یکی از قدیمی‌ترین و کامل‌ترین پلتفرم‌های{" "}
              <strong>Enterprise Backup &amp; Recovery</strong> است که برای
              محیط‌های بزرگ با ترکیب <strong>VMware/Hyper-V، دیتابیس‌های سنگین و
              آرشیو</strong> طراحی شده. <strong>Inline Dedup</strong> و موتور
              قدرتمند Job Management کمک می‌کند پنجرهٔ بکاپ کوچک بماند و در عین
              حال سیاست‌های پیچیدهٔ نگه‌داری داده پیاده شود.
            </p>
          </section>

          {/* دو ستون: ویژگی‌ها / سناریوها */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* ویژگی‌های کلیدی */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                ویژگی‌های کلیدی NetBackup
              </h3>
              <ul className="list-disc pr-5 space-y-2 leading-7">
                <li>
                  <strong>Inline Dedup</strong> برای کاهش ترافیک و حجم بکاپ، مخصوصاً
                  در محیط‌های بزرگ و چندسایت.
                </li>
                <li>
                  پوشش عمیق برای <strong>VMware / Hyper-V</strong> و
                  دیتابیس‌هایی مثل <strong>Oracle، SQL و...</strong>.
                </li>
                <li>
                  پشتیبانی از <strong>قوانین پیچیدهٔ Retention</strong> و
                  سیاست‌های مختلف نگه‌داری براساس نوع داده و سرویس.
                </li>
                <li>
                  کنسول مدیریت متمرکز با <strong>RBAC</strong>، گزارش‌گیری و
                  داشبوردهای عملیاتی برای تیم Backup.
                </li>
                <li>
                  امکان استفاده از <strong>Applianceهای سری 52xx</strong> و{" "}
                  <strong>Flex</strong> برای ساده‌سازی استقرار و بهینه‌سازی کارایی.
                </li>
              </ul>
            </section>

            {/* سناریوهای متداول */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                سناریوهای متداول پیاده‌سازی
              </h3>
              <ul className="list-disc pr-5 space-y-2 leading-7">
                <li>
                  حفاظت از <strong>VMware/Hyper-V</strong> با سیاست‌های مختلف
                  برای Tierهای متفاوت سرویس (Tier 1/2/3).
                </li>
                <li>
                  بکاپ و ریکاوری دیتابیس‌های بزرگ{" "}
                  <strong>Oracle / SQL / سایر DBها</strong> با قابلیت
                  Point-in-Time Recovery.
                </li>
                <li>
                  سناریوهای آرشیو روی <strong>Tape یا Cloud</strong> برای کاهش
                  هزینهٔ نگه‌داری طولانی‌مدت.
                </li>
                <li>
                  استفاده از <strong>NetBackup Flex</strong> برای سرویس‌دهی
                  چندسازمانی (Multi-tenant) یا چند محیط مجزا.
                </li>
                <li>
                  ترکیب بکاپ دیسکی سریع با آرشیو نوار/کلود برای دستیابی به
                  توازن هزینه/کارایی.
                </li>
              </ul>
            </section>
          </div>

          {/* جمع‌بندی */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              نتیجه برای سازمان شما
            </h3>
            <p className="leading-8">
              اگر محیط شما ترکیبی از VM، دیتابیس و آرشیوهای حجیم است، NetBackup
              یکی از گزینه‌های جدی برای پیاده‌سازی لایهٔ Backup سازمانی است.
              با طراحی درست توپولوژی و استفاده از Applianceهای مناسب، می‌شود هم
              پنجرهٔ بکاپ را کوچک نگه داشت و هم الزامات سخت‌گیرانهٔ RPO/RTO و
              Compliance را پوشش داد. ساتراس می‌تواند در طراحی و اجرای این
              معماری همراه شما باشد.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}