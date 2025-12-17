// pages/index.js
import React, { useEffect, useState } from "react";
import Link from "next/link";
import vendors from "../data/vendors";
import services from "../data/services.json";
import RotatingSolutionPrism from "../components/RotatingSolutionPrism.jsx";
/* =============== SectionTitle =============== */
function SectionTitle({ as: Tag = "h2", icon = "equipment", className = "", children }) {
  const map = { equipment: "vendors", solutions: "solutions", services: "services" };
  const src = `/icons/sections/${map[icon] || icon}.webp`;
  const [useFallback, setUseFallback] = useState(false);

  const FallbackIcon = ({ className = "" }) => {
    switch (icon) {
      case "solutions":
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M10 3a2 2 0 1 1 4 0h3a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-3a2 2 0 1 0-4 0H7a2 2 0 0 1-2-2v-4.65a4.5 4.5 0 1 0 0-4.7V5a2 2 0 0 1 2-2h3z" />
          </svg>
        );
      case "services":
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M21 14.35V19a2 2 0 0 1-2 2h-4.65a4.5 4.5 0 1 0-4.7 0H5a2 2 0 0 1-2-2v-4.65a4.5 4.5 0 1 0 0-4.7V5a2 2 0 0 1 2-2h4.65a4.5 4.5 0 1 0 4.7 0H19a2 2 0 0 1 2 2v4.65a4.5 4.5 0 1 0 0 4.7zM12 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM3 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm12 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5A2 2 0 0 1 3 8V5zm0 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3zm3-8h3v2H6V6zm0 9h3v2H6v-2zm10-9h2v2h-2V6zm0 9h2v2h-2v-2z" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`} dir="rtl">
      <span className="inline-flex items-center justify-center w-6 h-6">
        {useFallback ? (
          <FallbackIcon className="w-5 h-5" />
        ) : (
          <img
            src={src}
            alt=""
            className="w-5 h-5"
            aria-hidden="true"
            onError={() => setUseFallback(true)}
          />
        )}
      </span>
      <Tag className="text-2xl font-extrabold tracking-tight text-slate-900">
        {children}
      </Tag>
      <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
    </div>
  );
}

/* =============== helpers =============== */
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const LOGO_COLORS = [TEAL, YELLOW];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

/* =============== Cards =============== */

