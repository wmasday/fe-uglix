import { motion } from 'framer-motion'

export default function ModernToggle({ 
  checked, 
  onChange, 
  label, 
  size = 'md',
  disabled = false,
  className = ''
}) {
  const sizes = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8'
  }

  const thumbSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  }

  const translateX = {
    sm: checked ? '1rem' : '0.125rem',
    md: checked ? '1.5rem' : '0.125rem',
    lg: checked ? '2rem' : '0.125rem'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${sizes[size]}`}
        style={{
          background: checked ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: checked ? 'var(--glass-shadow)' : 'none'
        }}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <motion.div
          className={`absolute top-0.5 left-0.5 rounded-full flex items-center justify-center ${thumbSizes[size]}`}
          style={{
            background: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          animate={{
            x: translateX[size]
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
        >
          {checked && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="text-xs"
              style={{ color: 'var(--primary-color)' }}
            >
              ✓
            </motion.div>
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}
