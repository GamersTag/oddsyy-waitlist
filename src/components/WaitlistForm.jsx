import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useWaitlist, isValidEmail } from '../hooks/useWaitlist'

const ROLES = [
  { id: 'seeker',  icon: '🔍', name: 'Seeker',  sub: 'I have requests' },
  { id: 'hustler', icon: '⚡', name: 'Hustler', sub: 'I fulfill them' },
  { id: 'both',    icon: '✌️', name: 'Both',    sub: "I'm all in" },
]

export default function WaitlistForm({ onJoined }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('seeker')
  const [trap, setTrap] = useState('')
  const cardRef = useRef(null)
  const { submit, loading, error, success, alreadyJoined } = useWaitlist({ onJoined })

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !isValidEmail(email)) { shake(); return }
    submit({ name, email, role, trap })
  }

  function shake() {
    gsap.fromTo(cardRef.current, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' })
  }

  function pickRole(el, id) {
    setRole(id)
    // clearProps hands scale back to CSS (.role-btn.active / :hover) when done
    gsap.fromTo(el, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(2)', clearProps: 'transform' })
  }

  if (success) return (
    <div className="form-card" ref={cardRef}>
      <div className="success-view" role="status">
        <div className="success-icon">🎉</div>
        <h3>{alreadyJoined ? "You're already on the list!" : "You're on the list!"}</h3>
        <p>We'll reach out the moment Oddsyy goes live in Lahore.</p>
      </div>
    </div>
  )

  return (
    <form className="form-card" ref={cardRef} onSubmit={handleSubmit} noValidate>
      <p className="form-label">Get early access 🚀</p>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" type="text" autoComplete="name" maxLength={100} required
          value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" autoComplete="email" inputMode="email" maxLength={254} required
          value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      {/* Honeypot: hidden from people and screen readers, filled in by simple bots */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="hp_field">Leave this field empty</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off"
          value={trap} onChange={e => setTrap(e.target.value)} />
      </div>
      <p className="role-title" id="role-title">I want to join as</p>
      <div className="role-grid" role="group" aria-labelledby="role-title">
        {ROLES.map(r => (
          <button key={r.id} type="button" aria-pressed={role === r.id}
            className={`role-btn ${role === r.id ? 'active' : ''}`}
            onClick={e => pickRole(e.currentTarget, r.id)}>
            <span className="rb-icon" aria-hidden="true">{r.icon}</span>
            <span className="rb-name">{r.name}</span>
            <span className="rb-sub">{r.sub}</span>
          </button>
        ))}
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Reserving...' : 'Reserve my spot →'}
      </button>
      <p className="form-note">
        No spam — we only email you when we launch. <Link to="/privacy">How we use your details</Link>.
      </p>
    </form>
  )
}
