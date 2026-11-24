import { useEffect, useState } from 'react'
import Ostrich from './Ostrich'
import { Flag, Icon } from './Icon'
import { formPlace, scrollTo, scrollToForm } from '../lib/motion'

export default function Nav() {
  // The button appears once the form has scrolled away, and leaves when it's back.
  const [away, setAway] = useState(false)
  useEffect(() => {
    const on = () => setAway(window.scrollY > formPlace().bottom - 80)
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  return (
    <nav className="nav" aria-label="Oddsyy">
      <div className="nav-in">
        <button type="button" className="nav-brand" onClick={() => scrollTo(0)} aria-label="Oddsyy, back to top">
          <Ostrich size={30} viewBox="40 90 330 330" strokeWidth={20} rough={3} />
          <span className="nav-logo">odds<span>yy</span></span>
        </button>
        <div className="nav-right">
          <span className="nav-pill"><Flag />Launching in Lahore</span>
          <button type="button" className={`btn btn-sm nav-cta ${away ? 'is-on' : ''}`} onClick={scrollToForm}
            tabIndex={away ? 0 : -1} aria-hidden={!away}>
            <span>Reserve my spot</span><Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
    </nav>
  )
}
