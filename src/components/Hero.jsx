import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import WaitlistForm from './WaitlistForm'
import Ostrich from './Ostrich'
import Opening from './Opening'
import WaitingCount from './WaitingCount'
import HeroAsk, { Pile } from './HeroAsk'
import Hop from './Hop'
import { useWaitlistCount } from '../hooks/useWaitlistCount'
import { fontsReady, gsap, hopSet, hopTo, MOTION_OK, prefersMotion, wantsOpening } from '../lib/motion'
import { fly } from '../lib/notes'
import { ostrichDraw, ostrichReady, ostrichSpecs } from '../lib/ostrich'

// Honest facts only — no invented sign-up counts or placeholder faces. The
// waiting count is the real number from Firestore (see firestore.rules).
const FACTS = ['Free to join', 'Lahore first', 'Seekers & Hustlers welcome']

// Everything the hero does on load, as one paused timeline. With the opening, the
// bird arrives by itself (it flies in); without, it pops up from behind the form.
function build(root, withOpening) {
  const q = s => root.querySelector(s)
  const letters = root.querySelectorAll('.hero-title .hop-i')
  const navBird = document.querySelector('.nav .ostrich')
  const navText = document.querySelectorAll('.nav-logo, .nav-pill')
  const bird = q('.peek .ostrich')
  const copy = root.querySelectorAll('.hero-sub, .facts li')

  hopSet(letters)
  ostrichReady(navBird)
  if (withOpening) gsap.set(bird, { autoAlpha: 0 })
  else {
    ostrichReady(bird)
    gsap.set(bird.querySelectorAll('.ost-line path'), { strokeDashoffset: 0, autoAlpha: 1 })
    gsap.set(bird, { yPercent: 104, rotate: 7, transformOrigin: '50% 100%' })
  }
  gsap.set(navText, { autoAlpha: 0, y: -10 })
  gsap.set(q('.ask'), { clipPath: 'inset(-40% 100% -60% 0% round 999px)' })
  gsap.set(q('.ask-text'), { textContent: '' })
  gsap.set(q('.ask-reply'), { autoAlpha: 0 })
  gsap.set(q('.onit-ring path'), { autoAlpha: 0 })
  gsap.set(copy, { y: 18, autoAlpha: 0 })
  gsap.set(q('.form-card'), { y: 120, autoAlpha: 0 })

  const tl = gsap.timeline({ paused: true })
  ostrichDraw(tl, navBird, 0, 0.8)
  tl.to(navText, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' }, 0.25)
    .to(letters, hopTo(0.032), 0.15)
    .to(q('.ask'), { clipPath: 'inset(-40% -5% -60% 0% round 999px)', duration: 1, ease: 'expo.inOut' }, 0.45)
    .set(q('.ask'), { clearProps: 'clipPath' })
    .to(copy, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 0.7)
    .to(q('.form-card'), { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', clearProps: 'transform' }, 0.45)
  if (!withOpening) {
    tl.to(bird, { yPercent: 0, rotate: 0, duration: 0.95, ease: 'back.out(1.5)' }, 1.15)
    ostrichSpecs(tl, bird, 1.85)
  }

  // The bird follows the pointer a little, and looks at the field you're filling in.
  const turn = gsap.quickTo(bird, 'rotation', { duration: 0.8, ease: 'power3.out' })
  const onMove = e => { if (tl.progress() === 1 && !root.contains(document.activeElement)) turn((e.clientX / window.innerWidth - 0.75) * 8) }
  const onFocus = e => {
    const b = e.target.getBoundingClientRect()
    if (tl.progress() === 1) turn((b.left + b.width / 2) / window.innerWidth * 9 - 9)
  }
  const onBlur = () => turn(0)
  window.addEventListener('pointermove', onMove, { passive: true })
  root.addEventListener('focusin', onFocus)
  root.addEventListener('focusout', onBlur)

  // A new sign-up: their own note flies to the pile and gets stamped.
  const onJoined = e => {
    const you = q('.pnote.is-you')
    you.querySelector('.pnote-name').textContent = e.detail.name
    const from = q('.ok-ring') || q('.form-card')
    gsap.delayedCall(0.95, () => {
      fly(from, you, q('.pile'), 1.5)
      gsap.set(you, { zIndex: 900 })
      gsap.fromTo(you.querySelector('.stamp'), { scale: 2.8, autoAlpha: 0, rotate: 6 },
        { scale: 1, autoAlpha: 1, rotate: -8, duration: 0.3, delay: 1.3, ease: 'power4.in' })
    })
    gsap.timeline({ delay: 2.5 })
      .to(bird, { yPercent: -7, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 3 })
      .to(bird.querySelector('.ost-specs'), { keyframes: [{ y: -30, duration: 0.25 }, { y: 0, duration: 0.6, ease: 'bounce.out' }] }, 0)
  }
  window.addEventListener('oddsyy:joined', onJoined)

  return {
    tl,
    bird,
    off() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('oddsyy:joined', onJoined)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('focusout', onBlur)
    },
  }
}

export default function Hero() {
  const ref = useRef(null)
  const show = useRef(null)
  const { count, addOne } = useWaitlistCount()
  const [started, setStarted] = useState(false)
  const [opening, setOpening] = useState(wantsOpening)
  const withOpening = useRef(opening)

  useLayoutEffect(() => {
    let dead = false
    const mm = gsap.matchMedia(ref.current)
    mm.add(MOTION_OK, () => {
      const hero = build(ref.current, withOpening.current)
      show.current = hero
      if (!withOpening.current) fontsReady().then(() => { if (!dead) hero.tl.play() })
      return () => hero.off()
    })
    return () => { dead = true; mm.revert() }
  }, [])

  // The request loop starts once the headline and pill are in.
  useEffect(() => {
    if (!prefersMotion() || withOpening.current) return
    let t
    fontsReady().then(() => { t = setTimeout(() => setStarted(true), 1400) })
    return () => clearTimeout(t)
  }, [])

  const onReveal = useCallback(() => {
    show.current?.tl.play()
    setTimeout(() => setStarted(true), 1500)
  }, [])
  const onDone = useCallback(() => setOpening(false), [])

  // The flown-in bird hands over to the hero's own. (Not inside onDone: GSAP would
  // count that as part of the opening and undo it when the opening is removed.)
  useLayoutEffect(() => {
    if (!opening && withOpening.current && show.current) gsap.set(show.current.bird, { autoAlpha: 1 })
  }, [opening])

  return (
    <header className="hero" ref={ref}>
      <div className="wrap hero-in" data-lean=".sheet-band">
        <h1 className="hero-title">
          <span className="sr-only">Post it. Someone&apos;s on it.</span>
          <span className="ht ht-1" aria-hidden="true"><Hop text="Post it." letters /></span>
          <span className="ht-ask" aria-hidden="true"><HeroAsk started={started} /></span>
          <span className="ht ht-2" aria-hidden="true">
            <Hop text="Someone's" letters />{' '}
            <span className="onit">
              <Hop text="on it." letters />
              <svg className="onit-ring" viewBox="0 0 300 150" preserveAspectRatio="none">
                <path pathLength="1" d="M196 14 C96 2 12 30 9 78 C6 126 92 146 176 142 C252 138 296 112 291 70 C286 28 214 8 128 18" />
              </svg>
            </span>
          </span>
        </h1>

        <div className="hero-mid">
          <p className="hero-sub">From home tutors to painters, photographers to party wizards — find local people who get things done.</p>
          <ul className="facts" aria-label="About the waitlist">
            {FACTS.map(f => <li key={f}>{f}</li>)}
          </ul>
          <WaitingCount count={count} />
        </div>

        <div className="hero-form" id="join">
          <Pile />
          <div className="peek" aria-hidden="true"><Ostrich viewBox="40 112 320 400" strokeWidth={12} rough={4} /></div>
          <WaitlistForm onJoined={addOne} />
        </div>
      </div>
      {opening && <Opening onReveal={onReveal} onDone={onDone} />}
    </header>
  )
}
