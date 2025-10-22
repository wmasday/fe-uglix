import { useEffect, useState } from 'react'
import { FaPlay, FaSearch, FaFilter, FaBars, FaCalendarAlt, FaGlobe, FaHome, FaClock, FaStar } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ 
  search, 
  onSearchChange, 
  genres = [], 
  selectedGenre, 
  onGenreChange,
  countries = [],
  selectedCountry,
  onCountryChange,
  years = [],
  selectedYear,
  onYearChange
}) {
  const [query, setQuery] = useState(search || '')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setQuery(search || '')
  }, [search])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50" style={{
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3 rounded-2xl ps-4 mx-3" style={{background:'var(--gradient-primary)'}}>
                <FaPlay className="text-2xl text-white" />
              </div>
              {/* <span className="font-bold text-2xl tracking-tight" style={{color:'var(--text-primary)'}}></span> */}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/">
              <motion.button
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/' ? 'text-white' : ''
                }`}
                style={{
                  background: location.pathname === '/' ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  color: location.pathname === '/' ? 'white' : 'var(--text-primary)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: location.pathname === '/' ? 'var(--glass-shadow)' : 'none'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome className="text-sm" />
                <span>Home</span>
              </motion.button>
            </Link>
            
            <Link to="/new-releases">
              <motion.button
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/new-releases' ? 'text-white' : ''
                }`}
                style={{
                  background: location.pathname === '/new-releases' ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  color: location.pathname === '/new-releases' ? 'white' : 'var(--text-primary)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: location.pathname === '/new-releases' ? 'var(--glass-shadow)' : 'none'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaClock className="text-sm" />
                <span>New Releases</span>
              </motion.button>
            </Link>
            
            <Link to="/top-rated">
              <motion.button
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/top-rated' ? 'text-white' : ''
                }`}
                style={{
                  background: location.pathname === '/top-rated' ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  color: location.pathname === '/top-rated' ? 'white' : 'var(--text-primary)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: location.pathname === '/top-rated' ? 'var(--glass-shadow)' : 'none'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaStar className="text-sm" />
                <span>Top Rated</span>
              </motion.button>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <motion.div 
                className="relative w-full"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'var(--text-muted)'}} />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    onSearchChange?.(e.target.value)
                  }}
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
              </motion.div>
            </form>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
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
              <FaFilter className="text-lg" />
              <span className="text-sm font-medium">Filters</span>
            </motion.button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-2xl transition-all duration-300"
              style={{background:'rgba(255,255,255,0.1)', border:'1px solid var(--border-light)'}}
            >
              <FaBars className="text-xl" style={{color:'var(--text-primary)'}} />
            </button>
          </div>
        </div>

        {/* Desktop Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block absolute top-full left-0 right-0 mt-2 mx-4"
            >
              <div className="glass rounded-2xl p-6" style={{
                background:'var(--bg-dropdown)',
                border:'1px solid var(--bg-dropdown-border)',
                backdropFilter:'blur(20px)',
                boxShadow:'var(--glass-shadow)',
                color:'var(--bg-dropdown-text)'
              }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Genre Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--bg-dropdown-text)'}}>
                      <FaFilter className="text-sm" />
                      Genre
                    </label>
                    <select
                      value={selectedGenre || ''}
                      onChange={(e) => onGenreChange?.(e.target.value || '')}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--bg-dropdown-border)',
                        color: 'var(--bg-dropdown-text)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Genres</option>
                      {Array.isArray(genres) &&
                        genres.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                    </select>

                  </div>

                  {/* Country Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--bg-dropdown-text)'}}>
                      <FaGlobe className="text-sm" />
                      Country
                    </label>
                    <select
                      value={selectedGenre || ''}
                      onChange={(e) => onGenreChange?.(e.target.value || '')}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--bg-dropdown-border)',
                        color: 'var(--bg-dropdown-text)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Countries</option>
                      {Array.isArray(countries) && countries.map((c, index) => (
                        <option key={c || index} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2" style={{color:'var(--bg-dropdown-text)'}}>
                      <FaCalendarAlt className="text-sm" />
                      Year
                    </label>
                    <select
                      value={selectedGenre || ''}
                      onChange={(e) => onGenreChange?.(e.target.value || '')}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--bg-dropdown-border)',
                        color: 'var(--bg-dropdown-text)',
                        backgroundImage:
                          'url("data:image/svg+xml;utf8,<svg fill=\'%23aaa\' height=\'20\' viewBox=\'0 0 24 24\' width=\'20\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                      }}
                    >
                      <option value="">All Years</option>
                      {Array.isArray(years) && years.map((y, index) => (
                        <option key={y || index} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t" style={{borderColor:'var(--border-light)'}}
            >
              <div className="py-6 space-y-4">
                {/* Mobile Navigation */}
                <div className="flex flex-col gap-2 mb-6">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        location.pathname === '/' ? 'text-white' : ''
                      }`}
                      style={{
                        background: location.pathname === '/' ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                        border: '1px solid var(--border-color)',
                        color: location.pathname === '/' ? 'white' : 'var(--text-primary)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: location.pathname === '/' ? 'var(--glass-shadow)' : 'none'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaHome className="text-sm" />
                      <span>Home</span>
                    </motion.button>
                  </Link>
                  
                  <Link to="/new-releases" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        location.pathname === '/new-releases' ? 'text-white' : ''
                      }`}
                      style={{
                        background: location.pathname === '/new-releases' ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                        border: '1px solid var(--border-color)',
                        color: location.pathname === '/new-releases' ? 'white' : 'var(--text-primary)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: location.pathname === '/new-releases' ? 'var(--glass-shadow)' : 'none'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaClock className="text-sm" />
                      <span>New Releases</span>
                    </motion.button>
                  </Link>
                  
                  <Link to="/top-rated" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        location.pathname === '/top-rated' ? 'text-white' : ''
                      }`}
                      style={{
                        background: location.pathname === '/top-rated' ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                        border: '1px solid var(--border-color)',
                        color: location.pathname === '/top-rated' ? 'white' : 'var(--text-primary)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: location.pathname === '/top-rated' ? 'var(--glass-shadow)' : 'none'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaStar className="text-sm" />
                      <span>Top Rated</span>
                    </motion.button>
                  </Link>
                </div>

                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'var(--text-muted)'}} />
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        onSearchChange?.(e.target.value)
                      }}
                      placeholder="Search movies..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background:'var(--glass-bg)',
                        border:'1px solid var(--border-color)',
                        color:'var(--text-primary)',
                        backdropFilter:'blur(15px)'
                      }}
                    />
                  </div>
                </form>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'var(--text-muted)'}} />
                    <select
                      value={selectedGenre || ''}
                      onChange={(e) => onGenreChange?.(e.target.value || '')}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background:'var(--glass-bg)',
                        border:'1px solid var(--border-color)',
                        color:'var(--text-primary)',
                        backdropFilter:'blur(15px)'
                      }}
                    >
                      <option value="">All Genres</option>
                      {Array.isArray(genres) && genres.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'var(--text-muted)'}} />
                    <select
                      value={selectedCountry || ''}
                      onChange={(e) => onCountryChange?.(e.target.value || '')}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background:'var(--glass-bg)',
                        border:'1px solid var(--border-color)',
                        color:'var(--text-primary)',
                        backdropFilter:'blur(15px)'
                      }}
                    >
                      <option value="">All Countries</option>
                      {Array.isArray(countries) && countries.map((c, index) => (
                        <option key={c || index} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{color:'var(--text-muted)'}} />
                    <select
                      value={selectedYear || ''}
                      onChange={(e) => onYearChange?.(e.target.value || '')}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-offset-0"
                      style={{
                        background:'var(--glass-bg)',
                        border:'1px solid var(--border-color)',
                        color:'var(--text-primary)',
                        backdropFilter:'blur(15px)'
                      }}
                    >
                      <option value="">All Years</option>
                      {Array.isArray(years) && years.map((y, index) => (
                        <option key={y || index} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}


