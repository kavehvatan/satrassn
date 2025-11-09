export default function AI() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">هوش مصنوعی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-10 md:text-justify">
        آماده‌سازی داده، زیرساخت محاسباتی، MLOps و استقرار مدل‌ها برای کاربردهای بینش‌محور،
        بهینه‌سازی عملیات و توسعه راهکارهای AI/GenAI سازمانی.
      </p>
      <div className="flex justify-center">
        <img
          src="/avatars/services/ai.webp"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          alt="AI"
          className="w-48 h-48 rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}