import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Ostrich from './Ostrich'
import Hop from './Hop'
import PoweredBy from './PoweredBy'
import { gsap, hopSet, hopTo, onArrive, useMotion } from '../lib/motion'
import { ostrichReady, ostrichSpecs } from '../lib/ostrich'

// The ostrich comes up from the bottom of the page and puts its sunglasses on.
function setup(root) {
  const bird = root.querySelector('.ostrich')
  const words = root.querySelectorAll('.hop-i')
  ostrichReady(bird)
  gsap.set(bird.querySelectorAll('.ost-line path'), { strokeDashoffset: 0, autoAlpha: 1 })
  gsap.set(bird, { yPercent: 102, rotate: 8, transformOrigin: '60% 100%' })
  hopSet(words)
  const tl = onArrive(root, 'top 62%')
  tl.to(words, hopTo(0.1))
    .to(bird, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'back.out(1.4)' }, 0.35)
  ostrichSpecs(tl, bird, 1.25)
  const turn = gsap.quickTo(bird, 'rotation', { duration: 0.8, ease: 'power3.out' })
  const onMove = e => { if (tl.progress() === 1) turn((e.clientX / window.innerWidth - 0.7) * 9) }
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => window.removeEventListener('pointermove', onMove)
}

export default function Footer() {
  const ref = useRef(null)
  useMotion(ref, setup)
  return (
    <footer className="footer" ref={ref}>
      <div className="wrap footer-in">
        <div>
          <p className="footer-tagline">
            <span className="sr-only">consider it done.</span>
            <span aria-hidden="true"><Hop text="consider it done." /></span>
          </p>
          <div>
            <p className="footer-text">
              <span className="footer-logo">odds<span>yy</span></span>
              <span>Launching in Lahore · No spam, ever · <Link to="/privacy">Privacy</Link></span>
            </p>
            <PoweredBy />
          </div>
        </div>
        <div className="footer-bird" aria-hidden="true"><Ostrich viewBox="40 112 320 416" strokeWidth={12} rough={4} /></div>
      </div>
    </footer>
  )
}
