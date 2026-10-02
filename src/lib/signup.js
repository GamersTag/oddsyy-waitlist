// Loaded on demand when someone submits the form, so Firebase stays out of the
// first page load.
import { doc, setDoc, writeBatch, increment, serverTimestamp } from 'firebase/firestore/lite'
import { db } from './firebase'

// Doc ID = SHA-256 hex of the normalised email (firestore.rules checks this)
async function emailDocId(email) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email))
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
}

// Resolves on success; rejects with code 'permission-denied' if the email has
// already joined (the rules refuse to overwrite an existing doc).
export async function saveSignup({ name, email, role }) {
  const id = await emailDocId(email)
  const entry = { name, email, role, created_at: serverTimestamp() }

  // Normally the sign-up and the public count go up together, in one write.
  const batch = writeBatch(db)
  batch.set(doc(db, 'waitlist', id), entry)
  batch.update(doc(db, 'stats', 'waitlist'), { count: increment(1), last: id })
  try {
    await batch.commit()
  } catch {
    // A duplicate email fails here too. Retry the sign-up alone, so a counter
    // problem can never stop someone joining; this second write is what tells
    // a duplicate (permission-denied) apart.
    await setDoc(doc(db, 'waitlist', id), entry)
  }
}