// کارت برند (تجهیزات)
function BrandCard({ title, slug, href, index, logo }) {
  const [border, setBorder] = useState("#e5e7eb");
  const link = href || `/products/${slug || (title || "").toLowerCase()}`;
  const base =
    logo
      ? logo.replace(/^\/?avatars\//, "").replace(/\.(png|webp)$/i, "")
      : (slug || (title || "")).toLowerCase();

  const webp = `/avatars/${base}.webp`;
  const png = `/avatars/${base}.png`;
  const artWebp = `/brand-art/${base}.webp`;
  const artPng = `/brand-art/${base}.png`;

  return (
    <Link href={link} className="group block">
      <div
        className="
          group relative overflow-hidden rounded-2xl
          border backdrop-blur-xl hover:backdrop-blur-0
          p-5 transition duration-300 ease-in-out
          hover:-translate-y-0.5 hover:shadow-xl
        "
        style={{
          borderColor: border,
          borderWidth: 1,
          backgroundColor: "rgba(255,255,255,0.5)", // پیش‌فرض 50% (شیشه‌ای)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"; // روی هاور: کاملاً شفاف
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)]);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.5)"; // برگشت به 50%
          setBorder("#e5e7eb");
        }}
      >
        {/* پس‌زمینه کارت برند */}
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={artWebp} type="image/webp" />
          <img
            src={artPng}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-[1.12] opacity-40 group-hover:opacity-90 transition-opacity duration-300 contrast-115 saturate-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        {/* هایلایت رنگی آرام */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${colorOf(
              index
            )}33 0%, transparent 60%)`,
          }}
        />

        {/* لوگو */}
        <div className="relative flex items-center ltr:justify-start rtl:justify-end">
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
        </div>
      </div>
    </Link>
  );
}

// کارت سرویس‌ها
function ServiceCard({ title, icon, href }) {
  const [border, setBorder] = useState("#e5e7eb");
  const bg = "rgba(20,184,166,0.6)";
  const fg = "#fff";
  return (
    <Link href={href} className="w-full max-w-[520px]">
      <div
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
        className="flex flex-col items-center justify-center gap-3 p-5 border rounded-lg hover:shadow-md transition text-center w-full mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: border, background: bg, color: fg }}
      >
        {icon ? (
          <img
            src={icon}
            alt=""
            className="w-10 h-10 object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : null}
        <span className="font-semibold" style={{ color: fg }}>
          {title}
        </span>
      </div>
    </Link>
  );
}

/* ===== محافظت از داده: داده‌ها ===== */
const SOLUTIONS = [
  { name: "Veeam", slug: "veeam", offsetX: -48 },
  { name: "Veritas", slug: "veritas", offsetX: -22 },
  { name: "Commvault", slug: "commvault", offsetX: -18 },
];

/* =============== Page =============== */
export default function Home() {
  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const serviceItems = Array.isArray(services?.items) ? services.items : [];

  // CTA swap state
  const [isConsultFilled, setIsConsultFilled] = useState(() => {
    try {
      return (localStorage.getItem("cta_swap") || "consult") === "consult";
    } catch {
      return true;
    }
  });
  const filledColor = isConsultFilled ? TEAL : YELLOW;
  const outlinedColor = isConsultFilled ? YELLOW : TEAL;
  const flipCtas = () => {
    setIsConsultFilled((v) => {
      const nv = !v;
      try {
        localStorage.setItem("cta_swap", nv ? "consult" : "tools");
      } catch {}
      return nv;
    });
  };

  // --- Fade کل محتوای هیرو هنگام اسکرول
  const [heroOpacity, setHeroOpacity] = useState(1);

  useEffect(() => {
    const FADE_END = 340;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const next = Math.max(0, Math.min(1, 1 - y / FADE_END));
        setHeroOpacity(next);
        ticking = false;
      });
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setHeroOpacity(1);
      return;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div
          className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10"
          style={{
            opacity: heroOpacity,
            transition: "opacity 120ms linear",
            willChange: "opacity",
          }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              <span style={{ color: TEAL }}>زیرساخت هوشمند،</span>{" "}
              <span style={{ color: YELLOW }}>دقت مهندسی</span>
            </h1>

            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، درکنار شما.</p>

            <div className="mt-6 flex gap-3">
              <a
                href="/contact"
                onClick={flipCtas}
                className="rounded-full px-5 py-2.5 font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: filledColor,
                  color: filledColor === YELLOW ? "#000" : "#fff",
                  border: `1px solid ${filledColor}`,
                }}
              >
                ارائه مشاوره
              </a>
              <a
                href="/tools"
                onClick={flipCtas}
                className="rounded-full px-5 py-2.5 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  border: `1px solid ${outlinedColor}`,
                  color: outlinedColor,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = `${outlinedColor}1A`)
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

      {/* تجهیزات — نسخه ساده بدون بنر */}
      <section id="vendors" className="py-12">
        <div className="relative max-w-6xl mx-auto px-4">
          <SectionTitle as="h2" icon="equipment">
            تجهیزات
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeVendors.map((v, i) => (
              <BrandCard
                key={v.href || v.slug || v.title || i}
                title={v.title}
                slug={v.slug}
                href={v.href}
                index={i}
                logo={v.logo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* محافظت از داده */}
      <section id="solutions" className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 pt-7 pb-10">
          <SectionTitle as="h2" icon="solutions">
            محافظت از داده
          </SectionTitle>

          {/* جایگزین 3 کارت با یک باکس 3D چرخان */}
       <RotatingSolutionPrism
  items={SOLUTIONS}
  hrefBase="/solutions"
  height={170}
  durationSec={16}
  z={60}   // ✅ مهم: برای rotateX باید کوچیک باشه (حدود 50 تا 80)
 />
        </div>
      </section>

      {/* خدمات و راهکارها */}
      <section id="services" className="py-12">
        <div className="relative max-w-6xl mx-auto px-4">
          <SectionTitle as="h2" icon="services">
            خدمات و راهکارها
          </SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {serviceItems.map((s, i) => (
              <ServiceCard
                key={s.href || s.slug || s.title || i}
                title={s.title}
                icon={s.icon}
                href={s.href || `/services/${s.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 items-start text-center md:text-right">
            <div>
              <h4 className="font-bold mb-3">میان‌بُر</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="#vendors" className="hover:text-white">
                    تجهیزات
                  </a>
                </li>
                <li>
                  <a href="/tools" className="hover:text-white">
                    ابزارها
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white">
                    خدمات و راهکارها
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">خدمات و راهکارها</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="/services/install" className="hover:text-white">
                    نصب و راه‌اندازی
                  </a>
                </li>
                <li>
                  <a href="/services/monitoring" className="hover:text-white">
                    پایش
                  </a>
                </li>
                <li>
                  <a href="/services/training" className="hover:text-white">
                    آموزش
                  </a>
                </li>
                <li>
                  <a href="/services/consulting-design" className="hover:text-white">
                    مشاوره و طراحی
                  </a>
                </li>
                <li>
                  <a href="/services/operations" className="hover:text-white">
                    راهبری
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">صفحات</h4>
              <ul className="space-y-2 text-white/80">
                <li>
                  <a href="/contact" className="hover:text-white">
                    تماس با ما
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white">
                    درباره ما
                  </a>
                </li>
                <li>
                  <a href="/warranty" className="hover:text-white">
                    استعلام گارانتی
                  </a>
                </li>
                <li>
                  <a href="/news" className="hover:text-white">
                    تازه‌ها <span className="text-white/60">(اخبار و مقالات)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-white/10" />
          <p className="text-center text-white/80 text-sm">
            © {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است
          </p>
        </div>
      </footer>
    </main>
  );
}