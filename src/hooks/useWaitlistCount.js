import { useEffect, useState } from 'react'

const env = import.meta.env

// Read stats/waitlist through Firestore's REST API with a plain fetch, so the
// Firebase SDK still stays out of the first page load. Only this one document
// is public (see firestore.rules).
function countUrl() {
  const base = env.DEV && env.VITE_FIRESTORE_EMULATOR
    ? `http://${env.VITE_FIRESTORE_EMULATOR}`
    : 'https://firestore.googleapis.com'
  return `${base}/v1/projects/${env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/stats/waitlist`
    + `?key=${env.VITE_FIREBASE_API_KEY}&mask.fieldPaths=count`
}

// The real number of people on the waitlist, or null until it loads (or if it
// can't be read — then the page simply doesn't show a number).
export function useWaitlistCount() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(countUrl(), { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        const n = Number(d?.fields?.count?.integerValue)
        if (Number.isInteger(n) && n >= 0) setCount(n)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  // Called after this visitor joins, so they see themselves counted.
  const addOne = () => setCount(n => (n === null ? n : n + 1))

  return { count, addOne }
}
