import { motion } from 'framer-motion'
import { FaSearch, FaPlus, FaFilm, FaUser, FaPlay, FaUsers } from 'react-icons/fa'

const iconMap = {
  search: FaSearch,
  add: FaPlus,
  movie: FaFilm,
  actor: FaUser,
  episode: FaPlay,
  cast: FaUsers
}

export default function EmptyState({ 
  icon = 'search',
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionText = 'Add New Item',
  onAction,
  showAction = true
}) {
  const IconComponent = iconMap[icon] || FaSearch

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 rounded-full mb-6"
        style={{ background: 'var(--gradient-glass)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <IconComponent 
          className="text-4xl" 
          style={{ color: 'var(--text-muted)' }}
        />
      </motion.div>
      
      <motion.h3
        className="text-xl font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p
        className="text-sm text-center mb-6 max-w-md"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>
      
      {showAction && onAction && (
        <motion.button
          onClick={onAction}
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: 'var(--gradient-primary)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FaPlus />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}
