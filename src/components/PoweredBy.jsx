import { useEffect, useRef } from 'react'
import { fontsReady, gsap, prefersMotion, useInView } from '../lib/motion'

const FOOT = { x: 0.45, y: 0.975 } // where its feet are, as a share of the drawing

// The BunnyDevs bunny (their own drawing, trimmed to what a hop needs).
function Bunny() {
  const line = { stroke: '#5AA6CC', strokeWidth: 0.6 }
  return (
    <svg className="pb-svg" viewBox="0 -6 58 56" aria-hidden="true">
      <ellipse cx="19.500" cy="46.900" rx="6.400" ry="2" fill="#8FCAE6" />
      <g className="pb-ear pb-ear-b">
        <path d="M39.6 16.2C40.2 10 43 5.2 47.6 4C50.4 3.3 51.4 5.6 49.4 7.2C46.8 9.3 44.8 12.3 43.6 17Z" fill="#8FCAE6" {...line} />
        <path d="M41.2 15C41.8 10.8 43.8 7.4 47 6C48.3 5.5 48.7 6.4 47.8 7.2C45.6 9.1 44.2 11.6 43.3 15.2Z" fill="#EEF9FE" opacity="0.9" />
      </g>
      <g className="pb-ear pb-ear-f">
        <path d="M34.4 17C32 10.4 32.2 2.4 35.2 -0.2C38.2 -2.8 40.8 2.6 40 9.8C39.7 12.8 39 15.2 38.2 17.2Z" fill="#BFE4F6" {...line} />
        <path d="M35.4 15.2C33.8 10.2 34 4.2 35.6 2.6C37.2 1.1 38.4 4.8 38 9.4C37.9 11.6 37.4 13.6 36.9 15.4Z" fill="#EEF9FE" />
      </g>
      <path d="M12.4 39.2C11.6 31.8 17.2 27 25 26.8C32.8 26.6 37.6 31.4 37.6 38.2C37.6 43.6 34.4 46.8 28.6 47L19.2 47C14.8 47 12.8 43.6 12.4 39.2Z" fill="#BFE4F6" {...line} />
      <circle cx="19.200" cy="39.800" r="6.200" fill="#8FCAE6" opacity="0.4" />
      <ellipse cx="34.400" cy="46.700" rx="2.800" ry="1.700" fill="#8FCAE6" />
      <ellipse cx="30.800" cy="47" rx="2.500" ry="1.500" fill="#BFE4F6" {...line} />
      <circle cx="12" cy="36.600" r="3.800" fill="#fff" stroke="#8FCAE6" strokeWidth="0.500" />
      <circle cx="10.400" cy="35" r="1.700" fill="#fff" />
      <path className="pb-scarf" d="M31.6 32.4C29.4 33.4 27.6 35.6 26.8 38.4C27.8 38 28.7 37.8 29.4 38.2C29.6 36 30.6 34.4 32.4 33.6Z" fill="#1C4B68" />
      <path d="M29.6 30.2C33.4 31.8 38.6 32.2 43.4 31C44.4 30.8 45 31.6 44.6 32.4C44 33.8 42.8 34.6 41.2 35C36.8 36 32.6 35.4 29.4 33.6C28.4 33 28.6 29.8 29.6 30.2Z" fill="#2A6589" />
      <circle cx="31.600" cy="32.800" r="1.700" fill="#1C4B68" />
      <circle cx="38.400" cy="22.800" r="10" fill="#BFE4F6" {...line} />
      <ellipse cx="43.600" cy="27.400" rx="4.800" ry="3.600" fill="#BFE4F6" />
      <circle cx="46.400" cy="25.600" r="2.800" fill="#BFE4F6" />
      <ellipse cx="43.800" cy="26.400" rx="2.400" ry="1.350" fill="#F5A8BB" opacity="0.6" />
      <g className="pb-eye">
        <ellipse cx="42.800" cy="21.800" rx="2.400" ry="2.900" fill="#0B2233" />
        <circle cx="43.700" cy="20.600" r="1" fill="#fff" />
        <circle cx="42" cy="23.200" r="0.450" fill="#fff" opacity="0.8" />
      </g>
      <path className="pb-happy" d="M40.5 22.6q2.3-3 4.6 0" fill="none" stroke="#0B2233" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="48.800" cy="24.600" rx="1.050" ry="0.800" fill="#F5A8BB" />
      <path d="M46.9 26.5q.6.75 1.2 0q.6.75 1.2 0" fill="none" stroke="#0B2233" strokeWidth="0.420" strokeLinecap="round" opacity="0.8" />
      <rect x="47.500" y="26.750" width="1.100" height="1.250" rx="0.300" fill="#fff" />
    </svg>
  )
}

