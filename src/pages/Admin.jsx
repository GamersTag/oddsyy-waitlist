import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { collection, query, orderBy, getDocs, doc, writeBatch, increment } from 'firebase/firestore/lite'
import { db } from '../lib/firebase'
import { auth, googleProvider } from '../lib/auth'

const FILTERS = ['all', 'seeker', 'hustler', 'both']

// Access is decided by firestore.rules (isAdmin); this page only asks Google who
// you are. There is deliberately no password or allow-list in the client bundle.

// CSV-safe cell: quote everything and neutralise spreadsheet formulas
// (a name like "=HYPERLINK(...)" must not execute when the file is opened).
function csvCell(value) {
  let v = String(value ?? '')
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`
  return `"${v.replace(/"/g, '""')}"`
}

function formatDate(ts) {
  return ts?.toDate
    ? ts.toDate().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
}

export default function Admin() {
  const [user, setUser] = useState(undefined) // undefined = checking, null = signed out
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | ready | denied | error
  const [filter, setFilter] = useState('all')
  const [authErr, setAuthErr] = useState('')

  useEffect(() => {
    const prev = document.title
    document.title = 'Waitlist admin — Oddsyy'
    return () => { document.title = prev }
  }, [])

  // Load the list whenever someone signs in; the rules reject anyone not allow-listed.
  useEffect(() => {
    let current = 0
    return onAuthStateChanged(auth, u => {
      const run = ++current
      setUser(u)
      setEntries([])
      if (!u) { setStatus('idle'); return }
      setStatus('loading')
      getDocs(query(collection(db, 'waitlist'), orderBy('created_at', 'desc')))
        .then(snap => {
          if (run !== current) return
          setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
          setStatus('ready')
        })
        .catch(err => { if (run === current) setStatus(err?.code === 'permission-denied' ? 'denied' : 'error') })
    })
  }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? entries : entries.filter(e => e.role === filter)),
    [entries, filter],
  )
  const counts = useMemo(() => ({
    all: entries.length,
    seeker: entries.filter(e => e.role === 'seeker').length,
    hustler: entries.filter(e => e.role === 'hustler').length,
    both: entries.filter(e => e.role === 'both').length,
  }), [entries])

  async function login() {
    setAuthErr('')
    try { await signInWithPopup(auth, googleProvider) }
    catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') setAuthErr('Sign-in failed. Is Google sign-in enabled for this project?')
    }
  }

  function exportCSV() {
    const header = ['Name', 'Email', 'Role', 'Joined'].map(csvCell).join(',')
    const rows = filtered.map(e => [e.name, e.email, e.role, formatDate(e.created_at)].map(csvCell).join(','))
    const blob = new Blob(['﻿' + [header, ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `oddsyy-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function remove(entry) {
    if (!window.confirm(`Delete ${entry.email} from the waitlist? This can't be undone.`)) return
    try {
      // Delete and lower the public count together, so the landing page stays accurate.
      const batch = writeBatch(db)
      batch.delete(doc(db, 'waitlist', entry.id))
      batch.update(doc(db, 'stats', 'waitlist'), { count: increment(-1) })
      await batch.commit()
      setEntries(list => list.filter(e => e.id !== entry.id))
    } catch {
      window.alert('Could not delete this entry.')
    }
  }

  if (user === undefined) return <div className="admin-login"><p>Checking sign-in…</p></div>

  if (!user) return (
    <div className="admin-login">
      <div className="admin-logo">odds<span>yy</span></div>
      <h2>Waitlist admin</h2>
      <p className="admin-note">Staff only. Sign in with an authorised Google account.</p>
      <button onClick={login}>Sign in with Google</button>
      {authErr && <p className="admin-error" role="alert">{authErr}</p>}
      <Link to="/" className="admin-back">← Back to oddsyy.com</Link>
    </div>
  )

  if (status === 'denied') return (
    <div className="admin-login">
      <div className="admin-logo">odds<span>yy</span></div>
      <h2>No access</h2>
      <p className="admin-note">{user.email} isn't authorised to view the waitlist.</p>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </div>
  )

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Oddsyy Waitlist</h1>
        <div className="admin-actions">
          <button onClick={exportCSV} disabled={status !== 'ready' || filtered.length === 0}>Export CSV ↓</button>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>
      <div className="stats-grid">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="stat-card">
            <p className="stat-num">{v}</p>
            <p className="stat-label">{k === 'all' ? 'Total' : k}</p>
          </div>
        ))}
      </div>
      <div className="filter-row">
        {FILTERS.map(f => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {status === 'loading' || status === 'idle' ? (
        <p className="admin-note">Loading…</p>
      ) : status === 'error' ? (
        <p className="admin-error" role="alert">Couldn't load sign-ups. Check your connection and reload.</p>
      ) : filtered.length === 0 ? (
        <p className="admin-note">No entries yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td><span className={`role-badge ${e.role}`}>{e.role}</span></td>
                  <td>{formatDate(e.created_at)}</td>
                  <td><button className="row-del" onClick={() => remove(e)} aria-label={`Delete ${e.email}`}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="admin-note admin-foot">
        Use this list only to invite people when the app launches. Delete entries on request, and delete
        the whole list once launch invites are done (see README → Retirement).
      </p>
    </div>
  )
}
