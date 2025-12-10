// pages/downloads.js
import { useEffect, useState } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// جابه‌جایی نوبتی رنگ دکمه‌ها (مشابه صفحهٔ اول)
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW); // Filled
  const [secondary, setSecondary] = useState(TEAL); // Outlined

  useEffect(() => {
    try {
      const last = localStorage.getItem("satrass_btn_pair") === "1";
      const next = !last;
      localStorage.setItem("satrass_btn_pair", next ? "1" : "0");
      if (next) {
        setPrimary(TEAL);
        setSecondary(YELLOW);
      } else {
        setPrimary(YELLOW);
        setSecondary(TEAL);
      }
    } catch {
      // ignore
    }
  }, []);

  const swap = () => {
    setPrimary((p) => {
      const np = p === TEAL ? YELLOW : TEAL;
      const ns = np === TEAL ? YELLOW : TEAL;
      setSecondary(ns);
      try {
        localStorage.setItem("satrass_btn_pair", np === TEAL ? "1" : "0");
      } catch {
        // ignore
      }
      return np;
    });
  };

  return { primary, secondary, swap };
}

/* ======================= داده‌های نسخه‌ها ======================= */

const POWERSTORE_OS_VERSIONS = [
  {
    id: "ps-4.3.0.0",
    product: "PowerStoreOS",
    version: "4.3.0.0",
    build: "2611831",
    releaseDate: "2 Dec 2025",
    notes: "",
  },
  {
    id: "ps-4.2.0.1",
    product: "PowerStoreOS",
    version: "4.2.0.1",
    build: "2594695",
    releaseDate: "28 Oct 2025",
    notes: "",
  },
  {
    id: "ps-4.2.0.0-b2577950",
    product: "PowerStoreOS",
    version: "4.2.0.0",
    build: "2577950",
    releaseDate: "-",
    notes: "",
  },
  {
    id: "ps-4.2.0.0-b2563584",
    product: "PowerStoreOS",
    version: "4.2.0.0",
    build: "2563584",
    releaseDate: "3 Sep 2025",
    notes: "",
  },
];

const UNITY_OE_VERSIONS = [
  {
    id: "unity-5.5.2.0.5.014",
    product: "Unity OE",
    version: "5.5.2.0.5.014",
    releaseDate: "Oct 29, 2025",
    target: "Recommended code (Target)",
    notes: "5.5 SP2",
  },
  {
    id: "unity-5.5.1.0.5.025",
    product: "Unity OE",
    version: "5.5.1.0.5.025",
    releaseDate: "Jul 31, 2025",
    target: "Recommended code (Target)",
    notes: "5.5 SP1",
  },
  {
    id: "unity-5.5.0.0.5.259",
    product: "Unity OE",
    version: "5.5.0.0.5.259",
    releaseDate: "Mar 26, 2025",
    target: "Minor Release – See Note 3",
    notes: "",
  },
  {
    id: "unity-5.4.1.0.5.006",
    product: "Unity OE",
    version: "5.4.1.0.5.006",
    releaseDate: "Dec 12, 2024",
    target: "Jun 09, 2025 → present",
    notes: "5.4 SP1 (Version shipping from Manufacturing)",
  },
];

const PRODUCTS = {
  powerstore: {
    key: "powerstore",
    label: "PowerStoreOS",
    subtitle: "انتخاب نسخه سیستم‌عامل PowerStore",
    versions: POWERSTORE_OS_VERSIONS,
  },
  unity: {
    key: "unity",
    label: "Unity OE",
    subtitle: "انتخاب نسخه Unity OE برای Unity XT",
    versions: UNITY_OE_VERSIONS,
  },
};

// تولید سوال کپچا (جمع دو عدد ساده)
function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2; // 2..9
  const b = Math.floor(Math.random() * 8) + 1; // 1..8
  return { a, b, answer: a + b };
}

/* ======================= صفحه دانلود / درخواست Firmware ======================= */

