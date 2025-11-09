export default function Operations() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center px-4">
      <h1 className="text-3xl font-bold mb-6">راهبری</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify">
        در سرویس راهبری (Managed Service) تمام امور مانند پچینگ، بکاپ‌وریفای، هاردنینگ،
        بررسی لاگ‌ها و رسیدگی به رخدادها طبق SLA مدیریت می‌شوند. گزارش‌های ماهانه شامل
        وضعیت سلامت، ظرفیت و ریسک نیز ارائه می‌شود.
      </p>

      <div className="flex justify-center mt-10">
        <img
          src="/avatars/operations.webp"
          alt="Operations Avatar"
          className="w-48 h-48 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}