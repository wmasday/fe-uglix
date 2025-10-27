import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaExpand, 
  FaClock, 
  FaCalendarAlt, 
  FaGlobe, 
  FaStar,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchMovies } from '../api'

export default function Watch() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [showEpisodeList, setShowEpisodeList] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    loadMovie()
  }, [id])

  const loadMovie = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get all movies and find the one with matching ID
      const response = await fetchMovies({})
      const movies = response.data || response
      const foundMovie = movies.find(m => m.id == id)
      
      if (!foundMovie) {
        setError('Movie or series not found')
        return
      }
      
      setMovie(foundMovie)
      
      // For series, select the first episode by default
      if (foundMovie.type === 'Series' && foundMovie.episodes && foundMovie.episodes.length > 0) {
        setSelectedEpisode(foundMovie.episodes[0])
      }
    } catch (err) {
      setError('Failed to load movie details')
      console.error('Error loading movie:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode)
    setShowEpisodeList(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getCurrentVideoSource = () => {
    if (movie?.type === 'Series' && selectedEpisode) {
      return selectedEpisode.sources_url
    }
    return movie?.sources_url
  }

  const getCurrentTitle = () => {
    if (movie?.type === 'Series' && selectedEpisode) {
      return `${movie.title} - ${selectedEpisode.title}`
    }
    return movie?.title
  }

  if (loading) {
    return (
      <div
        style={{
          background: "var(--page-bg)",
          color: "var(--text-primary)",
          minHeight: "100vh",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: 'var(--primary-color)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div
        style={{
          background: "var(--page-bg)",
          color: "var(--text-primary)",
          minHeight: "100vh",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4" style={{ color: 'var(--text-muted)' }}>
              🎬
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {error || 'Movie not found'}
            </h2>
            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
              The movie or series you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="btn-primary px-6 py-3 text-white text-sm font-semibold"
            >
              Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: "var(--page-bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 p-4"
        style={{
          background: 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--header-border)'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="p-2 rounded-xl"
              style={{ background: 'var(--gradient-primary)' }}
              whileHover={{ rotate: 5 }}
            >
              <FaChevronLeft className="text-white" />
            </motion.div>
            <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              Back to Browse
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {movie.type === 'Series' && (
              <motion.button
                onClick={() => setShowEpisodeList(!showEpisodeList)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(15px)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaList className="text-sm" />
                <span className="text-sm font-medium">Episodes</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                className="w-full h-full object-cover"
                poster={movie.poster_url}
                controls
                autoPlay={isPlaying}
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={getCurrentVideoSource()} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={togglePlayPause}
                      className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
                    </motion.button>
                    
                    <motion.button
                      onClick={toggleMute}
                      className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isMuted ? <FaVolumeMute className="text-white" /> : <FaVolumeUp className="text-white" />}
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={toggleFullscreen}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaExpand className="text-white" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Video Info Overlay */}
            <div className="absolute top-4 left-4 right-4">
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: movie.type === 'Series' ? 'var(--gradient-secondary)' : 'var(--gradient-primary)',
                      color: 'white'
                    }}
                  >
                    {movie.type}
                  </div>
                  {movie.rating && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-white text-sm font-medium">{movie.rating}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Content Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {getCurrentTitle()}
              </h1>
              
              {movie.description && (
                <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {movie.description}
                </p>
              )}

              {/* Movie/Series Details */}
              <div className="flex flex-wrap gap-6 mb-6">
                {movie.release_year && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-lg" style={{ color: 'var(--primary-color)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {movie.release_year}
                    </span>
                  </div>
                )}
                
                {movie.duration_sec && (
                  <div className="flex items-center gap-2">
                    <FaClock className="text-lg" style={{ color: 'var(--secondary-color)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatDuration(movie.duration_sec)}
                    </span>
                  </div>
                )}
                
                {movie.country && (
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-lg" style={{ color: 'var(--accent-color)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {movie.country}
                    </span>
                  </div>
                )}
              </div>

              {/* Genre */}
              {movie.genre && (
                <div className="mb-6">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Genre: 
                  </span>
                  <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium" style={{ 
                    background: 'var(--glass-bg)', 
                    color: 'var(--text-primary)' 
                  }}>
                    {movie.genre.name}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enhanced Episode List for Series */}
            {movie.type === 'Series' && movie.episodes && movie.episodes.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Episodes
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {movie.episodes.length} episodes available
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary-color)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Currently Playing
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {movie.episodes.map((episode, index) => (
                      <motion.button
                        key={episode.id}
                        onClick={() => handleEpisodeSelect(episode)}
                        className={`w-80 text-left p-4 rounded-xl transition-all duration-300 group my-3 ms-2 ${
                          selectedEpisode?.id === episode.id 
                            ? 'ring-2 ring-blue-500 shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        style={{
                          background: selectedEpisode?.id === episode.id 
                            ? 'linear-gradient(135deg, var(--glass-bg) 0%, rgba(99, 102, 241, 0.1) 100%)' 
                            : 'var(--glass-bg)',
                          border: selectedEpisode?.id === episode.id 
                            ? '1px solid var(--primary-color)' 
                            : '1px solid var(--border-color)'
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: selectedEpisode?.id === episode.id 
                                    ? 'var(--gradient-primary)' 
                                    : 'var(--glass-bg)',
                                  color: selectedEpisode?.id === episode.id 
                                    ? 'white' 
                                    : 'var(--text-primary)',
                                  border: '1px solid var(--border-color)'
                                }}
                              >
                                {episode.episode_number}
                              </div>
                              <div>
                                <h4 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                                  {episode.title}
                                </h4>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  Episode {episode.episode_number}
                                </p>
                              </div>
                            </div>
                            
                            {episode.description && (
                              <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                {episode.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <FaClock className="text-xs" style={{ color: 'var(--text-muted)' }} />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {formatDuration(episode.duration_sec)}
                                </span>
                              </div>
                              {episode.release_date && (
                                <div className="flex items-center gap-1">
                                  <FaCalendarAlt className="text-xs" style={{ color: 'var(--text-muted)' }} />
                                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {new Date(episode.release_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {selectedEpisode?.id === episode.id && (
                            <motion.div
                              className="flex items-center gap-1 px-2 py-1 rounded-full"
                              style={{ background: 'var(--gradient-primary)' }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <FaPlay className="text-white text-xs" />
                              <span className="text-white text-xs font-medium">Playing</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Cast Information */}
            {movie.actors && movie.actors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--glass-shadow)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      Cast & Crew
                    </h3>
                    <span className="text-sm px-3 py-1 rounded-full" style={{ 
                      background: 'var(--glass-bg)', 
                      color: 'var(--text-secondary)' 
                    }}>
                      {movie.actors.length} members
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {movie.actors.map((actor, index) => (
                      <Link key={actor.id} to={`/cast/${actor.id}`}>
                        <motion.div
                          className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group cursor-pointer mb-2"
                          style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--border-color)'
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <motion.div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold relative overflow-hidden"
                            style={{ 
                              background: 'var(--gradient-primary)', 
                              color: 'white' 
                            }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {actor.photo_url ? (
                              <img
                                src={actor.photo_url}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              actor.name.charAt(0)
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-base group-hover:text-blue-500 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                              {actor.name}
                            </h4>
                            {actor.pivot?.role_name && (
                              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                                {actor.pivot.role_name}
                              </p>
                            )}
                            {actor.bio && (
                              <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                                {actor.bio}
                              </p>
                            )}
                          </div>
                          
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <FaChevronRight className="text-sm" style={{ color: 'var(--text-muted)' }} />
                          </motion.div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Episode List Modal for Mobile */}
      <AnimatePresence>
        {showEpisodeList && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowEpisodeList(false)}
            />
            <motion.div
              className="relative w-full max-h-[80vh] bg-white dark:bg-gray-900 rounded-t-2xl p-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Episodes
                </h3>
                <button
                  onClick={() => setShowEpisodeList(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaTimes className="text-lg" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {movie.episodes?.map((episode) => (
                  <motion.button
                    key={episode.id}
                    onClick={() => handleEpisodeSelect(episode)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedEpisode?.id === episode.id 
                        ? 'ring-2 ring-blue-500' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {episode.title}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Episode {episode.episode_number}
                        </p>
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {formatDuration(episode.duration_sec)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
