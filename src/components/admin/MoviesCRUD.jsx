import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaSave, FaEye, FaEyeSlash,
  FaCalendarAlt, FaTag, FaGlobe, FaStar, FaPlay, FaClock, FaUser
} from 'react-icons/fa'
import { 
  fetchMoviesAdmin, createMovie, updateMovie, deleteMovie, fetchGenresAdmin 
} from '../../api'
import ModernModal from '../ModernModal'
import ModernToggle from '../ModernToggle'
import FileUpload from '../FileUpload'
import FormLabel from '../FormLabel'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../utils/sweetAlert'

export default function MoviesCRUD() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [genresLoading, setGenresLoading] = useState(false)
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
    duration_sec: '',
    rating: '',
    country: '',
    type: 'Movie',
    is_published: true,
    genre_id: '',
    poster_url: '',
    sources_url: ''
  })
  const [posterFile, setPosterFile] = useState(null)

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
    if (genresLoading) return // Prevent multiple simultaneous loads
    setGenresLoading(true)
    try {
      console.log('Loading genres...')
      const response = await fetchGenresAdmin({ perPage: 100 })
      console.log('Genres API response:', response)
      // The API returns genres directly as an array, not wrapped in data
      const genresData = Array.isArray(response) ? response : (response.data || [])
      console.log('Setting genres:', genresData)
      setGenres(genresData)
    } catch (error) {
      console.error('Error loading genres:', error)
      setGenres([])
    } finally {
      setGenresLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    showLoading(editingMovie ? 'Updating movie...' : 'Creating movie...')
    
    try {
      const submitData = { ...formData }
      
      // Handle file upload if poster file is selected
      if (posterFile) {
        // In a real app, you would upload the file to a server
        // For now, we'll use a placeholder URL
        submitData.poster_url = URL.createObjectURL(posterFile)
      }
      
      if (editingMovie) {
        await updateMovie(editingMovie.id, submitData)
        showSuccess('Movie Updated!', 'The movie has been successfully updated.')
      } else {
        await createMovie(submitData)
        showSuccess('Movie Created!', 'The movie has been successfully created.')
      }
      
      closeLoading()
      setShowForm(false)
      setEditingMovie(null)
      setPosterFile(null)
      setFormData({
        title: '',
        description: '',
        release_year: '',
        duration_sec: '',
        rating: '',
        country: '',
        type: 'Movie',
        is_published: true,
        genre_id: '',
        poster_url: '',
        sources_url: ''
      })
      loadMovies()
    } catch (error) {
      closeLoading()
      console.error('Error saving movie:', error)
      showError('Error!', error.message || 'Failed to save movie. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (movie) => {
    console.log('Editing movie:', movie)
    console.log('Available genres:', genres)
    
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      description: movie.description,
      release_year: movie.release_year,
      duration_sec: movie.duration_sec,
      rating: movie.rating,
      country: movie.country,
      type: movie.type,
      is_published: movie.is_published,
      genre_id: movie.genre_id ? String(movie.genre_id) : '',
      poster_url: movie.poster_url,
      sources_url: movie.sources_url
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const result = await showConfirm(
      'Delete Movie?',
      'Are you sure you want to delete this movie? This action cannot be undone.',
      'Yes, delete it!'
    )
    
    if (result.isConfirmed) {
      try {
        showLoading('Deleting movie...')
        await deleteMovie(id)
        closeLoading()
        showSuccess('Movie Deleted!', 'The movie has been successfully deleted.')
        loadMovies()
      } catch (error) {
        closeLoading()
        console.error('Error deleting movie:', error)
        showError('Error!', 'Failed to delete movie. Please try again.')
      }
    }
  }

  const togglePublished = async (movie) => {
    try {
      await updateMovie(movie.id, { ...movie, is_published: !movie.is_published })
      showSuccess(
        movie.is_published ? 'Movie Unpublished!' : 'Movie Published!',
        `The movie has been ${movie.is_published ? 'unpublished' : 'published'} successfully.`
      )
      loadMovies()
    } catch (error) {
      console.error('Error updating movie:', error)
      showError('Error!', 'Failed to update movie status. Please try again.')
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
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Published
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
                            {movie.duration_sec ? Math.floor(movie.duration_sec / 60) : 'N/A'} min
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
                      <div className="flex items-center justify-center">
                        <ModernToggle
                          checked={movie.is_published}
                          onChange={() => togglePublished(movie)}
                          size="sm"
                        />
                      </div>
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
      <ModernModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingMovie(null)
          setPosterFile(null)
          setFormData({
            title: '',
            description: '',
            release_year: '',
            duration_sec: '',
            rating: '',
            country: '',
            type: 'Movie',
            is_published: true,
            genre_id: '',
            poster_url: '',
            sources_url: ''
          })
        }}
        title={editingMovie ? 'Edit Movie' : 'Add New Movie'}
        size="lg"
        loading={loading}
      >

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel required>
                      Title
                    </FormLabel>
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
                    <FormLabel required>
                      Genre
                    </FormLabel>
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
                      <option value="">{genresLoading ? 'Loading genres...' : 'Select Genre'}</option>
                      {genres.map(genre => (
                        <option key={genre.id} value={String(genre.id)}>{genre.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FormLabel required>
                      Release Year
                    </FormLabel>
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
                    <FormLabel>
                      Duration (seconds)
                    </FormLabel>
                    <input
                      type="number"
                      value={formData.duration_sec}
                      onChange={(e) => setFormData({ ...formData, duration_sec: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <FormLabel>
                      Rating
                    </FormLabel>
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
                    <FormLabel>
                      Country
                    </FormLabel>
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
                    <FormLabel>
                      Type
                    </FormLabel>
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
                      <option value="Movie">Movie</option>
                      <option value="Series">Series</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <ModernToggle
                      checked={formData.is_published}
                      onChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      label="Published"
                      size="md"
                    />
                  </div>
                </div>

                <div>
                  <FormLabel>
                    Description
                  </FormLabel>
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
                    <FileUpload
                      onFileSelect={setPosterFile}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024}
                      label="Movie Poster"
                      preview={true}
                    />
                  </div>

                  <div>
                    <FormLabel required>
                      Sources URL
                    </FormLabel>
                    <input
                      type="url"
                      required
                      value={formData.sources_url}
                      onChange={(e) => setFormData({ ...formData, sources_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingMovie(null)
                      setPosterFile(null)
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
                        {editingMovie ? 'Update Movie' : 'Create Movie'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
      </ModernModal>
    </div>
  )
}
