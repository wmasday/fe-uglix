import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaUser, FaLock, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/admin'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Small delay to ensure authentication state is updated
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 100)
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: "var(--page-bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20" style={{ background: 'var(--gradient-primary)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20" style={{ background: 'var(--gradient-secondary)' }} />
      </div>

      {/* Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 p-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="p-2 rounded-xl"
              style={{ background: 'var(--gradient-primary)' }}
              whileHover={{ rotate: -5 }}
            >
              <FaArrowLeft className="text-white" />
            </motion.div>
            <span className="font-bold text-xl group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Back to Home
            </span>
          </Link>
          
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Login Form */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="rounded-3xl p-8 md:p-12 glass"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--glass-shadow)",
            backdropFilter: "blur(20px)"
          }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <FaUser className="text-2xl text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome Back
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your admin account
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-6 p-4 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "var(--danger-color)"
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-offset-0 transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    backdropFilter: 'blur(15px)'
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-0 focus:ring-2 focus:ring-offset-0 transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    backdropFilter: 'blur(15px)'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--gradient-primary)' }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing In...
                </motion.div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Contact administrator for account access
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
