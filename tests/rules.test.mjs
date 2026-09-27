// Firestore security-rules tests. Run with:  npm run test:rules
// (starts the Firestore emulator, runs this file, stops the emulator).
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { after, before, beforeEach, describe, test } from 'node:test'
import {
  initializeTestEnvironment, assertFails, assertSucceeds,
} from '@firebase/rules-unit-testing'
import {
  collection, doc, setDoc, getDoc, getDocs, deleteDoc, getCountFromServer,
  query, where, serverTimestamp, updateDoc,
} from 'firebase/firestore'

const sha = s => createHash('sha256').update(s).digest('hex')
const entry = email => ({ name: 'Test User', email, role: 'seeker', created_at: serverTimestamp() })
const google = (email, verified = true) => ({
  email, email_verified: verified, firebase: { sign_in_provider: 'google.com' },
})

let env
before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-oddsyy',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
})
after(async () => { await env?.cleanup() })
beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async ctx => {
    // One legacy entry with a random ID, like the documents already in production
    await setDoc(doc(ctx.firestore(), 'waitlist', 'legacyRandomId'), { name: 'Old', email: 'old@example.com', role: 'both' })
    // Staff allow-list, as created by the owner in the Firebase console
    await setDoc(doc(ctx.firestore(), 'admins', 'staff@example.com'), { note: 'test admin' })
  })
})

describe('public visitor', () => {
  const db = () => env.unauthenticatedContext().firestore()

  test('can join with sha256(email) as the ID', async () => {
    const e = 'alice@example.com'
    await assertSucceeds(setDoc(doc(db(), 'waitlist', sha(e)), entry(e)))
  })
  test('cannot join twice with the same email', async () => {
    const e = 'alice@example.com'
    await setDoc(doc(db(), 'waitlist', sha(e)), entry(e))
    await assertFails(setDoc(doc(db(), 'waitlist', sha(e)), entry(e)))
  })
  test('cannot list, count, query or read sign-ups', async () => {
    await assertFails(getDocs(collection(db(), 'waitlist')))
    await assertFails(getCountFromServer(collection(db(), 'waitlist')))
    await assertFails(getDocs(query(collection(db(), 'waitlist'), where('email', '==', 'old@example.com'))))
    await assertFails(getDoc(doc(db(), 'waitlist', 'legacyRandomId')))
  })
  test('cannot update or delete', async () => {
    await assertFails(updateDoc(doc(db(), 'waitlist', 'legacyRandomId'), { role: 'hustler' }))
    await assertFails(deleteDoc(doc(db(), 'waitlist', 'legacyRandomId')))
  })
  test('rejects malformed sign-ups', async () => {
    const d = db()
    await assertFails(setDoc(doc(d, 'waitlist', 'not-a-hash'), entry('bob@example.com')))
    await assertFails(setDoc(doc(d, 'waitlist', sha('victim@example.com')), entry('attacker@example.com')))
    await assertFails(setDoc(doc(d, 'waitlist', sha('Carol@Example.com')), entry('Carol@Example.com')))
    await assertFails(setDoc(doc(d, 'waitlist', sha('noat.example.com')), entry('noat.example.com')))
    await assertFails(setDoc(doc(d, 'waitlist', sha('dan@example.com')), { ...entry('dan@example.com'), admin: true }))
    await assertFails(setDoc(doc(d, 'waitlist', sha('eve@example.com')), { ...entry('eve@example.com'), role: 'owner' }))
    await assertFails(setDoc(doc(d, 'waitlist', sha('fay@example.com')), { ...entry('fay@example.com'), created_at: new Date(0) }))
    await assertFails(setDoc(doc(d, 'waitlist', sha('gus@example.com')), { ...entry('gus@example.com'), name: 'x'.repeat(101) }))
    await assertFails(setDoc(doc(d, 'waitlist', sha('hal@example.com')), { ...entry('hal@example.com'), name: '' }))
  })
  test('cannot touch any other collection, including the admin allow-list', async () => {
    await assertFails(getDocs(collection(db(), 'stats')))
    await assertFails(getDoc(doc(db(), 'admins', 'staff@example.com')))
    await assertFails(setDoc(doc(db(), 'admins', 'me@example.com'), { x: 1 }))
    await assertFails(setDoc(doc(db(), 'anything', 'x'), { a: 1 }))
  })
})

describe('admin (Google sign-in, allow-listed email)', () => {
  const admin = () => env.authenticatedContext('admin1', google('staff@example.com')).firestore()

  test('can list and read sign-ups', async () => {
    await assertSucceeds(getDocs(collection(admin(), 'waitlist')))
    await assertSucceeds(getDoc(doc(admin(), 'waitlist', 'legacyRandomId')))
  })
  test('can delete an entry (privacy request) but not edit one', async () => {
    await assertSucceeds(deleteDoc(doc(admin(), 'waitlist', 'legacyRandomId')))
    await env.withSecurityRulesDisabled(async ctx => {
      await setDoc(doc(ctx.firestore(), 'waitlist', 'another'), { name: 'A', email: 'a@example.com', role: 'seeker' })
    })
    await assertFails(updateDoc(doc(admin(), 'waitlist', 'another'), { role: 'both' }))
  })
})

describe('everyone else signed in', () => {
  test('an admin cannot add themselves or others to the allow-list', async () => {
    const db = env.authenticatedContext('admin1', google('staff@example.com')).firestore()
    await assertFails(setDoc(doc(db, 'admins', 'friend@example.com'), { x: 1 }))
    await assertFails(getDocs(collection(db, 'admins')))
  })
  test('a non-allow-listed Google account cannot read', async () => {
    const db = env.authenticatedContext('u2', google('someone@gmail.com')).firestore()
    await assertFails(getDocs(collection(db, 'waitlist')))
  })
  test('an allow-listed email with an unverified address cannot read', async () => {
    const db = env.authenticatedContext('u3', google('staff@example.com', false)).firestore()
    await assertFails(getDocs(collection(db, 'waitlist')))
  })
  test('an allow-listed email from a non-Google provider cannot read', async () => {
    const db = env.authenticatedContext('u4', {
      email: 'staff@example.com', email_verified: true, firebase: { sign_in_provider: 'password' },
    }).firestore()
    await assertFails(getDocs(collection(db, 'waitlist')))
  })
})
