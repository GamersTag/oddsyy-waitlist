import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import WaitlistForm from './WaitlistForm'
import Ostrich from './Ostrich'
import WaitingCount from './WaitingCount'
import { useWaitlistCount } from '../hooks/useWaitlistCount'

// Honest facts only — no invented sign-up counts or placeholder faces. The
// waiting count is the real number from Firestore (see firestore.rules).
const FACTS = ['Free to join', 'Lahore first', 'Seekers & Hustlers welcome']

export default function Hero() {
  const leftRef = useRef(null)
  const formRef = useRef(null)
  const { count, addOne } = useWaitlistCount()

  useEffect(() => {
    const els = leftRef.current.querySelectorAll('.reveal')
    gsap.to(els, {
      opacity: 1, y: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: { each: 0.13, ease: 'power2.inOut' },
      delay: 0.15,
    })
    gsap.to(formRef.current, {
      opacity: 1, scale: 1,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.3,
    })
  }, [])

  return (
    <div className="hero">
      <div className="hero-left" ref={leftRef}>
        <Ostrich size={76} className="hero-mascot reveal" />
        <div className="eyebrow reveal">Early Access</div>
        <h1 className="hero-title reveal">Post it.<br /><em>Someone's on it.</em></h1>
        <p className="hero-sub reveal">From home tutors to painters, photographers to party wizards — find local people who get things done.</p>
        <ul className="proof reveal" aria-label="About the waitlist">
          {FACTS.map(f => <li key={f} className="proof-chip">{f}</li>)}
        </ul>
        <WaitingCount count={count} />
      </div>
      <div ref={formRef} className="reveal-scale"><WaitlistForm onJoined={addOne} /></div>
    </div>
  )
}
