// lib/rateLimiter.js

// بازه زمانی (مثلاً 60 ثانیه)
const DEFAULT_WINDOW_MS = 60 * 1000;
// حداکثر درخواست مجاز در هر بازه برای هر IP
const DEFAULT_MAX = 60;

// ساختار: ip -> { count, start }
const ipStore = new Map();

export function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) {
    // اگر پشت پروکسی مثل Render / Nginx باشی
    return xf.split(",")[0].trim();
  }
  return (
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    "unknown"
  );
}

export function rateLimit({
  ip,
  windowMs = DEFAULT_WINDOW_MS,
  max = DEFAULT_MAX,
}) {
  const now = Date.now();
  const entry = ipStore.get(ip) || { count: 0, start: now };

  // اگر از پنجره زمانی عبور کردیم → ریست
  if (now - entry.start > windowMs) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }

  ipStore.set(ip, entry);

  const remaining = Math.max(0, max - entry.count);
  const resetMs = windowMs - (now - entry.start);

  return {
    ok: entry.count <= max,
    remaining,
    resetMs,
  };
}