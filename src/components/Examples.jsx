import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const EXAMPLES = [
  { tag: 'brand', cat: 'Tutoring',      title: 'Home school teacher for Grade 3',                     desc: 'Full-time Mon–Fri. English, Math, Urdu. Must come to our home in Wapda Town.',             budget: 'PKR 25,000 – 40,000' },
  { tag: 'brand', cat: 'Home Services', title: 'Painter for 2 bedroom apartment',                     desc: 'White walls, clean finish. Paint provided. Johar Town, Lahore.',                           budget: 'PKR 8,000 – 18,000'  },
  { tag: 'brand', cat: 'Cleaning',      title: 'Deep clean before move-in',                           desc: '3-marla house. Floors, bathrooms, kitchen, fans, windows. Need a reliable team.',          budget: 'PKR 3,000 – 6,000'   },
  { tag: 'accent',cat: 'Weird & Fun',   title: "Dress as a wizard at my friend's birthday",           desc: 'Full costume. Dramatic entrance. Make him completely lose his mind.',                       budget: 'PKR 2,000 – 5,000'   },
  { tag: 'accent',cat: 'Weird & Fun',   title: 'I need someone to break up with my ex for me',        desc: "I'm too soft. Need a confident stranger to deliver the message. Script provided.",         budget: 'PKR 500 – 1,500'     },
  { tag: 'brand', cat: 'Delivery',      title: 'Pick up biryani from Burns Road',                     desc: 'Friday lunch. 10 portions. Must arrive hot. Gulberg office, 1:00 PM sharp.',              budget: 'PKR 400 – 800'       },
  { tag: 'accent',cat: 'Weird & Fun',   title: 'Roast my friend at his farewell',                     desc: "He's moving to Canada. Wants to go out with a roast. Need someone funny.",                budget: 'PKR 3,000 – 7,000'   },
  { tag: 'brand', cat: 'Tech Help',     title: "Fix my parents' WiFi — offline for 3 days",           desc: 'They keep calling me and I live in another city. Please just sort it out.',                budget: 'PKR 500 – 1,500'     },
  { tag: 'accent',cat: 'Weird & Fun',   title: 'Pretend to be my boss on a call with my mother',      desc: 'She thinks I got promoted. Professional-sounding voice needed. 5 minutes max.',            budget: 'PKR 500 – 1,000'     },
  { tag: 'brand', cat: 'Events',        title: "Photographer for my cat's birthday party",            desc: "Yes it's a real party. 8 cats, 12 humans, a cake. Don't judge. Shoot fast.",             budget: 'PKR 4,000 – 8,000'   },
  { tag: 'brand', cat: 'Tutoring',      title: 'Teach my dad WhatsApp without calling me 10x a day',  desc: 'Patient person needed. He asks the same question 6 times. Urdu preferred.',              budget: 'PKR 500 – 1,500'     },
  { tag: 'accent',cat: 'Weird & Fun',   title: 'Write a shayari roasting my friend who ghosted us',   desc: 'Classic Urdu shayari format but the content should be absolutely ruthless.',              budget: 'PKR 500 – 1,500'     },
]

export default function Examples() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.querySelectorAll('.ex-card').forEach((card, i) => {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: (i % 4) * 0.07, scrollTrigger: { trigger: card, start: 'top 90%' } })
    })
  }, [])
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-inner" ref={ref}>
        <p className="s-label">Real requests</p>
        <h2 className="s-title">From everyday<br /><em>to unexpected.</em></h2>
        <div className="ex-grid">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="ex-card">
              <span className={`ex-tag tag-${ex.tag}`}>{ex.cat}</span>
              <p className="ex-title">{ex.title}</p>
              <p className="ex-desc">{ex.desc}</p>
              <p className="ex-budget">{ex.budget}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
