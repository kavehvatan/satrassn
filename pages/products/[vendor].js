// pages/products/[vendor].js
import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";

// ---------- Helpers ----------
const cx = (...a) => a.filter(Boolean).join(" ");
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

function readProductsJson() {
  try {
    const raw = fs.readFileSync(PRODUCTS_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

// تبدیل اعداد فارسی/عربی به لاتین (مثلاً F۵ -> F5)
function toLatinDigits(input) {
  if (input == null) return "";
  const s = String(input);

  const map = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return s.replace(/[۰-۹٠-٩]/g, (d) => map[d] || d);
}

function normKey(s) {
  return toLatinDigits(String(s || ""))
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function findByModel(items, includesAny = []) {
  const list = Array.isArray(items) ? items : [];
  const needles = includesAny.map((x) => normKey(x));
  return (
    list.find((it) => {
      const m = normKey(it?.model);
      return needles.some((n) => m.includes(n));
    }) || null
  );
}

function mergeKeepExisting(template, existing) {
  if (!existing) return template;
  return {
    ...template,
    // اگر قبلاً تو JSON چیزی داشتی، همونو نگه دار (خصوصاً لینک‌ها)
    vendor: existing.vendor || template.vendor,
    desc: existing.desc || template.desc,
    image: existing.image || template.image,
    specsheet: existing.specsheet || template.specsheet,
  };
}

// فقط Fortinet را اینجا مرتب و اصلاح می‌کنیم
function normalizeItemsForVendor(vendor, items) {
  if (vendor !== "fortinet") return Array.isArray(items) ? items : [];

  const list = Array.isArray(items) ? items : [];

  // سه تا FortiGate قدیمی حذف
  const removed = new Set([
    normKey("FortiGate 60F"),
    normKey("FortiGate 100F"),
    normKey("FortiGate 200F"),
  ]);

  const kept = list.filter((it) => !removed.has(normKey(it?.model)));

  // تمپلیت‌های جدید (اگر در JSON نبود هم از همین‌ها ساخته می‌شود)
  const T_120G = {
    vendor: "Fortinet",
    model: "FortiGate 120G",
    desc: "فایروال نسل جدید برای شعب/سازمان با NGFW و SD-WAN؛ گزینه خوش‌قیمت برای سناریوهای Enterprise Edge.",
    image: "/products/fortinet/fortigate-120g.webp",
    specsheet: "/specs/fortinet/fortigate-120g.pdf",
  };

  const T_900G = {
    vendor: "Fortinet",
    model: "FortiGate 900G",
    desc: "فایروال قدرتمند دیتاسنتری برای سازمان‌های بزرگ با توان پردازشی بالا و ظرفیت مناسب برای ترافیک‌های پرتراکم.",
    image: "/products/fortinet/fortigate-900g.webp",
    specsheet: "/specs/fortinet/fortigate-900g.pdf",
  };

  const T_FORTIWEB_1000F = {
    vendor: "Fortinet",
    model: "FortiWeb 1000F",
    desc: "WAF سخت‌افزاری برای حفاظت اپلیکیشن‌های وب (WAAP/WAF) با قابلیت‌های امنیتی پیشرفته برای سرویس‌های حیاتی.",
    image: "/products/fortinet/fortiweb-1000f.webp",
    specsheet: "/specs/fortinet/fortiweb-1000f.pdf",
  };

  const T_MATRIX = {
    vendor: "Fortinet",
    model: "Fortinet Product Matrix",
    desc: "نمای کلی خانواده محصولات Fortinet (Firewall / WAF / Management / Switching) برای مقایسه سریع و انتخاب صحیح.",
    image: "", // تصویر لازم نیست
    specsheet: "/specs/fortinet/fortinet-product-matrix.pdf",
  };

  // اگر قبلاً تو JSON این آیتم‌ها یا لینک‌هاشون رو گذاشتی، همونو بردار
  const ex120 = findByModel(list, ["FortiGate 120G", "FG-120G", "120g"]);
  const ex900 = findByModel(list, ["FortiGate 900G", "FG-900G", "900g"]);
  const exWaf = findByModel(list, ["FortiWeb 1000F", "fortiweb 1000f", "1000f"]);
  const exMatrix = findByModel(list, ["Fortinet Product Matrix", "product matrix", "matrix"]);

  const i120 = mergeKeepExisting(T_120G, ex120);
  const i900 = mergeKeepExisting(T_900G, ex900);
  const iWaf = mergeKeepExisting(T_FORTIWEB_1000F, exWaf);
  const iMatrix = mergeKeepExisting(T_MATRIX, exMatrix);

  // بقیه Fortinet ها رو (Analyzer/Manager/Switch) از JSON نگه می‌داریم
  const iSwitch = findByModel(kept, ["FortiSwitch"]) || {
    vendor: "Fortinet",
    model: "FortiSwitch (Enterprise Switching)",
    desc: "سوئیچ‌های سازمانی برای Access/Distribution با یکپارچگی در Fabric و مدیریت.",
    image: "/products/fortinet/fortiswitch.webp",
    specsheet: "/specs/fortinet/fortiswitch.pdf",
  };

  const iManager = findByModel(kept, ["FortiManager"]) || {
    vendor: "Fortinet",
    model: "FortiManager",
    desc: "مدیریت مرکزی پالیسی‌ها و دیپلوی تنظیمات در مقیاس چندسایتی.",
    image: "/products/fortinet/fortimanager.webp",
    specsheet: "/specs/fortinet/fortimanager.pdf",
  };

  const iAnalyzer = findByModel(kept, ["FortiAnalyzer"]) || {
    vendor: "Fortinet",
    model: "FortiAnalyzer",
    desc: "تحلیل و گزارش‌گیری متمرکز لاگ‌ها برای دید بهتر امنیتی و Compliance.",
    image: "/products/fortinet/fortianalyzer.webp",
    specsheet: "/specs/fortinet/fortianalyzer.pdf",
  };

  // ترتیب نهایی (همون که خواستی):
  // ردیف ۱: 120G, 900G, FortiWeb 1000F
  // ردیف ۲: Switch, Manager, Analyzer
  // ردیف آخر: Matrix (وسط)
  return [i120, i900, iWaf, iSwitch, iManager, iAnalyzer, iMatrix];
}

// ---------- UI ----------
function ConsultBtn({ className = "" }) {
  return (
    <Link
      href="/contact#contact"
      prefetch={false}
      className={cx("btn btn-primary", className)}
    >
      درخواست مشاوره
    </Link>
  );
}

export default function VendorPage({ vendor, title, intro, items, theme }) {
  const pageTitleRaw = title || vendor?.toUpperCase() || "";
  const pageTitle = toLatinDigits(pageTitleRaw);

  const avatarWebp = `/avatars/${vendor}.webp`;
  const avatarPng = `/avatars/${vendor}.png`;

  const renderItems = normalizeItemsForVendor(vendor, items);

  // برای مرکز کردن Fortinet Product Matrix
  const isFortinet = vendor === "fortinet";
  const matrixIndex = isFortinet
    ? renderItems.findIndex((x) => normKey(x?.model) === normKey("Fortinet Product Matrix"))
    : -1;

  const hasMatrix = matrixIndex >= 0;
  const total = renderItems.length;

  const lgRemainder = total % 3; // lg:grid-cols-3
  const mdRemainder = total % 2; // md:grid-cols-2

  const loneLastRowLg = hasMatrix && lgRemainder === 1; // یک کارت تنها در ردیف آخر lg
  const loneLastRowMd = hasMatrix && mdRemainder === 1; // یک کارت تنها در ردیف آخر md

  const matrixCenterClass = hasMatrix
    ? cx(
        // وسط کردن در lg
        loneLastRowLg ? "lg:col-start-2 lg:col-span-1" : "",
        // وسط کردن در md (دو ستون)
        // نکته مهم: md:col-span-2 روی lg هم اثر می‌گذارد، پس حتما lg:col-span-1 دادیم.
        loneLastRowMd ? "md:col-span-2 lg:col-span-1 md:max-w-xl md:mx-auto" : ""
      )
    : "";

  return (
    <div data-theme={theme} className={`theme-${theme}`}>
      <Head>
        <title>{pageTitle} | تجهیزات</title>
        <meta
          name="description"
          content={intro || `محصولات ${pageTitle} در ساتراس`}
        />
      </Head>

      {/* Fix: جلوگیری از فارسی‌شدن اعداد/حروف در متن‌های انگلیسی داخل همین صفحه */}
      <style jsx>{`
        .latin-fix {
          direction: ltr;
          unicode-bidi: plaintext;
          font-feature-settings: "ss01" 0, "locl" 0 !important;
          font-variant-numeric: normal !important;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
            Roboto, Arial, sans-serif !important;
        }
      `}</style>

      {/* Hero */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-center">
          <div className="flex justify-center">
            <picture>
              <source srcSet={avatarWebp} type="image/webp" />
              <img
                src={avatarPng}
                alt={`${pageTitle} logo`}
                width={130}
                height={40}
                className="h-10 w-auto object-contain"
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
            </picture>
          </div>

          {intro ? (
            <p className="mt-6 mx-auto max-w-3xl text-slate-300 leading-8">
              {intro}
            </p>
          ) : null}
        </div>
      </header>

      {/* Grid محصولات */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {renderItems && renderItems.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderItems.map((p, i) => {
              const vendorLabel = toLatinDigits(p.vendor || pageTitle);
              const modelLabel = toLatinDigits(p.model || "");
              const imgAlt = modelLabel || vendorLabel || pageTitle;

              const isMatrixCard =
                isFortinet && normKey(p?.model) === normKey("Fortinet Product Matrix");

              return (
                <article
                  key={`${vendor}-${i}`}
                  className={cx(
                    "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition",
                    isMatrixCard ? matrixCenterClass : ""
                  )}
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* تصویر */}
                    {p.image ? (
                      <div className="mb-6 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={imgAlt}
                          className="h-28 w-auto object-contain"
                          loading="lazy"
                          lang="en"
                          dir="ltr"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : null}

                    {/* برند کوچک (انگلیسی) - LTR و چپ‌چین */}
                    <div
                      className="latin-fix text-xs text-slate-400 w-full text-left"
                      lang="en"
                      dir="ltr"
                    >
                      {vendorLabel}
                    </div>

                    {/* عنوان محصول (مدل) - LTR و چپ‌چین */}
                    <h3
                      className={cx(
                        "latin-fix mt-1 font-semibold text-slate-900 w-full text-left",
                        isMatrixCard ? "text-xl" : "text-lg"
                      )}
                      lang="en"
                      dir="ltr"
                    >
                      {modelLabel}
                    </h3>

                    {/* توضیح */}
                    {p.desc ? (
                      <p
                        className={cx(
                          "mt-3 text-slate-600 leading-7",
                          isMatrixCard ? "text-center" : ""
                        )}
                      >
                        {p.desc}
                      </p>
                    ) : null}

                    <div className="mt-auto" />

                    {/* دکمه‌ها */}
                    <div
                      className={cx(
                        "mt-6 flex items-center justify-center gap-6",
                        isMatrixCard ? "justify-center" : ""
                      )}
                    >
                      {p.specsheet && (
                        <a
                          href={p.specsheet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline latin-fix"
                          lang="en"
                          dir="ltr"
                        >
                          Specsheet
                        </a>
                      )}
                      <ConsultBtn />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-slate-700">
              هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
              <code className="rounded bg-white px-2 py-1 text-slate-800">
                data/products.json
              </code>{" "}
              اضافه کن.
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ---------- SSG ----------
export async function getStaticPaths() {
  const fileData = readProductsJson();
  const vendors = Object.keys(fileData || {});
  const paths = vendors.map((v) => ({ params: { vendor: v } }));
  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const vendor = String(ctx.params?.vendor || "").toLowerCase();

  const fileData = readProductsJson();
  const block = fileData[vendor];

  if (!block) return { notFound: true };

  return {
    props: {
      vendor,
      title: block.title || vendor.toUpperCase(),
      intro: block.intro || "",
      items: Array.isArray(block.items) ? block.items : [],
      theme: block.theme || block.themeVendor || vendor,
    },
  };
}