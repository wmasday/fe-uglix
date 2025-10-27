import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaUserLock, FaInfoCircle } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  return (
    <div
      style={{
        background: "var(--page-bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: "var(--gradient-secondary)" }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 p-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="p-2 rounded-xl"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ rotate: -5 }}
            >
              <FaArrowLeft className="text-white" />
            </motion.div>
            <span
              className="font-bold text-xl group-hover:opacity-80 transition-opacity"
              style={{ color: "var(--text-primary)" }}
            >
              Back to Home
            </span>
          </Link>

          <ThemeToggle />
        </div>
      </motion.header>

      {/* Disabled Registration Message */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="rounded-3xl p-8 md:p-12 glass text-center"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--glass-shadow)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Icon */}
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--gradient-secondary)" }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <FaUserLock className="text-3xl text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Registration Disabled
          </motion.h1>

          {/* Message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p
              className="text-lg mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              New user registration is currently disabled.
            </p>
            <div
              className="flex items-center justify-center gap-2 p-4 rounded-xl"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "var(--info-color)",
              }}
            >
              <FaInfoCircle className="text-lg" />
              <span className="text-sm font-medium">
                Contact your administrator to request access
              </span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/login">
              <motion.button
                className="w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 mb-3"
                style={{ background: "var(--gradient-primary)" }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login
              </motion.button>
            </Link>

            <Link to="/">
              <motion.button
                className="w-full py-4 rounded-xl font-semibold transition-all duration-300"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
