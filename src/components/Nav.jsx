import Ostrich from './Ostrich'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <Ostrich size={26} />
        <div className="nav-logo">odds<span>yy</span></div>
      </div>
      <div className="nav-pill"><span className="nav-pill-flag">🇵🇰</span>Launching in Lahore</div>
    </nav>
  )
}
