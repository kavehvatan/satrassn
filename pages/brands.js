// pages/brands.js
import Link from "next/link";

function BrandCard({ name, slug }) {
  return (
    <Link
      href={`/products/${slug}`}
      className="bg-white border rounded-lg p-4 flex flex-col items-center gap-3 hover:shadow-md transition text-center"
    >
      <img
        src={`/avatars/${slug}.png`}
        alt={name}
        className="w-12 h-12 object-contain"
        onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
      />
      <span className="text-sm font-semibold">{name}</span>
    </Link>
  );
}

export default function Brands() {
  const items = [
    { name: "Dell EMC", slug: "dell" },
    { name: "Cisco", slug: "cisco" },
    { name: "HPE", slug: "hpe" },
    { name: "Lenovo", slug: "lenovo" },
    { name: "Commvault", slug: "commvault" },
    { name: "NetBackup", slug: "netbackup" },
  ];

  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">برندها</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {items.map((b) => (
            <BrandCard key={b.slug} name={b.name} slug={b.slug} />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-6">
          * نشان‌ها صرفاً برای اشاره به محصولات همان برند هستند.
        </p>
      </main>
      <footer className="bg-black text-white">
        <div className="container mx-auto p-6 text-center">
          <p>© {new Date().getFullYear()} ساتراس.</p>
        </div>
      </footer>
    </div>
  );
}