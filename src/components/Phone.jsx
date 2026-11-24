import { useLayoutEffect, useRef } from 'react'
import { photo } from '../data/content'
import { gsap, prefersMotion } from '../lib/motion'
import { Icon } from './Icon'
import Ostrich from './Ostrich'

// The three steps, played out on the app's own screens with one of the example
// requests. Screens are drawn in `em` so they scale with the phone.

const OFFERS = [
  { who: 'HR', name: 'Hamza R.', price: 'PKR 6,500', say: 'I bring a fast lens and fish treats.' },
  { who: 'SN', name: 'Sana N.',  price: 'PKR 5,500', say: 'Eight cats? Finally, a challenge.' },
  { who: 'UA', name: 'Usman A.', price: 'PKR 4,800', say: 'Mildly allergic. Fully committed.' },
]
const STAGES = [
  ['Offer accepted', 'PKR 5,500'],
  ['On the way', 'Sana set off at 4:30'],
  ['Started', 'Cake, cats, camera'],
  ['Done', 'You check and confirm'],
]
const TITLE = "Photographer for my cat's birthday party"

function Post() {
  return (
    <>
      <div className="ph-bar"><span className="ph-ico"><Icon name="close" /></span><b>Post a task</b><span className="ph-ico ph-ghost" /></div>
      <div className="ph-steps">{[0, 1, 2, 3, 4].map(i => <i key={i}><u /></i>)}</div>
      <p className="ph-h">What do you need?</p>
      <div className="ph-field"><span className="p1-type">{TITLE}</span></div>
      <div className="ph-shot p1-pop"><img src={photo('note-cat')} alt="" loading="lazy" /><span className="ph-chip">Events</span></div>
      <div className="ph-row p1-pop"><Icon name="tag" /><span>Budget</span><b>PKR 4,000 – 8,000</b></div>
      <div className="ph-row p1-pop"><Icon name="clock" /><span>When</span><b>Saturday, 5 pm</b></div>
      <div className="ph-row p1-pop"><Icon name="pin" /><span>Where</span><b>Johar Town</b></div>
      <div className="ph-btn p1-btn"><span className="p1-a">Post it</span><span className="p1-b"><Icon name="tick" width={3} />Posted</span></div>
    </>
  )
}
function playPost(tl, q, qa) {
  const type = q('.p1-type')
  const n = { v: 0 }
  gsap.set(type, { textContent: '' })
  gsap.set(qa('.ph-steps u'), { scaleX: 0 })
  gsap.set(qa('.p1-pop'), { y: 26, scale: 0.9, autoAlpha: 0 })
  gsap.set(q('.p1-a'), { autoAlpha: 1 })
  gsap.set(q('.p1-b'), { yPercent: 120, autoAlpha: 0 })
  gsap.set(q('.p1-btn'), { backgroundColor: '#5A1226' })
  tl.to(qa('.ph-steps u'), { scaleX: 1, duration: 0.45, stagger: 0.42, ease: 'power2.out' }, 0.2)
    .to(n, { v: TITLE.length, duration: 1.25, ease: 'none', onUpdate: () => { type.textContent = TITLE.slice(0, Math.round(n.v)) } }, 0.25)
    .to(qa('.p1-pop'), { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(1.7)' }, 1.2)
    .to(q('.p1-btn'), { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1 }, '+=0.25')
    .to(q('.p1-a'), { yPercent: -120, autoAlpha: 0, duration: 0.35, ease: 'power3.inOut' }, '<0.1')
    .to(q('.p1-b'), { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.inOut' }, '<')
    .to(q('.p1-btn'), { backgroundColor: '#1F7A3A', duration: 0.3 }, '<')
}

function Offers() {
  return (
    <>
      <div className="ph-bar"><span className="ph-ico"><Icon name="back" /></span><b>Your request</b><span className="ph-ico ph-ghost" /></div>
      <div className="ph-task"><img src={photo('note-cat')} alt="" loading="lazy" /><span>{TITLE}</span></div>
      <p className="ph-h ph-h-row">Offers <em className="p2-count">3</em></p>
      {OFFERS.map((o, i) => (
        <div className={`ph-offer ${i === 1 ? 'is-pick' : 'is-other'}`} key={o.who}>
          <div className="ph-offer-top"><span className="ph-av">{o.who}</span><b>{o.name}</b><strong>{o.price}</strong></div>
          {i === 1
            ? <div className="ph-btn ph-btn-s p2-btn"><span className="p2-a">Accept</span><span className="p2-b"><Icon name="tick" width={3} />Accepted</span></div>
            : <div className="ph-btn ph-btn-s ph-btn-idle"><span>Accept</span></div>}
        </div>
      ))}
    </>
  )
}
function playOffers(tl, q, qa) {
  const cards = qa('.ph-offer')
  const count = q('.p2-count')
  gsap.set(cards, { x: 70, rotate: 5, autoAlpha: 0 })
  gsap.set(q('.p2-a'), { autoAlpha: 1 })
  gsap.set(q('.p2-b'), { yPercent: 120, autoAlpha: 0 })
  gsap.set(q('.p2-btn'), { backgroundColor: '#5A1226' })
  gsap.set(count, { textContent: '0' })
  cards.forEach((c, i) => {
    const at = 0.35 + i * 0.5
    tl.to(c, { x: 0, rotate: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.6)' }, at)
      .call(() => { count.textContent = i + 1 }, null, at + 0.1)
      .fromTo(count, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, at + 0.1)
  })
  tl.to(q('.p2-btn'), { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1 }, '+=0.45')
    .to(q('.p2-a'), { yPercent: -120, autoAlpha: 0, duration: 0.35, ease: 'power3.inOut' }, '<0.1')
    .to(q('.p2-b'), { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.inOut' }, '<')
    .to(q('.p2-btn'), { backgroundColor: '#1F7A3A', duration: 0.3 }, '<')
    .to(q('.is-pick'), { scale: 1.035, duration: 0.5, ease: 'back.out(2)' }, '<')
    .to(qa('.is-other'), { autoAlpha: 0.42, scale: 0.97, duration: 0.5 }, '<')
}

function Job() {
  return (
    <>
      <div className="ph-bar"><span className="ph-ico"><Icon name="back" /></span><b>Your job</b><span className="ph-ico ph-ghost" /></div>
      <div className="ph-task"><img src={photo('note-cat')} alt="" loading="lazy" /><span>{TITLE}</span></div>
      <div className="ph-line">
        <i className="ph-rail"><u /></i>
        {STAGES.map(([a, b]) => (
          <div className="ph-stage" key={a}><span className="ph-dot"><Icon name="tick" width={3.4} /></span><div><b>{a}</b><small>{b}</small></div></div>
        ))}
      </div>
      <div className="ph-rate"><b>Rate each other</b><div className="ph-stars">{[0, 1, 2, 3, 4].map(i => (
        <svg key={i} viewBox="0 0 24 24"><path d="M12 2.800l2.800 5.900 6.400.8-4.700 4.500 1.200 6.400L12 17.300l-5.700 3.100 1.200-6.400L2.800 9.500l6.400-.8z" /></svg>
      ))}</div></div>
    </>
  )
}
function playJob(tl, q, qa) {
  const dots = qa('.ph-dot')
  gsap.set(qa('.ph-dot .icon'), { scale: 0 })
  gsap.set(dots, { backgroundColor: '#FFFFFF', borderColor: '#EFE2D9' })
  gsap.set(qa('.ph-stage > div'), { autoAlpha: 0.4 })
  gsap.set(q('.ph-rail u'), { scaleY: 0 })
  gsap.set(q('.ph-rate'), { y: 24, autoAlpha: 0 })
  gsap.set(qa('.ph-stars svg'), { scale: 0, rotate: -40 })
  dots.forEach((d, i) => {
    const at = 0.3 + i * 0.38
    tl.to(d, { backgroundColor: '#E5F2DC', borderColor: '#1F7A3A', duration: 0.25 }, at)
      .to(d.querySelector('.icon'), { scale: 1, duration: 0.45, ease: 'back.out(3)' }, at + 0.05)
      .to(qa('.ph-stage > div')[i], { autoAlpha: 1, duration: 0.3 }, at)
    if (i < dots.length - 1) tl.to(q('.ph-rail u'), { scaleY: (i + 1) / (dots.length - 1), duration: 0.45, ease: 'power2.inOut' }, at + 0.15)
  })
  tl.to(q('.ph-rate'), { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)' }, '+=0.1')
    .to(qa('.ph-stars svg'), { scale: 1, rotate: 0, duration: 0.45, stagger: 0.09, ease: 'back.out(2.6)' }, '<0.2')
}

const SCREENS = [[Post, playPost], [Offers, playOffers], [Job, playJob]]

// One screen. Plays from the start every time it becomes active; with reduced
// motion (or before it's reached) it simply shows its finished state.
function Screen({ i, active, state }) {
  const ref = useRef(null)
  const [View, play] = SCREENS[i]
  useLayoutEffect(() => {
    if (!active || !prefersMotion()) return
    const root = ref.current
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 })
      play(tl, s => root.querySelector(s), s => [...root.querySelectorAll(s)])
    }, ref)
    // Put typed text and the counter back too: gsap only restores styles.
    const texts = [['.p1-type', TITLE], ['.p2-count', '3']]
    return () => {
      ctx.revert()
      texts.forEach(([s, t]) => { const el = root.querySelector(s); if (el) el.textContent = t })
    }
  }, [active, play])
  // GSAP moves .ph-in, never .ph-screen: it would absorb that element's CSS `translate`.
  return <div className={`ph-screen ${state}`} ref={ref}><div className="ph-in"><View /></div></div>
}

// `step` picks the screen; below 0 it's still on the app's splash.
export default function Phone({ step, playing = true }) {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-in">
        <span className="phone-cam" />
        <div className="ph-splash"><Ostrich viewBox="40 90 330 330" strokeWidth={17} rough={3} /><b>odds<span>yy</span></b></div>
        {[0, 1, 2].map(i => (
          <Screen key={i} i={i} active={i === step && playing} state={i === step ? 'is-on' : i < step ? 'is-past' : 'is-next'} />
        ))}
      </div>
    </div>
  )
}
