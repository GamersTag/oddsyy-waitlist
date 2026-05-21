import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const CATS = [
  { emoji: '🏠', name: 'Home Services' }, { emoji: '🔧', name: 'Repair & Fix' },
  { emoji: '📚', name: 'Tutoring' },      { emoji: '📦', name: 'Delivery' },
  { emoji: '🧹', name: 'Cleaning' },      { emoji: '💻', name: 'Tech Help' },
  { emoji: '💅', name: 'Beauty' },        { emoji: '🚗', name: 'Transport' },
  { emoji: '🎨', name: 'Creative' },      { emoji: '🎉', name: 'Events' },
  { emoji: '✍️', name: 'Writing' },       { emoji: '✨', name: 'Weird & Fun' },
]

export default function Categories() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.querySelectorAll('.cat-card').forEach((card, i) => {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)', delay: (i % 6) * 0.06, scrollTrigger: { trigger: card, start: 'top 90%' } })
    })
  }, [])
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-inner" ref={ref}>
        <p className="s-label">What you can post</p>
        <h2 className="s-title">Any request.<br /><em>No judgment.</em></h2>
        <div className="cat-grid">
          {CATS.map(c => (
            <div key={c.name} className="cat-card">
              <span className="cat-emoji">{c.emoji}</span>
              <span className="cat-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
