export default function VirtualDesktop() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">دسکتاپ مجازی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-10 md:text-justify">
        فراهم‌سازی محیط‌های VDI برای دسترسی امن، مقیاس‌پذیر و مدیریت‌پذیر به دسکتاپ‌ها و اپلیکیشن‌ها
        از هر مکان. بهینه‌سازی منابع، ساده‌سازی مدیریت نسخه‌ها و افزایش امنیت داده‌ها.
      </p>
      <div className="flex justify-center">
        <img
          src="/avatars/services/virtual-desktop.webp"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          alt="Virtual Desktop"
          className="w-48 h-48 rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}