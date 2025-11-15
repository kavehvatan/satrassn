import React from "react";

export default function UnityMidrangeSizerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">
          Unity Midrange Sizer
        </h1>
        <p className="text-sm md:text-base text-slate-600 mb-4">
          این ابزار برای سایزبندی سریع Unity XT / Midrange طراحی شده و خارج از
          دیتاشیت رسمی است؛ لطفاً همیشه نتایج را با مستندات DellEMC و تجربه
          خودت اعتبارسنجی کن.
        </p>

        <div className="w-full">
          <div className="relative w-full h-[75vh] md:h-[80vh] rounded-xl overflow-hidden border border-slate-200">
            <iframe
              src="/tools/unity-midrangesizer.html"
              title="Unity Midrange Sizer"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
