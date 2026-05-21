import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { n: '1', title: 'Post your request', body: 'Describe what you need, set a budget and deadline. Takes 60 seconds.' },
  { n: '2', title: 'Get offers from Hustlers', body: 'Local people who can help send their price and message. You pick who to hire.' },
  { n: '3', title: 'Get it done', body: "Chat, confirm, pay — all in one place. Rate your Hustler when it's done." },
]

export default function HowItWorks() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.querySelectorAll('.how-card').forEach((card, i) => {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 88%' } })
    })
  }, [])
  return (
    <section className="section">
      <div className="section-inner" ref={ref}>
        <p className="s-label">How it works</p>
        <h2 className="s-title">Three steps.<br /><em>That's it.</em></h2>
        <div className="how-grid">
          {STEPS.map(s => (
            <div key={s.n} className="how-card" data-n={s.n}>
              <div className="how-num">{s.n}</div>
              <p className="how-title">{s.title}</p>
              <p className="how-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
