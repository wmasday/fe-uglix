import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false 
}) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: currentPage === 1 ? 'var(--glass-bg)' : 'var(--glass-bg)',
          border: '1px solid var(--border-color)',
          color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
          backdropFilter: 'blur(15px)',
          boxShadow: 'var(--glass-shadow)'
        }}
        whileHover={currentPage > 1 ? { scale: 1.05, y: -2 } : {}}
        whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
      >
        <FaChevronLeft className="text-xs" />
        <span>Previous</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <motion.button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || isLoading}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              page === '...' ? 'cursor-default' : 'cursor-pointer'
            }`}
            style={{
              background: page === currentPage ? 'var(--gradient-primary)' : 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              color: page === currentPage ? 'white' : 'var(--text-primary)',
              backdropFilter: 'blur(15px)',
              boxShadow: page === currentPage ? 'var(--glass-shadow)' : 'none'
            }}
            whileHover={page !== '...' && page !== currentPage ? { scale: 1.05, y: -2 } : {}}
            whileTap={page !== '...' && page !== currentPage ? { scale: 0.95 } : {}}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: currentPage === totalPages ? 'var(--glass-bg)' : 'var(--glass-bg)',
          border: '1px solid var(--border-color)',
          color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
          backdropFilter: 'blur(15px)',
          boxShadow: 'var(--glass-shadow)'
        }}
        whileHover={currentPage < totalPages ? { scale: 1.05, y: -2 } : {}}
        whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
      >
        <span>Next</span>
        <FaChevronRight className="text-xs" />
      </motion.button>
    </motion.div>
  )
}
