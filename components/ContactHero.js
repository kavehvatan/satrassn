// components/ContactHero.js
import Image from "next/image";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

const ContactHero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* پس‌زمینه مشکی با گرادیان لطیف */}
      <div className="absolute inset-0 bg-[#0b0b0b]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_80%_20%,rgba(20,184,166,0.15),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_80%,rgba(244,194,31,0.12),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* آواتار */}
          <div className="flex justify-center">
            <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px]">
              <Image
                src="/avatars/contact-operator.webp"
                alt="پشتیبان ساتراس با هدست"
                fill
                sizes="(max-width: 768px) 320px, 380px"
                className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                priority
              />
            </div>
          </div>

          {/* مانیتور شیشه‌ای با اطلاعات تماس */}
          <div className="relative">
            {/* بدنه مانیتور (کارت شیشه‌ای یکنواخت با یکی از رنگ‌های برند) */}
            <div
              className="rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl"
              style={{
                background: 
		"linear-gradient(180deg, rgba(244,194,31,0.14) 0%, rgba(244,194,31,0.14) 100%)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-2">
                تماس با ما
              </h1>
              <p className="text-gray-200/90 mb-6">
                از مشاوره تا اجرا و پشتیبانی کنار شما هستیم. سریع‌ترین راه‌های ارتباطی:
              </p>

              <ul className="space-y-4 text-gray-100">
                <li className="flex items-start gap-3">
                  {/* Map Pin */}
                  <svg width="22" height="22" viewBox="0 0 24 24" className="mt-1 shrink-0" fill={YELLOW}>
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/>
                  </svg>
                  <div>
                    <div className="font-semibold">نشانی</div>
                    <div className="text-gray-300">
                      ونک، ملاصدرا، شیراز جنوبی، خیابان وحدت، پلاک ۲، طبقه ۴
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  {/* Phone */}
                  <svg width="22" height="22" viewBox="0 0 24 24" className="mt-1 shrink-0" fill={TEAL}>
                    <path d="M6.6 10.8a15.3 15.3 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 4 .6.6 0 1 .4 1 .9V20c0 .6-.4 1-1 1C11.3 21 3 12.7 3 2.5 3 2 3.4 1.6 4 1.6h3.6c.5 0 .9.4.9 1 0 1.4.2 2.8.6 4 .1.4 0 .8-.3 1.1L6.6 10.8z"/>
                  </svg>
                  <div>
                    <div className="font-semibold">تلفن</div>
                    <a href="tel:+982188066022" className="text-gray-300 hover:text-white transition">
  <span dir="ltr" className="inline-block font-mono tabular-nums tracking-wide">
    +98 (21) 88066022
  </span>
</a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  {/* Mail */}
                  <svg width="22" height="22" viewBox="0 0 24 24" className="mt-1 shrink-0" fill="#ffffff">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12a2 2 0 0 0 2 2h16c1.1 0 2-.9 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
                  </svg>
                  <div>
                    <div className="font-semibold">ایمیل</div>
                    <a href="mailto:info@satrass.com" className="text-gray-300 hover:text-white transition">
                      info@satrass.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* پایه مانیتور */}
            <div className="mx-auto h-3 w-36 bg-white/10 rounded-b-xl mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;