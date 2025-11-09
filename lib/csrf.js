// lib/csrf.js
export function readCsrfFromCookie() {
  if (typeof document === 'undefined') return ''
  const c = document.cookie.split('; ').find(v => v.startsWith('csrfToken='))
  return c ? decodeURIComponent(c.split('=')[1]) : ''
}
