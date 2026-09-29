import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/sections/Hero'
import { AboutGeminis } from '../components/sections/AboutGeminis'

export function App() {
  return (
    <main className="site-shell">
      <Navbar />
      <Hero />
      <AboutGeminis />
      <Footer />
    </main>
  )
}

