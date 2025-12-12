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

  // بقیه برندها: نمونه‌های رایج (۳ تا)
  hpe: {
    title: "HPE",
    intro:
      "سرورها و استوریج‌های HPE برای دیتاسنترهای سازمانی با تمرکز بر پایداری، مدیریت‌پذیری و اکوسیستم گسترده.",
    items: [
      {
        vendor: "HPE",
        model: "ProLiant DL380 (Gen10/Gen11)",
        desc: "سرور 2U همه‌فن‌حریف برای مجازی‌سازی، دیتابیس و بارکاری‌های عمومی دیتاسنتر.",
        image: "/products/hpe/dl380.webp",
        specsheet: "/specs/hpe/dl380.pdf",
      },
      {
        vendor: "HPE",
        model: "HPE Nimble Storage (AF/HF)",
        desc: "استوریج میان‌رده SAN با کارایی بالا و مدیریت ساده؛ مناسب VMware و بارکاری‌های ترکیبی.",
        image: "/products/hpe/nimble.webp",
        specsheet: "/specs/hpe/nimble.pdf",
      },
      {
        vendor: "HPE",
        model: "HPE Alletra / Primera",
        desc: "استوریج‌های سازمانی All-Flash برای کارایی پایدار، HA و بارکاری‌های حساس.",
        image: "/products/hpe/alletra.webp",
        specsheet: "/specs/hpe/alletra.pdf",
      },
    ],
  },

  lenovo: {
    title: "Lenovo",
    intro:
      "سرورهای ThinkSystem و راهکارهای دیتاسنتری Lenovo با تمرکز بر ارزش خرید و انعطاف در کانفیگ.",
    items: [
      {
        vendor: "Lenovo",
        model: "ThinkSystem SR650",
        desc: "سرور 2U محبوب برای مجازی‌سازی و بارکاری‌های عمومی با گزینه‌های توسعه زیاد.",
        image: "/products/lenovo/sr650.webp",
        specsheet: "/specs/lenovo/sr650.pdf",
      },
      {
        vendor: "Lenovo",
        model: "ThinkSystem SR630",
        desc: "سرور 1U جمع‌وجور برای رک‌های پرتراکم و سرویس‌های عمومی دیتاسنتر.",
        image: "/products/lenovo/sr630.webp",
        specsheet: "/specs/lenovo/sr630.pdf",
      },
      {
        vendor: "Lenovo",
        model: "ThinkSystem DE Series Storage",
        desc: "SAN Storage اقتصادی/میان‌رده برای بلاک و سناریوهای Backup/VMware/DB.",
        image: "/products/lenovo/de-series.webp",
        specsheet: "/specs/lenovo/de-series.pdf",
      },
    ],
  },

  cisco: {
    title: "Cisco",
    intro:
      "سوئیچینگ/روتینگ و سرورهای دیتاسنتری Cisco با اکوسیستم قدرتمند و استانداردهای صنعتی.",
    items: [
      {
        vendor: "Cisco",
        model: "Nexus 9000 Series",
        desc: "سوئیچ‌های دیتاسنتری برای Spine/Leaf، کارایی بالا و فیچرهای شبکه‌سازی مدرن.",
        image: "/products/cisco/nexus-9k.webp",
        specsheet: "/specs/cisco/nexus-9k.pdf",
      },
      {
        vendor: "Cisco",
        model: "Catalyst 9300 Series",
        desc: "سوئیچ Access/Distribution سازمانی با قابلیت‌های امنیتی و مدیریت‌پذیری بالا.",
        image: "/products/cisco/catalyst-9300.webp",
        specsheet: "/specs/cisco/catalyst-9300.pdf",
      },
      {
        vendor: "Cisco",
        model: "UCS C-Series Rack Servers",
        desc: "سرورهای رک‌مونت دیتاسنتری برای مجازی‌سازی و بارکاری‌های سازمانی.",
        image: "/products/cisco/ucs-c.webp",
        specsheet: "/specs/cisco/ucs-c.pdf",
      },
    ],
  },

  juniper: {
    title: "Juniper",
    intro:
      "سوئیچ/روتر و فایروال‌های Juniper برای شبکه‌های Enterprise و Datacenter با تمرکز روی کارایی و اتوماسیون.",
    items: [
      {
        vendor: "Juniper",
        model: "EX Series Switches",
        desc: "سوئیچ‌های Enterprise برای Access/Distribution با گزینه‌های متنوع پورت و استک.",
        image: "/products/juniper/ex-series.webp",
        specsheet: "/specs/juniper/ex-series.pdf",
      },
      {
        vendor: "Juniper",
        model: "QFX Series (Datacenter)",
        desc: "سوئیچ‌های دیتاسنتری مناسب معماری Spine/Leaf و ترافیک‌های پرتراکم.",
        image: "/products/juniper/qfx-series.webp",
        specsheet: "/specs/juniper/qfx-series.pdf",
      },
      {
        vendor: "Juniper",
        model: "SRX Series Firewalls",
        desc: "فایروال/UTM سازمانی برای امنیت شبکه، VPN و کنترل تهدیدات.",
        image: "/products/juniper/srx-series.webp",
        specsheet: "/specs/juniper/srx-series.pdf",
      },
    ],
  },

  quantum: {
    title: "Quantum",
    intro:
      "Backup/Archive در مقیاس سازمانی با Tape Library و Appliance های ذخیره‌سازی و حفاظت از داده.",
    items: [
      {
        vendor: "Quantum",
        model: "DXi Backup Appliance",
        desc: "Dedup Appliance برای بکاپ‌گیری (مناسب NetBackup/Veeam و سناریوهای دیتاسنتری).",
        image: "/products/quantum/dxi.webp",
        specsheet: "/specs/quantum/dxi.pdf",
      },
      {
        vendor: "Quantum",
        model: "Scalar Tape Library",
        desc: "Tape Library سازمانی برای آرشیو و بکاپ بلندمدت با قابلیت توسعه.",
        image: "/products/quantum/scalar.webp",
        specsheet: "/specs/quantum/scalar.pdf",
      },
      {
        vendor: "Quantum",
        model: "StorNext",
        desc: "فایل‌سیستم/مدیریت داده برای آرشیو و ورک‌فلوهای حجیم (Media و Data-heavy).",
        image: "/products/quantum/stornext.webp",
        specsheet: "/specs/quantum/stornext.pdf",
      },
    ],
  },

  paloalto: {
    title: "Palo Alto Networks",
    intro:
      "امنیت شبکه نسل جدید با تمرکز روی Threat Prevention، App Control و مدیریت یکپارچه.",
    items: [
      {
        vendor: "Palo Alto Networks",
        model: "PA-3200 Series",
        desc: "NGFW میان‌رده برای سازمان‌ها با توان پردازشی مناسب و قابلیت‌های امنیتی کامل.",
        image: "/products/paloalto/pa-3200.webp",
        specsheet: "/specs/paloalto/pa-3200.pdf",
      },
      {
        vendor: "Palo Alto Networks",
        model: "PA-5200 Series",
        desc: "NGFW سطح Enterprise برای دیتاسنتر و سازمان‌های بزرگ با Throughput بالاتر.",
        image: "/products/paloalto/pa-5200.webp",
        specsheet: "/specs/paloalto/pa-5200.pdf",
      },
      {
        vendor: "Palo Alto Networks",
        model: "Panorama",
        desc: "مدیریت متمرکز سیاست‌ها و لاگ‌ها برای چندین فایروال در مقیاس سازمانی.",
        image: "/products/paloalto/panorama.webp",
        specsheet: "/specs/paloalto/panorama.pdf",
      },
    ],
  },

  fortinet: {
    title: "Fortinet",
    intro:
      "راهکارهای امنیت شبکه و SD-WAN با سخت‌افزارهای پرکاربرد در شبکه‌های سازمانی.",
    items: [
      {
        vendor: "Fortinet",
        model: "FortiGate 100F",
        desc: "فایروال محبوب شعب/سازمان برای NGFW + SD-WAN با ارزش خرید بالا.",
        image: "/products/fortinet/fortigate-100f.webp",
        specsheet: "/specs/fortinet/fortigate-100f.pdf",
      },
      {
        vendor: "Fortinet",
        model: "FortiAnalyzer",
        desc: "تحلیل و گزارش‌گیری متمرکز لاگ‌ها برای دید بهتر امنیتی و Compliance.",
        image: "/products/fortinet/fortianalyzer.webp",
        specsheet: "/specs/fortinet/fortianalyzer.pdf",
      },
      {
        vendor: "Fortinet",
        model: "FortiManager",
        desc: "مدیریت مرکزی پالیسی‌ها و دیپلوی تنظیمات در مقیاس چندسایتی.",
        image: "/products/fortinet/fortimanager.webp",
        specsheet: "/specs/fortinet/fortimanager.pdf",
      },
    ],
  },

  brocade: {
    title: "Brocade",
    intro:
      "سوئیچ‌های Fibre Channel برای SAN با تمرکز بر پایداری، Latency پایین و مقیاس‌پذیری دیتاسنتری.",
    items: [
      {
        vendor: "Brocade",
        model: "G620 Switch",
        desc: "سوئیچ FC پرکاربرد دیتاسنتری برای SAN Fabric های سازمانی.",
        image: "/products/brocade/g620.webp",
        specsheet: "/specs/brocade/g620.pdf",
      },
      {
        vendor: "Brocade",
        model: "6505 / 6510 (Legacy Common)",
        desc: "مدل‌های رایج نسل‌های قبل که هنوز در بسیاری از دیتاسنترها دیده می‌شوند.",
        image: "/products/brocade/6505-6510.webp",
        specsheet: "/specs/brocade/6505-6510.pdf",
      },
      {
        vendor: "Brocade",
        model: "X6 Director Series",
        desc: "Director کلاس Enterprise برای SAN های بزرگ با قابلیت‌های HA و مقیاس بالا.",
        image: "/products/brocade/x6-director.webp",
        specsheet: "/specs/brocade/x6-director.pdf",
      },
    ],
  },

  hitachi: {
    title: "Hitachi Vantara",
    intro:
      "استوریج‌های سازمانی برای کارایی پایدار، قابلیت اطمینان بالا و سناریوهای Mission-Critical.",
    items: [
      {
        vendor: "Hitachi Vantara",
        model: "VSP E Series",
        desc: "Enterprise Storage برای بارکاری‌های حساس با قابلیت‌های پیشرفته Availability.",
        image: "/products/hitachi/vsp-e.webp",
        specsheet: "/specs/hitachi/vsp-e.pdf",
      },
      {
        vendor: "Hitachi Vantara",
        model: "VSP G Series",
        desc: "استوریج‌های کلاس Enterprise/High-end برای دیتاسنترهای بزرگ و رشدپذیر.",
        image: "/products/hitachi/vsp-g.webp",
        specsheet: "/specs/hitachi/vsp-g.pdf",
      },
      {
        vendor: "Hitachi Vantara",
        model: "HCP (Content Platform)",
        desc: "Object Storage برای آرشیو، لاگ‌ها و داده‌های Unstructured در مقیاس بالا.",
        image: "/products/hitachi/hcp.webp",
        specsheet: "/specs/hitachi/hcp.pdf",
      },
    ],
  },

  oracle: {
    title: "Oracle",
    intro:
      "پلتفرم‌های دیتابیس و سیستم‌های مهندسی‌شده Oracle برای کارایی و یکپارچگی بالا در بارکاری‌های دیتابیس.",
    items: [
      {
        vendor: "Oracle",
        model: "Exadata Database Machine",
        desc: "سیستم مهندسی‌شده برای Oracle DB با کارایی بالا و بهینه‌سازی End-to-End.",
        image: "/products/oracle/exadata.webp",
        specsheet: "/specs/oracle/exadata.pdf",
      },
      {
        vendor: "Oracle",
        model: "Oracle ZFS Storage Appliance",
        desc: "استوریج فایل/بلاک برای سناریوهای دیتابیس و محیط‌های سازمانی.",
        image: "/products/oracle/zfs.webp",
        specsheet: "/specs/oracle/zfs.pdf",
      },
      {
        vendor: "Oracle",
        model: "Private Cloud Appliance",
        desc: "زیرساخت آماده برای راه‌اندازی Cloud خصوصی و سرویس‌های سازمانی.",
        image: "/products/oracle/pca.webp",
        specsheet: "/specs/oracle/pca.pdf",
      },
    ],
  },

  f5: {
    title: "F5",
    intro:
      "Load Balancing و Application Delivery برای سرویس‌های حیاتی با قابلیت‌های امنیتی و مقیاس‌پذیری.",
    items: [
      {
        vendor: "F5",
        model: "BIG-IP iSeries (Hardware)",
        desc: "ADC سخت‌افزاری برای Load Balancing، SSL Offload و محافظت از اپلیکیشن.",
        image: "/products/f5/bigip-iseries.webp",
        specsheet: "/specs/f5/bigip-iseries.pdf",
      },
      {
        vendor: "F5",
        model: "BIG-IP VE (Virtual Edition)",
        desc: "نسخه مجازی برای VMware/KVM و سناریوهای Cloud/Private Cloud.",
        image: "/products/f5/bigip-ve.webp",
        specsheet: "/specs/f5/bigip-ve.pdf",
      },
      {
        vendor: "F5",
        model: "BIG-IQ (Management)",
        desc: "مدیریت مرکزی، لایسنس و Lifecycle برای محیط‌های چند BIG-IP.",
        image: "/products/f5/big-iq.webp",
        specsheet: "/specs/f5/big-iq.pdf",
      },
    ],
  },
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
  const pageTitle = title || vendor?.toUpperCase();

  // آواتار برند در هدر: اول webp بعد png
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
                  <div className="text-xs text-slate-400">
                    {p.vendor || pageTitle}
                  </div>

                  {/* عنوان محصول */}
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {p.model}
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
  const fallbackKeys = Object.keys(FALLBACK_PRODUCTS);
  const fileKeys = Object.keys(fileData || {});
  const vendors = Array.from(new Set([...fallbackKeys, ...fileKeys]));
  const paths = vendors.map((v) => ({ params: { vendor: v } }));
  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const vendor = String(ctx.params?.vendor || "").toLowerCase();

  const fileData = readProductsJson();
  const blockFromFile = fileData[vendor];
  const blockFallback = FALLBACK_PRODUCTS[vendor];

  const block = blockFromFile || blockFallback || {};

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