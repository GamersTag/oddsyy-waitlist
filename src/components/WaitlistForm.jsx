import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useWaitlist } from '../hooks/useWaitlist'

const ROLES = [
  { id: 'seeker',  name: 'Seeker',   sub: 'I have requests' },
  { id: 'hustler', name: 'Hustler',  sub: 'I fulfill them'  },
  { id: 'both',    name: 'Both',     sub: "I'm all in"      },
]

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('seeker')
  const cardRef = useRef(null)
  const { submit, loading, error, success } = useWaitlist()

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.includes('@')) { shake(); return }
    submit({ name, email, role })
  }

  function shake() {
    gsap.fromTo(cardRef.current, { x: -5 }, { x: 0, duration: 0.35, ease: 'elastic.out(1,0.3)' })
  }

  if (success) return (
    <div className="form-card" ref={cardRef}>
      <div className="success-view">
        <div className="success-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 10 8 14 16 6" />
          </svg>
        </div>
        <h3>You're on the list</h3>
        <p>We'll reach out the moment Oddsyy goes live in Lahore.</p>
      </div>
    </div>
  )

  return (
    <form className="form-card" ref={cardRef} onSubmit={handleSubmit}>
      <p className="form-heading">Get early access</p>

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <p className="role-label">I want to join as</p>
      <div className="role-seg">
        {ROLES.map(r => (
          <button
            key={r.id}
            type="button"
            className={`role-seg-btn ${role === r.id ? 'active' : ''}`}
            onClick={() => setRole(r.id)}
          >
            <span className="rsb-name">{r.name}</span>
            <span className="rsb-sub">{r.sub}</span>
          </button>
        ))}
      </div>

      {error && <p className="err">{error}</p>}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Reserving…' : 'Reserve my spot'}
      </button>

      <p className="form-note">No spam — only a launch notification.</p>
    </form>
  )
}
