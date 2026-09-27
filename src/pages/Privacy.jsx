import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, PRIVACY_UPDATED } from '../config'

export default function Privacy() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Privacy notice — Oddsyy waitlist'
    return () => { document.title = prev }
  }, [])

  return (
    <main className="legal">
      <Link to="/" className="back">← Back to oddsyy.com</Link>
      <h1>Waitlist privacy notice</h1>
      <p className="updated">Last updated {PRIVACY_UPDATED}</p>

      <p>This page explains what happens to the details you give us when you join the Oddsyy waitlist on
        oddsyy.com. It covers the waitlist only — the Oddsyy app will have its own privacy policy when it launches.</p>

      <h2>What we collect</h2>
      <ul>
        <li>Your name and email address.</li>
        <li>Whether you want to join as a Seeker, a Hustler or both.</li>
        <li>The date and time you joined.</li>
      </ul>
      <p>That's all. The site sets no advertising or tracking cookies and runs no analytics.</p>

      <h2>Why we collect it</h2>
      <p>Only to tell you when Oddsyy launches and to invite you in. Knowing your role helps us invite Hustlers
        and Seekers in the right order so there's someone on the other side when you arrive.</p>

      <h2>Who can see it</h2>
      <p>Only the Oddsyy team. Your details are stored in Google Firebase (Cloud Firestore) and can't be read
        from the public website. We never sell your details or share them with anyone for marketing.</p>
      <p>Like any website, our hosting provider (Google Firebase Hosting) and font provider (Google Fonts)
        process technical data such as your IP address to deliver the pages to you.</p>

      <h2>How long we keep it</h2>
      <p>Until launch invitations are finished — and no longer than six months after the Oddsyy app launches.
        Then the waitlist is deleted.</p>

      <h2>Your choices</h2>
      <p>You can ask us to delete your details at any time, and every email we send will tell you how to stop
        hearing from us. Email <a href={`mailto:${CONTACT_EMAIL}?subject=Oddsyy%20waitlist%20request`}>{CONTACT_EMAIL}</a> from
        the address you signed up with and we'll act on it within 7 days.</p>
    </main>
  )
}
