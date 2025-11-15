// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

// --- Toast (اعلان درون‌صفحه‌ای)، بدون alert ---
function Toast({ notice, onClose }) {
  if (!notice) return null;
  const { type = "info", text = "" } = notice;
  const base =
    "fixed z-[60] top-6 left-1/2 -translate-x-1/2 rounded-xl px-4 py-3 shadow-lg text-sm md:text-base";
  const colors =
    type === "success"
      ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300"
      : type === "error"
      ? "bg-rose-100 text-rose-900 ring-1 ring-rose-300"
      : "bg-slate-100 text-slate-900 ring-1 ring-slate-300";
  return (
    <div className={`${base} ${colors}`}>
      <div className="flex items-center gap-3">
        <span>{text}</span>
        <button
          onClick={onClose}
          className="rounded-lg px-2 py-1 bg-white/50 hover:bg-white/70 transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// داده‌های اولیه
const VENDORS = ["Dell EMC", "HPE", "Cisco", "Lenovo", "Oracle", "Fujitsu", "Juniper", "Quantum"];

const MODELS_BY_VENDOR = {
  "Dell EMC": [
    "Unity XT 380",
    "Unity XT 480",
    "Unity XT 680",
    "Unity XT 880",
    "PowerStore 500T",
    "PowerStore 1200T",
    "PowerStore 3200T/Q",
    "PowerStore 5200T",
    "PowerStore 9200T",
  ],
  HPE: [
    "ProLiant DL360 Gen10",
    "ProLiant DL380 Gen10",
    "ProLiant DL380 Gen11",
    "ProLiant ML350",
  ],
  Cisco: ["UCS C220 M6", "UCS C240 M6", "Nexus 9K"],
  Lenovo: ["ThinkSystem SR650", "ThinkSystem SR630"],
  Oracle: ["Oracle DB Appliance X10"],
  Fujitsu: ["PRIMERGY RX2540"],
  Juniper: ["QFX5120"],
  Quantum: ["Scalar i6", "DXi V5000"],
};

// یادداشت‌ها ۱ تا ۱۰ سال
const NOTE_YEARS = Array.from({ length: 10 }, (_, i) => `${i + 1} سال`);

// کلید لوکال‌استوریج برای توکن
const TOKEN_KEY = "SAT_ADMIN_TOKEN";

export default function WarrantyAdmin() {
  const [token, setToken] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [notice, setNotice] = useState(null);

  // فرم افزودن
  const [vendor, setVendor] = useState(VENDORS[0]);
  const [model, setModel] = useState(MODELS_BY_VENDOR[VENDORS[0]][0]);
  const [serial, setSerial] = useState("");
  const [expireAt, setExpireAt] = useState(""); // yyyy-mm-dd
  const [status, setStatus] = useState("فعال");
  const [note, setNote] = useState(NOTE_YEARS[2]); // پیش‌فرض ۳ سال
  const [pendingRows, setPendingRows] = useState([]);

  // لیست مدل‌های وابسته به Vendor
  const modelOptions = useMemo(() => {
    const list = MODELS_BY_VENDOR[vendor] || [];
    // اگر مدلی قبلاً دستی اضافه شده، حفظ شود
    return Array.from(new Set([...(list || []), model || ""])).filter(Boolean);
  }, [vendor, model]);

  // بارگذاری توکن
  useEffect(() => {
    // fetch CSRF token on mount
    fetch("/api/csrf-token", { method: "GET", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.csrfToken) setCsrfToken(data.csrfToken);
      })
      .catch(() => {
        setCsrfToken("");
      });
  }, []);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY) || "";
    if (t) setToken(t);
  }, []);

  // وقتی vendor تغییر می‌کند، مدل اول همان vendor انتخاب شود
  useEffect(() => {
    const def = MODELS_BY_VENDOR[vendor]?.[0];
    if (def) setModel(def);
  }, [vendor]);

  // فانکشن نمایش Toast
  const toast = (text, type = "info", timeout = 2200) => {
    setNotice({ text, type });
    if (timeout) {
      setTimeout(() => setNotice(null), timeout);
    }
  };

  // ورود با توکن، بدون alert
  const handleLogin = async () => {
    const t = (tokenInput || "").trim();
    if (!t) {
      toast("توکن را وارد کنید.", "error");
      return;
    }
    try {
      // اگر API بررسی دارید، اینجا فراخوانی‌اش کنید؛ خطا هم داخل toast می‌آید.
      // const res = await fetch("/api/admin-check", { method: "POST", headers: { Authorization: `Bearer ${t}` }});
      // if (!res.ok) throw new Error("توکن صحیح نیست.");
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      setTokenInput("");
      toast("ورود انجام شد.", "success");
    } catch (e) {
      toast(e.message || "توکن صحیح نیست.", "error");
    }
  };

  // خروج
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    toast("خروج انجام شد.", "success");
  };

  // افزودن ردیف به لیست آماده ثبت
  const addRow = () => {
    if (!serial.trim()) return toast("سریال را وارد کنید.", "error");
    if (!expireAt) return toast("تاریخ پایان (ExpireAt) اجباری است.", "error");

    const row = {
      vendor,
      model,
      serial: serial.trim(),
      expireAt, // yyyy-mm-dd
      status,
      notes: note,
    };
    setPendingRows((p) => [row, ...p]);
    // پاک‌کردن فیلدها (اختیاری)
    setSerial("");
    // setExpireAt("");
    toast("ردیف افزوده شد.", "success");
  };

  // حذف ردیف از pending
  const removePending = (idx) => {
    setPendingRows((p) => p.filter((_, i) => i !== idx));
  };

  // ذخیره همه ردیف‌ها
  const handleSave = async () => {
    if (!token) {
      toast("ابتدا وارد شوید.", "error");
      return;
    }
    if (!pendingRows.length) {
      toast("ردیفی برای ثبت وجود ندارد.", "error");
      return;
    }
    try {
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ rows: pendingRows }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "خطا در ذخیره.");
      }
      setPendingRows([]);
      toast("ذخیره شد.", "success");
    } catch (e) {
      toast(e.message || "خطا در ذخیره.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-slate-900" dir="rtl">
      {/* Toast */}
      <Toast notice={notice} onClose={() => setNotice(null)} />

      {/* نوار ورود / خروج */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                توکن فعال است
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200"
              >
                خروج
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="password"
                className="w-64 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="توکن مدیر"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <button
                onClick={handleLogin}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                ورود
              </button>
            </div>
          )}
        </div>
      </div>

      {/* فرم افزودن ردیف */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 text-lg font-semibold">افزودن ردیف</div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Vendor */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">Vendor</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            >
              {VENDORS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Serial */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              * Serial
            </label>
            <input
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="مثال: HPE-9J1234"
            />
          </div>

          {/* Model */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            >
              {modelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* ExpireAt */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              * ExpireAt
            </label>
            <input
              type="date"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option>فعال</option>
              <option>منقضی</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm text-slate-600">Notes</label>
            <select
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            >
              {NOTE_YEARS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={addRow}
            className="rounded-xl bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
          >
            افزودن ردیف
          </button>
          <button
            onClick={() => {
              setVendor(VENDORS[0]);
              setModel(MODELS_BY_VENDOR[VENDORS[0]][0]);
              setSerial("");
              setExpireAt("");
              setStatus("فعال");
              setNote(NOTE_YEARS[2]);
              toast("فرم پاک شد.", "success");
            }}
            className="rounded-xl bg-slate-100 px-4 py-2 hover:bg-slate-200"
          >
            پاکسازی فرم
          </button>
        </div>
      </div>

      {/* جدول ردیف‌های آماده ثبت */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">ردیف‌های آماده ثبت</div>
          <button
            onClick={handleSave}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
          >
            ذخیره
          </button>
        </div>

        {pendingRows.length === 0 ? (
          <div className="text-slate-500">ردیفی اضافه نشده است.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-auto border-separate border-spacing-y-2">
              <thead>
                <tr className="text-right text-slate-500">
                  <th className="px-3 py-2">سریال</th>
                  <th className="px-3 py-2">برند</th>
                  <th className="px-3 py-2">مدل</th>
                  <th className="px-3 py-2">وضعیت</th>
                  <th className="px-3 py-2">تاریخ پایان</th>
                  <th className="px-3 py-2">یادداشت</th>
                  <th className="px-3 py-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {pendingRows.map((r, i) => (
                  <tr
                    key={`${r.serial}-${i}`}
                    className="rounded-xl bg-slate-50"
                  >
                    <td className="px-3 py-2">{r.serial}</td>
                    <td className="px-3 py-2">{r.vendor}</td>
                    <td className="px-3 py-2">{r.model}</td>
                    <td className="px-3 py-2">{r.status}</td>
                    <td className="px-3 py-2">{r.expireAt}</td>
                    <td className="px-3 py-2">{r.notes}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removePending(i)}
                        className="rounded-lg bg-rose-600 px-3 py-1 text-white hover:bg-rose-700"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}