// pages/solutions/[vendor].js
import Link from "next/link";
import { useRouter } from "next/router";

const SOLUTIONS = {
  commvault: {
    name: "Commvault",
    logo: "/avatars/commvault.png",
    items: [
      { title: "Complete Backup & Recovery", img: "/products/commvault/complete.png", desc: "پلتفرم بکاپ/ریکاوری سازمانی با Dedup و Cloud Tiering." },
      { title: "Hyperscale X", img: "/products/commvault/hsx.png", desc: "هایپر-اسکیل برای حفاظت مدرن از داده؛ Scale-out." },
      { title: "Metallic SaaS", img: "/products/commvault/metallic.png", desc: "بکاپ SaaS برای Microsoft 365، Salesforce و Endpointها." },
    ],
  },
  netbackup: {
    name: "NetBackup",
    logo: "/avatars/netbackup.png",
    items: [
      { title: "NetBackup Appliance 5250", img: "/products/netbackup/5250.png", desc: "اپلاینس بکاپ یکپارچه با Dedup کارآمد." },
      { title: "NetBackup Flex", img: "/products/netbackup/flex.png", desc: "زیرساخت ماژولار برای سرویس‌دهی چندسازمانی." },
      { title: "NetBackup for VMware/DB", img: "/products/netbackup/vmw-db.png", desc: "پشتیبانی عمیق از VM و دیتابیس‌های اصلی." },
    ],
  },
};

export default function SolutionVendor() {
  const { query } = useRouter();
  const slug = String(query.vendor || "");
  const vendor = SOLUTIONS[slug];

  if (!vendor) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <p className="text-red-600 font-semibold mb-4">راهکاری با این نام پیدا نشد.</p>
        <Link href="/" className="text-amber-600 underline">بازگشت به صفحهٔ اصلی</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-10">
      {/* Header vendor */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={vendor.logo}
          alt={vendor.name}
          className="w-12 h-12 object-contain"
          onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
        />
        <h1 className="text-3xl font-extrabold">{vendor.name} — راهکارها</h1>
      </div>

      {/* Items */}
      <div className="space-y-6">
        {vendor.items.map((p, i) => (
          <article key={i} className="flex items-center gap-5 border rounded-2xl p-5 bg-white hover:shadow-md transition">
            <img
              src={p.img}
              alt={p.title}
              className="w-24 h-24 object-contain shrink-0"
              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
            />
            <div className="grow">
              <h2 className="text-xl font-bold">{p.title}</h2>
              <p className="text-gray-600 mt-1 leading-7">{p.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/#solutions" className="inline-block text-amber-600 font-semibold">← بازگشت به راهکارها</Link>
      </div>
    </main>
  );
}














