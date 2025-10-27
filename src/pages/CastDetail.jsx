import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaCalendarAlt,
  FaUser,
  FaFilm,
  FaStar,
  FaPlay,
  FaClock,
  FaGlobe,
  FaHeart,
} from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchActor, fetchActorMovies } from "../api";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";

export default function CastDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  useEffect(() => {
    loadActor();
    loadMovies();
  }, [id]);

  const loadActor = async () => {
    try {
      setLoading(true);
      setError("");
      const actorData = await fetchActor(id);
      setActor(actorData);
    } catch (err) {
      setError("Failed to load actor details");
      console.error("Error loading actor:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async (page = 1) => {
    try {
      setMoviesLoading(true);
      const response = await fetchActorMovies({
        actorId: id,
        page,
        perPage: 20,
      });
      setMovies(response.data || []);
      setCurrentPage(response.current_page || 1);
      setTotalPages(response.last_page || 1);
      setTotalMovies(response.total || 0);
    } catch (err) {
      console.error("Error loading actor movies:", err);
    } finally {
      setMoviesLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadMovies(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

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
            style={{ borderColor: "var(--primary-color)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (error || !actor) {
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
            <div
              className="text-6xl mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              🎭
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {error || "Actor not found"}
            </h2>
            <p
              className="text-lg mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              The actor you're looking for doesn't exist.
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
    );
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
          background: "var(--header-bg)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--header-border)",
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
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ rotate: 5 }}
            >
              <FaChevronLeft className="text-white" />
            </motion.div>
            <span
              className="font-bold text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              Back to Browse
            </span>
          </Link>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actor Hero Section */}
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
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Actor Photo */}
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  {actor.photo_url ? (
                    <img
                      src={actor.photo_url}
                      alt={actor.name}
                      className="w-48 h-48 rounded-2xl object-cover"
                      style={{ boxShadow: "var(--glass-shadow)" }}
                    />
                  ) : (
                    <div
                      className="w-48 h-48 rounded-2xl flex items-center justify-center text-6xl font-bold"
                      style={{
                        background: "var(--gradient-primary)",
                        color: "white",
                        boxShadow: "var(--glass-shadow)",
                      }}
                    >
                      {actor.name.charAt(0)}
                    </div>
                  )}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "var(--gradient-secondary)" }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <FaHeart className="text-white text-sm" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Actor Information */}
              <div className="flex-1">
                <motion.h1
                  className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
                  style={{ color: "var(--text-primary)" }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {actor.name}
                </motion.h1>

                {actor.bio && (
                  <motion.p
                    className="text-lg mb-6 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {actor.bio}
                  </motion.p>
                )}

                {/* Actor Stats */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: "var(--glass-bg)" }}
                    >
                      <FaCalendarAlt
                        className="text-2xl"
                        style={{ color: "var(--primary-color)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Born
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatDate(actor.birth_date)}
                        {actor.birth_date && (
                          <span
                            className="text-sm font-normal ml-2"
                            style={{ color: "var(--text-muted)" }}
                          >
                            ({calculateAge(actor.birth_date)} years old)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: "var(--glass-bg)" }}
                    >
                      <FaFilm
                        className="text-2xl"
                        style={{ color: "var(--secondary-color)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Movies & Series
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {totalMovies} {totalMovies === 1 ? "title" : "titles"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: "var(--glass-bg)" }}
                    >
                      <FaStar
                        className="text-2xl"
                        style={{ color: "var(--accent-color)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Experience
                      </p>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {actor.birth_date
                          ? calculateAge(actor.birth_date) + " years"
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Movies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Filmography
                </h2>
                <p
                  className="text-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Movies and series featuring {actor.name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <FaFilm
                    className="text-sm"
                    style={{ color: "var(--primary-color)" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {totalMovies} titles
                  </span>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <AnimatePresence mode="wait">
              {moviesLoading ? (
                <motion.div
                  key="loading"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
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
                  <div
                    className="text-6xl mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    🎬
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    No movies found
                  </h3>
                  <p
                    className="text-lg"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    This actor hasn't appeared in any movies or series yet.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!moviesLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={moviesLoading}
              />
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
