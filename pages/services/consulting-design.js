export default function ConsultingDesign() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center px-4">
      <h1 className="text-3xl font-bold mb-6">مشاوره و طراحی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify">
        در این بخش ابتدا نیازسنجی و ظرفیت‌سنجی انجام می‌شود. سپس طراحی معماری با در نظر گرفتن
        HA/DR، TCO و رشد آتی صورت می‌گیرد. خروجی شامل دیاگرام، BOM و طرح مهاجرت خواهد بود.
      </p>

      <div className="flex justify-center mt-10">
        <img
          src="/avatars/consulting-design.webp"
          alt="Consulting & Design Avatar"
          className="w-48 h-48 rounded-full shadow-md object-cover"
        />
      </div>
    </div>
  );
}