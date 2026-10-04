// All motion on the landing page, in one place: the load sequence, scroll
// reveals, parallax, the nav's scrolled state and Lenis smooth scrolling.
// Visitors who ask for reduced motion get the same page with no movement.
import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power3.out'

// Reveal elements as they scroll into view, a few at a time with a stagger.
// From-states are set with gsap.set (never `once: true`, which can strand
// content invisible on a reload part-way down the page), and the transform is
// cleared afterwards so CSS hover effects work on the revealed element.
function revealOnScroll(targets, { y = 32, scale = 1, stagger = 0.08, duration = 0.9, start = 'top 88%' } = {}) {
  const els = gsap.utils.toArray(targets)
  if (!els.length) return
  gsap.set(els, { autoAlpha: 0, y, scale })
  ScrollTrigger.batch(els, {
    start,
    onEnter: batch => gsap.to(batch, {
      autoAlpha: 1, y: 0, scale: 1, duration, ease: EASE, stagger, overwrite: true, clearProps: 'transform',
    }),
  })
}

export function useHomeMotion(scopeRef) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef.current)

    // Always: the nav gets a firmer background and shadow once the page scrolls.
    mm.add('all', () => {
      const nav = scopeRef.current.querySelector('.nav')
      const update = self => nav.classList.toggle('is-scrolled', self.scroll() > 40)
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update })
      return () => nav.classList.remove('is-scrolled')
    })

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in step.
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      const raf = time => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      // Load: nav drops in, then the hero builds line by line, then the form.
      // (Times are seconds from the start; it's all in by about 1.6 s.) Each tween
      // clears the styles it set when done: GSAP leaves `translate/rotate/scale:
      // none` behind, which would cancel the CSS hover effects.
      gsap.timeline({ defaults: { ease: EASE, duration: 0.9, clearProps: 'transform,opacity,visibility' } })
        .from('.nav', { yPercent: -100, autoAlpha: 0, duration: 0.7 }, 0)
        .from('.hero-mascot', { y: 24, rotate: -12, autoAlpha: 0, ease: 'back.out(1.8)' }, 0.15)
        .from('.hero .eyebrow', { y: 16, autoAlpha: 0 }, 0.3)
        .from('.hero-title .line-in', { yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.38)
        .from('.hero-sub', { y: 20, autoAlpha: 0 }, 0.7)
        .from('.proof-chip', { y: 14, scale: 0.9, autoAlpha: 0, stagger: 0.07, ease: 'back.out(2)', duration: 0.6 }, 0.85)
        .from('.hero-form', { y: 40, scale: 0.96, autoAlpha: 0, duration: 1.1, ease: 'expo.out' }, 0.3)

      // Scroll: everything below the fold eases in as it arrives.
      revealOnScroll('.marquee-wrap', { y: 24, duration: 1 })
      revealOnScroll('.s-label', { y: 16, duration: 0.7 })
      revealOnScroll('.s-title', { y: 40, duration: 1 })
      revealOnScroll('.how-card', { y: 40, stagger: 0.12 })
      revealOnScroll('.cat-card', { y: 26, scale: 0.92, stagger: 0.04, duration: 0.7, start: 'top 92%' })
      revealOnScroll('.ex-card', { y: 34, stagger: 0.07, start: 'top 92%' })
      revealOnScroll('.footer > *', { y: 22, stagger: 0.08, duration: 0.8, start: 'top 98%' })

      // The warm background glows drift at different speeds as you scroll.
      gsap.to('.ambient-1', { y: 220, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.2 } })
      gsap.to('.ambient-2', { y: -260, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.2 } })

      return () => {
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    })

    return () => mm.revert()
  }, [scopeRef])
}
