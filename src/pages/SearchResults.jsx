import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaFilter, FaTimes, FaSlidersH, FaSortAmountDown } from 'react-icons/fa'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'
import { searchMovies, fetchDropdownData } from '../api'

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [countries, setCountries] = useState([])
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Get search parameters from URL
  const search = searchParams.get('q') || ''
  const genreId = searchParams.get('genre') || ''
  const country = searchParams.get('country') || ''
  const year = searchParams.get('year') || ''
  const type = searchParams.get('type') || ''

  const [filters, setFilters] = useState({
    search: search,
    genreId: genreId,
    country: country,
    year: year,
    type: type
  })

  const loadMovies = async (page = 1) => {
    try {
      setLoading(true)
      setError('')
      const response = await searchMovies({ 
        search: filters.search,
        genreId: filters.genreId,
        country: filters.country,
        year: filters.year,
        type: filters.type,
        page, 
        perPage: 20 
      })
      
      setMovies(response.data || [])
      setCurrentPage(response.current_page || 1)
      setTotalPages(response.last_page || 1)
      setTotalItems(response.total || 0)
    } catch (err) {
      setError('Failed to load search results')
      console.error('Error loading search results:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies(1)
  }, [filters])

  useEffect(() => {
    // Load dropdown data for filters
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

  const handleSearch = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    
    // Update URL parameters
    const params = new URLSearchParams()
    if (newFilters.search) params.set('q', newFilters.search)
    if (newFilters.genreId) params.set('genre', newFilters.genreId)
    if (newFilters.country) params.set('country', newFilters.country)
    if (newFilters.year) params.set('year', newFilters.year)
    if (newFilters.type) params.set('type', newFilters.type)
    
    navigate(`/search?${params.toString()}`, { replace: true })
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadMovies(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      genreId: '',
      country: '',
      year: '',
      type: ''
    }
    setFilters(clearedFilters)
    navigate('/search', { replace: true })
  }

  const hasActiveFilters = filters.search || filters.genreId || filters.country || filters.year || filters.type

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
        {/* Search Header */}
        <motion.section
          className="mb-8"
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
                style={{ background: 'var(--gradient-primary)' }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <FaSearch className="text-3xl text-white" />
              </motion.div>
              <div>
                <h1
                  className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Search Results
                </h1>
                <p
                  className="text-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {hasActiveFilters ? 'Filtered results for your search' : 'Discover movies and series'}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'var(--text-muted)'}} />
              <input
                value={filters.search}
                onChange={(e) => handleSearch({ ...filters, search: e.target.value })}
                placeholder="Search for movies, series..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-offset-0 transition-all duration-300"
                style={{
                  background:'var(--glass-bg)',
                  border:'1px solid var(--border-color)',
                  color:'var(--text-primary)',
                  backdropFilter:'blur(15px)',
                  boxShadow:'var(--glass-shadow)'
                }}
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300"
                style={{
                  background:'var(--glass-bg)',
                  border:'1px solid var(--border-color)',
                  color:'var(--text-primary)',
                  backdropFilter:'blur(15px)',
                  boxShadow:'var(--glass-shadow)'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSlidersH className="text-lg" />
                <span className="text-sm font-medium">Filters</span>
                {hasActiveFilters && (
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--primary-color)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>

              {hasActiveFilters && (
                <motion.button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300"
                  style={{
                    background:'rgba(239, 68, 68, 0.1)',
                    border:'1px solid rgba(239, 68, 68, 0.3)',
                    color:'var(--danger-color)',
                    backdropFilter:'blur(15px)'
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FaTimes className="text-sm" />
                  <span className="text-sm font-medium">Clear All</span>
                </motion.button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <motion.div
                className="mt-4 flex flex-wrap gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filters.search && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{background:'var(--glass-bg)', color:'var(--text-primary)'}}>
                    Search: "{filters.search}"
                  </span>
                )}
                {filters.genreId && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{background:'var(--glass-bg)', color:'var(--text-primary)'}}>
                    Genre: {genres.find(g => g.id == filters.genreId)?.name}
                  </span>
                )}
                {filters.country && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{background:'var(--glass-bg)', color:'var(--text-primary)'}}>
                    Country: {filters.country}
                  </span>
                )}
                {filters.year && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{background:'var(--glass-bg)', color:'var(--text-primary)'}}>
                    Year: {filters.year}
                  </span>
                )}
                {filters.type && (
                  <span className="px-3 py-1 rounded-full text-sm" style={{background:'var(--glass-bg)', color:'var(--text-primary)'}}>
                    Type: {filters.type}
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div
                className="rounded-2xl p-6 glass"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--glass-shadow)",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Genre Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--text-primary)'}}>
                      <FaFilter className="text-sm" />
                      Genre
                    </label>
                    <select
                      value={filters.genreId}
                      onChange={(e) => handleSearch({ ...filters, genreId: e.target.value })}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Genres</option>
                      {genres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--text-primary)'}}>
                      <FaFilter className="text-sm" />
                      Country
                    </label>
                    <select
                      value={filters.country}
                      onChange={(e) => handleSearch({ ...filters, country: e.target.value })}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Countries</option>
                      {countries.map((c, index) => (
                        <option key={c || index} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--text-primary)'}}>
                      <FaFilter className="text-sm" />
                      Year
                    </label>
                    <select
                      value={filters.year}
                      onChange={(e) => handleSearch({ ...filters, year: e.target.value })}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Years</option>
                      {years.map((y, index) => (
                        <option key={y || index} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--text-primary)'}}>
                      <FaFilter className="text-sm" />
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleSearch({ ...filters, type: e.target.value })}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Types</option>
                      <option value="Movie">Movies</option>
                      <option value="Series">Series</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {totalItems} {totalItems === 1 ? 'Result' : 'Results'}
            </h2>
            {hasActiveFilters && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FaSortAmountDown className="text-xs" />
                <span>Filtered</span>
              </motion.div>
            )}
          </div>
        </motion.div>

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
          ) : movies.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MovieGrid movies={movies} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-6xl mb-4" style={{ color: 'var(--text-muted)' }}>
                🔍
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                No results found
              </h3>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your search terms or filters
              </p>
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
