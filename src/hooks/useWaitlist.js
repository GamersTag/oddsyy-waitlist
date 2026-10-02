import { useState } from 'react'

export const ROLES = ['seeker', 'hustler', 'both']
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function normaliseEmail(email) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email) {
  const e = normaliseEmail(email)
  return e.length <= 254 && EMAIL_RE.test(e)
}

// onJoined runs after a new sign-up (not a repeat), e.g. to bump the shown count.
export function useWaitlist({ onJoined } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [alreadyJoined, setAlreadyJoined] = useState(false)

  // `trap` is a hidden honeypot field; people never fill it, simple bots do.
  async function submit({ name, email, role, trap }) {
    if (trap) { setSuccess(true); return }
    const cleanName = name.trim()
    const cleanEmail = normaliseEmail(email)
    if (!cleanName || cleanName.length > 100 || !isValidEmail(cleanEmail) || !ROLES.includes(role)) {
      setError('Please check your name and email.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // The waitlist can't be read from the browser, so duplicates are caught by
      // the write itself: the same email maps to the same doc, and the rules
      // deny overwriting an existing doc.
      const { saveSignup } = await import('../lib/signup')
      await saveSignup({ name: cleanName, email: cleanEmail, role })
      setSuccess(true)
      onJoined?.()
    } catch (err) {
      if (err?.code === 'permission-denied') {
        setAlreadyJoined(true)
        setSuccess(true)
      } else {
        console.error(err)
        setError('Something went wrong. Please try again.')
      }
    }
    setLoading(false)
  }

  return { submit, loading, error, success, alreadyJoined }
}
