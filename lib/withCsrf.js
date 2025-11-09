// Simple CSRF wrapper for Next.js API routes
export default function withCsrf(handler) {
  const secret = process.env.CSRF_STATIC_SECRET || process.env.NEXT_PUBLIC_CSRF_STATIC_SECRET;
  return async (req, res) => {
    if (req.method !== 'GET') {
      const token = req.headers['x-csrf-token'] || (req.cookies && req.cookies['csrf-token']);
      if (!secret || token !== secret) {
        return res.status(403).json({ error: 'forbidden_csrf' });
      }
    }
    return handler(req, res);
  };
}