// The round trip: up over the words, down the far side, back along the ground.
function route(root) {
  const box = root.getBoundingClientRect()
  const words = [...root.querySelectorAll('.pb-w')]
  const base = root.querySelector('.pb-base').getBoundingClientRect().top - box.top
  const pen = document.createElement('canvas').getContext('2d')
  const tops = words.map(w => {
    const b = w.getBoundingClientRect()
    const s = getComputedStyle(w)
    pen.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`
    return { x: b.left - box.left + b.width / 2, y: base - pen.measureText(w.textContent).actualBoundingBoxAscent + 1, word: w }
  })
  const right = words.at(-1).getBoundingClientRect().right - box.left + 38
  const ground = box.height
  const steps = Math.max(2, Math.round(right / 92))
  const back = Array.from({ length: steps }, (_, i) => ({ x: 30 + (right - 30) * (1 - (i + 1) / steps), y: ground }))
  return { home: { x: 30, y: ground }, stops: [...tops, { x: right, y: base }, { x: right - 8, y: ground, turn: true }, ...back] }
}

// One lap as one timeline, built from where everything is right now.
function lap(root, from) {
  const bunny = root.querySelector('.pb-bunny')
  const flip = root.querySelector('.pb-flip')
  const pitch = root.querySelector('.pb-pitch')
  const ears = root.querySelectorAll('.pb-ear')
  const w = bunny.offsetWidth
  const h = bunny.offsetHeight
  const at = p => ({ x: p.x - w * FOOT.x, y: p.y - h * FOOT.y })
  const { home, stops } = route(root)
  let here = from || home
  let dir = 1
  // GSAP's own pivot: a CSS one on SVG throws the ears off the head
  gsap.set(ears, { transformOrigin: '42% 100%' })
  const tl = gsap.timeline()
  tl.set(bunny, { ...at(here) })

  stops.forEach(p => {
    const a = at(here)
    const b = at(p)
    const way = p.x >= here.x ? 1 : -1
    const gap = Math.abs(p.x - here.x)
    const d = 0.36 + Math.min(gap, 160) / 900
    const peak = Math.min(a.y, b.y) - 15 - gap * 0.1
    if (way !== dir && gap > 12) {
      dir = way
      tl.to(flip, { scaleX: dir, duration: 0.16, ease: 'power1.inOut' }, '+=0.22')
    }
    // crouch, leap with the ears trailing, land with a squash
    tl.to(pitch, { scaleY: 0.8, scaleX: 1.13, duration: 0.12, ease: 'power2.out' }, '+=0.16')
      .add('up')
      .to(pitch, { scaleY: 1.1, scaleX: 0.93, rotation: -13, duration: 0.13, ease: 'power2.out' }, 'up')
      .to(bunny, { x: b.x, duration: d, ease: 'none' }, 'up')
      .to(bunny, { y: peak, duration: d * 0.48, ease: 'power2.out' }, 'up')
      .to(bunny, { y: b.y, duration: d * 0.52, ease: 'power2.in' }, `up+=${d * 0.48}`)
      .to(ears, { rotation: -20, duration: d * 0.45, stagger: 0.03, ease: 'power2.out' }, 'up')
      .to(pitch, { rotation: 11, duration: d * 0.45, ease: 'sine.inOut' }, `up+=${d * 0.5}`)
      .to(pitch, { scaleY: 0.8, scaleX: 1.14, rotation: 0, duration: 0.08 }, `up+=${d}`)
      .to(pitch, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1.1,0.45)' }, `up+=${d + 0.08}`)
      .to(ears, { rotation: 9, duration: 0.12, stagger: 0.03 }, `up+=${d}`)
      .to(ears, { rotation: 0, duration: 0.5, stagger: 0.03, ease: 'elastic.out(1,0.4)' }, `up+=${d + 0.14}`)
    // the word gives a little under its weight, and takes the bunny down with it
    if (p.word) {
      tl.to([p.word, bunny], { y: `+=${5}`, duration: 0.09, ease: 'power2.out' }, `up+=${d}`)
        .to([p.word, bunny], { y: '-=5', duration: 0.5, ease: 'elastic.out(1.2,0.4)' }, `up+=${d + 0.09}`)
    }
    here = p
  })
  // A spin for joy before the next lap.
  tl.to(flip, { scaleX: 1, duration: 0.16 }, '+=0.2')
    .add('joy')
    .to(bunny, { y: '-=30', duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 }, 'joy')
    .to(pitch, { rotation: 360, duration: 0.6, ease: 'sine.inOut' }, 'joy')
    .set(pitch, { rotation: 0 })
    .to({}, { duration: 0.5 })
  return { tl, end: here }
}

export default function PoweredBy() {
  const ref = useRef(null)
  const now = useRef(null)
  const seen = useRef(false)
  const inView = useInView(ref, { threshold: 0.2 })

  useEffect(() => {
    const root = ref.current
    let dead = false
    const ctx = gsap.context(() => {})
    fontsReady().then(() => {
      if (dead) return
      const bunny = root.querySelector('.pb-bunny')
      // Without motion it just sits on the last word.
      if (!prefersMotion()) {
        const p = route(root).stops[3]
        gsap.set(bunny, { x: p.x - bunny.offsetWidth * FOOT.x, y: p.y - bunny.offsetHeight * FOOT.y })
        return
      }
      const run = from => {
        if (dead) return
        ctx.add(() => {
          const { tl, end } = lap(root, from)
          now.current = tl
          if (!seen.current) tl.pause()
          tl.eventCallback('onComplete', () => run(end))
        })
      }
      run()
      ctx.add(() => {
        gsap.timeline({ repeat: -1, repeatDelay: 2.6 })
          .to(root.querySelector('.pb-eye'), { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1 })
        gsap.to(root.querySelector('.pb-scarf'), { rotation: 14, transformOrigin: '90% 0%', duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      })
    })
    return () => { dead = true; ctx.revert() }
  }, [])

  useEffect(() => {
    seen.current = inView
    if (inView) now.current?.play()
    else now.current?.pause()
  }, [inView])

  const hurry = on => { if (now.current) gsap.to(now.current, { timeScale: on ? 1.7 : 1, duration: 0.3 }) }

  return (
    <div className="powered" ref={ref}>
      <a href="https://bunnydevs.com" target="_blank" rel="noopener" aria-label="Powered by BunnyDevs (opens in a new tab)"
        onPointerEnter={() => hurry(true)} onPointerLeave={() => hurry(false)}>
        <span className="pb-w">Powered</span>{' '}<span className="pb-w">by</span>{' '}
        <b><span className="pb-w">Bunny</span><span className="pb-w pb-devs">Devs</span></b>
        <i className="pb-base" />
      </a>
      <span className="pb-bunny" aria-hidden="true"><span className="pb-flip"><span className="pb-pitch"><Bunny /></span></span></span>
    </div>
  )
}
