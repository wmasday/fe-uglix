import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaTag, FaFilm
} from 'react-icons/fa'
import { 
  fetchGenresAdmin, createGenre, updateGenre, deleteGenre 
} from '../../api'

export default function GenresCRUD() {
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
      const response = await fetchGenresAdmin({
        page: currentPage,
        perPage: 10,
        search
      })
      setGenres(response.data || [])
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading genres:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, formData)
      } else {
        await createGenre(formData)
      }
      setShowForm(false)
      setEditingGenre(null)
      setFormData({ name: '', description: '' })
      loadGenres()
    } catch (error) {
      console.error('Error saving genre:', error)
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
    if (window.confirm('Are you sure you want to delete this genre?')) {
      try {
        await deleteGenre(id)
        loadGenres()
      } catch (error) {
        console.error('Error deleting genre:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Genres Management
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage movie and series genres
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          Add Genre
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        className="glass rounded-2xl p-6"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
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

              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <FaFilm />
                <span>Created {new Date(genre.created_at).toLocaleDateString()}</span>
              </div>
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
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-3xl p-8 w-full max-w-md"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--glass-shadow)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editingGenre ? 'Edit Genre' : 'Add New Genre'}
                </h3>
                <motion.button
                  onClick={() => {
                    setShowForm(false)
                    setEditingGenre(null)
                    setFormData({ name: '', description: '' })
                  }}
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--text-secondary)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Genre Name *
                  </label>
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
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Description
                  </label>
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
                    className="px-6 py-3 rounded-xl font-medium"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 px-6 py-3"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
