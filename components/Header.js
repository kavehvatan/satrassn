// components/Header.js
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // رنگ‌های متناوب برای "ابزارها"
  const TEAL = "#14b8a6";
  const YELLOW = "#f4c21f";
  const [toolsColor, setToolsColor] = useState(TEAL);
  useEffect(() => {
    const id = setInterval(() => {
      setToolsColor((c) => (c === TEAL ? YELLOW : TEAL));
    }, 1000); // هر ۱ ثانیه
    return () => clearInterval(id);
  }, []);

  // قفل اسکرول صفحه وقتی منوی موبایل باز است
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const nav = [
    { href: "/", label: "خانه" },
    { href: "/tools", label: "ابزارها" },
    { href: "/downloads", label: "دانلودها" },
    { href: "/warranty", label: "گارانتی" },
    { href: "/news", label: "تازه‌ها" },      // ← جایگزین «درباره ما»
    { href: "/contact", label: "تماس با ما" },
  ];

  const isActive = (href) =>
    href === "/"
      ? router.pathname === "/"
      : router.pathname.startsWith(href);

  const itemClass =
    "px-1 py-1 rounded-md hover:text-brand-600 hover:opacity-90 transition";
  const activeClass =
    "text-brand-600 font-bold";

  return (
    <header dir="rtl" className=" z-40 bg-white/85 backdrop-blur-md border-b border-black/5">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          {/* لوگو */}
          <div className="shrink-0 flex items-center">
            <Link href="/" aria-label="Satrass">
              <Image
                src="/logo-satrass.png"
                alt="Satrass"
                width={132}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* منوی دسکتاپ */}
          <nav className="hidden md:flex items-center gap-7 text-slate-900">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`${itemClass} ${isActive(n.href) ? activeClass : ""}`}
                aria-current={isActive(n.href) ? "page" : undefined}
                // فقط برای «ابزارها» رنگ متناوب اعمال شود
                style={
                  n.href === "/tools"
                    ? { color: toolsColor, transition: "color 300ms ease" }
                    : undefined
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* دکمه همبرگری موبایل */}
          <button
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-black/10 bg-white/70 hover:bg-white transition"
            aria-label="باز کردن منو"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* لایه و دراور موبایل */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed z-50 top-16 inset-x-3 md:hidden">
            <div className="rounded-2xl border border-white/30 bg-white/95 shadow-2xl p-3 text-right">
              <ul className="divide-y divide-black/5">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className={`block px-3 py-3 rounded-xl hover:bg-black/5 transition ${
                        isActive(n.href) ? "text-brand-600 font-bold" : "text-slate-900"
                      }`}
                      aria-current={isActive(n.href) ? "page" : undefined}
                      style={
                        n.href === "/tools"
                          ? { color: toolsColor, transition: "color 300ms ease" }
                          : undefined
                      }
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
// افزودن لینک ابزار جدید:
// { title: 'Unity Midrange Sizer', href: '/tools/unity-midrangesizer' }
