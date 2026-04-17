import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import Header from './components/layout/Header'
import LeftSidebar from './components/layout/LeftSidebar'
import ToastContainer from './components/common/Toast'
import useAuthStore from './store/useAuthStore'
import useLayoutStore from './store/useLayoutStore'
import './App.css'

function App() {
  const loadUser = useAuthStore((s) => s.loadUser)
  const settings = useLayoutStore((s) => s.settings)

  useEffect(() => {
    loadUser()
  }, [loadUser])

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
      </div>
    </BrowserRouter>
  )
}

export default App
