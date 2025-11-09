export default function Install() {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center px-4">
      <h1 className="text-3xl font-bold mb-6">نصب و راه‌اندازی</h1>
      <p className="text-lg leading-8 text-gray-700 mb-12 text-justify">
        در این سرویس تمامی مراحل از پیش‌نیاز تا استیجینگ و کانفیگ استاندارد انجام می‌شود.
        ارتقای Firmware و هم‌ترازی با Best Practice نیز پوشش داده می‌شود. 
        در صورت نیاز مهاجرت بدون وقفه صورت می‌گیرد و در پایان، UAT و تحویل رسمی پروژه انجام خواهد شد.
      </p>

      <div className="flex justify-center mt-10">
        <img
          src="/avatars/install.webp"
          alt="Install Avatar"
          className="w-[300px] h-auto shadow-md object-cover"
        />
      </div>
    </div>
  );
}