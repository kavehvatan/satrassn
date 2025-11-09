// pages/services/[slug].js
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

export async function getStaticPaths() {
  const file = path.join(process.cwd(), "data", "services.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const paths = Object.keys(data).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false }; // فقط همین اسلاگ‌هایی که تو JSON هستن
}

export async function getStaticProps({ params }) {
  const file = path.join(process.cwd(), "data", "services.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return { props: { svc: data[params.slug] || null } };
}

export default function ServicePage({ svc }) {
  if (!svc) return null;
  return (
    <>
      <Head><title>{svc.title} — ساتراس</title></Head>
      <main className="min-h-screen">
        {/* هِرو جمع‌وجور */}
        <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <nav className="text-sm text-white/70 mb-3">
              <Link href="/" className="hover:text-white/90">خانه</Link>
              <span className="mx-2">/</span>
              <span className="text-white/90">خدمات</span>
              <span className="mx-2">/</span>
              <span className="text-white">{svc.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold">{svc.title}</h1>
            <p className="mt-3 text-gray-300 max-w-3xl leading-7">{svc.intro}</p>
          </div>
        </section>

        {/* کارت‌های تجهیزات/Specsheet */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          {(!svc.items || svc.items.length === 0) ? (
            <div className="rounded-xl border p-6 text-gray-600">
              هنوز آیتمی برای این خدمت ثبت نشده. از
              <code className="bg-gray-100 px-1 mx-1 rounded">data/services.json</code>
              اضافه‌اش کن.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {svc.items.map((it, idx) => (
                <article key={idx} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  {it.image && (
                    <img
                      src={it.image}
                      alt={`${it.vendor} ${it.model}`}
                      className="w-full h-36 object-contain mb-3"
                    />
                  )}
                  <div className="text-sm text-gray-500">{it.vendor}</div>
                  <h3 className="text-lg font-bold text-gray-900">{it.model}</h3>
                  <p className="mt-2 text-gray-700 leading-7">{it.desc}</p>
                  <div className="mt-4 flex gap-3">
                    {it.specsheet && (
                      <a
                        href={it.specsheet}
                        className="rounded-full px-4 py-2 text-sm font-semibold border border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 transition"
                        target="_blank" rel="noopener noreferrer"
                      >
                        Specsheet
                      </a>
                    )}
                    <a
                      href="/contact"
                      className="rounded-full px-4 py-2 text-sm font-bold bg-[#f4c21f] text-black hover:bg-[#f4c21f]/90 transition"
                    >
                      درخواست مشاوره
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}