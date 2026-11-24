import { useLayoutEffect, useRef } from 'react'
import Ostrich from './Ostrich'
import Hop from './Hop'
import { fontsReady, gsap, hopSet, hopTo } from '../lib/motion'
import { ostrichDraw, ostrichReady } from '../lib/ostrich'

// The first two seconds: the ostrich draws itself, puts its sunglasses on, then
// flies to its place behind the form. The screen is the hero's own maroon, so the
// hero simply appears around it. `onReveal` starts the hero, `onDone` removes this.
export default function Opening({ onReveal, onDone }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const root = ref.current
    let dead = false
    const ctx = gsap.context(() => {
      const bird = root.querySelector('.ostrich')
      const word = root.querySelectorAll('.hop-i')
      ostrichReady(bird)
      hopSet(word)
      fontsReady().then(() => {
        if (dead) return
        ctx.add(() => {
          const tl = gsap.timeline()
          ostrichDraw(tl, bird, 0, 0.75)
          tl.to(word, hopTo(0.045), 0.75)
            .add('go', 1.75)
            .to(word, { yPercent: -60, autoAlpha: 0, duration: 0.35, stagger: 0.02, ease: 'power2.in' }, 'go-=0.1')
            .call(() => {
              // Land exactly on the hero's own bird, wherever the layout has put it.
              const to = document.querySelector('.peek .ostrich').parentElement
              const pad = getComputedStyle(to)
              const b = to.getBoundingClientRect()
              const x = b.left + parseFloat(pad.paddingLeft)
              const w = b.width - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight)
              const y = b.top + parseFloat(pad.paddingTop)
              const a = bird.getBoundingClientRect()
              gsap.to(bird, { x: x - a.left, y: y - a.top, scale: w / a.width, transformOrigin: '0 0', duration: 1, ease: 'expo.inOut', onComplete: onDone })
              gsap.to(root.querySelector('.opening-bg'), { autoAlpha: 0, duration: 0.4, delay: 0.25 })
              onReveal()
            }, null, 'go')
        })
      })
    }, ref)
    return () => { dead = true; ctx.revert() }
  }, [onReveal, onDone])

  return (
    <div className="opening" ref={ref} aria-hidden="true">
      <div className="opening-bg" />
      <Ostrich viewBox="40 112 320 400" strokeWidth={12} rough={4} />
      <p className="opening-word"><Hop text="oddsyy" letters /></p>
    </div>
  )
}
