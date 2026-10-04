import { useRef } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import HowItWorks from '../components/HowItWorks'
import Categories from '../components/Categories'
import Examples from '../components/Examples'
import Footer from '../components/Footer'
import { useHomeMotion } from '../lib/motion'

export default function Home() {
  const scope = useRef(null)
  useHomeMotion(scope)
  return (
    <div ref={scope}>
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <Nav />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Categories />
      <Examples />
      <Footer />
    </div>
  )
}
