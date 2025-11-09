// pages/index.js
import Link from "next/link";
import { useState } from "react";

const LOGO_COLORS = ["#14b8a6", "#f4c21f"]; // teal & yellow

function BrandCard({ name, slug }) {
  const [border, setBorder] = useState("#e5e7eb");

  return (
    <Link
      href={`/products/${slug}`}
      onMouseEnter={() => setBorder(LOGO_COLORS[Math.floor(Math.random()*LOGO_COLORS.length)])}
      onMouseLeave={() => setBorder("#e5e7eb")}
      className="flex items-center justify-center gap-4 p-5 bg-white border rounded-lg
                 hover:shadow-md transition text-center w-full max-w-[520px] mx-auto"
      style={{ borderColor: border }}
    >
      <img
        src={`/avatars/${slug}.png`}
        alt={name}
        className="w-10 h-10 object-contain"
        onError={(e)=>e.currentTarget.src="/avatars/default.png"}
      />
      <div className="font-bold text-gray-900">{name}</div>
    </Link>
  );
}

export default function Home() {
  const brands = [
    { name: "Dell EMC", slug: "dell" },
    { name: "Cisco", slug: "cisco" },
    { name: "Commvault", slug: "commvault" },
    { name: "NetBackup", slug: "netbackup" },
    // { name: "HPE", slug: "hpe" }, // اگر لوگوش رو گذاشتی اضافه کن
  ];

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، کنار شماییم.</p>
            <div className="mt-6 flex gap-3">
              <a href="/contact" className="rounded-full px-5 py-2.5 font-bold bg-amber-400 text-black hover:bg-amber-300 transition">مشاوره رایگان</a>
              <a href="/tools" className="rounded-full px-5 py-2.5 font-semibold border border-amber-400 text-amber-400 hover:bg-amber-400/10 transition">مشاهده ابزارها</a>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/satrass-hero.png" alt="آواتار ساتراس" className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
   <section id="products" className="max-w-6xl mx-auto px-4 py-10 border-t border-black/10">
  <h2 className="text-2xl font-bold mb-6">محصولات</h2>

  {/* فقط این کلاس رو اضافه کن */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
    {brands.map((b) => (<BrandCard key={b.slug} {...b} />))}
  </div>
</section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">تماس با ما</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <form className="space-y-4">
            <input type="text" placeholder="نام" className="w-full p-2 border rounded" />
            <input type="email" placeholder="ایمیل" className="w-full p-2 border rounded" />
            <textarea placeholder="پیام شما" className="w-full p-2 border rounded h-28"></textarea>
            <button className="rounded px-4 py-2 font-semibold bg-amber-400 text-black hover:bg-amber-300 transition">ارسال پیام</button>
          </form>
          <div className="text-gray-700">
            <p>آدرس: تهران، میدان فاطمی، خیابان گلها، پلاک ۲۵</p>
            <p>تلفن: ۰۲۱-۸۸۰۶۶۲۲۱</p>
            <p>ایمیل: info@satrass.com</p>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p>© {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است</p>
        </div>
      </footer>
    </main>
  );
}