export default function DownloadsPage() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  const [productKey, setProductKey] = useState("powerstore");

  const currentProduct = PRODUCTS[productKey];
  const [selectedVersionId, setSelectedVersionId] = useState(
    currentProduct.versions[0].id,
  );

  const [nameOrOrg, setNameOrOrg] = useState("");
  const [phone, setPhone] = useState("");

  // captcha state
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // وقتی محصول عوض می‌شود، نسخه پیش‌فرض همان محصول را انتخاب کن
    setSelectedVersionId(PRODUCTS[productKey].versions[0].id);
  }, [productKey]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameOrOrg.trim() || !phone.trim()) {
      alert("لطفاً نام/سازمان و شماره تماس را وارد کنید.");
      return;
    }

    // چک کردن کپچا
    if (Number(captchaInput) !== captcha.answer) {
      alert("پاسخ سوال امنیتی اشتباه است. لطفاً دوباره تلاش کنید.");
      refreshCaptcha();
      return;
    }

    const versionObj = currentProduct.versions.find(
      (v) => v.id === selectedVersionId,
    );

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/firmware-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: currentProduct.label,
          version: versionObj?.version,
          build: versionObj?.build || "",
          target: versionObj?.target || "",
          nameOrOrg,
          phone,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert(
        "درخواست شما ثبت شد ✅\nبه زودی لینک دانلود برای شما ارسال خواهد شد.",
      );

      // اگر خواستی فرم بعد از ثبت خالی شود:
      setNameOrOrg("");
      setPhone("");
      setCaptchaInput("");
      refreshCaptcha();
      swap(); // برای جابه‌جایی رنگ دکمه
    } catch (err) {
      console.error(err);
      alert("در ثبت درخواست مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeVersion = currentProduct.versions.find(
    (v) => v.id === selectedVersionId,
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right font-sans">
      {/* هدر تیره مشابه ابزارها */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>درخواست Firmware / OS</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            انتخاب نسخهٔ مناسب PowerStoreOS و Unity OE و ثبت درخواست برای
            دریافت لینک دانلود
          </p>
        </div>
      </section>

      {/* محتوای اصلی */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-10">
        {/* انتخاب محصول */}
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            ۱. انتخاب محصول
          </h2>
          <p className="text-sm text-slate-600">
            ابتدا مشخص کنید برای کدام محصول قصد دریافت Firmware / OS دارید:
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.values(PRODUCTS).map((p) => {
              const active = p.key === productKey;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setProductKey(p.key)}
                  className={`px-4 py-2 rounded-full text-sm md:text-base font-bold border transition ${
                    active
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  style={
                    active
                      ? { borderColor: TEAL }
                      : { borderColor: "rgba(148,163,184,0.6)" }
                  }
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* انتخاب نسخه */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 mb-8">
          <h2 className="text-lg md:text-xl font-bold mb-2">
            ۲. {currentProduct.subtitle}
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            از لیست زیر نسخهٔ مورد نظر خود را انتخاب کنید. برای انتخاب نسخه
            پیشنهادی، می‌توانید از ستون‌ها و توضیحات جدول کمک بگیرید.
          </p>

          {/* Select نسخه */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              انتخاب نسخه
            </label>
            <select
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              className="w-full md:w-80 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] bg-white"
            >
              {currentProduct.versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {currentProduct.label} {v.version}
                  {v.build ? `  (Build ${v.build})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* جزئیات نسخه انتخاب‌شده */}
          {activeVersion && (
            <div className="overflow-x-auto mt-2" dir="ltr">
              <table className="min-w-full text-xs md:text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#0f4fa8] text-white">
                    <th className="px-3 py-2 text-left font-semibold">
                      {currentProduct.label}
                    </th>
                    {activeVersion.build && (
                      <th className="px-3 py-2 text-left font-semibold">
                        Build
                      </th>
                    )}
                    <th className="px-3 py-2 text-left font-semibold">
                      Release Date
                    </th>
                    {activeVersion.target && (
                      <th className="px-3 py-2 text-left font-semibold">
                        Recommended / Target
                      </th>
                    )}
                    {activeVersion.notes && (
                      <th className="px-3 py-2 text-left font-semibold">
                        Notes
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white text-slate-800">
                    <td className="px-3 py-2 border-t border-slate-200">
                      {activeVersion.version}
                    </td>
                    {activeVersion.build && (
                      <td className="px-3 py-2 border-t border-slate-200">
                        {activeVersion.build}
                      </td>
                    )}
                    <td className="px-3 py-2 border-t border-slate-200">
                      {activeVersion.releaseDate || "-"}
                    </td>
                    {activeVersion.target && (
                      <td className="px-3 py-2 border-t border-slate-200">
                        {activeVersion.target}
                      </td>
                    )}
                    {activeVersion.notes && (
                      <td className="px-3 py-2 border-t border-slate-200">
                        {activeVersion.notes}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-[11px] md:text-xs text-slate-500 leading-relaxed">
            * تمامی نسخ از سایت رسمی DELL دانلود شده است.
          </p>
        </div>

        {/* فرم اطلاعات تماس */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6"
        >
          <h2 className="text-lg md:text-xl font-bold mb-2">
            ۳. ثبت اطلاعات برای دریافت اتوماتیک لینک
          </h2>
          <p className="text-sm text-slate-600 mb-5">
            پس از ثبت این فرم، لینک دانلود برای شما ارسال خواهد شد.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                نام  / سازمان
              </label>
              <input
                type="text"
                value={nameOrOrg}
                onChange={(e) => setNameOrOrg(e.target.value)}
                placeholder="مثلاً: بابک باقری – شرکت ساتراس"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                شماره تماس برای دریافت لینک دانلود
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912XXXXXXX"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] bg-white"
              />
            </div>
          </div>

          {/* سوال امنیتی (کپچا ساده) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              سوال امنیتی 
            </label>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-2 bg-slate-100 rounded-lg">
                {captcha.a} + {captcha.b} = ؟
              </span>
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-[#14b8a6] bg-white"
                placeholder="پاسخ"
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="px-3 py-2 rounded-full border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 transition"
              >
                سوال جدید
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-full px-6 py-2.5 text-sm md:text-base font-bold transition inline-flex items-center justify-center ${
              isSubmitting ? "opacity-70 cursor-wait" : ""
            }`}
            style={{
              backgroundColor: primary,
              color: primaryIsYellow ? "#000" : "#fff",
              border: `1px solid ${secondary}`,
            }}
          >
            {isSubmitting ? "در حال ثبت..." : "ثبت درخواست دریافت لینک"}
          </button>
        </form>
      </section>
    </main>
  );
}