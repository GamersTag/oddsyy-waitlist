import { useRef } from 'react'
import { CATEGORIES, EXAMPLES, photo } from '../data/content'
import { gsap, scrollVelocity, useMotion } from '../lib/motion'

// Two rows drifting opposite ways. They hurry when you scroll and turn round with you.
function setup(root) {
  const rows = [...root.querySelectorAll('.band-track')].map((el, i) => {
    const loop = gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration: i ? 70 : 46, ease: 'none', repeat: -1 })
    loop.totalTime(loop.duration() * 100) // so it can run backwards for as long as it likes
    return { loop, way: i ? -1 : 1 }
  })
  let dir = 1
  let speed = 1
  const tick = () => {
    const v = scrollVelocity()
    if (Math.abs(v) > 1) dir = Math.sign(v)
    speed += (dir * (1 + Math.min(Math.abs(v) / 9, 5)) - speed) * 0.08
    rows.forEach(r => r.loop.timeScale(speed * r.way))
  }
  gsap.ticker.add(tick)
  return () => gsap.ticker.remove(tick)
}

export default function Marquee() {
  const ref = useRef(null)
  useMotion(ref, setup)
  return (
    <div className="band sheet sheet-band" ref={ref} aria-hidden="true">
      <div className="band-track">
        {[0, 1].map(k => (
          <div className="band-set" key={k}>
            {CATEGORIES.map(c => (
              <span className="band-item" key={c.key}>
                <img src={photo(`thumb-${c.key}`)} alt="" width="104" height="64" />{c.name}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="band-track band-small">
        {[0, 1].map(k => (
          <div className="band-set" key={k}>
            {EXAMPLES.map(e => <span className="band-ask" key={e.title}>{e.title}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}
