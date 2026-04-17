import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import Header from './components/layout/Header'
import LeftSidebar from './components/layout/LeftSidebar'
import ToastContainer from './components/common/Toast'
import OnboardingWizard, { ONBOARDING_KEY } from './components/onboarding/OnboardingWizard'
import WelcomeTour, { TOUR_KEY } from './components/onboarding/WelcomeTour'
import useAuthStore from './store/useAuthStore'
import useLayoutStore from './store/useLayoutStore'
import './App.css'

function App() {
  const loadUser = useAuthStore((s) => s.loadUser)
  const settings = useLayoutStore((s) => s.settings)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    const onboardingDone = localStorage.getItem(ONBOARDING_KEY)
    const tourDone = localStorage.getItem(TOUR_KEY)
    if (!onboardingDone) {
      setShowOnboarding(true)
    } else if (!tourDone) {
      setShowTour(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    // Show tour after onboarding
    if (!localStorage.getItem(TOUR_KEY)) {
      setShowTour(true)
    }
  }

  const bgStyle = {
    backgroundColor: settings.background,
    ...(settings.backgroundImage && {
      backgroundImage: `url(${settings.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }),
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={bgStyle}>
        <Header />
        <LeftSidebar />
        <main
          className="md:ml-12 max-w-[1400px] mx-auto px-4 py-4"
          style={{ opacity: settings.backgroundImage ? settings.opacity : 1 }}
        >
          <AppRoutes />
        </main>
        <ToastContainer />

        {showOnboarding && (
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        )}
        {showTour && !showOnboarding && (
          <WelcomeTour onComplete={() => setShowTour(false)} />
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
