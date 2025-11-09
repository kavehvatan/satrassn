// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import vendors from "../data/vendors"; // ⟵ ایمپورت نسبی، بدون @

// ---------------------- رنگ‌ها و کمک‌تابع‌ها ----------------------
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];
const LOGO_COLORS = [TEAL, YELLOW];

// تبدیل #RRGGBB به #RRGGBBAA با آلفای اعشاری 0..1
function withAlpha(hex, alpha = 0.7) {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  // اگر hex مثل #14b8a6 باشد:
  return hex.length === 7 ? `${hex}${a}` : hex;
}

// ---------------------- داده‌ها: راهکارها/خدمات ----------------------
// راهکارها (قدیم) – الان می‌بریم داخل «خدمات»
const SOLUTIONS = [
  {
    name: "Commvault",
    slug: "commvault",
    p1: "راهکار یکپارچهٔ حفاظت از داده برای VM/DB/Files/SaaS/Cloud با Dedup و Policyهای منعطف.",
    p2: "Hyperscale X برای Scale-out و Metallic به‌صورت SaaS؛ گزارش‌گیری و خودکارسازی کامل.",
    p3: "سناریوهای متداول: M365/Endpoint، بکاپ ترکیبی On-prem/Cloud، RTO/RPO سخت‌گیرانه.",
  },
  {
    name: "NetBackup",
    slug: "netbackup",
    p1: "پلتفرم بکاپ سازمانی با پوشش عمیق مجازی‌سازی/دیتابیس و Inline Dedup برای پنجرهٔ بکاپ کوچک.",
    p2: "اپلاینس‌های سری 52xx/Flex، مدیریت متمرکز، RBAC و گزارش‌گیری دقیق.",
    p3: "سناریوها: VMware/Hyper-V، Oracle/SQL، آرشیو نوار/کلود، بازیابی انتخابی سطح فایل.",
  },
];

// خدمات اصلی
const SERVICES_BASE = [
  {
    slug: "install",
    title: "نصب و راه‌اندازی",
    desc1:
      "از پیش‌نیاز تا استیجینگ و کانفیگ استاندارد؛ ارتقای Firmware و هم‌ترازی با Best Practice.",
    desc2:
      "در صورت نیاز مهاجرت بدون وقفه و در پایان UAT و تحویل رسمی پروژه انجام می‌شود.",
  },
  {
    slug: "monitoring",
    title: "پایش",
    desc1:
      "مانیتورینگ با آستانه‌های درست، داشبورد و هشدارهای عملیاتی + گزارش‌های SLA/ظرفیت/Performance.",
    desc2:
      "بازبینی سلامت و پیشنهادهای بهینه‌سازی دوره‌ای برای پایداری زیرساخت.",
  },
  {
    slug: "training",
    title: "آموزش",
    desc1:
      "انتقال دانش سناریومحور: راهبری تا Troubleshooting + Lab/Runbook اختصاصی.",
    desc2: "پس از دوره، پشتیبانی پرسش‌وپاسخ و به‌روزرسانی جزوات داریم.",
  },
  {
    slug: "consulting-design",
    title: "مشاوره و طراحی",
    desc1: "نیازسنجی، ظرفیت‌سنجی، HA/DR و انتخاب راهکار با نگاه TCO و رشد آتی.",
    desc2:
      "خروجی: دیاگرام، BOM و طرح مهاجرت + چند گزینهٔ فنی/مالی برای تصمیم شفاف.",
  },
  {
    slug: "operations",
    title: "راهبری",
    desc1:
      "Managed Service: پچینگ، بکاپ‌وریفای، هاردنینگ، بررسی لاگ و رسیدگی به رخدادها طبق SLA.",
    desc2: "گزارش ماهانه سلامت/ظرفیت/ریسک + نشست CAB.",
  },
];

// راهکارها را به آیتم‌های «خدمات» تبدیل می‌کنیم (بدون لوگو آیکن – صرفاً عنوان و توضیح)
const SOLUTIONS_AS_SERVICES = SOLUTIONS.map((s) => ({
  slug: s.slug,
  title: s.name,
  desc1: s.p1,
  desc2: `${s.p2} ${s.p3}`,
}));

// ترکیب نهایی «خدمات» (راهکارها هم اضافه شد) — در صورت نیاز ترتیب را جابه‌جا کن
const SERVICES = [...SOLUTIONS_AS_SERVICES, ...SERVICES_BASE];

// ---------------------- هوک جابجایی رنگ دکمه‌های هیرو ----------------------
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW); // Filled
  const [secondary, setSecondary] = useState(TEAL); // Outlined

  useEffect(() => {
    try {
      const lastIsTeal = localStorage.getItem("satrass_btn_pair") === "1";
      const nextIsTeal = !lastIsTeal;
      localStorage.setItem("satrass_btn_pair", nextIsTeal ? "1" : "0");
      if (nextIsTeal) {
        setPrimary(TEAL);
        setSecondary(YELLOW);
      } else {
        setPrimary(YELLOW);
        setSecondary(TEAL);
      }
    } catch {}
  }, []);

  const swap = () => {
    setPrimary((p) => {
      const np = p === TEAL ? YELLOW : TEAL;
      setSecondary(np === TEAL ? YELLOW : TEAL);
      try {
        localStorage.setItem("satrass_btn_pair", np === TEAL ? "1" : "0");
      } catch {}
      return np;
    });
  };

  return { primary, secondary, swap };
}

