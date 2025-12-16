import Link from "next/link";
import React, { useMemo } from "react";

export default function RotatingBrandBox({
  items,
  height = 190,
  durationSec = 14,
  z = 220,
  className = "",
}) {
  const data = useMemo(
    () =>
      items?.length
        ? items
        : [
            { name: "Veeam", logoSrc: "/avatars/veeam.webp", href: "/solutions/veeam" },
            { name: "Veritas", logoSrc: "/avatars/veritas.webp", href: "/solutions/veritas" },
            { name: "Commvault", logoSrc: "/avatars/commvault.webp", href: "/solutions/commvault" },
          ],
    [items]
  );

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        className="rbx-scene w-full max-w-6xl"
        style={{
          height,
          ["--rbx-h"]: `${height}px`,
          ["--rbx-z"]: `${z}px`,
          ["--rbx-dur"]: `${durationSec}s`,
        }}
      >
        <div className="rbx-prism" aria-label="Rotating brand showcase">
          {data.slice(0, 3).map((it, idx) => (
            <div key={it.name} className="rbx-face" style={{ ["--rbx-i"]: idx }}>
              <Link
                href={it.href || "#"}
                className="rbx-link"
                aria-label={it.name}
                title={it.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.logoSrc} alt={it.name} className="rbx-logo" loading="lazy" />
              </Link>
            </div>
          ))}
        </div>

        <style jsx>{`
          .rbx-scene {
            position: relative;
            perspective: 1200px;
          }

          /* وقتی موس میره روش، بچرخه ولی مکث کنه که کلیک راحت شه */
          .rbx-scene:hover .rbx-prism {
            animation-play-state: paused;
          }

          .rbx-prism {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            animation: rbx-spin var(--rbx-dur) linear infinite;
          }

          .rbx-face {
            position: absolute;
            inset: 0;
            border-radius: 24px;

            background: rgba(244, 194, 31, 0.55);
            box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
            border: 2px solid rgba(20, 184, 166, 0.55);

            backface-visibility: hidden;
            transform: rotateY(calc(var(--rbx-i) * 120deg)) translateZ(var(--rbx-z));
          }

          .rbx-link {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 24px;
            text-decoration: none;
          }

          .rbx-link:focus-visible {
            outline: 3px solid rgba(20, 184, 166, 0.9);
            outline-offset: 4px;
          }

          .rbx-logo {
            max-height: calc(var(--rbx-h) * 0.36);
            max-width: 60%;
            object-fit: contain;
            filter: drop-shadow(0 8px 14px rgba(2, 6, 23, 0.14));
          }

          @keyframes rbx-spin {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(-360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}