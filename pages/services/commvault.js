// pages/services/commvault.js
import Head from "next/head";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export default function CommvaultPage() {
  return (
    <>
      <Head>
        <title>Commvault Data Protection | ساتراس</title>
        <meta
          name="description"
          content="راهکار یکپارچهٔ حفاظت از داده برای VM، دیتابیس، فایل، SaaS و Cloud با Dedup و پالیسی‌های منعطف."
        />
      </Head>

      <main className="min-h-screen bg-slate-50">
        {/* بنر شبیه گارانتی، با دو رنگ برند */}
        <section className="bg-[#020617] text-white">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-relaxed">
              <span style={{ color: YELLOW }}>Commvault</span>{" "}
              <span style={{ color: TEAL }}>Data Protection</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-200">
              راهکار یکپارچهٔ حفاظت از داده برای VM، دیتابیس، فایل، سرویس‌های
              SaaS و Cloud با Dedup و Policyهای منعطف.
            </p>
          </div>
        </section>

        {/* بدنه روشن */}
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-12 text-slate-800">
          {/* بخش معرفی و تمرکز اصلی */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-amber-600 mb-4">
              چرا Commvault؟
            </h2>
            <p className="leading-8">
              Commvault یک پلتفرم یکپارچه برای{" "}
              <strong>Backup، Recovery و Archive</strong> است که تمام لایه‌های
              داده—از <strong>VM و دیتابیس</strong> تا{" "}
              <strong>File، SaaS و Cloud</strong>—را پوشش می‌دهد. هستهٔ اصلی
              راهکار روی <strong>Dedup/Compression کارآمد</strong>،{" "}
              <strong>Policyهای منعطف</strong> و ادغام عمیق با زیرساخت مجازی و
              ابری متمرکز است.
            </p>
          </section>

          {/* دو ستون: ویژگی‌ها / سناریوها */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* ویژگی‌های کلیدی */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                ویژگی‌های کلیدی Commvault
              </h3>
              <ul className="list-disc pr-5 space-y-2 leading-7">
                <li>
                  پوشش هم‌زمان <strong>VM، دیتابیس، File، SaaS و Cloud</strong>{" "}
                  در یک کنسول مدیریت متمرکز.
                </li>
                <li>
                  <strong>Dedup/Compression سراسری</strong> (Global) برای کاهش
                  چشمگیر فضای مصرفی و ترافیک بکاپ.
                </li>
                <li>
                  <strong>Policy-based Protection</strong> برای تعریف SLA، زمان‌بندی
                  و Retention براساس سطح سرویس کسب‌وکار.
                </li>
                <li>
                  ادغام با پلتفرم‌های ابری و زیرساخت مدرن، به‌همراه{" "}
                  <strong>Reporting و Automation</strong> پیشرفته.
                </li>
                <li>
                  پشتیبانی از سناریوهای <strong>Archive و Long-term Retention</strong>{" "}
                  روی Tape یا Cloud.
                </li>
              </ul>
            </section>

            {/* سناریوهای رایج (Hyperscale X / Metallic) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                سناریوهای متداول پیاده‌سازی
              </h3>
              <ul className="list-disc pr-5 space-y-2 leading-7">
                <li>
                  استفاده از <strong>Hyperscale X</strong> به‌عنوان پلتفرم{" "}
                  <strong>Scale-out Backup</strong> برای رشد تدریجی ظرفیت و
                  کارایی.
                </li>
                <li>
                  پیاده‌سازی <strong>Metallic</strong> به‌صورت{" "}
                  <strong>SaaS Backup</strong> برای سرویس‌هایی مثل M365، Endpoint
                  و Salesforce.
                </li>
                <li>
                  سناریوهای بکاپ ترکیبی{" "}
                  <strong>On-prem / Cloud (Hybrid)</strong> با Tiering هوشمند روی
                  Object Storage.
                </li>
                <li>
                  تعریف RPO/RTOهای سخت‌گیرانه برای سرویس‌های حیاتی و تست دوره‌ای
                  بازیابی (Restore Test).
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
              با Commvault می‌توانید یک لایهٔ محافظت یکپارچه برای تمام داده‌های
              سازمان ایجاد کنید؛ فارغ از این‌که روی VM، دیتابیس، فایل‌سرور یا
              پلتفرم‌های SaaS/Cloud قرار داشته باشند. ساتراس می‌تواند در طراحی
              معماری، انتخاب بین Hyperscale X / Metallic و پیاده‌سازی عملی این
              راهکار در کنار شما باشد.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}