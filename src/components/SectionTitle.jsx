import { useRef } from 'react'
import Hop from './Hop'
import { gsap, hopSet, hopTo, onArrive, useMotion } from '../lib/motion'

function setup(root) {
  const words = root.querySelectorAll('.hop-i')
  hopSet(words)
  gsap.set(root.querySelector('.s-label'), { y: 14, autoAlpha: 0 })
  gsap.set(root.querySelector('.s-under'), { clipPath: 'inset(-20% 100% -20% 0)' })
  onArrive(root, 'top 84%')
    .to(root.querySelector('.s-label'), { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
    .to(words, hopTo(0.07), 0.08)
    .to(root.querySelector('.s-under'), { clipPath: 'inset(-20% 0% -20% 0)', duration: 0.7, ease: 'power2.inOut' }, 0.5)
}

// The label + two-line heading every section opens with. The second line gets a
// hand-drawn underline.
export default function SectionTitle({ label, line1, line2 }) {
  const ref = useRef(null)
  useMotion(ref, setup)
  return (
    <div className="s-head" ref={ref}>
      <p className="s-label">{label}</p>
      <h2 className="s-title">
        <span className="sr-only">{line1} {line2}</span>
        <span className="s-line" aria-hidden="true"><Hop text={line1} /></span>
        <span className="s-line s-line-2" aria-hidden="true">
          <Hop text={line2} />
          <svg className="s-under" viewBox="0 0 320 20" preserveAspectRatio="none">
            <path d="M3 13 C50 5 108 4 160 9 S262 17 317 6" />
          </svg>
        </span>
      </h2>
    </div>
  )
}
