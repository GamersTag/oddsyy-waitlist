import { useState } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'

export function useWaitlist() {
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const [success, setSuccess] = useState(false)

  async function submit({ name, email, role }) {
    setLoading(true)
    setError(null)
    try {
      // Check for duplicate email
      const q = query(collection(db, 'waitlist'), where('email', '==', email.toLowerCase().trim()))
      const snap = await getDocs(q)
      if (!snap.empty) {
        setError("You're already on the list!")
        setLoading(false)
        return
      }
      await addDoc(collection(db, 'waitlist'), {
        name:       name.trim(),
        email:      email.toLowerCase().trim(),
        role,
        created_at: serverTimestamp(),
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return { submit, loading, error, success }
}
