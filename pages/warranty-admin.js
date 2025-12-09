// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

// کلید ذخیره توکن در مرورگر
const TOKEN_KEY = "satrass_admin_token";

/* ----------------------- Toast ساده درون صفحه ----------------------- */
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
          className="rounded-full px-2 py-0.5 text-xs hover:bg-black/5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* -------------------------- صفحه ادمین گارانتی ------------------------- */
export default function WarrantyAdminPage() {
  const [token, setToken] = useState(""); // توکن فعال
  const [tokenInput, setTokenInput] = useState(""); // توکن داخل input
  const [loadingToken, setLoadingToken] = useState(false);

  const [rows, setRows] = useState([]); // ردیف‌های در انتظار ذخیره
  const [vendor, setVendor] = useState("Dell EMC");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [status, setStatus] = useState("فعال");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const toast = (text, type = "info", timeout = 4000) => {
    setNotice({ text, type });
    if (timeout) {
      setTimeout(() => setNotice(null), timeout);
    }
  };

  /* ------------------- تلاش برای لاگین خودکار با توکن قبلی ------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;

    (async () => {
      try {
        const res = await fetch("/api/admin-check", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stored}`,
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          // توکن قبلی دیگر معتبر نیست
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          return;
        }
        // توکن معتبر است
        setToken(stored);
        toast("توکن فعال است.", "success");
      } catch {
        // خطای شبکه: سکوت می‌کنیم، ولی وارد شده فرض نمی‌کنیم
      }
    })();
  }, []);

  /* ----------------------------- ورود با توکن ----------------------------- */
  const handleLogin = async () => {
    const t = (tokenInput || "").trim();
    if (!t) {
      toast("توکن را وارد کنید.", "error");
      return;
    }

    setLoadingToken(true);
    try {
      const res = await fetch("/api/admin-check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${t}`,
        },
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "توکن صحیح نیست.");
      }

      // توکن درست است
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, t);
      }
      setToken(t);
      setTokenInput("");
      toast("توکن فعال است.", "success");
    } catch (e) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
      }
      setToken("");
      toast(e.message || "توکن صحیح نیست.", "error");
    } finally {
      setLoadingToken(false);
    }
  };

  /* ------------------------------- خروج ادمین ------------------------------ */
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken("");
    setTokenInput("");
    setRows([]);
    toast("خارج شدید.", "success");
  };

  /* -------------------------- افزودن ردیف جدید محلی ------------------------- */
  const handleAddRow = () => {
    if (!serial.trim()) {
      toast("سریال را وارد کنید.", "error");
      return;
    }
    if (!expireAt.trim()) {
      toast("تاریخ پایان گارانتی را وارد کنید.", "error");
      return;
    }

    const newRow = {
      vendor: vendor.trim() || "",
      model: model.trim() || "",
      serial: serial.trim(),
      expireAt: expireAt.trim(),
      status: status.trim() || "فعال",
      notes: notes.trim() || "",
    };

    setRows((prev) => [...prev, newRow]);
    setSerial("");
    setExpireAt("");
    setNotes("");
    toast("ردیف به لیست در انتظار ذخیره افزوده شد.", "success");
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  /* ----------------------------- ذخیره در سرور ----------------------------- */
  const handleSave = async () => {
    if (!token) {
      toast("ابتدا با توکن معتبر وارد شوید.", "error");
      return;
    }
    if (!rows.length) {
      toast("هیچ ردیفی برای ذخیره وجود ندارد.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rows }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "خطا در ذخیره‌سازی");
      }

      toast(
        `ذخیره شد. ردیف‌های ارسال‌شده: ${data.saved ?? rows.length}${
          data.total ? ` / مجموع رکوردها: ${data.total}` : ""
        }`,
        "success"
      );
      setRows([]);
    } catch (e) {
      toast(e.message || "خطا در ذخیره‌سازی", "error");
    } finally {
      setSaving(false);
    }
  };

  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  /* --------------------------------- UI --------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Toast notice={notice} onClose={() => setNotice(null)} />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-10">
        {/* بنر بالای صفحه */}
        <section className="rounded-3xl bg-slate-900 px-6 py-10 text-right text-slate-50 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            پنل مدیریت گارانتی
          </h1>
          <p className="text-sm md:text-base text-slate-200">
            از این صفحه می‌توانید رکوردهای گارانتی را با استفاده از یک توکن
            مدیریتی امن، به فایل گارانتی اضافه یا به‌روزرسانی کنید. این صفحه
            عمومی نیست و فقط برای استفاده داخلی است.
          </p>
        </section>

        {/* کارت ورود ادمین */}
        <section className="rounded-2xl bg-white p-6 shadow-md border border-slate-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                توکن مدیریتی
              </label>
              <input
                type="password"
                dir="ltr"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm md:text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="مثال: sk_live_xxx"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                این توکن فقط در مرورگر شما (localStorage) ذخیره می‌شود و در هیچ
                جای دیگری نمایش داده نخواهد شد.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleLogin}
                disabled={loadingToken}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-sm md:text-base font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
              >
                {loadingToken ? "در حال بررسی..." : "ورود / فعال‌سازی توکن"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm md:text-base font-semibold text-slate-700 hover:bg-slate-100"
              >
                خروج
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm">
            {isLoggedIn ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
                ✅ توکن فعال است و شما به عنوان ادمین وارد شده‌اید.
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                ⚠️ برای استفاده از امکانات ثبت گارانتی، ابتدا باید توکن معتبر وارد
                کنید.
              </span>
            )}
          </div>
        </section>

        {/* فرم افزودن ردیف گارانتی */}
        <section className="rounded-2xl bg-white p-6 shadow-md border border-slate-100">
          <h2 className="mb-4 text-lg font-bold text-slate-800">
            افزودن ردیف گارانتی
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Vendor
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              >
                <option>Dell EMC</option>
                <option>HPE</option>
                <option>Lenovo</option>
                <option>Cisco</option>
                <option>Fujitsu</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Model
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="مثال: Unity XT 480"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Serial
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="مثال: FNM123456789"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                ExpireAt
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="فعال">فعال</option>
                <option value="منقضی">منقضی</option>
                <option value="در حال بررسی">در حال بررسی</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                توضیحات
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="هر توضیح اضافه‌ای در مورد این سریال..."
              />
            </div>
          </div>

          <div className="mt-4 flex justify-start">
            <button
              type="button"
              onClick={handleAddRow}
              className="rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700"
            >
              افزودن به لیست
            </button>
          </div>
        </section>

        {/* جدول ردیف‌های در انتظار ذخیره */}
        <section className="rounded-2xl bg-white p-6 shadow-md border border-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              ردیف‌های در انتظار ذخیره
            </h2>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !rows.length}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "در حال ذخیره..." : "ذخیره در فایل گارانتی"}
            </button>
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-slate-500">
              هنوز ردیفی به لیست اضافه نشده است.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-right text-slate-600">
                    <th className="px-3 py-1">Vendor</th>
                    <th className="px-3 py-1">Model</th>
                    <th className="px-3 py-1">Serial</th>
                    <th className="px-3 py-1">ExpireAt</th>
                    <th className="px-3 py-1">Status</th>
                    <th className="px-3 py-1">Notes</th>
                    <th className="px-3 py-1">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={`${r.serial}-${i}`}
                      className="bg-slate-50 rounded-xl"
                    >
                      <td className="px-3 py-2">{r.vendor}</td>
                      <td className="px-3 py-2">{r.model}</td>
                      <td className="px-3 py-2" dir="ltr">
                        {r.serial}
                      </td>
                      <td className="px-3 py-2">{r.expireAt}</td>
                      <td className="px-3 py-2">{r.status}</td>
                      <td className="px-3 py-2">{r.notes}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(i)}
                          className="rounded-lg bg-rose-600 px-3 py-1 text-xs text-white hover:bg-rose-700"
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
        </section>
      </main>
    </div>
  );
}