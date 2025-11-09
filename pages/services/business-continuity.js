export default function BusinessContinuity() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">تداوم کسب‌وکار</h1>
      <p className="text-lg leading-8 text-gray-700 mb-10 md:text-justify">
        استراتژی‌های BCDR شامل پالیسی‌های بکاپ، ریکاوری، تست‌های دوره‌ای و سناریوهای DR برای
        حداقل‌سازی RTO/RPO و حفظ سرویس در شرایط بحران.
      </p>
      <div className="flex justify-center">
        <img
          src="/avatars/services/business-continuity.webp"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          alt="Business Continuity"
          className="w-48 h-48 rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}