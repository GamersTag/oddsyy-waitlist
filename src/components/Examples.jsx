import { useEffect, useRef, useState } from 'react'
import SectionTitle from './SectionTitle'
import { Icon } from './Icon'
import { EXAMPLES, photo } from '../data/content'
import { gsap, MOTION_OK, onArrive, useInView, useMedia } from '../lib/motion'

const N = EXAMPLES.length
const HOLD = 1.9 // seconds a stamped card waits before the wheel turns

// Cards round the rim of a wheel whose hub is far below the screen. `pos` is which
// card is at the top; everything else follows from it.
function makeWheel(root, onFront) {
  const cards = [...root.querySelectorAll('.wcard')]
  const s = { pos: -4, y: 0 }
  let R, deg, tween, next, held = false, active = false

  const size = () => {
    const small = root.offsetWidth < 760
    R = small ? 1150 : 1900
    deg = small ? 15.5 : 11.6
    cards.forEach(c => { c.style.transformOrigin = `50% ${R}px` })
    render()
  }
  const render = () => {
    const step = deg
    cards.forEach((c, i) => {
      const d = gsap.utils.wrap(-N / 2, N / 2, i - s.pos)
      const a = d * step
      const far = Math.abs(a) > 62
      c.style.visibility = far ? 'hidden' : 'visible'
      if (far) return
      const near = Math.max(0, 1 - Math.abs(d))
      c.style.transform = `translateX(-50%) rotate(${a}deg) scale(${0.9 + near * 0.1})`
      c.style.zIndex = String(100 - Math.round(Math.abs(d) * 10))
    })
  }
  const front = () => gsap.utils.wrap(0, N, Math.round(s.pos))
  const clear = () => { next?.kill(); cards.forEach(c => c.classList.remove('is-on')) }
  const settle = () => {
    cards[front()].classList.add('is-on')
    onFront(front())
    wait()
  }
  const wait = () => {
    next?.kill()
    if (active && !held) next = gsap.delayedCall(HOLD, () => turn(1))
  }
  const to = (pos, { duration = 1.15, ease = 'back.out(1.25)' } = {}) => {
    clear()
    tween?.kill()
    tween = gsap.to(s, { pos, duration, ease, onUpdate: render, onComplete: settle })
  }
  const turn = n => to(Math.round(s.pos) + n)

  // Drag to spin; let go and it rolls on to the nearest card.
  let drag = null
  const down = e => {
    if (e.button) return
    drag = { x: e.clientX, pos: s.pos, moved: 0, v: 0, t: e.timeStamp, last: e.clientX }
    held = true
    clear()
    tween?.kill()
  }
  const move = e => {
    if (!drag) return
    const dx = e.clientX - drag.x
    drag.moved = Math.max(drag.moved, Math.abs(dx))
    if (drag.moved > 6) { root.setPointerCapture?.(e.pointerId); root.classList.add('is-drag') }
    drag.v = (e.clientX - drag.last) / Math.max(1, e.timeStamp - drag.t)
    drag.last = e.clientX
    drag.t = e.timeStamp
    s.pos = drag.pos - dx / (R * deg * Math.PI / 180)
    render()
  }
  const up = e => {
    if (!drag) return
    const d = drag
    drag = null
    held = e.pointerType === 'mouse' && root.matches(':hover')
    root.classList.remove('is-drag')
    if (d.moved > 6) to(Math.round(s.pos - d.v * 1.1), { duration: 0.9, ease: 'power3.out' })
    else {
      const card = e.target.closest?.('.wcard')
      const i = card ? cards.indexOf(card) : front()
      turn(Math.round(gsap.utils.wrap(-N / 2, N / 2, i - Math.round(s.pos))))
    }
  }
  const enter = e => { if (e.pointerType === 'mouse') { held = true; next?.kill() } }
  const leave = e => { if (e.pointerType === 'mouse' && !drag) { held = false; wait() } }

  root.addEventListener('pointerdown', down)
  root.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
  root.addEventListener('pointerenter', enter)
  root.addEventListener('pointerleave', leave)
  window.addEventListener('resize', size)
  size()

  return {
    turn,
    // Spin in from the side, then start turning by itself.
    start() { active = true; to(0, { duration: 1.9, ease: 'back.out(1.1)' }) },
    run(on) { active = on; if (on) wait(); else next?.kill() },
    off() {
      tween?.kill()
      next?.kill()
      root.removeEventListener('pointerdown', down)
      root.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      root.removeEventListener('pointerenter', enter)
      root.removeEventListener('pointerleave', leave)
      window.removeEventListener('resize', size)
    },
  }
}

function Card({ ex, className = '' }) {
  return (
    <li className={`wcard ${className} ${ex.photo ? 'has-photo' : `tone-${ex.tone}`}`}>
      <div className="wcard-in">
        {ex.photo && <div className="note-photo"><img src={photo(ex.photo)} alt="" loading="lazy" decoding="async" draggable="false" /></div>}
        <div className="note-body">
          <p className="note-cat">{ex.cat}</p>
          <h3 className="note-title">{ex.title}</h3>
          <p className="note-desc">{ex.desc}</p>
          <p className="note-budget">{ex.budget}</p>
        </div>
        <span className="stamp" aria-hidden="true">On it!</span>
      </div>
    </li>
  )
}

export default function Examples() {
  const ref = useRef(null)
  const wheel = useRef(null)
  const [at, setAt] = useState(0)
  const moving = useMedia(MOTION_OK)
  const inView = useInView(ref, { threshold: 0.25 })

  useEffect(() => {
    if (!moving) return
    const w = makeWheel(ref.current, setAt)
    wheel.current = w
    const ctx = gsap.context(() => {
      gsap.set(ref.current, { y: 260 })
      onArrive(ref.current, 'top 85%')
        .to(ref.current, { y: 0, duration: 1.3, ease: 'power3.out' })
        .call(() => w.start(), null, 0)
    })
    return () => { ctx.revert(); w.off(); wheel.current = null }
  }, [moving])

  useEffect(() => { wheel.current?.run(inView) }, [inView, moving])

  return (
    <section className="section sheet sheet-dark" data-dark>
      <div className="wrap wheel-head">
        <SectionTitle label="Example requests" line1="From everyday" line2="to unexpected." />
      </div>
      <ul className={moving ? 'wheel' : 'wheel-flat wrap'} ref={ref}>
        {EXAMPLES.map(ex => <Card key={ex.title} ex={ex} />)}
      </ul>
      {moving && (
        <div className="wheel-nav">
          <button type="button" onClick={() => wheel.current?.turn(-1)} aria-label="Previous request"><Icon name="back" size={22} /></button>
          <span aria-hidden="true">{at + 1} / {N}</span>
          <button type="button" onClick={() => wheel.current?.turn(1)} aria-label="Next request"><Icon name="arrow" size={22} /></button>
        </div>
      )}
    </section>
  )
}
