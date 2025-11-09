// pages/services/index.js
import { useState } from "react";
import services from "../../data/services.json";

// همان ServiceCard صفحهٔ اصلی برای یکدستی UI
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

function GlassModal({ open, onClose, title, paragraphs }) {
  const [closing, setClosing] = useState(false);
  if (!open) return null;
  const paras = (paragraphs || []).filter(Boolean);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose?.(); }, 200);
  };
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <article
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[min(92vw,760px)] mx-auto rounded-2xl overflow-hidden transform transition-all duration-200 ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl bg-white/45 supports-[backdrop-filter]:bg-white/40 backdrop-blur-2xl ring-1 ring-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,.45)]">
          <div className="p-6 md:p-8 text-gray-900">
            <div className="flex items-start justify-between gap-6">
              <h4 className="text-xl md:text-2xl font-extrabold">{title}</h4>
              <button onClick={handleClose} aria-label="بستن" className="text-gray-800 hover:text-black transition text-2xl leading-none">×</button>
            </div>
            {paras.map((tx, i) => (
              <p key={i} className={`leading-8 ${i === 0 ? "mt-4" : "mt-3"} text-gray-900/95`}>{tx}</p>
            ))}
            <div className="mt-6 flex justify-end">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-black/10 bg-white/30 hover:bg-white/40 transition">بستن</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function ServiceCard({ title, desc1, desc2, icon, index = 0 }) {
  const [open, setOpen] = useState(false);
  const isTeal = index % 2 === 0;
  const bg = isTeal ? "rgba(20,184,166,0.7)" : "rgba(244,194,31,0.7)";
  const fg = isTeal ? "#fff" : "#000";
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 p-5 border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: "#e5e7eb", background: bg, color: fg }}
      >
        {icon ? (
          <img
            src={icon}
            onError={(e)=>{ e.currentTarget.style.display="none"; }}
            alt=""
            className="w-10 h-10 object-contain"
          />
        ) : null}
        <span className="font-semibold">{title}</span>
      </div>
      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        paragraphs={[desc1, desc2]}
      />
    </>
  );
}

export default function ServicesPage() {
  const items = Array.isArray(services?.items) ? services.items : [];
  return (
    <main className="min-h-screen font-sans">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold mb-6 text-slate-900">خدمات</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {items.map((s, i) => (
            <ServiceCard
              key={s.href || s.title || i}
              title={s.title}
              desc1={s.desc}
              desc2={s.desc2}
              icon={s.icon}
              index={i}
            />
          ))}
        </div>
      </section>
    </main>
  );
}