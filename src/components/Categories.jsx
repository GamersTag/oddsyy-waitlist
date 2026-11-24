import { useEffect, useRef, useState } from 'react'
import SectionTitle from './SectionTitle'
import { CATEGORIES, photo } from '../data/content'
import { gsap, onArrive, prefersMotion, useInView, useMotion } from '../lib/motion'

// The photos arrive as one deck in the middle and are dealt out to both sides.
function setup(root) {
  const strips = gsap.utils.toArray(root.querySelectorAll('.fan-in'))
  const box = root.getBoundingClientRect()
  const down = getComputedStyle(root).flexDirection === 'column'
  strips.forEach((el, i) => {
    const b = el.getBoundingClientRect()
    gsap.set(el, {
      x: down ? 0 : box.left + box.width / 2 - (b.left + b.width / 2),
      y: down ? Math.min(0, box.top + 60 - b.top) : 320,
      rotate: (i - 5.5) * (down ? 0.8 : 2.4), scale: 0.9, autoAlpha: 0, zIndex: i,
    })
  })
  onArrive(root, 'top 76%')
    .to(strips, { autoAlpha: 1, y: down ? '+=0' : 0, duration: 0.5, stagger: 0.025, ease: 'power3.out' })
    .to(strips, { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.95, ease: 'back.out(1.15)', stagger: { each: 0.035, from: 'center' }, clearProps: 'transform,zIndex' }, 0.5)
}

// A hand of photos. One is open at a time: it moves along by itself until you
// point at (or tap) one.
export default function Categories() {
  const ref = useRef(null)
  const [open, setOpen] = useState(6)
  const [held, setHeld] = useState(false)
  const inView = useInView(ref, { threshold: 0.35 })
  useMotion(ref, setup)

  useEffect(() => {
    if (!inView || held || !prefersMotion()) return
    const t = setInterval(() => setOpen(o => (o + 5) % CATEGORIES.length), 2600)
    return () => clearInterval(t)
  }, [inView, held])

  return (
    <section className="section sheet sheet-fan">
      <div className="wrap">
        <SectionTitle label="What you can post" line1="Any request." line2="No judgment." />
      </div>
      <ul className="fan" ref={ref} onPointerLeave={e => e.pointerType === 'mouse' && setHeld(false)}>
        {CATEGORIES.map((c, i) => (
          <li key={c.key} className={`fan-strip ${i === open ? 'is-open' : ''}`}
            onPointerEnter={e => { if (e.pointerType === 'mouse') { setHeld(true); setOpen(i) } }}
            onClick={() => { setHeld(true); setOpen(i) }}>
            <div className="fan-in">
              <img src={photo(`fan-${c.key}`)} alt="" loading="lazy" decoding="async" />
              <span className="fan-name">{c.name}</span>
              <span className="fan-ask">&ldquo;{c.ask}&rdquo;</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
