import { useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useWaitlist } from '../hooks/useWaitlist'

const ROLES = [
  { id: 'seeker',  icon: '🔍', name: 'Seeker',  sub: 'I have requests' },
  { id: 'hustler', icon: '⚡', name: 'Hustler', sub: 'I fulfill them' },
  { id: 'both',    icon: '✌️', name: 'Both',    sub: "I'm all in" },
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
    gsap.fromTo(cardRef.current, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' })
  }

  function pickRole(el, id) {
    setRole(id)
    gsap.fromTo(el, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
  }

  if (success) return (
    <div className="form-card" ref={cardRef}>
      <div className="success-view">
        <div className="success-icon">🎉</div>
        <h3>You're on the list!</h3>
        <p>We'll reach out the moment Oddsyy goes live in Lahore.</p>
      </div>
    </div>
  )

  return (
    <form className="form-card" ref={cardRef} onSubmit={handleSubmit}>
      <p className="form-label">Get early access 🚀</p>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <p className="role-title">I want to join as</p>
      <div className="role-grid">
        {ROLES.map(r => (
          <button key={r.id} type="button"
            className={`role-btn ${role === r.id ? 'active' : ''}`}
            onClick={e => pickRole(e.currentTarget, r.id)}>
            <span className="rb-icon">{r.icon}</span>
            <span className="rb-name">{r.name}</span>
            <span className="rb-sub">{r.sub}</span>
          </button>
        ))}
      </div>
      {error && <p className="err">{error}</p>}
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Reserving...' : 'Reserve my spot →'}
      </button>
      <p className="form-note">No spam. We'll only reach out when we launch.</p>
    </form>
  )
}
