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
  // ✅ برای اینکه موبایل عمودی همیشه “نشان بده” (به جای 3D پرپر/غیب)
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

  // عمق صحیح برای rotateX بر اساس ارتفاع
  const z = Math.max(40, Math.round(height / 2));

  // ✅ تشخیص موبایل/صفحه کوچک (برای خاموش کردن 3D در صورت نیاز)
  const [forceFallback, setForceFallback] = useState(false);

  useEffect(() => {
    if (!disable3DOnSmallScreens) return;

    const onResize = () => {
      try {
        const w = window.innerWidth || 9999;
        const isSmall = w <= smallScreenMaxWidth;
        setForceFallback(isSmall);
      } catch {}
    };

    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [disable3DOnSmallScreens, smallScreenMaxWidth]);

  const imgTransform = (it) => {
    const ox = Number(it?.offsetX || 0);
    const oy = Number(it?.offsetY || 0);
    const sc = Number(it?.scale || 1);
    // ✅ translateZ(0) برای قفل GPU و جلوگیری از پرپر
    return `translateX(${ox}px) translateY(${oy}px) scale(${sc}) translateZ(0)`;
  };

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
        {/* ✅ 3D prism */}
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

        {/* ✅ Fallback (reduce motion + small screens) */}
        <div className={`rsp-fallback ${forceFallback ? "rsp-fallback--show" : ""}`}>
          {data3.map((it, idx) => {
            const href = it?.href ? String(it.href) : joinPath(hrefBase, it?.slug);
            const srcWebp = it?.logo || `/avatars/${it?.slug}.webp`;
            const srcPng = `/avatars/${it?.slug}.png`;

            return (
              <Link
                key={`${it?.slug || "x"}-${idx}`}
                href={href}
                className="rsp-fallbackItem"
                aria-label={it?.name}
                title={it?.name}
              >
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
            );
          })}
        </div>

        <style jsx>{`
          .rsp-scene {
            position: relative;
            perspective: 1200px;
            border-radius: 24px;
            overflow: hidden;
            background: var(--rsp-bg);
            border: 1px solid var(--rsp-bd);
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);

            /* ✅ iOS/Safari fixes for 3D + radius + overflow */
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

            /* ✅ rotateX faces + GPU nudge */
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

          .rsp-link:focus-visible {
            outline: 3px solid rgba(20, 184, 166, 0.9);
            outline-offset: 4px;
          }

          .rsp-logo {
            max-height: calc(var(--rsp-h) * 0.62);
            max-width: 60%;
            object-fit: contain;
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
          }

          @keyframes rsp-spin {
            from {
              transform: rotateX(0deg);
            }
            to {
              transform: rotateX(-360deg);
            }
          }

          .rsp-fallback {
            display: none;
            position: absolute;
            inset: 0;
            gap: 12px;
            background: transparent;
          }

          .rsp-fallback--show {
            display: flex;
          }

          .rsp-fallbackItem {
            flex: 1;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* prefers-reduced-motion: always fallback */
          @media (prefers-reduced-motion: reduce) {
            .rsp-prism {
              display: none;
            }
            .rsp-fallback {
              display: flex;
            }
          }
        `}</style>
      </div>
    </div>
  );
}