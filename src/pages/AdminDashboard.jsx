import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCog,
  FaUserShield,
  FaFilm,
  FaTag,
  FaUser,
  FaList,
  FaUsers,
  FaChartBar,
  FaHome,
  FaDatabase,
  FaCogs,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import MoviesCRUD from "../components/admin/MoviesCRUD";
import GenresCRUD from "../components/admin/GenresCRUD";
import ActorsCRUD from "../components/admin/ActorsCRUD";
import EpisodesCRUD from "../components/admin/EpisodesCRUD";
import MovieCastsCRUD from "../components/admin/MovieCastsCRUD";
import { fetchMoviesAdmin, fetchGenresAdmin } from '../api';
import { fetchActorsAdmin } from '../api';
import { fetchEpisodesAdmin } from '../api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Dynamic counts
  const [counts, setCounts] = useState({ movies: 0, genres: 0, actors: 0, episodes: 0, "movie-casts": 0 });

  useEffect(() => {
    async function fetchAllCounts() {
      // Movies
      const movies = await fetchMoviesAdmin({ perPage: 1 });
      // Genres
      const genres = await fetchGenresAdmin({ perPage: 1 });
      // Actors
      const actors = await fetchActorsAdmin({ perPage: 1 });
      // Episodes
      const episodes = await fetchEpisodesAdmin({ perPage: 1 });
      setCounts({
        movies: movies.total || 0,
        genres: genres.total || 0,
        actors: actors.total || 0,
        episodes: episodes.total || 0,
        "movie-casts": 0 // TODO: fetch movie casts count if/when backend supports it
      });
    }
    fetchAllCounts();
  }, []);

  const tabs = [
    { id: "movies", label: "Movies", icon: FaFilm, count: counts.movies },
    { id: "genres", label: "Genres", icon: FaTag, count: counts.genres },
    { id: "actors", label: "Actors", icon: FaUser, count: counts.actors },
    { id: "episodes", label: "Episodes", icon: FaList, count: counts.episodes },
    { id: "movie-casts", label: "Movie Casts", icon: FaUsers, count: counts["movie-casts"] },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "movies":
        return <MoviesCRUD />;
      case "genres":
        return <GenresCRUD />;
      case "actors":
        return <ActorsCRUD />;
      case "episodes":
        return <EpisodesCRUD />;
      case "movie-casts":
        return <MovieCastsCRUD />;
      default:
        return <MoviesCRUD />;
    }
  };

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
        className="sticky top-0 z-50"
        style={{
          background: "var(--header-bg)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--header-border)",
          boxShadow: "var(--glass-shadow)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 rounded-2xl"
                style={{ background: "var(--gradient-primary)" }}
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <FaFilm className="text-2xl text-white" />
              </motion.div>
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Admin Dashboard
                </h1>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Welcome back, {user?.full_name || user?.username}
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "var(--danger-color)",
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt className="text-sm" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-3 rounded-2xl transition-all duration-300"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                className="lg:hidden border-t py-4"
                style={{ borderColor: "var(--border-light)" }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "var(--danger-color)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              className="rounded-2xl p-6 glass"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--glass-shadow)",
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {tab.label}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {tab.count}
                  </p>
                </div>
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <tab.icon className="text-2xl text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="rounded-2xl p-6 glass"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <h3
                className="text-lg font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Management
              </h3>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id ? "text-white" : ""
                    }`}
                    style={{
                      background:
                        activeTab === tab.id
                          ? "var(--gradient-primary)"
                          : "var(--glass-bg)",
                      border: "1px solid var(--border-color)",
                      color:
                        activeTab === tab.id ? "white" : "var(--text-primary)",
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="text-sm" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    <span
                      className="ml-auto text-xs px-2 py-1 rounded-full"
                      style={{
                        background:
                          activeTab === tab.id
                            ? "rgba(255,255,255,0.2)"
                            : "var(--glass-bg)",
                        color:
                          activeTab === tab.id
                            ? "white"
                            : "var(--text-secondary)",
                      }}
                    >
                      {tab.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
