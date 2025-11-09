export default function VirtualizationCloud() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">مجازی‌سازی و ابر</h1>
      <p className="text-lg leading-8 text-gray-700 mb-10 md:text-justify">
        طراحی و پیاده‌سازی زیرساخت‌های مجازی‌سازی و ترکیبی (Hybrid Cloud) برای چابکی بیشتر،
        کاهش هزینه و مقیاس‌پذیری؛ همراه با سیاست‌های امنیتی و نظارتی یکپارچه.
      </p>
      <div className="flex justify-center">
        <img
          src="/avatars/services/virtualization-cloud.webp"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          alt="Virtualization & Cloud"
          className="w-48 h-48 rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}