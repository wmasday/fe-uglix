import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaTrophy, FaMedal } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'
import { fetchTopRated, fetchDropdownData } from '../api'

export default function TopRated() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [countries, setCountries] = useState([])
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const loadMovies = async (page = 1) => {
    try {
      setLoading(true)
      setError('')
      const response = await fetchTopRated({ page, perPage: 20 })
      
      setMovies(response.data || [])
      setCurrentPage(response.current_page || 1)
      setTotalPages(response.last_page || 1)
      setTotalItems(response.total || 0)
    } catch (err) {
      setError('Failed to load top rated movies')
      console.error('Error loading top rated movies:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies(1)
  }, [])

  useEffect(() => {
    // Load dropdown data for navbar
    const loadDropdownData = async () => {
      try {
        const data = await fetchDropdownData()
        setGenres(data.genres || [])
        setCountries(data.countries || [])
        setYears(data.years || [])
      } catch (err) {
        console.error('Error loading dropdown data:', err)
      }
    }
    loadDropdownData()
  }, [])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadMovies(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div
      style={{
        background: "var(--page-bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      <Navbar
        genres={genres}
        countries={countries}
        years={years}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-8 md:p-12 glass"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="p-4 rounded-2xl"
                style={{ background: 'var(--gradient-secondary)' }}
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <FaStar className="text-3xl text-white" />
              </motion.div>
              <div>
                <h1
                  className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Top Rated
                </h1>
                <p
                  className="text-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Discover the highest rated movies and series
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(15px)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <FaStar className="text-lg" style={{ color: 'var(--accent-color)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {totalItems} Top Rated Movies
                </span>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(15px)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <FaTrophy className="text-lg" style={{ color: 'var(--warning-color)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Highest Rated
                </span>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(15px)'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <FaMedal className="text-lg" style={{ color: 'var(--success-color)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Critically Acclaimed
                </span>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "var(--danger-color)",
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Movies Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="aspect-[2/3] w-full rounded-2xl glass" />
                  <div className="mt-3 h-4 w-3/4 rounded glass" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MovieGrid movies={movies} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        )}
      </main>
    </div>
  )
}
