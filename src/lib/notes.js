import { gsap } from './motion'

// The pile of posted notes behind the form: they overlap, and lean different ways.
export const SLOTS = 4
const TILT = [-7, 4, -3, 8]
export const slotStyle = k => ({ left: `${k * 25}%`, rotate: TILT[Math.floor(k) % SLOTS] })

let order = 0

// Throw a note from an element to its slot on the pile: up a little, over, and down
// with a squash. The x and y are separate tweens, which is what bends the path.
export function fly(from, note, pile, slot) {
  const place = slotStyle(slot)
  note.dataset.slot = slot
  gsap.killTweensOf(note)
  gsap.set(note, { left: place.left, x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, autoAlpha: 1, zIndex: 10 + ++order })
  const a = from.getBoundingClientRect()
  const b = note.getBoundingClientRect()
  const dx = a.left + a.width / 2 - (b.left + b.width / 2)
  const dy = a.top + a.height / 2 - (b.top + b.height / 2)
  gsap.set(note.querySelector('.stamp'), { autoAlpha: 0 })
  return gsap.timeline()
    .fromTo(note, { x: dx }, { x: 0, duration: 1.05, ease: 'sine.inOut' }, 0)
    .fromTo(note, { y: dy }, { keyframes: [{ y: dy - 46, duration: 0.3, ease: 'power2.out' }, { y: 0, duration: 0.75, ease: 'power2.in' }] }, 0)
    .fromTo(note, { scaleX: 0.35, scaleY: 0.35, rotate: 24 }, { scaleX: 1, scaleY: 1, rotate: -26, duration: 0.55, ease: 'power2.out' }, 0)
    .to(note, { rotate: place.rotate, duration: 0.5, ease: 'power1.inOut' }, 0.55)
    .to(note, { scaleY: 0.86, scaleX: 1.07, duration: 0.09, transformOrigin: '50% 100%' }, 1.03)
    .to(note, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1.1,0.45)' })
}
