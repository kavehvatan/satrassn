import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Sitemap */}
        <nav aria-label="نقشه سایت" className="mb-3">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85">
            <li><Link href="/">صفحه اصلی</Link></li>
            <li><Link href="/#vendors">تجهیزات</Link></li>
            <li><Link href="/#solutions">خدمات و راهکارها</Link></li>
            <li><Link href="/tools">ابزارها</Link></li>
            <li><Link href="/warranty">استعلام گارانتی</Link></li>
            <li><Link href="/contact">تماس با ما</Link></li>
          </ul>
        </nav>

        {/* Copy */}
        <p className="text-center text-white/90 text-sm">
          © {new Date().getFullYear()} ساتراس — همه حقوق محفوظ است
        </p>
      </div>
    </footer>
  );
}