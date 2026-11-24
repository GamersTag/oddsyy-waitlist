import { useEffect, useRef, useState } from 'react'
import Hop from './Hop'
import Phone from './Phone'
import { photo } from '../data/content'
import { gsap, hopSet, hopTo, onArrive, prefersMotion, scrollTo, ScrollTrigger, useMotion } from '../lib/motion'
import { throwPaper } from '../lib/paper'

const STEPS = [
  { title: 'Post your request', body: 'Describe what you need, set a budget and deadline. Takes 60 seconds.' },
  { title: 'Get offers from Hustlers', body: 'Local people who can help send their price and message. You pick who to hire.' },
  { title: 'Get it done', body: 'Chat, agree the details and get it done. Then rate each other so good people rise to the top.' },
]
// Where each step begins, in window heights from the top of the scene (0 = the title).
const AT = [0, 0.55, 1.5, 2.45]

// Things that spring out of the phone. fx/fy point back at it, r is the lean.
const OUT = [
  { k: 1, cls: 'o-note', x: '1%', y: '47%', fx: 190, fy: -60, r: -8, d: 1.5 },
  { k: 1, cls: 'o-chip', x: '66%', y: '17%', fx: -150, fy: 90, r: 5, d: 2, text: 'PKR 4,000 – 8,000' },
  { k: 1, cls: 'o-chip', x: '68%', y: '76%', fx: -160, fy: -90, r: -4, d: 2.2, text: 'Saturday, 5 pm' },
  { k: 2, cls: 'o-say', x: '-3%', y: '17%', fx: 200, fy: 120, r: -4, d: 0.65, who: 'HR', text: 'I bring a fast lens and fish treats.' },
  { k: 2, cls: 'o-say is-right is-pick', x: '67%', y: '38%', fx: -190, fy: 30, r: 3, d: 1.15, who: 'SN', text: 'Eight cats? Finally, a challenge.' },
  { k: 2, cls: 'o-say is-last', x: '-2%', y: '66%', fx: 200, fy: -90, r: 4, d: 1.65, who: 'UA', text: 'Mildly allergic. Fully committed.' },
  { k: 3, cls: 'o-say', x: '-3%', y: '24%', fx: 200, fy: 80, r: -4, d: 0.7, who: 'SN', text: 'On my way. Do the cats like salmon?' },
  { k: 3, cls: 'o-say is-right is-me', x: '67%', y: '36%', fx: -190, fy: 60, r: 4, d: 1.4, text: 'They demand it.' },
]

// Pen marks in the logo's line style. They draw themselves when their step comes up.
const L = 'translate(0 40) scale(0.8)'
const R = 'translate(160 110) scale(0.82)'
const DOODLES = {
  1: [[L, 'M30 250 C70 130 150 120 170 190 C184 240 118 250 122 196 C128 120 210 100 262 132'], [L, 'M228 102 L268 134 L226 164'],
    [R, 'M792 470 L784 392 L826 424 C846 418 868 418 888 424 L930 392 L922 470 C926 530 888 556 857 556 C826 556 788 530 792 470'],
    [R, 'M830 472 v12 M884 472 v12 M848 504 l9 9 l9 -9 M857 513 v10'], [R, 'M770 486 l-34 -8 M772 510 l-34 8 M944 486 l34 -8 M942 510 l34 8']],
  2: [],
  3: [['translate(0 290) scale(0.8)', 'M60 250 L128 326 L262 150'], ['translate(0 290) scale(0.8)', 'M150 430 L120 474 M196 440 L196 492 M240 426 L276 462'],
    ['translate(160 190) scale(0.82)', 'M782 570 V490 C782 478 790 472 802 472 H920 C932 472 940 478 940 490 V570 Z'],
    ['translate(160 190) scale(0.82)', 'M784 512 C804 536 826 496 862 516 S916 536 938 510'],
    ['translate(160 190) scale(0.82)', 'M861 470 V418 M861 398 c-14 -14 -2 -28 0 -38 c4 12 14 24 0 38']],
}

function Doodles({ step }) {
  return (
    <svg className="doodles" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {Object.entries(DOODLES).map(([k, d]) => (
        <g key={k} className={Number(k) === step ? 'is-on' : ''}>
          {d.map(([t, p], j) => <path key={j} d={p} transform={t} pathLength="1" style={{ '--d': `${0.5 + j * 0.22}s` }} />)}
        </g>
      ))}
    </svg>
  )
}

