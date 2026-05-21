import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const EXAMPLES = [
  {
    cat: 'Tutoring',
    title: 'Home school teacher — Grade 3',
    desc: 'Full-time Mon–Fri. English, Math, Urdu. Must come to our home in Wapda Town.',
    budget: 'PKR 25,000 – 40,000 / mo',
  },
  {
    cat: 'Home Services',
    title: 'Painter for a 2-bedroom apartment',
    desc: 'White walls, clean finish. Paint provided. Johar Town, Lahore.',
    budget: 'PKR 8,000 – 18,000',
  },
  {
    cat: 'Cleaning',
    title: 'Deep clean before move-in',
    desc: '3-marla house. Floors, bathrooms, kitchen, fans, and windows. Reliable team needed.',
    budget: 'PKR 3,000 – 6,000',
  },
  {
    cat: 'Delivery',
    title: 'Pick up lunch from Burns Road',
    desc: 'Friday. 10 portions of biryani. Must arrive hot. Gulberg office, 1:00 PM.',
    budget: 'PKR 400 – 800',
  },
  {
    cat: 'Tech Help',
    title: "Fix my parents' home WiFi",
    desc: 'Router issue, offline for 3 days. I live in another city — please just sort it out.',
    budget: 'PKR 500 – 1,500',
  },
  {
    cat: 'Photography',
    title: 'Event photographer — birthday party',
    desc: '20–25 guests, 3 hours, indoor venue in DHA. Edited photos within 3 days.',
    budget: 'PKR 8,000 – 15,000',
  },
]

export default function Examples() {
  const ref = useRef(null)

  useEffect(() => {
    ref.current.querySelectorAll('.ex-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1, y: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: (i % 3) * 0.07,
        scrollTrigger: { trigger: card, start: 'top 90%' },
      })
    })
  }, [])

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-inner" ref={ref}>
        <p className="s-label">Example requests</p>
        <h2 className="s-title">Real jobs,<br /><em>real people.</em></h2>
        <div className="ex-grid">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="ex-card">
              <p className="ex-cat">{ex.cat}</p>
              <p className="ex-title">{ex.title}</p>
              <p className="ex-desc">{ex.desc}</p>
              <p className="ex-budget">{ex.budget}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
