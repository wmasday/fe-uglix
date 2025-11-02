import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  FaFire,
  FaStar,
  FaClock,
} from "react-icons/fa";
import Navbar from "./components/Navbar.jsx";
import MovieGrid from "./components/MovieGrid.jsx";
import NewReleases from "./pages/NewReleases.jsx";
import TopRated from "./pages/TopRated.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Watch from "./pages/Watch.jsx";
import CastDetail from "./pages/CastDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { fetchGenres, fetchMovies, fetchDropdownData } from "./api.js";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [g, m, dropdownData] = await Promise.all([
          fetchGenres().catch(() => []),
          fetchMovies({}).catch(() => []),
          fetchDropdownData().catch(() => ({
            genres: [],
            countries: [],
            years: [],
          })),
        ]);
        if (!mounted) return;
        setGenres(Array.isArray(g) ? g : []);
        setMovies(Array.isArray(m) ? m : []);
        setCountries(
          Array.isArray(dropdownData.countries) ? dropdownData.countries : []
        );
        setYears(Array.isArray(dropdownData.years) ? dropdownData.years : []);
      } catch (e) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter((m) => {
      // Only show published movies for non-authenticated users
      // Backend should already filter, but double-check on frontend
      if (m.is_published === false) {
        return false;
      }
      
      const matchesQuery =
        !q ||
        m.title?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q);
      const matchesGenre =
        !selectedGenre ||
        String(m.genre_id) === String(selectedGenre) ||
        String(m.genre?.id) === String(selectedGenre);
      const matchesCountry =
        !selectedCountry ||
        String(m.country_id) === String(selectedCountry) ||
        String(m.country?.id) === String(selectedCountry);
      const matchesYear =
        !selectedYear || String(m.release_year) === String(selectedYear);
      return matchesQuery && matchesGenre && matchesCountry && matchesYear;
    });
  }, [movies, search, selectedGenre, selectedCountry, selectedYear]);

  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            background: "var(--page-bg)",
            color: "var(--text-primary)",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={
              <>
                <Navbar
                  search={search}
                  onSearchChange={setSearch}
                  genres={genres}
                  selectedGenre={selectedGenre}
                  onGenreChange={setSelectedGenre}
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  years={years}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <h1
                        className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Discover Amazing Movies
                      </h1>
                      <p
                        className="text-lg mb-8"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Search, filter by genre, and discover trending titles from our
                        curated collection.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          className="btn-primary px-6 py-3 text-white text-sm font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaFire className="float-left mt-1 me-2" /> Trending Now
                        </motion.button>
                        <Link to="/new-releases">
                          <motion.button
                            className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                              background: "var(--glass-bg)",
                              border: "1px solid var(--border-color)",
                              color: "var(--text-primary)",
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaClock className="float-left mt-1 me-2" /> New Releases
                          </motion.button>
                        </Link>
                        <Link to="/top-rated">
                          <motion.button
                            className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                              background: "var(--glass-bg)",
                              border: "1px solid var(--border-color)",
                              color: "var(--text-primary)",
                            }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaStar className="float-left mt-1 me-2" /> Top Rated
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.section>

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

                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="animate-pulse"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="aspect-[2/3] w-full rounded-2xl glass" />
                          <div className="mt-3 h-4 w-3/4 rounded glass" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MovieGrid movies={filtered} />
                    </motion.div>
                  )}
                </main>
              </>
            } />
            <Route path="/new-releases" element={<NewReleases />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/cast/:id" element={<CastDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
