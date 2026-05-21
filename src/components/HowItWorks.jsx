import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    title: 'Post your request',
    body: 'Describe what you need, set a budget and a deadline. Takes under a minute.',
  },
  {
    n: '02',
    title: 'Receive offers',
    body: 'Local Hustlers who can help send their price and a short message. You choose who to hire.',
  },
  {
    n: '03',
    title: 'Get it done',
    body: 'Chat, confirm, and pay — all in one place. Rate your Hustler once the job is complete.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.querySelectorAll('.how-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1, y: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      })
    })
  }, [])

  return (
    <section className="section">
      <div className="section-inner" ref={ref}>
        <p className="s-label">How it works</p>
        <h2 className="s-title">Simple by design.</h2>
        <div className="how-grid">
          {STEPS.map(s => (
            <div key={s.n} className="how-card">
              <p className="how-step">{s.n}</p>
              <p className="how-title">{s.title}</p>
              <p className="how-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
