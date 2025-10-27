import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaSave, FaEye, FaEyeSlash,
  FaCalendarAlt, FaTag, FaGlobe, FaStar, FaPlay, FaClock, FaUser
} from 'react-icons/fa'
import { 
  fetchMoviesAdmin, createMovie, updateMovie, deleteMovie, fetchGenresAdmin 
} from '../../api'

export default function MoviesCRUD() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: '',
    duration: '',
    rating: '',
    country: '',
    type: 'movie',
    is_published: true,
    genre_id: '',
    poster_url: '',
    trailer_url: ''
  })

  useEffect(() => {
    loadMovies()
    loadGenres()
  }, [currentPage, search, genreFilter, statusFilter])

  const loadMovies = async () => {
    setLoading(true)
    try {
      const response = await fetchMoviesAdmin({
        page: currentPage,
        perPage: 10,
        search,
        genreId: genreFilter,
        status: statusFilter
      })
      setMovies(response.data || [])
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGenres = async () => {
    try {
      const response = await fetchGenresAdmin({ perPage: 100 })
      setGenres(response.data || [])
    } catch (error) {
      console.error('Error loading genres:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, formData)
      } else {
        await createMovie(formData)
      }
      setShowForm(false)
      setEditingMovie(null)
      setFormData({
        title: '',
        description: '',
        release_year: '',
        duration: '',
        rating: '',
        country: '',
        type: 'movie',
        is_published: true,
        genre_id: '',
        poster_url: '',
        trailer_url: ''
      })
      loadMovies()
    } catch (error) {
      console.error('Error saving movie:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      description: movie.description,
      release_year: movie.release_year,
      duration: movie.duration,
      rating: movie.rating,
      country: movie.country,
      type: movie.type,
      is_published: movie.is_published,
      genre_id: movie.genre_id,
      poster_url: movie.poster_url,
      trailer_url: movie.trailer_url
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id)
        loadMovies()
      } catch (error) {
        console.error('Error deleting movie:', error)
      }
    }
  }

  const togglePublished = async (movie) => {
    try {
      await updateMovie(movie.id, { ...movie, is_published: !movie.is_published })
      loadMovies()
    } catch (error) {
      console.error('Error updating movie:', error)
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
            Movies Management
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage movies, series, and content
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          Add Movie
        </motion.button>
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
              placeholder="Search movies..."
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
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <motion.button
            onClick={loadMovies}
            className="btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaFilter />
            Apply Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Movies Table */}
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
                    Movie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Genre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, index) => (
                  <motion.tr
                    key={movie.id}
                    className="border-t border-opacity-10"
                    style={{ borderColor: 'var(--border-color)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ background: 'var(--bg-secondary)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-200">
                          {movie.poster_url ? (
                            <img 
                              src={movie.poster_url} 
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaPlay className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {movie.title}
                          </div>
                          <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <FaClock className="text-xs" />
                            {movie.duration} min
                            <span className="mx-1">•</span>
                            <FaGlobe className="text-xs" />
                            {movie.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
                        background: 'var(--gradient-primary)',
                        color: 'white'
                      }}>
                        {movie.genre?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <FaCalendarAlt className="text-xs" />
                        {movie.release_year}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <FaStar className="text-yellow-500" />
                        {movie.rating || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        onClick={() => togglePublished(movie)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          movie.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {movie.is_published ? <FaEye /> : <FaEyeSlash />}
                        {movie.is_published ? 'Published' : 'Draft'}
                      </motion.button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(movie)}
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
                          onClick={() => handleDelete(movie.id)}
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

      {/* Movie Form Modal */}
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
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </h3>
                <motion.button
                  onClick={() => {
                    setShowForm(false)
                    setEditingMovie(null)
                    setFormData({
                      title: '',
                      description: '',
                      release_year: '',
                      duration: '',
                      rating: '',
                      country: '',
                      type: 'movie',
                      is_published: true,
                      genre_id: '',
                      poster_url: '',
                      trailer_url: ''
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
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Genre *
                    </label>
                    <select
                      required
                      value={formData.genre_id}
                      onChange={(e) => setFormData({ ...formData, genre_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="">Select Genre</option>
                      {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Release Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.release_year}
                      onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="movie">Movie</option>
                      <option value="series">Series</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: 'var(--primary-color)' }}
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Published
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Poster URL
                    </label>
                    <input
                      type="url"
                      value={formData.poster_url}
                      onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Trailer URL
                    </label>
                    <input
                      type="url"
                      value={formData.trailer_url}
                      onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingMovie(null)
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
                        {editingMovie ? 'Update Movie' : 'Create Movie'}
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
