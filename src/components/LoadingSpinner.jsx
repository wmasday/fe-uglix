import { motion } from 'framer-motion'

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  text = 'Loading...',
  showText = true 
}) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const colorStyles = {
    primary: { borderColor: 'var(--primary-color)' },
    secondary: { borderColor: 'var(--secondary-color)' },
    success: { borderColor: 'var(--success-color)' },
    danger: { borderColor: 'var(--danger-color)' },
    warning: { borderColor: 'var(--warning-color)' },
    info: { borderColor: 'var(--info-color)' }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]}`}
        style={colorStyles[color]}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {showText && (
        <motion.p
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
