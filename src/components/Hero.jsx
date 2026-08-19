import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { db } from '../lib/firebase'
import { collection, getCountFromServer } from 'firebase/firestore'
import WaitlistForm from './WaitlistForm'
import Ostrich from './Ostrich'

const AVATARS = [
  { initials: 'AK', color: '#5A1226' },
  { initials: 'SR', color: '#B43A60' },
  { initials: 'MZ', color: '#7E2440' },
  { initials: 'FH', color: '#8C4A2F' },
  { initials: 'NB', color: '#6B2350' },
]

export default function Hero() {
  const leftRef = useRef(null)
  const formRef = useRef(null)
  const [count, setCount] = useState(null)

  useEffect(() => {
    getCountFromServer(collection(db, 'waitlist'))
      .then(snap => setCount(snap.data().count))
      .catch(() => {})
  }, [])

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
        <div className="proof reveal">
          <div className="avatars">
            {AVATARS.map((av, i) => (
              <div key={i} className="av" style={{ background: av.color }}>{av.initials}</div>
            ))}
          </div>
          <p className="proof-text"><strong>{count !== null ? `${count < 10 ? count : `${Math.floor(count / 10) * 10}+`} ${count === 1 ? 'person' : 'people'}` : '…'}</strong> already waiting</p>
        </div>
      </div>
      <div ref={formRef} className="reveal-scale"><WaitlistForm /></div>
    </div>
  )
}
