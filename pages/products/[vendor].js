// pages/products/[vendor].js
import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";

// ---------- Fallback data (داخل همین فایل) ----------
const FALLBACK_PRODUCTS = {
  dell: {
    title: "Dell EMC",
    intro:
      "استوریج و سرورهای Dell EMC برای بارکاری‌ سازمانی با تمرکز بر کارایی، سادگی مدیریت و دسترس‌پذیری.",
    items: [
      {
        vendor: "Dell EMC",
        model: "PowerStore T",
        desc: "آرایه‌های All-Flash با معماری NVMe و Scale-Up/Scale-Out؛ مناسب دیتابیس و بارکاری‌ ترکیبی با فشرده‌سازی پیشرفته.",
        image: "/products/dell/powerstore.webp",
        specsheet: "/specs/dell/powerstore.pdf",
      },
      {
        vendor: "Dell EMC",
        model: "Unity XT",
        desc: "میان‌رده محبوب برای فایل/NAS و بلاک/SAN با Snapshot/Replication و Cloud Tiering؛ تعادل قیمت/کارایی عالی.",
        image: "/products/dell/unity-xt480.webp",
        specsheet: "/specs/dell/xt480.pdf",
      },
      {
        vendor: "Dell EMC",
        model: "PowerEdge R760",
        desc: "سرور 2U نسل جدید برای بارکاری‌های مجازی‌سازی، دیتابیس و VDI با پشتیبانی PCIe Gen4 و iDRAC.",
        image: "/products/dell/poweredge-r760.webp",
        specsheet: "/specs/dell/poweredge-r760.pdf",
      },
    ],
  },
  // اگر خواستی برای برندهای دیگر هم پیش‌فرض بگذار:
  // hpe: { title: "HPE", intro: "", items: [] },
  // lenovo: { title: "Lenovo", intro: "", items: [] },
};

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

// ---------- UI ----------
function ConsultBtn({ className = "" }) {
  return (
    <Link href="/contact#contact" prefetch={false} className={cx("btn btn-primary", className)}>
      درخواست مشاوره
    </Link>
  );
}

export default function VendorPage({ vendor, title, intro, items, theme }) {
  const pageTitle = title || vendor?.toUpperCase();

  // آواتار برند در هدر: اول webp بعد png
  const avatarWebp = `/avatars/${vendor}.webp`;
  const avatarPng = `/avatars/${vendor}.png`;

  return (
    <div data-theme={theme} className={`theme-${theme}`}>
      <Head>
        <title>{pageTitle} | تجهیزات</title>
        <meta name="description" content={intro || `محصولات ${pageTitle} در ساتراس`} />
      </Head>

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
            <p className="mt-6 mx-auto max-w-3xl text-slate-300 leading-8">{intro}</p>
          ) : null}
        </div>
      </header>

      {/* Grid محصولات */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {items && items.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => (
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
                        alt={p.model || ""}
                        className="h-28 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  {/* برند کوچک */}
                  <div className="text-xs text-slate-400">{p.vendor || pageTitle}</div>

                  {/* عنوان محصول */}
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{p.model}</h3>

                  {/* توضیح */}
                  {p.desc ? <p className="mt-3 text-slate-600 leading-7">{p.desc}</p> : null}

                  <div className="mt-auto" />

                  {/* دکمه‌ها */}
                  <div className="mt-6 flex items-center justify-center gap-6">
                    {p.specsheet && (
                      <a
                        href={p.specsheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        Specsheet
                      </a>
                    )}
                    <ConsultBtn />
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-slate-700">
              هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
              <code className="rounded bg-white px-2 py-1 text-slate-800">data/products.json</code>{" "}
              اضافه کن.
            </p>
            <div className="mt-4">
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
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
  const fallbackKeys = Object.keys(FALLBACK_PRODUCTS);
  const fileKeys = Object.keys(fileData || {});
  // اتحاد کلیدهای موجود در فایل و فالبک
  const vendors = Array.from(new Set([...fallbackKeys, ...fileKeys]));
  const paths = vendors.map((v) => ({ params: { vendor: v } }));
  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const vendor = String(ctx.params?.vendor || "").toLowerCase();

  const fileData = readProductsJson();
  const blockFromFile = fileData[vendor];
  const blockFallback = FALLBACK_PRODUCTS[vendor];

  // اگر در فایل بود، همون مقدم است؛ وگرنه فالبک
  const block = blockFromFile || blockFallback || {};

  return {
    props: {
      vendor,
      title: block.title || vendor.toUpperCase(),
      intro: block.intro || "",
      items: Array.isArray(block.items) ? block.items : [],
      theme: block.theme || block.themeVendor || vendor, // برای تم احتمالی
    },
  };
}