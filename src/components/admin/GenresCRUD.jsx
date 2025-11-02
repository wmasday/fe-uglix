import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaTag, FaFilm, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { 
  fetchGenresAdmin, createGenre, updateGenre, deleteGenre 
} from '../../api'
import ModernModal from '../ModernModal'
import FormLabel from '../FormLabel'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../utils/sweetAlert'

export default function GenresCRUD({ onDataChange }) {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingGenre, setEditingGenre] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadGenres()
  }, [currentPage, search])

  const loadGenres = async () => {
    setLoading(true)
    try {
      console.log('Loading genres...')
      const response = await fetchGenresAdmin({
        page: currentPage,
        perPage: 10,
        search
      })
      console.log('Genres API response:', response)
      // Now the API returns proper pagination format
      setGenres(response.data || [])
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading genres:', error)
      setGenres([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    showLoading(editingGenre ? 'Updating genre...' : 'Creating genre...')
    
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, formData)
        showSuccess('Genre Updated!', 'The genre has been successfully updated.')
      } else {
        await createGenre(formData)
        showSuccess('Genre Created!', 'The genre has been successfully created.')
      }
      
      closeLoading()
      setShowForm(false)
      setEditingGenre(null)
      setFormData({ name: '', description: '' })
      loadGenres()
      if (onDataChange) onDataChange() // Refresh counts in dashboard
    } catch (error) {
      closeLoading()
      console.error('Error saving genre:', error)
      showError('Error!', error.message || 'Failed to save genre. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (genre) => {
    setEditingGenre(genre)
    setFormData({
      name: genre.name,
      description: genre.description
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Delete Genre?',
      'Are you sure you want to delete this genre? This action cannot be undone.',
      'Yes, delete it!'
    )
    
    if (result.isConfirmed) {
      try {
        showLoading('Deleting genre...')
        await deleteGenre(id)
        closeLoading()
        showSuccess('Genre Deleted!', 'The genre has been successfully deleted.')
        loadGenres()
        if (onDataChange) onDataChange() // Refresh counts in dashboard
      } catch (error) {
        closeLoading()
        console.error('Error deleting genre:', error)
        showError('Error!', 'Failed to delete genre. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
              <FaTag className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Genres Management
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Organize and categorize your content
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{ background: 'var(--gradient-primary)' }}
          >
            <FaPlus />
            Add Genre
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search genres by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-offset-0 transition-all duration-300"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <FaFilm />
            <span>{genres.length} genres</span>
          </div>
        </div>
      </motion.div>

      {/* Genres Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <motion.div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: 'var(--primary-color)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              className="glass rounded-2xl p-6"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--glass-shadow)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                    <FaTag className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {genre.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {genre.movies_count || 0} movies
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleEdit(genre)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      background: 'var(--glass-bg)',
                      color: 'var(--primary-color)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(genre.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      background: 'var(--glass-bg)',
                      color: 'var(--danger-color)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
              
              {genre.description && (
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {genre.description}
                </p>
              )}

              {genre.movies_count > 0 && (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <FaFilm />
                  <span>{genre.movies_count} {genre.movies_count === 1 ? 'movie' : 'movies'}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-between glass rounded-2xl p-6"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--glass-shadow)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{
                background: currentPage === 1 ? 'var(--bg-secondary)' : 'var(--glass-bg)',
                color: 'var(--text-primary)'
              }}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{
                background: currentPage === totalPages ? 'var(--bg-secondary)' : 'var(--glass-bg)',
                color: 'var(--text-primary)'
              }}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Genre Form Modal */}
      <ModernModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingGenre(null)
          setFormData({ name: '', description: '' })
        }}
        title={editingGenre ? 'Edit Genre' : 'Add New Genre'}
        size="sm"
        loading={loading}
      >

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <FormLabel required>
                    Genre Name
                  </FormLabel>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="e.g., Action, Comedy, Drama"
                  />
                </div>

                <div>
                  <FormLabel>
                    Description
                  </FormLabel>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    placeholder="Brief description of this genre..."
                  />
                </div>

                <div className="flex items-center justify-end gap-4">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingGenre(null)
                    }}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-200"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)'
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      boxShadow: 'var(--glass-shadow)'
                    }}
                    whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <motion.div
                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <FaSave />
                        {editingGenre ? 'Update Genre' : 'Create Genre'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
      </ModernModal>
    </div>
  )
}
