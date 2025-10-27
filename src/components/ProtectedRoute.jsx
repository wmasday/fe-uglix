import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user, token } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user, 'token:', token) // Debug log

  if (loading) {
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
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-transparent"
            style={{ 
              borderTopColor: 'var(--primary-color)',
              borderRightColor: 'var(--primary-color)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            Loading...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
