// Loaded on demand when someone submits the form, so Firebase stays out of the
// first page load.
import { doc, setDoc, serverTimestamp } from 'firebase/firestore/lite'
import { db } from './firebase'

// Doc ID = SHA-256 hex of the normalised email (firestore.rules checks this)
async function emailDocId(email) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email))
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
}

// Resolves on success; rejects with code 'permission-denied' if the email has
// already joined (the rules refuse to overwrite an existing doc).
export async function saveSignup({ name, email, role }) {
  await setDoc(doc(db, 'waitlist', await emailDocId(email)), {
    name,
    email,
    role,
    created_at: serverTimestamp(),
  })
}
