import { motion } from 'framer-motion'

export default function FormLabel({ 
  children, 
  required = false, 
  className = '',
  ...props 
}) {
  return (
    <motion.label
      className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${className}`}
      style={{ 
        color: 'var(--text-primary)',
        opacity: 0.85,
        fontWeight: '600'
      }}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 0.85 }}
      whileHover={{ opacity: 1 }}
      {...props}
    >
      {children}
      {required && (
        <span 
          className="ml-1 font-bold"
          style={{ color: 'var(--danger-color)' }}
        >
          *
        </span>
      )}
    </motion.label>
  )
}
