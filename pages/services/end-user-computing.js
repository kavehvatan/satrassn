export default function EndUserComputing() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">رایانش کاربر نهایی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-10 md:text-justify">
        استانداردسازی و مدیریت چرخه عمر دستگاه‌ها، ایمیج‌ها و اپلیکیشن‌ها برای تجربه‌ی کاربری یکپارچه
        و پایدار؛ با تمرکز بر امنیت، خودکارسازی و بهره‌وری.
      </p>
      <div className="flex justify-center">
        <img
          src="/avatars/services/end-user-computing.webp"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          alt="EUC"
          className="w-48 h-48 rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}