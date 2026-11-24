import { useEffect, useRef } from 'react'
import { ASKS, photo } from '../data/content'
import { gsap, prefersMotion } from '../lib/motion'
import { fly, SLOTS, slotStyle } from '../lib/notes'

const TYPE = 0.03 // seconds per letter
const WIPE = 0.012

// One request, as one chain of events: it's typed, it's posted (a note flies from
// the pill down to the pile), someone's on it (the stamp, the ring, the reply).
function playAsk(root, i, turn) {
  const ask = ASKS[i]
  const q = s => root.querySelector(s)
  const photos = root.querySelectorAll('.ask-photo img')
  const reply = q('.ask-reply')
  const text = q('.ask-text')
  const pile = document.querySelector('.pile')
  const notes = [...pile.querySelectorAll('.pnote:not(.is-you)')]
  const note = notes[i]
  const slot = turn % SLOTS
  const ring = document.querySelector('.onit-ring path')
  const bird = document.querySelector('.peek .ostrich')
  const n = { v: 0 }
  const write = () => { text.textContent = ask.text.slice(0, Math.round(n.v)) }

  gsap.set([ring, reply], { autoAlpha: 0 })
  write()
  const tl = gsap.timeline()
  tl.call(() => {
    gsap.set(photos, { zIndex: 0 })
    gsap.set(photos[i], { zIndex: 1 })
    q('.ask-who').textContent = ask.who
    q('.ask-price').textContent = ask.reply
  })
    .fromTo(photos[i], { clipPath: 'circle(0% at 30% 60%)', scale: 1.25 },
      { clipPath: 'circle(120% at 30% 60%)', scale: 1, duration: 0.8, ease: 'power3.out' })
    .to(n, { v: ask.text.length, duration: ask.text.length * TYPE, ease: 'none', onUpdate: write }, 0.1)
    // whoever stands in this slot (or still is this note) makes room
    .call(() => {
      notes.forEach(o => {
        if (Number(o.dataset.slot) === slot || o === note) {
          o.dataset.slot = ''
          if (o !== note) gsap.to(o, { y: '+=260', rotate: '+=14', duration: 0.5, ease: 'power2.in' })
        }
      })
    }, null, '+=0.1')
    .to(q('.ask-in'), { scale: 0.965, duration: 0.11, yoyo: true, repeat: 1, ease: 'power2.inOut' })
    .add('fly', '-=0.1')
    .call(() => fly(root.querySelector('.ask-photo'), note, pile, slot), null, 'fly')
    .fromTo(note.querySelector('.stamp'), { scale: 2.8, autoAlpha: 0, rotate: 6 },
      { scale: 1, autoAlpha: 1, rotate: -10, duration: 0.3, ease: 'power4.in' }, 'fly+=1.3')
    .to(bird, { keyframes: [{ yPercent: 5, duration: 0.1 }, { yPercent: 0, duration: 0.45, ease: 'back.out(3)' }] }, 'fly+=1.58')
    .fromTo(reply, { scale: 0, rotate: -16, autoAlpha: 0 },
      { scale: 1, rotate: -3, autoAlpha: 1, duration: 0.6, ease: 'back.out(2.2)' }, 'fly+=1.6')
    .set(ring, { autoAlpha: 1 }, 'fly+=1.7') // hidden until now: its round cap would show as a dot
    .fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 'fly+=1.7')
    .to(bird.querySelector('.ost-specs'), { keyframes: [{ y: -13, rotate: -5, duration: 0.2, ease: 'power2.out' }, { y: 0, rotate: 0, duration: 0.5, ease: 'bounce.out' }], transformOrigin: '50% 50%' }, 'fly+=1.8')
    .to({}, { duration: 1.6 })
    .to(reply, { scale: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' })
    .to(ring, { autoAlpha: 0, duration: 0.3 }, '<')
    .to(n, { v: 0, duration: ask.text.length * WIPE, ease: 'none', onUpdate: write }, '<')
  return tl
}

// The headline's other half. A picture of the product, so it's hidden from screen
// readers and labelled as an example.
export default function HeroAsk({ started }) {
  const ref = useRef(null)
  const turn = useRef(0)

  // Sticky, so "on screen" isn't enough: pause once the next sheet has covered it.
  // The request that's under way finishes first, so no note is left in mid-air.
  useEffect(() => {
    if (!started || !prefersMotion()) return
    const ctx = gsap.context(() => {})
    let alive = true
    let busy = false
    const seen = () => window.scrollY < window.innerHeight * 0.9
    const run = () => {
      busy = alive && seen()
      if (!busy) return
      const t = turn.current++
      ctx.add(() => playAsk(ref.current, t % ASKS.length, t).eventCallback('onComplete', run))
    }
    const wake = () => { if (!busy) run() }
    run()
    window.addEventListener('scroll', wake, { passive: true })
    return () => {
      alive = false
      window.removeEventListener('scroll', wake)
      ctx.kill()
    }
  }, [started])

  const first = ASKS[0]
  return (
    <span className="ask" ref={ref}>
      <span className="ask-in">
        <span className="ask-photo">
          {ASKS.map((a, i) => <img key={a.photo} src={photo(a.photo)} alt="" style={{ zIndex: i === 0 ? 1 : 0 }} />)}
        </span>
        <span className="ask-body">
          <span className="ask-cap">Example request</span>
          <span className="ask-copy"><span className="ask-text">{first.text}</span><i className="ask-caret" /></span>
        </span>
      </span>
      <span className="ask-reply">
        <span className="ask-who">{first.who}</span>
        <span>On it! <b className="ask-price">{first.reply}</b></span>
      </span>
    </span>
  )
}

// The notes that have been posted, standing in a tray behind the form.
export function Pile() {
  return (
    <div className="pile" aria-hidden="true">
      {ASKS.map((a, i) => (
        <div className="pnote" key={a.photo} style={{ left: slotStyle(i % SLOTS).left }} data-slot="">
          <img src={photo(a.photo)} alt="" />
          <span className="pnote-text">{a.text}</span>
          <span className="stamp">On it!</span>
        </div>
      ))}
      <div className="pnote is-you" data-slot="">
        <span className="pnote-text">You&apos;re in</span>
        <b className="pnote-name" />
        <span className="stamp">On the list!</span>
      </div>
    </div>
  )
}
