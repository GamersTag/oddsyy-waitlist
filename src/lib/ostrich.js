import { gsap } from './motion'

// Draw the bird's outline, then drop its sunglasses on. Adds to `tl` at `at`.
export function ostrichReady(svg) {
  gsap.set(svg.querySelectorAll('.ost-line path'), { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 })
  gsap.set(svg.querySelector('.ost-specs'), { y: -90, rotate: -14, autoAlpha: 0, transformOrigin: '50% 50%' })
}
export function ostrichDraw(tl, svg, at = 0, duration = 0.9) {
  const lines = svg.querySelectorAll('.ost-line path')
  tl.to(lines, { autoAlpha: 1, duration: 0.01, stagger: 0.06 }, at)
    .to(lines, { strokeDashoffset: 0, duration, stagger: 0.06, ease: 'power2.inOut' }, at)
  ostrichSpecs(tl, svg, at + duration + 0.15)
  return tl
}
export function ostrichSpecs(tl, svg, at) {
  return tl.to(svg.querySelector('.ost-specs'), { y: 0, rotate: 0, autoAlpha: 1, duration: 0.7, ease: 'bounce.out' }, at)
}