function Out({ o, step }) {
  return (
    <div className={`out ${o.cls} ${o.k === step ? 'is-on' : ''}`} aria-hidden="true"
      style={{ left: o.x, top: o.y, '--fx': `${o.fx}px`, '--fy': `${o.fy}px`, '--r': `${o.r}deg`, '--d': `${o.d}s` }}>
      <div className="out-in">
        {o.cls.startsWith('o-note')
          ? <><img src={photo('note-cat')} alt="" loading="lazy" /><span>Photographer for my cat&apos;s birthday party</span></>
          : <>{o.who && <i>{o.who}</i>}{o.text}</>}
      </div>
    </div>
  )
}

// The title hops in as the scene arrives. (Its move to the corner is CSS.)
function setup(root) {
  const words = root.querySelectorAll('.story-title .hop-i')
  const phone = root.querySelector('.story-phone-in')
  hopSet(words)
  gsap.set(root.querySelector('.story-label'), { y: 14, autoAlpha: 0 })
  gsap.set(phone, { y: 260, rotate: 14 })
  onArrive(root, 'top 72%')
    .to(root.querySelector('.story-label'), { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
    .to(words, hopTo(0.1, { duration: 0.95 }), 0.05)
    .to(phone, { y: 0, rotate: 0, duration: 1.2, ease: 'back.out(1.4)' }, 0.2)

  // The phone turns a little towards the pointer.
  const tilt = root.querySelector('.story-phone-tilt')
  const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' })
  const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' })
  const move = e => {
    ry((e.clientX / window.innerWidth - 0.5) * 16)
    rx((0.5 - e.clientY / window.innerHeight) * 10)
  }
  root.addEventListener('pointermove', move, { passive: true })
  return () => root.removeEventListener('pointermove', move)
}

// One pinned scene. Scrolling only chooses the step; each step then plays itself out.
export default function Story() {
  const ref = useRef(null)
  const stamp = useRef(null)
  const [step, setStep] = useState(0)
  const [near, setNear] = useState(false)
  useMotion(ref, setup)

  useEffect(() => {
    const pick = self => {
      const d = (self.scroll() - self.start) / window.innerHeight
      setStep(d < AT[1] ? 0 : d < AT[2] ? 1 : d < AT[3] ? 2 : 3)
      setNear(self.isActive)
    }
    const st = ScrollTrigger.create({ trigger: ref.current, start: 'top top', end: 'bottom bottom', onUpdate: pick, onRefresh: pick, onToggle: pick })
    return () => st.kill()
  }, [])

  // Step 3 ends with the stamp landing and paper going up.
  useEffect(() => {
    if (step !== 3 || !prefersMotion()) return
    const t = setTimeout(() => throwPaper(stamp.current, { count: 46, wide: 420 }), 2650)
    return () => clearTimeout(t)
  }, [step])

  const go = i => {
    const top = ref.current.getBoundingClientRect().top + window.scrollY
    scrollTo(top + (AT[i] + 0.3) * window.innerHeight)
  }

  return (
    <section className="story" data-step={step} ref={ref}>
      <div className="story-pin">
        <div className="story-in" data-lean=".sheet-fan">
          <div className="story-num" aria-hidden="true"><span style={{ '--s': Math.max(step, 1) - 1 }}><i>1</i><i>2</i><i>3</i></span></div>

          <div className="story-title">
            <p className="story-label">How it works</p>
            <h2>
              <span className="sr-only">Three steps. That&apos;s it.</span>
              <span className="s-line" aria-hidden="true"><Hop text="Three steps." /></span>
              <span className="s-line s-line-2" aria-hidden="true"><Hop text="That's it." /></span>
            </h2>
          </div>

          <ol className="story-copy">
            {STEPS.map((s, i) => (
              <li key={s.title} className={step === i + 1 ? 'is-on' : ''}>
                <h3>{s.title.split(' ').map((w, j) => <span key={j}><span className="sw" style={{ '--d': `${0.12 + j * 0.06}s` }}>{w}</span>{' '}</span>)}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="story-stage">
            <Doodles step={step} />
            {OUT.map((o, i) => <Out key={i} o={o} step={step} />)}
          </div>

          <div className="story-phone">
            <div className="story-phone-in"><div className="story-phone-tilt"><Phone step={step - 1} playing={near} /></div></div>
            <div className="story-stamp" ref={stamp} aria-hidden="true"><span className="stamp">Consider it done</span></div>
          </div>

          <div className="story-rail">
            {STEPS.map((s, i) => (
              <button key={s.title} type="button" className={step > i ? 'is-on' : ''} onClick={() => go(i + 1)} aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={step === i + 1 ? 'step' : undefined}><i /></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
