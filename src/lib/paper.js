import { gsap } from './motion'

const PAPER = ['#D9577A', '#FFFCF8', '#EFDDE2', '#B43A60', '#F7E3B4', '#CFE6C1']

// Bits of paper thrown up from the middle of `box`, then gone.
export function throwPaper(box, { count = 34, wide = 260 } = {}) {
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('i')
    bit.className = 'paper'
    bit.style.background = PAPER[i % PAPER.length]
    box.appendChild(bit)
    const x = gsap.utils.random(-wide, wide)
    gsap.timeline({ onComplete: () => bit.remove() })
      .set(bit, { scale: gsap.utils.random(0.6, 1.4), rotate: gsap.utils.random(0, 360) })
      .to(bit, { x: x * 0.7, y: gsap.utils.random(-0.75, -0.25) * wide, rotate: '+=200', duration: 0.5, ease: 'power3.out' })
      .to(bit, { x, y: gsap.utils.random(0.25, 0.75) * wide, rotate: '+=300', autoAlpha: 0, duration: gsap.utils.random(0.8, 1.5), ease: 'power1.in' })
  }
}
