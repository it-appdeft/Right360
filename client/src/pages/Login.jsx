import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaSignInAlt, FaGoogle } from 'react-icons/fa'
import useAuthStore from '../store/useAuthStore'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    clearError()
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch {
      // error is set in store
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Welcome Back
          </h1>
          <p className="text-text-muted text-sm mt-2">
            Sign in to your Right360 account
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-card px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full h-11 pl-10 pr-4 rounded-card border border-border bg-page text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-4 rounded-card border border-border bg-page text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-white rounded-card font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <FaSignInAlt size={14} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google OAuth */}
        <button
          onClick={async () => {
            try {
              // In production, use Google Identity Services SDK
              // For now, show a prompt explaining setup needed
              const email = prompt('Google OAuth requires setup.\n\nFor testing, enter your Google email:')
              if (!email) return
              const name = email.split('@')[0]
              const { data } = await api.post('/auth/google', {
                email,
                name,
                googleId: 'google_' + Date.now(),
                avatar: '',
              })
              localStorage.setItem('token', data.token)
              useAuthStore.getState().loadUser()
              navigate('/')
            } catch (err) {
              // handled by interceptor
            }
          }}
          className="w-full h-11 flex items-center justify-center gap-2 border border-border rounded-card text-sm font-medium text-text-primary hover:bg-page transition-colors"
        >
          <FaGoogle size={16} className="text-brand-red" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-text-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
