import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaPlay, FaClock, FaFilm, FaList, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { 
  fetchEpisodesAdmin, createEpisode, updateEpisode, deleteEpisode, fetchMoviesAdmin 
} from '../../api'
import ModernModal from '../ModernModal'
import FormLabel from '../FormLabel'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../utils/sweetAlert'

export default function EpisodesCRUD({ onDataChange }) {
  const [episodes, setEpisodes] = useState([])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [movieFilter, setMovieFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingEpisode, setEditingEpisode] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episode_number: '',
    season_number: '',
    duration_sec: '',
    sources_url: '',
    movie_id: ''
  })

  useEffect(() => {
    loadEpisodes()
    loadMovies()
  }, [currentPage, search, movieFilter])

  const loadEpisodes = async () => {
    setLoading(true)
    try {
      const response = await fetchEpisodesAdmin({
        page: currentPage,
        perPage: 10,
        search,
        movieId: movieFilter
      })
      setEpisodes(response.data || [])
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading episodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMovies = async () => {
    try {
      const response = await fetchMoviesAdmin({ perPage: 100 })
      // Filter to only show Series (type = 'Series')
      const seriesOnly = (response.data || []).filter(movie => movie.type === 'Series')
      setMovies(seriesOnly)
    } catch (error) {
      console.error('Error loading movies:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingEpisode) {
        await updateEpisode(editingEpisode.id, formData)
      } else {
        await createEpisode(formData)
      }
      setShowForm(false)
      setEditingEpisode(null)
      setFormData({
        title: '',
        description: '',
        episode_number: '',
        season_number: '',
        duration_sec: '',
        sources_url: '',
        movie_id: ''
      })
      loadEpisodes()
      if (onDataChange) onDataChange() // Refresh counts in dashboard
    } catch (error) {
      console.error('Error saving episode:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (episode) => {
    setEditingEpisode(episode)
    setFormData({
      title: episode.title,
      description: episode.description || '',
      episode_number: episode.episode_number,
      season_number: episode.season_number || '',
      duration_sec: episode.duration_sec || '',
      sources_url: episode.sources_url || '',
      movie_id: episode.movie_id
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this episode?')) {
      try {
        await deleteEpisode(id)
        loadEpisodes()
        if (onDataChange) onDataChange() // Refresh counts in dashboard
      } catch (error) {
        console.error('Error deleting episode:', error)
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
              <FaPlay className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Episodes Management
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage series episodes and content
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
            Add Episode
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search episodes..."
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
            <option value="">All Series</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>

          <motion.button
            onClick={loadEpisodes}
            className="btn-primary flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSearch />
            Apply Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Episodes Table */}
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
                    Episode
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Series
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Season/Episode
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Duration
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {episodes.map((episode, index) => (
                  <motion.tr
                    key={episode.id}
                    className="border-t border-opacity-10"
                    style={{ borderColor: 'var(--border-color)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ background: 'var(--bg-secondary)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                          <FaPlay className="text-gray-400 text-lg" />
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {episode.title}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {episode.description ? episode.description.substring(0, 50) + '...' : 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaFilm className="text-sm" style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {episode.movie?.title || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaList className="text-sm" style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          S{episode.season_number || 1}E{episode.episode_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <FaClock className="text-xs" />
                        {episode.duration_sec ? Math.floor(episode.duration_sec / 60) : 'N/A'} min
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(episode)}
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
                          onClick={() => handleDelete(episode.id)}
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

      {/* Episode Form Modal */}
      <ModernModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingEpisode(null)
          setFormData({
            title: '',
            description: '',
            episode_number: '',
            season_number: '',
            duration_sec: '',
            sources_url: '',
            movie_id: ''
          })
        }}
        title={editingEpisode ? 'Edit Episode' : 'Add New Episode'}
        size="lg"
        loading={loading}
      >

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel required>
                Episode Title
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
                placeholder="e.g., The Pilot"
              />
            </div>

            <div>
              <FormLabel required>
                Series
              </FormLabel>
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
                <option value="">Select Series</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel>
                Season Number
              </FormLabel>
              <input
                type="number"
                min="1"
                value={formData.season_number}
                onChange={(e) => setFormData({ ...formData, season_number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="1"
              />
            </div>

            <div>
              <FormLabel required>
                Episode Number
              </FormLabel>
              <input
                type="number"
                required
                min="1"
                value={formData.episode_number}
                onChange={(e) => setFormData({ ...formData, episode_number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="1"
              />
            </div>

            <div>
              <FormLabel>
                Duration (seconds)
              </FormLabel>
              <input
                type="number"
                min="1"
                value={formData.duration_sec}
                onChange={(e) => setFormData({ ...formData, duration_sec: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                placeholder="2700"
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
              placeholder="Episode description..."
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <motion.button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingEpisode(null)
                setFormData({
                  title: '',
                  description: '',
                  episode_number: '',
                  season_number: '',
                  duration_sec: '',
                  sources_url: '',
                  movie_id: ''
                })
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
                  {editingEpisode ? 'Update Episode' : 'Create Episode'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </ModernModal>
    </div>
  )
}
