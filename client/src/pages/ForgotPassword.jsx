import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaPaperPlane, FaArrowLeft } from 'react-icons/fa'
import api from '../services/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <FaPaperPlane className="text-success" size={24} />
            </div>
            <h1 className="text-xl font-heading font-bold text-gray-800 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-6">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link.
            </p>
            <Link to="/login" className="text-sm text-primary font-medium hover:underline">
              <FaArrowLeft className="inline mr-1" size={11} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-heading font-bold text-gray-800">Forgot Password?</h1>
              <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send a reset link</p>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
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
                  <><FaPaperPlane size={13} /> Send Reset Link</>
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

export default ForgotPassword
