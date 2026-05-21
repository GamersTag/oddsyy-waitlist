import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const CATS = [
  'Home Services', 'Repairs & Fixes', 'Tutoring', 'Deliveries',
  'Cleaning', 'Tech Help', 'Beauty & Grooming', 'Transport',
  'Creative Work', 'Events & Photography', 'Writing & Content', 'Anything else',
]

export default function Categories() {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.querySelectorAll('.cat-chip').forEach((chip, i) => {
      gsap.to(chip, {
        opacity: 1, y: 0,
        duration: 0.45,
        ease: 'power2.out',
        delay: i * 0.04,
        scrollTrigger: { trigger: chip, start: 'top 92%' },
      })
    })
  }, [])

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-inner" ref={ref}>
        <p className="s-label">What you can post</p>
        <h2 className="s-title">Any request.<br /><em>Any category.</em></h2>
        <div className="cat-chips">
          {CATS.map(c => (
            <span key={c} className="cat-chip">{c}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
