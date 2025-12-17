import React, { useMemo, useState } from "react";
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
  hrefBase = "/services",          // ✅ مسیر درست شما همین است
  height = 170,
  durationSec = 16,
  bg = "rgba(244,194,31,0.6)",
  accentColors = ["#14b8a6", "#f4c21f"],
  className = "",
  z: zProp,                         // ✅ اگر خواستی دستی بده (مثلاً 60)
}) {
  const data3 = useMemo(() => (items || []).slice(0, 3), [items]);

  // 4 وجه برای چرخش X: 0,1,2,0
  const faces = useMemo(() => {
    const a = data3[0] || { name: "", slug: "" };
    const b = data3[1] || a;
    const c = data3[2] || a;
    return [a, b, c, a];
  }, [data3]);

  const [border, setBorder] = useState("#e5e7eb");
  const pickBorder = () =>
    accentColors[Math.floor(Math.random() * accentColors.length)] || "#e5e7eb";

  // عمق مناسب برای rotateX (اگر دستی دادی همان)
  const z = Number.isFinite(Number(zProp))
    ? Number(zProp)
    : Math.max(38, Math.round(height / 2));

  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* ✅ wrapper: border/overflow/shadow اینجاست (برای موبایل مهم) */}
      <div
        className="rsp-wrap w-full max-w-6xl"
        style={{
          background: bg,
          border: `1px solid ${border}`,
        }}
        onMouseEnter={() => setBorder(pickBorder())}
        onMouseLeave={() => setBorder("#e5e7eb")}
      >
        {/* ✅ scene: فقط perspective اینجاست */}
        <div
          className="rsp-scene"
          style={{
            height,
            ["--rsp-h"]: `${height}px`,
            ["--rsp-z"]: `${z}px`,
            ["--rsp-dur"]: `${durationSec}s`,
          }}
        >
          <div className="rsp-prism" aria-label="Solutions rotating cube">
            {faces.map((it, idx) => {
              const href = it?.href ? String(it.href) : joinPath(hrefBase, it?.slug);
              const srcWebp = it?.logo || `/avatars/${it?.slug}.webp`;
              const srcPng = `/avatars/${it?.slug}.png`;

              const ox = Number(it?.offsetX || 0);
              const oy = Number(it?.offsetY || 0);
              const sc = Number(it?.scale || 1);

              return (
                <div
                  key={`${it?.slug || "x"}-${idx}`}
                  className="rsp-face"
                  style={{ ["--rsp-i"]: idx }}
                >
                  <Link
                    href={href}
                    className="rsp-link"
                    aria-label={it?.name || ""}
                    title={it?.name || ""}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srcWebp}
                      alt={it?.name || ""}
                      className="rsp-logo"
                      style={{
                        ["--ox"]: `${ox}px`,
                        ["--oy"]: `${oy}px`,
                        ["--sc"]: sc,
                      }}
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

          {/* Reduce motion fallback */}
          <div className="rsp-fallback" aria-hidden="true">
            {data3.map((it, idx) => {
              const href = it?.href ? String(it.href) : joinPath(hrefBase, it?.slug);
              const srcWebp = it?.logo || `/avatars/${it?.slug}.webp`;
              const srcPng = `/avatars/${it?.slug}.png`;
              return (
                <Link
                  key={`${it?.slug || "x"}-${idx}`}
                  href={href}
                  className="rsp-fallbackItem"
                  aria-label={it?.name || ""}
                  title={it?.name || ""}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={srcWebp}
                    alt={it?.name || ""}
                    className="rsp-logo"
                    style={{
                      ["--ox"]: `${Number(it?.offsetX || 0)}px`,
                      ["--oy"]: `${Number(it?.offsetY || 0)}px`,
                      ["--sc"]: Number(it?.scale || 1),
                    }}
                    onError={(e) => (e.currentTarget.src = srcPng)}
                    loading="lazy"
                    draggable={false}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .rsp-wrap {
            border-radius: 28px;
            overflow: hidden; /* ✅ اینجا، نه روی scene */
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
          }

          .rsp-scene {
            position: relative;
            width: 100%;
            perspective: 1200px;
            /* یه ذره padding داخلی برای اینکه لوگو به لبه‌ها نچسبه */
          }

          .rsp-prism {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            will-change: transform;
            animation: rsp-spin var(--rsp-dur) linear infinite;
            transform: translateZ(0);
          }

          .rsp-face {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: rotateX(calc(var(--rsp-i) * 90deg)) translateZ(var(--rsp-z));
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
            text-decoration: none;
            /* ✅ Safe padding: جلوی چسبیدن به بالا/پایین */
            padding: clamp(14px, 3vw, 26px);
          }

          .rsp-link:focus-visible {
            outline: 3px solid rgba(20, 184, 166, 0.9);
            outline-offset: 4px;
          }

          .rsp-logo {
            max-height: calc(var(--rsp-h) * 0.62);
            max-width: 64%;
            object-fit: contain;
            object-position: center;
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
            transform-origin: 50% 50%;
            transform: translateX(var(--ox)) translateY(var(--oy))
              scale(var(--sc)) translateZ(0);
          }

          /* ✅ موبایل: همیشه افقی وسط، offsetX رو خنثی می‌کنیم تا “وسط نیست” تمام شود */
          @media (max-width: 640px) {
            .rsp-logo {
              max-width: 78%;
              max-height: calc(var(--rsp-h) * 0.54);
              transform: translateX(0px) translateY(var(--oy))
                scale(var(--sc)) translateZ(0);
            }
            .rsp-link {
              padding: 18px;
            }
          }

          @keyframes rsp-spin {
            from {
              transform: translateZ(0) rotateX(0deg);
            }
            to {
              transform: translateZ(0) rotateX(-360deg);
            }
          }

          .rsp-fallback {
            display: none;
            position: absolute;
            inset: 0;
            gap: 12px;
            padding: 16px;
          }

          .rsp-fallbackItem {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

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