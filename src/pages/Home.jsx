import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import HowItWorks from '../components/HowItWorks'
import Categories from '../components/Categories'
import Examples from '../components/Examples'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <Nav />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Categories />
      <Examples />
      <Footer />
    </>
  )
}
