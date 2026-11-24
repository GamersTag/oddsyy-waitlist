import { useRef } from 'react'
import { photo } from '../data/content'
import { gsap, hopSet, hopTo, onArrive, scrollToForm, useMotion } from '../lib/motion'
import { Icon } from './Icon'
import Skyline, { Birds, Rickshaw } from './Skyline'

const CITY = [...'Lahore']

// The letters hop in, the city draws itself along the ground, and traffic starts.
function setup(root) {
  const letters = root.querySelectorAll('.city-l')
  const lines = root.querySelectorAll('.sky-l')
  const traffic = root.querySelectorAll('.rickshaw, .birds')
  hopSet(letters)
  gsap.set(root.querySelectorAll('.closing-lead, .closing .btn'), { y: 24, autoAlpha: 0 })
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 })
  gsap.set(traffic, { autoAlpha: 0 })
  onArrive(root, 'top 68%')
    .to(root.querySelector('.closing-lead'), { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' })
    .to(letters, hopTo(0.09, { duration: 1 }), 0.1)
    .to(root.querySelector('.btn'), { y: 0, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'transform' }, 0.75)
  onArrive(root.querySelector('.skyline'), 'top 96%')
    .to(lines, { autoAlpha: 1, duration: 0.01, stagger: 0.045 }, 0)
    .to(lines, { strokeDashoffset: 0, duration: 0.9, stagger: 0.045, ease: 'power2.inOut' }, 0)
    .to(traffic, { autoAlpha: 1, duration: 0.4 }, 1.6)
  // The photo inside the letters drifts for as long as it's on screen.
  gsap.fromTo(letters, { '--pan': 0 }, { '--pan': 1, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1,
    scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' } })
}

// "Launching in Lahore", with the city's own tilework inside the letters.
export default function Closing() {
  const ref = useRef(null)
  useMotion(ref, setup)
  const bg = `url(${photo('lahore-wazir')})`
  return (
    <section className="closing sheet" ref={ref}>
      <div className="wrap">
        <h2 className="closing-h">
          <span className="sr-only">Launching in Lahore</span>
          <span className="closing-lead" aria-hidden="true">Launching in</span>
          <span className="city" aria-hidden="true">
            {CITY.map((c, i) => <span key={i} className="city-l" style={{ '--n': i, backgroundImage: bg }}>{c}</span>)}
          </span>
        </h2>
        <button type="button" className="btn btn-lg" onClick={scrollToForm}><span>Reserve my spot</span><Icon name="arrow" size={22} /></button>
      </div>
      <div className="street" aria-hidden="true">
        <Birds />
        <Skyline />
        <Rickshaw />
      </div>
    </section>
  )
}
