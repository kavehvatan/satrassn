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

// فقط برای حالتی که واقعاً رقم فارسی داخل دیتا باشد (اینجا لازم نیست ولی نگه می‌داریم)
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

  return (
    <div data-theme={theme} className={`theme-${theme}`}>
      <Head>
        <title>{pageTitle} | تجهیزات</title>
        <meta
          name="description"
          content={intro || `محصولات ${pageTitle} در ساتراس`}
        />
      </Head>

      {/* فقط داخل همین صفحه: اعداد لاتین را از دستکاری فونت نجات می‌دهیم */}
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
        {items && items.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => {
              // دیتا لاتینه؛ اینجا فقط برای safety
              const vendorLabel = toLatinDigits(p.vendor || pageTitle);
              const modelLabel = toLatinDigits(p.model || "");

              return (
                <article
                  key={`${vendor}-${i}`}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* تصویر */}
                    {p.image ? (
                      <div className="mb-6 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={modelLabel}
                          className="h-28 w-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : null}

                    {/* Vendor (انگلیسی) */}
                    <div
                      className="latin-fix text-xs text-slate-400 w-full text-left"
                      lang="en"
                      dir="ltr"
                    >
                      {vendorLabel}
                    </div>

                    {/* Model (انگلیسی) */}
                    <h3
                      className="latin-fix mt-1 text-lg font-semibold text-slate-900 w-full text-left"
                      lang="en"
                      dir="ltr"
                    >
                      {modelLabel}
                    </h3>

                    {/* توضیح */}
                    {p.desc ? (
                      <p className="mt-3 text-slate-600 leading-7">{p.desc}</p>
                    ) : null}

                    <div className="mt-auto" />

                    {/* دکمه‌ها */}
                    <div className="mt-6 flex items-center justify-center gap-6">
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