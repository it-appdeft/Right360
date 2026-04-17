import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaCog, FaUser, FaSignOutAlt, FaChevronDown, FaBell } from 'react-icons/fa'
import useAuthStore from '../../store/useAuthStore'
import useCategoryStore from '../../store/useCategoryStore'
import { getCategoryIcon } from '../../utils/categoryIcons'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { categories, fetchCategories } = useCategoryStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  // Show first 6 categories as tabs
  const tabCategories = categories.slice(0, 6)
  const currentSlug = location.pathname.split('/category/')[1]?.split('/')[0]

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Right360" className="h-7" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Settings"
            >
              <FaCog size={15} />
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm">{user?.username}</span>
                  <FaChevronDown size={9} className="text-white/50" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-card shadow-tile-hover border border-border py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">{user?.username}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-page transition-colors"
                    >
                      <FaCog size={13} /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors"
                    >
                      <FaSignOutAlt size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category tabs bar */}
      <div className="bg-[#2d2d44] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          <Link
            to="/"
            className={`shrink-0 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              location.pathname === '/'
                ? 'text-white border-primary bg-white/5'
                : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            🏠 Homepage
          </Link>
          {tabCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon)
            const isActive = currentSlug === cat.slug
            return (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-white border-primary bg-white/5'
                    : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={12} />
                {cat.name}
              </Link>
            )
          })}
          <Link
            to="/categories"
            className="shrink-0 px-4 py-2.5 text-xs font-medium text-white/40 border-b-2 border-transparent hover:text-white/70 transition-colors"
          >
            More ▸
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Add Webmix / Webspaces button */}
          <Link
            to="/webspaces"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 my-0.5 rounded-full text-[10px] font-bold bg-brand-green text-white hover:bg-brand-green/90 transition-colors"
          >
            + Add a Public Webspace
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
