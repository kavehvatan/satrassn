// components/RotatingSolutionPrism.jsx
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function joinPath(base, slug) {
  const b = String(base || "").replace(/\/+$/, "");
  const s = String(slug || "").replace(/^\/+/, "");
  if (!b) return `/${s}`;
  if (!s) return b;
  return `${b}/${s}`;
}

export default function RotatingSolutionPrism({
  items,
  hrefBase = "/services",
  height = 170,
  durationSec = 16,
  bg = "rgba(244,194,31,0.6)",
  accentColors = ["#14b8a6", "#f4c21f"],
  className = "",
  disable3DOnSmallScreens = true,
  smallScreenMaxWidth = 520,
}) {
  const data3 = useMemo(() => (items || []).slice(0, 3), [items]);

  // 4 وجه برای چرخش X (مکعبی): 0,1,2,0
  const faces = useMemo(() => {
    const a = data3[0] || { name: "", slug: "" };
    const b = data3[1] || a;
    const c = data3[2] || a;
    return [a, b, c, a];
  }, [data3]);

  const [border, setBorder] = useState("#e5e7eb");
  const pickBorder = () =>
    accentColors[Math.floor(Math.random() * accentColors.length)] || "#e5e7eb";

  const z = Math.max(40, Math.round(height / 2));

  // ✅ روی موبایل/صفحه کوچک: به جای 3D، یک لوگو در مرکز + fade
  const [forceFallback, setForceFallback] = useState(false);
  const [fallbackIdx, setFallbackIdx] = useState(0);

  useEffect(() => {
    if (!disable3DOnSmallScreens) return;

    const onResize = () => {
      const w = window.innerWidth || 9999;
      setForceFallback(w <= smallScreenMaxWidth);
    };

    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [disable3DOnSmallScreens, smallScreenMaxWidth]);

  useEffect(() => {
    if (!forceFallback) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      ?.matches;

    if (prefersReduced) {
      setFallbackIdx(0);
      return;
    }

    const stepMs = Math.max(2200, Math.round((durationSec * 1000) / 3));
    const t = setInterval(() => {
      setFallbackIdx((v) => (v + 1) % Math.max(1, data3.length));
    }, stepMs);

    return () => clearInterval(t);
  }, [forceFallback, durationSec, data3.length]);

  const imgTransform = (it) => {
    const ox = Number(it?.offsetX || 0);
    const oy = Number(it?.offsetY || 0);
    const sc = Number(it?.scale || 1);
    return `translateX(${ox}px) translateY(${oy}px) scale(${sc}) translateZ(0)`;
  };

  const active = data3[fallbackIdx] || data3[0] || { name: "", slug: "" };
  const activeHref = active?.href ? String(active.href) : joinPath(hrefBase, active?.slug);
  const activeWebp = active?.logo || `/avatars/${active?.slug}.webp`;
  const activePng = `/avatars/${active?.slug}.png`;

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        className="rsp-scene w-full max-w-6xl"
        style={{
          height,
          ["--rsp-h"]: `${height}px`,
          ["--rsp-z"]: `${z}px`,
          ["--rsp-dur"]: `${durationSec}s`,
          ["--rsp-bg"]: bg,
          ["--rsp-bd"]: border,
        }}
        onMouseEnter={() => setBorder(pickBorder())}
        onMouseLeave={() => setBorder("#e5e7eb")}
      >
        {/* 3D prism */}
        {!forceFallback && (
          <div className="rsp-prism" aria-label="Solutions rotating cube">
            {faces.map((it, idx) => {
              const href = it?.href ? String(it.href) : joinPath(hrefBase, it?.slug);
              const srcWebp = it?.logo || `/avatars/${it?.slug}.webp`;
              const srcPng = `/avatars/${it?.slug}.png`;

              return (
                <div
                  key={`${it?.slug || "x"}-${idx}`}
                  className="rsp-face"
                  style={{ ["--rsp-i"]: idx }}
                >
                  <Link href={href} className="rsp-link" aria-label={it?.name} title={it?.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srcWebp}
                      alt={it?.name || ""}
                      className="rsp-logo"
                      style={{ transform: imgTransform(it) }}
                      onError={(e) => (e.currentTarget.src = srcPng)}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ Mobile fallback: فقط یک لوگو وسط + fade */}
        {forceFallback && (
          <Link href={activeHref} className="rsp-fallbackOne" aria-label={active?.name} title={active?.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`${active?.slug || "x"}-${fallbackIdx}`} // ✅ برای اجرای fade در هر سوییچ
              src={activeWebp}
              alt={active?.name || ""}
              className="rsp-logo rsp-fade"
              style={{ transform: imgTransform(active) }}
              onError={(e) => (e.currentTarget.src = activePng)}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </Link>
        )}

        <style jsx>{`
          .rsp-scene {
            position: relative;
            perspective: 1200px;
            border-radius: 24px;
            overflow: hidden;
            background: var(--rsp-bg);
            border: 1px solid var(--rsp-bd);
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);

            /* iOS/Safari fixes */
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            isolation: isolate;
            -webkit-mask-image: -webkit-radial-gradient(white, black);
          }

          .rsp-prism {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            will-change: transform;
            animation: rsp-spin var(--rsp-dur) linear infinite;
          }

          .rsp-face {
            position: absolute;
            inset: 0;
            border-radius: 24px;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: rotateX(calc(var(--rsp-i) * 90deg)) translateZ(var(--rsp-z)) translateZ(0);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rsp-link {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 24px;
            text-decoration: none;
          }

          .rsp-fallbackOne {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;     /* ✅ وسط عمودی */
            justify-content: center; /* ✅ وسط افقی */
            text-decoration: none;
          }

          .rsp-link:focus-visible,
          .rsp-fallbackOne:focus-visible {
            outline: 3px solid rgba(20, 184, 166, 0.9);
            outline-offset: 4px;
          }

          .rsp-logo {
            max-height: calc(var(--rsp-h) * 0.62);
            max-width: 60%;
            object-fit: contain;
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
          }

          /* ✅ روی موبایل فضا رو بهتر پر کن */
          @media (max-width: 520px) {
            .rsp-logo {
              max-width: 82%;
              max-height: calc(var(--rsp-h) * 0.7);
            }
          }

          .rsp-fade {
            animation: rsp-fade 320ms ease-out;
          }

          @keyframes rsp-fade {
            from { opacity: 0; transform: translateZ(0) scale(0.98); }
            to   { opacity: 1; transform: translateZ(0) scale(1); }
          }

          @keyframes rsp-spin {
            from { transform: rotateX(0deg); }
            to   { transform: rotateX(-360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}