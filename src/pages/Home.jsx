import { useRef } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Story from '../components/Story'
import Categories from '../components/Categories'
import Examples from '../components/Examples'
import Closing from '../components/Closing'
import Footer from '../components/Footer'
import { usePageMotion } from '../lib/motion'
import '../home.css'

export default function Home() {
  const scope = useRef(null)
  usePageMotion(scope)
  return (
    <div className="home" ref={scope}>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Categories />
        <Examples />
        <Closing />
      </main>
      <Footer />
    </div>
  )
}
