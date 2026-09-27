import { Link } from 'react-router-dom'
import Ostrich from './Ostrich'

export default function Footer() {
  return (
    <footer className="footer">
      <Ostrich size={54} className="footer-mascot" />
      <div className="footer-logo">odds<span>yy</span></div>
      <p className="footer-tagline">consider it done.</p>
      <p className="footer-text">
        Launching in Lahore · No spam, ever · <Link to="/privacy">Privacy</Link>
      </p>
    </footer>
  )
}
