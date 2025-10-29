import { motion } from 'framer-motion'

export default function StatsCard({ 
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend = null,
  description = null
}) {
  const colorStyles = {
    primary: {
      bg: 'var(--gradient-primary)',
      text: 'var(--text-light)'
    },
    secondary: {
      bg: 'var(--gradient-secondary)',
      text: 'var(--text-light)'
    },
    success: {
      bg: 'var(--success-color)',
      text: 'var(--text-light)'
    },
    danger: {
      bg: 'var(--danger-color)',
      text: 'var(--text-light)'
    },
    warning: {
      bg: 'var(--warning-color)',
      text: 'var(--text-light)'
    },
    info: {
      bg: 'var(--info-color)',
      text: 'var(--text-light)'
    }
  }

  const currentColor = colorStyles[color] || colorStyles.primary

  return (
    <motion.div
      className="glass rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ background: currentColor.bg }}>
          <Icon className="text-xl" style={{ color: currentColor.text }} />
        </div>
        {trend && (
          <motion.div
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </motion.div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {value}
        </h3>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </p>
        {description && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}
