import { useState } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { ResearchProvider } from '../context/ResearchContext'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/sections/Hero'
import { AboutGeminis } from '../components/sections/AboutGeminis'
import { TeamMembers } from '../components/sections/TeamMembers'
import { ResearchPublications } from '../components/sections/ResearchPublications'
import { CyberNews } from '../components/sections/CyberNews'
import { LoginModal } from '../components/auth/LoginModal'
import { ResearchDashboardModal } from '../components/dashboard/ResearchDashboardModal'
import { LoadingScreen } from '../components/visuals/LoadingScreen'

export function App() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <AuthProvider>
      <ResearchProvider>
        {showLoader && <LoadingScreen onComplete={() => setShowLoader(false)} />}
        <main className="site-shell">
          <Navbar />
          <Hero />
          <AboutGeminis />
          <TeamMembers />
          <ResearchPublications />
          <CyberNews />
          <Footer />
          <LoginModal />
          <ResearchDashboardModal />
        </main>
      </ResearchProvider>
    </AuthProvider>
  )
}
