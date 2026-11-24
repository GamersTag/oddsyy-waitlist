import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWaitlist, isValidEmail } from '../hooks/useWaitlist'
import { gsap, prefersMotion } from '../lib/motion'
import { throwPaper } from '../lib/paper'
import { Icon } from './Icon'

const ROLES = [
  { id: 'seeker',  name: 'Seeker',  sub: 'I have requests' },
  { id: 'hustler', name: 'Hustler', sub: 'I fulfill them' },
  { id: 'both',    name: 'Both',    sub: "I'm all in" },
]

function Success({ alreadyJoined, fromHeight }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    el.querySelector('h3').focus({ preventScroll: true })
    if (!prefersMotion()) return
    const ctx = gsap.context(() => {
      const card = el.closest('.form-card')
      gsap.from(card, { height: fromHeight, duration: 0.6, ease: 'expo.inOut', clearProps: 'height' })
      gsap.from(el.querySelector('.ok-ring'), { scale: 0, rotate: -40, duration: 0.7, ease: 'back.out(2)', delay: 0.3 })
      gsap.fromTo(el.querySelector('.ok-ring path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out', delay: 0.65 })
      // opacity, not autoAlpha: a hidden heading would lose the focus it was just given
      gsap.from(el.querySelectorAll('h3, p'), { y: 22, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.45 })
      if (!alreadyJoined) gsap.delayedCall(0.6, () => throwPaper(el.querySelector('.ok-ring')))
    }, ref)
    return () => ctx.revert()
  }, [alreadyJoined, fromHeight])

  return (
    <div className="success-view" role="status" ref={ref}>
      <span className="ok-ring" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path pathLength="1" d="M13 25 L21 33 L36 15" /></svg>
      </span>
      <div>
        <h3 tabIndex={-1}>{alreadyJoined ? "You're already on the list!" : "You're on the list!"}</h3>
        <p>We&apos;ll reach out the moment Oddsyy goes live in Lahore.</p>
      </div>
    </div>
  )
}

export default function WaitlistForm({ onJoined }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('seeker')
  const [trap, setTrap] = useState('')
  const [height, setHeight] = useState(0)
  const cardRef = useRef(null)
  const joinedAs = useRef('')
  const { submit, loading, error, success, alreadyJoined } = useWaitlist({ onJoined })

  useEffect(() => {
    if (!success || alreadyJoined) return
    window.dispatchEvent(new CustomEvent('oddsyy:joined', { detail: { name: joinedAs.current } }))
  }, [success, alreadyJoined])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !isValidEmail(email)) {
      shake()
      document.getElementById(name.trim() ? 'email' : 'name').focus()
      return
    }
    setHeight(cardRef.current.offsetHeight)
    joinedAs.current = name.trim().split(/\s+/)[0].slice(0, 14)
    submit({ name, email, role, trap })
  }

  function shake() {
    if (!prefersMotion()) return
    gsap.fromTo(cardRef.current, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1.1,0.3)', clearProps: 'transform' })
  }

  if (success) return (
    <div className="form-card is-done" ref={cardRef}>
      <Success alreadyJoined={alreadyJoined} fromHeight={height} />
    </div>
  )

  return (
    <form className="form-card" ref={cardRef} onSubmit={handleSubmit} noValidate>
      <div className="form-top">
        <p className="form-label">Get early access</p>
        <p className="form-note">
          No spam — we only email you when we launch. <Link to="/privacy">How we use your details</Link>.
        </p>
      </div>
      <div className="form-row">
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
        <div className="field field-role">
          <p className="role-title" id="role-title">I want to join as</p>
          <div className="role-grid" role="group" aria-labelledby="role-title"
            style={{ '--i': ROLES.findIndex(r => r.id === role) }}>
            <span className="role-thumb" aria-hidden="true" />
            {ROLES.map(r => (
              <button key={r.id} type="button" aria-pressed={role === r.id}
                className={`role-btn ${role === r.id ? 'active' : ''}`} onClick={() => setRole(r.id)}>
                <span className="rb-name">{r.name}</span>
                <span className="rb-sub">{r.sub}</span>
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn submit-btn" disabled={loading}>
          <span>{loading ? 'Reserving...' : 'Reserve my spot'}</span><Icon name="arrow" size={21} />
        </button>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
    </form>
  )
}
