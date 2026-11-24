// Shared motion for the landing page: smooth scrolling, the nav's states and the
// helpers each section uses for its own animation. Two rules throughout:
//   1. An animation starts when its section arrives and then plays to the end by
//      itself. Nothing is tied to scroll position, so nothing is ever left half done.
//   2. With "reduce motion" switched on, none of it runs and the page is complete
//      and static (every from-state is set inside the MOTION_OK query).
import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigationType } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const prefersMotion = () => window.matchMedia(MOTION_OK).matches

// The page's signature move: letters and words hop in, tip over a little and settle.
const HOP_FROM = { yPercent: 55, rotate: 9, scale: 0.7, autoAlpha: 0, transformOrigin: '0% 100%' }
const HOP_TO = { yPercent: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 0.75, ease: 'back.out(1.9)' }
export const hopSet = els => gsap.set(els, HOP_FROM)
export const hopTo = (stagger = 0.06, extra = {}) => ({ ...HOP_TO, stagger, ...extra })

// Run `setup(root)` when motion is allowed; everything it makes is undone on unmount.
// `setup` must be a stable function (defined outside the component).
export function useMotion(ref, setup) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(ref.current)
    mm.add(MOTION_OK, () => setup(ref.current))
    return () => mm.revert()
  }, [ref, setup])
}

// Resolve once the display font is in (or after a second), so the headline never
// animates in the fallback font and then jumps.
export function fontsReady() {
  const load = document.fonts?.load
    ? Promise.all([document.fonts.load('800 1em "Baloo 2"'), document.fonts.load('500 1em "DM Sans"')])
    : Promise.resolve()
  return Promise.race([load, new Promise(r => setTimeout(r, 1000))]).catch(() => {})
}

// A paused timeline that plays when `trigger` scrolls into view. It is not `once`:
// that can kill the trigger on a reload part-way down and strand content invisible.
export function onArrive(trigger, start = 'top 80%') {
  return gsap.timeline({ scrollTrigger: { trigger, start, toggleActions: 'play none none none' } })
}

// True while the element is on screen.
export function useInView(ref, { threshold = 0.3, rootMargin = '0px' } = {}) {
  const [inView, set] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold, rootMargin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])
  return inView
}

export function useMedia(query) {
  const [match, set] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => set(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

let lenis = null

export const scrollTo = (y, opts = {}) => (lenis
  ? lenis.scrollTo(y, { duration: 1.3, ...opts })
  : (window.scrollTo(0, y), opts.onComplete?.()))

// The hero is sticky, so the form's place on screen says nothing about its place on
// the page: measure it inside the hero, which always starts at 0.
export function formPlace() {
  const form = document.getElementById('join')
  const hero = form?.closest('.hero')
  if (!hero) return { top: 0, bottom: 0 }
  const top = form.getBoundingClientRect().top - hero.getBoundingClientRect().top
  return { top, bottom: top + form.offsetHeight }
}

// Every "Reserve my spot" button away from the form: go to the form, then focus it.
export function scrollToForm() {
  const { top } = formPlace()
  scrollTo(Math.max(0, top - window.innerHeight * 0.3), {
    duration: 1.6,
    onComplete: () => document.getElementById('name')?.focus({ preventScroll: true }),
  })
}

// Scroll speed in px per frame, for the category band. 0 when motion is reduced.
export const scrollVelocity = () => lenis?.velocity ?? 0

// Where the reader was on this page, for reloads and for coming back from /privacy.
// The browser's own restoring gets this page wrong: it remembers the sticky phone
// as its landmark, and that isn't where it was once the page starts again at the top.
const PLACE = 'oddsyy:y'
const readPlace = () => { try { return Number(sessionStorage.getItem(PLACE)) || 0 } catch { return 0 } }
const savePlace = y => { try { sessionStorage.setItem(PLACE, Math.round(y)) } catch { /* private mode */ } }
let arrived = false // has this tab shown the page since it loaded?

// The opening plays once per visit, and never on a reload or a trip back.
export function wantsOpening() {
  if (arrived || !prefersMotion()) return false
  if (performance.getEntriesByType('navigation')[0]?.type !== 'navigate') return false
  try {
    if (sessionStorage.getItem('oddsyy:hi')) return false
    sessionStorage.setItem('oddsyy:hi', '1')
  } catch { return false }
  return true
}

function usePlace() {
  const pop = useNavigationType() === 'POP'
  useLayoutEffect(() => {
    history.scrollRestoration = 'manual'
    const load = performance.getEntriesByType('navigation')[0]?.type
    const back = arrived ? pop : load === 'reload' || load === 'back_forward'
    arrived = true
    let y = back ? readPlace() : 0
    window.scrollTo({ top: y, behavior: 'instant' })
    y = window.scrollY
    savePlace(y)
    const note = () => { y = window.scrollY }
    const save = () => savePlace(y)
    window.addEventListener('scroll', note, { passive: true })
    window.addEventListener('pagehide', save)
    return () => {
      window.removeEventListener('scroll', note)
      window.removeEventListener('pagehide', save)
      save()
    }
  }, [pop])
}

export function usePageMotion(scopeRef) {
  usePlace()
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef.current)
    const root = scopeRef.current

    // Always: the nav is clear over the hero and a floating maroon pill after that.
    // The hero sticks while the next sheet slides over it; once it's covered it's
    // switched off. (A hero taller than the window sticks by its bottom edge.)
    mm.add('all', () => {
      const nav = root.querySelector('.nav')
      const hero = root.querySelector('.hero')
      const fit = () => hero.style.setProperty('--stick', `${Math.min(0, window.innerHeight - hero.offsetHeight)}px`)
      const update = () => {
        const y = window.scrollY
        nav.classList.toggle('is-pill', y > 24)
        hero.classList.toggle('is-gone', y > hero.offsetHeight + 40)
      }
      const ro = new ResizeObserver(fit)
      ro.observe(hero)
      window.addEventListener('resize', fit)
      window.addEventListener('scroll', update, { passive: true })
      update()
      return () => {
        ro.disconnect()
        window.removeEventListener('resize', fit)
        window.removeEventListener('scroll', update)
      }
    })

    mm.add(MOTION_OK, () => {
      // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in step.
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      const raf = time => lenis?.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      // What gets covered leans back a little as the named sheet slides over it.
      gsap.utils.toArray('[data-lean]').forEach(el => {
        gsap.to(el, {
          scale: 0.92, yPercent: -3, opacity: 0.35, ease: 'none', transformOrigin: '50% 100%',
          scrollTrigger: { trigger: el.dataset.lean, start: 'clamp(top bottom)', end: 'top top', scrub: true },
        })
      })

      return () => {
        gsap.ticker.remove(raf)
        lenis.destroy()
        lenis = null
      }
    })

    fontsReady().then(() => ScrollTrigger.refresh())
    return () => mm.revert()
  }, [scopeRef])
}
