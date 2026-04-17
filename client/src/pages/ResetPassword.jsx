import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa'
import api from '../services/api'
import useAuthStore from '../store/useAuthStore'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        password: form.password,
      })
      // Auto-login with returned token
      localStorage.setItem('token', data.token)
      useAuthStore.getState().loadUser()
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <FaCheck className="text-success" size={24} />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-800 mb-2">Password Reset!</h1>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-heading font-bold text-gray-800">Reset Password</h1>
              <p className="text-sm text-gray-500 mt-2">Enter your new password below</p>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="text-primary font-medium hover:underline">
                <FaArrowLeft className="inline mr-1" size={10} /> Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
