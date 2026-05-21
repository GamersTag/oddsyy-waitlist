import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

const FILTERS = ['all', 'seeker', 'hustler', 'both']

export default function Admin() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [authed, setAuthed]   = useState(false)
  const [pw, setPw]           = useState('')
  const [err, setErr]         = useState('')

  function login() {
    if (pw === import.meta.env.VITE_ADMIN_PASSWORD) { setAuthed(true) }
    else { setErr('Incorrect password.') }
  }

  useEffect(() => {
    if (!authed) return
    const q = query(collection(db, 'waitlist'), orderBy('created_at', 'desc'))
    getDocs(q).then(snap => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [authed])

  function exportCSV() {
    const header = 'Name,Email,Role,Date\n'
    const rows = filtered.map(e => {
      const date = e.created_at?.toDate ? e.created_at.toDate().toLocaleDateString() : ''
      return `${e.name},${e.email},${e.role},${date}`
    }).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'oddsyy-waitlist.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) return (
    <div className="admin-login">
      <div style={{ fontFamily: 'serif', fontSize: '2rem', marginBottom: '1.5rem' }}>
        odds<span style={{ color: 'oklch(72% 0.22 320)' }}>yy</span>
      </div>
      <h2>Admin Access</h2>
      <input
        type="password" placeholder="Password" value={pw}
        onChange={e => setPw(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && login()}
      />
      {err && <p style={{ color: 'oklch(65% 0.18 30)', fontSize: '0.8rem' }}>{err}</p>}
      <button onClick={login}>Enter →</button>
    </div>
  )

  const filtered = filter === 'all' ? entries : entries.filter(e => e.role === filter)
  const counts   = {
    all:     entries.length,
    seeker:  entries.filter(e => e.role === 'seeker').length,
    hustler: entries.filter(e => e.role === 'hustler').length,
    both:    entries.filter(e => e.role === 'both').length,
  }

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Oddsyy Waitlist</h1>
        <button onClick={exportCSV}>Export CSV ↓</button>
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
      {loading ? (
        <p style={{ color: 'oklch(50% 0.02 300)', padding: '2rem 0' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'oklch(50% 0.02 300)', padding: '2rem 0' }}>No entries yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Date</th></tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td><span className={`role-badge ${e.role}`}>{e.role}</span></td>
                <td>{e.created_at?.toDate
                  ? e.created_at.toDate().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
