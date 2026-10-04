import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { COUNT_SHOW_FROM } from '../config'

const fmt = n => Math.round(n).toLocaleString('en-US')

// "● 1,234 people already waiting" — the real count from stats/waitlist.
// Renders nothing until the number has loaded, or while it's below COUNT_SHOW_FROM.
export default function WaitingCount({ count }) {
  const rootRef = useRef(null)
  const numRef = useRef(null)
  const shown = useRef(null)
  const mountedAt = useRef(0)

  useEffect(() => { mountedAt.current = performance.now() }, [])

  const visible = count !== null && count >= COUNT_SHOW_FROM

  useEffect(() => {
    if (!visible) return
    const el = numRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (shown.current === null) {
      // First appearance: fade in and count up from zero, after the hero's load
      // animation has brought in the chips above (about 1.5 s after mounting).
      if (reduce) {
        el.textContent = fmt(count)
      } else {
        const delay = Math.max(0, 1.5 - (performance.now() - mountedAt.current) / 1000)
        gsap.fromTo(rootRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' })
        const n = { v: 0 }
        el.textContent = '0'
        gsap.to(n, { v: count, duration: 1.4, delay, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(n.v) } })
      }
    } else {
      // The visitor just joined: show the new number with a small pop.
      el.textContent = fmt(count)
      if (!reduce) gsap.fromTo(el, { scale: 1.35 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' })
    }
    shown.current = count
  }, [count, visible])

  if (!visible) return null
  return (
    <p className="waiting" ref={rootRef} aria-live="polite">
      <span className="waiting-dot" aria-hidden="true" />
      <span><strong ref={numRef} className="waiting-num">{fmt(count)}</strong>{' '}
        {count === 1 ? 'person is' : 'people are'} already waiting</span>
    </p>
  )
}
