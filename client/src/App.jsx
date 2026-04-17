import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import Header from './components/layout/Header'
import LeftSidebar from './components/layout/LeftSidebar'
import ToastContainer from './components/common/Toast'
import OnboardingWizard, { ONBOARDING_KEY } from './components/onboarding/OnboardingWizard'
import useAuthStore from './store/useAuthStore'
import useLayoutStore from './store/useLayoutStore'
import './App.css'

function App() {
  const loadUser = useAuthStore((s) => s.loadUser)
  const settings = useLayoutStore((s) => s.settings)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY)
    if (!done) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
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
      </div>
    </BrowserRouter>
  )
}

export default App
