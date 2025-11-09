export default function Monitoring() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center px-4">
      <h1 className="text-3xl font-bold mb-6">پایش</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify">
        پایش مداوم زیرساخت‌های ذخیره‌سازی و شبکه نقش مهمی در پیشگیری از خرابی‌ها و کاهش زمان
        قطعی دارد. تیم ما با ابزارهای پیشرفته وضعیت سیستم‌ها را بررسی کرده و مشکلات احتمالی
        را قبل از بروز بحران رفع می‌کند.
      </p>

      <div className="flex justify-center mt-10">
        <img
          src="/avatars/monitoring.webp"
          alt="Monitoring Avatar"
          className="w-48 h-48 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}