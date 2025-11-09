// lib/withCsrf.js
export function withCsrf(handler) {
  return async function csrfWrapped(req, res) {
    if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
      const hdr = String(req.headers['x-csrf-token'] || '')
      const ckv = String(req.cookies?.csrfToken || '')
      if (!hdr || !ckv || hdr !== ckv) {
        return res.status(403).json({ error: 'CSRF verification failed' })
      }
    }
    return handler(req, res)
  }
}
