import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSpinner } from 'react-icons/fa'

export default function ModernModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  loading = false,
  className = ''
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-hidden ${className}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="glass rounded-3xl overflow-hidden"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-opacity-10" style={{ borderColor: 'var(--border-color)' }}>
                <motion.h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h3>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-all duration-200 hover:bg-red-50 group"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </motion.button>
              </div>
              
              {/* Content */}
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="animate-spin"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FaSpinner className="text-2xl" style={{ color: 'var(--primary-color)' }} />
                      </motion.div>
                      <span className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Loading...
                      </span>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {children}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
