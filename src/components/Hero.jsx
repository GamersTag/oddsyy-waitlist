import WaitlistForm from './WaitlistForm'
import Ostrich from './Ostrich'
import WaitingCount from './WaitingCount'
import { useWaitlistCount } from '../hooks/useWaitlistCount'

// Honest facts only — no invented sign-up counts or placeholder faces. The
// waiting count is the real number from Firestore (see firestore.rules).
// Load animation lives in src/lib/motion.js.
const FACTS = ['Free to join', 'Lahore first', 'Seekers & Hustlers welcome']

export default function Hero() {
  const { count, addOne } = useWaitlistCount()

  return (
    <div className="hero">
      <div className="hero-left">
        <Ostrich size={76} className="hero-mascot" />
        <div className="eyebrow">Early Access</div>
        {/* Each line sits in a mask so it can slide up into place on load */}
        <h1 className="hero-title">
          <span className="line"><span className="line-in">Post it.</span></span>
          <span className="line"><em className="line-in">Someone's on it.</em></span>
        </h1>
        <p className="hero-sub">From home tutors to painters, photographers to party wizards — find local people who get things done.</p>
        <ul className="proof" aria-label="About the waitlist">
          {FACTS.map(f => <li key={f} className="proof-chip">{f}</li>)}
        </ul>
        <WaitingCount count={count} />
      </div>
      <div className="hero-form"><WaitlistForm onJoined={addOne} /></div>
    </div>
  )
}