// ---------------------- کارت برند «تجهیزات» ----------------------
function BrandCard({ title, slug, href, subtitle, index, logo }) {
  const [border, setBorder] = useState("#e5e7eb");
  const link = href || `/products/${slug || (title || "").toLowerCase()}`;

  // نام پایه‌ی لوگو و آرت (webp → png → default.png)
  const base = logo
    ? logo.replace(/^\/?avatars\//, "").replace(/\.(png|webp)$/i, "")
    : (slug || (title || "")).toLowerCase();

  const webp = `/avatars/${base}.webp`;
  const png = `/avatars/${base}.png`;

  // تصویر پس‌زمینهٔ کارتونی (اختیاری)
  const artWebp = `/brand-art/${base}.webp`;
  const artPng = `/brand-art/${base}.png`;

  return (
    <Link href={link} className="group block">
      <div
        className="
          relative overflow-hidden rounded-2xl
          border bg-white/70 supports-[backdrop-filter]:bg-white/35
          backdrop-blur-xl p-5 transition duration-200
          hover:-translate-y-0.5 hover:shadow-xl
        "
        style={{ borderColor: border, borderWidth: 1 }}
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
      >
        {/* بک‌گراند برند (خیلی کم‌رنگ) */}
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={artWebp} type="image/webp" />
          <img
            src={artPng}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-[1.12] opacity-[.12] md:opacity-[.14] contrast-110 saturate-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        {/* هالهٔ ملایم رنگی برای هماهنگی بصری */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${colorOf(
              index
            )}33 0%, transparent 60%)`,
          }}
        />

        {/* محتوای کارت */}
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-white ring-1 ring-black/5 shadow-sm grid place-items-center transition-transform duration-200 group-hover:scale-[1.03] overflow-hidden">
            <picture>
              <source srcSet={webp} type="image/webp" />
              <img
                src={png}
                alt={title}
                width={56}
                height={56}
                className="w-10 h-10 object-contain"
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
            </picture>
          </div>

          <div className="min-w-0">
            <h3 className="text-slate-900 font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------- مودال شیشه‌ای عمومی ----------------------
function GlassModal({ open, onClose, title, paragraphs }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 200);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <article
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[min(92vw,760px)] mx-auto rounded-2xl overflow-hidden transform transition-all duration-200 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl bg-white/45 supports-[backdrop-filter]:bg-white/40 backdrop-blur-2xl ring-1 ring-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,.45)]">
          <div className="p-6 md:p-8 text-gray-900">
            <div className="flex items-start justify-between gap-6">
              <h4 className="text-xl md:text-2xl font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,.6)]">
                {title}
              </h4>
              <button
                onClick={handleClose}
                aria-label="بستن"
                className="text-gray-800 hover:text-black transition text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {paragraphs.map((tx, i) => (
              <p
                key={i}
                className={`leading-8 ${
                  i === 0 ? "mt-4" : "mt-3"
                } text-gray-900/95 drop-shadow-[0_1px_1px_rgba(255,255,255,.55)]`}
              >
                {tx}
              </p>
            ))}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-black/10 bg-white/30 hover:bg-white/40 transition"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// ---------------------- کارت «خدمات» (پس‌زمینه رنگی با آلفا 70٪) ----------------------
function ServiceCard({ title, desc1, desc2, index }) {
  const [border, setBorder] = useState("#e5e7eb");
  const bgBase = index % 2 === 0 ? TEAL : YELLOW; // یکی از دو رنگ سایت
  const bg = withAlpha(bgBase, 0.7); // شفافیت ~70%

  return (
    <>
      <div
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 p-5 border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: border, backgroundColor: bg }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
      >
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <GlassModal
        open={false /* مودال با کلیک زیر باز می‌شود */}
        onClose={() => {}}
        title={title}
        paragraphs={[desc1, desc2]}
      />
    </>
  );
}

// برای باز شدن مودال با کلیک: نسخه‌ای با state داخلی
function ServiceCardWithModal(props) {
  const [open, setOpen] = useState(false);
  const [border, setBorder] = useState("#e5e7eb");
  const bgBase = props.index % 2 === 0 ? TEAL : YELLOW;
  const bg = withAlpha(bgBase, 0.7);

  return (
    <>
      <div
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 p-5 border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: border, backgroundColor: bg }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900">{props.title}</span>
      </div>
      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={props.title}
        paragraphs={[props.desc1, props.desc2]}
      />
    </>
  );
}

// ---------------------- صفحه اصلی ----------------------
export default function Home() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  const safeVendors = Array.isArray(vendors) ? vendors : [];

  return (
    <main className="min-h-screen font-sans">
      {/* Hero (بنر تیره) */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              راهکارها و تجهیزات سازمانی با تمرکز بر کارایی و سادگی
            </h1>
            <p className="mt-4 text-gray-300">
              از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همیشه کنار شما هستیم.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="/contact"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-bold transition"
                style={{
                  backgroundColor: primary,
                  color: primaryIsYellow ? "#000" : "#fff",
                }}
              >
                ارائه مشاوره
              </a>
              <a
                href="/tools"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-semibold transition"
                style={{
                  border: `1px solid ${secondary}`,
                  color: secondary,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = `${secondary}1A`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                مشاهده ابزارها
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/satrass-hero.webp"
              alt="آواتار ساتراس"
              className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section id="vendors" className="relative py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-extrabold mb-6 text-slate-900">تجهیزات</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeVendors.map((v, i) => (
            <BrandCard
              key={v.href || v.slug || v.title || i}
              title={v.title}
              slug={v.slug}
              href={v.href}
              subtitle={v.subtitle}
              index={i}
              logo={v.logo}
            />
          ))}
        </div>
      </section>

      {/* خدمات (شامل Commvault و NetBackup) */}
      <section id="services" className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold mb-6">خدمات</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {SERVICES.map((s, i) => (
            <ServiceCardWithModal key={s.slug || s.title} index={i} {...s} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p>© {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است</p>
        </div>
      </footer>
    </main>
  );
}