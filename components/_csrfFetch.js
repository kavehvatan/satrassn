// components/_csrfFetch.js
import { readCsrfFromCookie } from '@/lib/csrf'
export async function csrfFetch(input, init = {}) {
  const csrf = readCsrfFromCookie()
  const headers = { ...(init.headers || {}), 'x-csrf-token': csrf }
  return fetch(input, { ...init, headers })
}
