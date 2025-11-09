export default function Training() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center px-4">
      <h1 className="text-3xl font-bold mb-6">آموزش</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify">
        آموزش‌های ما بر اساس سناریوهای واقعی طراحی شده‌اند. 
        انتقال دانش شامل راهبری، عیب‌یابی (Troubleshooting) و استفاده از Lab و Runbook اختصاصی است.
        همچنین پس از پایان دوره، پشتیبانی پرسش‌وپاسخ و به‌روزرسانی جزوات نیز ارائه می‌شود.
      </p>

      <div className="flex justify-center mt-10">
        <img
          src="/avatars/training.webp"
          alt="Training Avatar"
          className="w-48 h-48 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}