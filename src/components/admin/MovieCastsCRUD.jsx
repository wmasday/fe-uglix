import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaUser, FaFilm, FaStar, FaUsers, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { 
  fetchMovieCastsAdmin, createMovieCast, updateMovieCast, deleteMovieCast,
  fetchMoviesAdmin, fetchActorsAdmin 
} from '../../api'
import ModernModal from '../ModernModal'
import FormLabel from '../FormLabel'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../utils/sweetAlert'

export default function MovieCastsCRUD() {
  const [movieCasts, setMovieCasts] = useState([])
  const [movies, setMovies] = useState([])
  const [actors, setActors] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [movieFilter, setMovieFilter] = useState('')
  const [actorFilter, setActorFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingMovieCast, setEditingMovieCast] = useState(null)
  const [formData, setFormData] = useState({
    movie_id: '',
    actor_id: '',
    role_name: ''
  })

  useEffect(() => {
    loadMovieCasts()
    loadMovies()
    loadActors()
  }, [currentPage, search, movieFilter, actorFilter])

  const loadMovieCasts = async () => {
    setLoading(true)
    try {
      const response = await fetchMovieCastsAdmin({
        page: currentPage,
        perPage: 10,
        search,
        movieId: movieFilter,
        actorId: actorFilter
      })
      setMovieCasts(response.data || [])
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading movie casts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMovies = async () => {
    try {
      const response = await fetchMoviesAdmin({ perPage: 100 })
      setMovies(response.data || [])
    } catch (error) {
      console.error('Error loading movies:', error)
    }
  }

  const loadActors = async () => {
    try {
      const response = await fetchActorsAdmin({ perPage: 100 })
      setActors(response.data || [])
    } catch (error) {
      console.error('Error loading actors:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingMovieCast) {
        await updateMovieCast(editingMovieCast.id, formData)
      } else {
        await createMovieCast(formData)
      }
      setShowForm(false)
      setEditingMovieCast(null)
      setFormData({
        movie_id: '',
        actor_id: '',
        role_name: ''
      })
      loadMovieCasts()
    } catch (error) {
      console.error('Error saving movie cast:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (movieCast) => {
    setEditingMovieCast(movieCast)
    setFormData({
      movie_id: movieCast.movie_id,
      actor_id: movieCast.actor_id,
      role_name: movieCast.role_name
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cast member?')) {
      try {
        await deleteMovieCast(id)
        loadMovieCasts()
      } catch (error) {
        console.error('Error deleting movie cast:', error)
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
            <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-dark)' }}>
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Movie Casts Management
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage cast members and their roles
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(30, 41, 59, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{ background: 'var(--gradient-dark)' }}
          >
            <FaPlus />
            Add Cast Member
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search cast members..."
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
          
          <select
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">All Movies</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>

          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">All Actors</option>
            {actors.map(actor => (
              <option key={actor.id} value={actor.id}>{actor.name}</option>
            ))}
          </select>

          <motion.button
            onClick={loadMovieCasts}
            className="btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSearch />
            Apply Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Movie Casts Table */}
      <motion.div
        className="glass rounded-2xl overflow-hidden"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: 'var(--primary-color)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Actor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Movie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Type
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {movieCasts.map((movieCast, index) => (
                  <motion.tr
                    key={movieCast.id}
                    className="border-t border-opacity-10"
                    style={{ borderColor: 'var(--border-color)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ background: 'var(--bg-secondary)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {movieCast.actor?.profile_url ? (
                            <img 
                              src={movieCast.actor.profile_url} 
                              alt={movieCast.actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                              <FaUser className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {movieCast.actor?.name || 'N/A'}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Actor
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaFilm className="text-sm" style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {movieCast.movie?.title || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {movieCast.role_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Cast Member
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(movieCast)}
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
                          onClick={() => handleDelete(movieCast.id)}
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
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-opacity-10" style={{ borderColor: 'var(--border-color)' }}>
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
          </div>
        )}
      </motion.div>

      {/* Movie Cast Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                  {editingMovieCast ? 'Edit Cast Member' : 'Add New Cast Member'}
                </h3>
                <motion.button
                  onClick={() => {
                    setShowForm(false)
                    setEditingMovieCast(null)
                    setFormData({
                      movie_id: '',
                      actor_id: '',
                      role_name: ''
                    })
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Movie *
                    </label>
                    <select
                      required
                      value={formData.movie_id}
                      onChange={(e) => setFormData({ ...formData, movie_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="">Select Movie</option>
                      {movies.map(movie => (
                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Actor *
                    </label>
                    <select
                      required
                      value={formData.actor_id}
                      onChange={(e) => setFormData({ ...formData, actor_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="">Select Actor</option>
                      {actors.map(actor => (
                        <option key={actor.id} value={actor.id}>{actor.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Role Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role_name}
                      onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      placeholder="e.g., Tony Stark, Captain America"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingMovieCast(null)
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
                        {editingMovieCast ? 'Update Cast Member' : 'Create Cast Member'}
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
