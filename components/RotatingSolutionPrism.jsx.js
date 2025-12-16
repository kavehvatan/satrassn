import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function RotatingSolutionPrism({
  items,
  hrefBase = "/solutions",        // لینک هر وجه: /solutions/{slug}
  height = 160,
  durationSec = 14,
  z = 230,                        // عمق 3D (کم/زیادش کن اگر لازم شد)
  bg = "rgba(244,194,31,0.6)",     // مثل کارت‌های فعلی
  accentColors = ["#14b8a6", "#f4c21f"],
  className = "",
}) {
  const data = useMemo(() => (items || []).slice(0, 3), [items]);
  const [border, setBorder] = useState("#e5e7eb");

  const pickBorder = () =>
    accentColors[Math.floor(Math.random() * accentColors.length)] || "#e5e7eb";

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
        <div className="rsp-prism" aria-label="Solutions rotating prism">
          {data.map((it, idx) => {
            const href = it.href || `${hrefBase}/${it.slug}`;
            const srcWebp = it.logo || `/avatars/${it.slug}.webp`;
            const srcPng = `/avatars/${it.slug}.png`;
            return (
              <div key={it.slug || it.name || idx} className="rsp-face" style={{ ["--rsp-i"]: idx }}>
                <Link href={href} className="rsp-link" aria-label={it.name} title={it.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={srcWebp}
                    alt={it.name}
                    className="rsp-logo"
                    onError={(e) => (e.currentTarget.src = srcPng)}
                    loading="lazy"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Reduce motion fallback */}
        <div className="rsp-fallback">
          {data.map((it, idx) => {
            const href = it.href || `${hrefBase}/${it.slug}`;
            const srcWebp = it.logo || `/avatars/${it.slug}.webp`;
            const srcPng = `/avatars/${it.slug}.png`;
            return (
              <Link
                key={it.slug || it.name || idx}
                href={href}
                className="rsp-fallbackItem"
                aria-label={it.name}
                title={it.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcWebp}
                  alt={it.name}
                  className="rsp-logo"
                  onError={(e) => (e.currentTarget.src = srcPng)}
                  loading="lazy"
                />
              </Link>
            );
          })}
        </div>

        <style jsx>{`
          .rsp-scene {
            position: relative;
            perspective: 1200px;
          }

          /* روی هاور مکث کند که کلیک راحت باشد */
          .rsp-scene:hover .rsp-prism {
            animation-play-state: paused;
          }

          .rsp-prism {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            animation: rsp-spin var(--rsp-dur) linear infinite;
          }

          .rsp-face {
            position: absolute;
            inset: 0;
            border-radius: 24px;

            background: var(--rsp-bg);
            border: 1px solid var(--rsp-bd);
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);

            backface-visibility: hidden;

            /* 3 وجه: 0 / 120 / 240 */
            transform: rotateY(calc(var(--rsp-i) * 120deg)) translateZ(var(--rsp-z));
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
            transition: transform 180ms ease;
          }

          .rsp-scene:hover .rsp-logo {
            transform: scale(1.04) translateY(-2px);
          }

          @keyframes rsp-spin {
            from {
              transform: rotateY(0deg);
            }
            to {
              transform: rotateY(-360deg);
            }
          }

          /* fallback */
          .rsp-fallback {
            display: none;
            position: absolute;
            inset: 0;
            gap: 12px;
          }
          .rsp-fallbackItem {
            flex: 1;
            border-radius: 24px;
            background: var(--rsp-bg);
            border: 1px solid var(--rsp-bd);
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
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