import React, { useEffect, useMemo, useRef, useState } from "react";
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
  padding = 14, // ✅ حاشیه امن برای اینکه لوگوها به لبه نچسبن
}) {
  const sceneRef = useRef(null);

  // ✅ اسکیل کردن offset ها بر اساس عرض واقعی باکس (برای موبایل/تبلت)
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const BASE = 1024; // عرض مرجع (حدسی) برای offset های px
    const ro = new ResizeObserver((entries) => {
      const w = entries?.[0]?.contentRect?.width || BASE;
      const nk = Math.max(0.35, Math.min(1, w / BASE)); // بین 0.35 تا 1
      setK(nk);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data3 = useMemo(() => (items || []).slice(0, 3), [items]);

  // 4 وجه برای rotateX: 0,1,2,0
  const faces = useMemo(() => {
    const a = data3[0] || { name: "", slug: "" };
    const b = data3[1] || a;
    const c = data3[2] || a;
    return [a, b, c, a];
  }, [data3]);

  const [border, setBorder] = useState("#e5e7eb");
  const pickBorder = () =>
    accentColors[Math.floor(Math.random() * accentColors.length)] || "#e5e7eb";

  // عمق مناسب برای rotateX
  const z = Math.max(40, Math.round(height / 2));

  const imgTransform = (it) => {
    const ox = Number(it?.offsetX || 0) * k;
    const oy = Number(it?.offsetY || 0) * k;
    const scRaw = Number(it?.scale || 1);
    const sc = Number.isFinite(scRaw) ? Math.max(0.6, Math.min(2.4, scRaw)) : 1;

    // ✅ scale اول، بعد translate: جابجایی اسکیل نشه + ضد پرپر
    return `scale(${sc}) translate3d(${ox}px, ${oy}px, 0)`;
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        ref={sceneRef}
        className="rsp-scene w-full max-w-6xl"
        style={{
          height,
          ["--rsp-h"]: `${height}px`,
          ["--rsp-z"]: `${z}px`,
          ["--rsp-dur"]: `${durationSec}s`,
          ["--rsp-bg"]: bg,
          ["--rsp-bd"]: border,
          ["--rsp-pad"]: `${padding}px`,
        }}
        onMouseEnter={() => setBorder(pickBorder())}
        onMouseLeave={() => setBorder("#e5e7eb")}
      >
        {/* 3D prism */}
        <div className="rsp-prism" aria-label="Solutions rotating prism">
          {faces.map((it, idx) => {
            const href = it?.href ? String(it.href) : joinPath(hrefBase, it?.slug);
            const srcWebp = it?.logo || `/avatars/${it?.slug}.webp`;
            const srcPng = `/avatars/${it?.slug}.png`;

            return (
              <div
                key={`${it?.slug || it?.name || "x"}-${idx}`}
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

        {/* Reduce motion fallback (iOS/Accessibility) */}
        <div className="rsp-fallback" aria-hidden="true">
          {data3.map((it, idx) => {
            const href = it?.href ? String(it.href) : joinPath(hrefBase, it?.slug);
            const srcWebp = it?.logo || `/avatars/${it?.slug}.webp`;
            const srcPng = `/avatars/${it?.slug}.png`;

            return (
              <Link
                key={`${it?.slug || it?.name || "x"}-${idx}`}
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
                  style={{ transform: imgTransform(it) }}
                  onError={(e) => (e.currentTarget.src = srcPng)}
                  loading="lazy"
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
            transform: translateZ(0); /* ✅ کمک به رندر موبایل */
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
            transform: rotateX(calc(var(--rsp-i) * 90deg)) translateZ(var(--rsp-z));
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* ✅ اینجا مرکز واقعی + حاشیه امن */
          .rsp-link {
            position: absolute;
            inset: var(--rsp-pad);
            display: flex;
            align-items: center;  /* ✅ وسط عمودی */
            justify-content: center; /* ✅ وسط افقی */
            border-radius: 20px;
            text-decoration: none;
            box-sizing: border-box;
          }

          .rsp-link:focus-visible {
            outline: 3px solid rgba(20, 184, 166, 0.9);
            outline-offset: 4px;
          }

          .rsp-logo {
            display: block;
            margin: 0 auto;
            max-height: calc((var(--rsp-h) - (var(--rsp-pad) * 2)) * 0.72);
            max-width: 82%;
            object-fit: contain;
            object-position: center center;
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.18));
            transform-origin: center center;
            -webkit-transform: translateZ(0);
          }

          @keyframes rsp-spin {
            from {
              transform: rotateX(0deg);
            }
            to {
              transform: rotateX(-360deg);
            }
          }

          /* ✅ fallback هم باید دقیقاً وسط باشه */
          .rsp-fallback {
            display: none;
            position: absolute;
            inset: 0;
            padding: var(--rsp-pad);
            box-sizing: border-box;

            align-items: center;   /* ✅ وسط عمودی */
            justify-content: center; /* ✅ وسط افقی */
            gap: 12px;

            flex-wrap: wrap; /* موبایل: اگر جا نشد، wrap کن */
          }

          .rsp-fallbackItem {
            flex: 0 1 180px; /* ✅ هر کدوم حداقل منطقی */
            min-width: 140px;
            height: 100%;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
          }

          @media (max-width: 640px) {
            .rsp-logo {
              max-width: 92%;
              max-height: calc((var(--rsp-h) - (var(--rsp-pad) * 2)) * 0.78);
            }
            .rsp-fallbackItem {
              flex: 1 1 140px;
            }
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