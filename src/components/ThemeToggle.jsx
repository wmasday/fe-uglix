import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <motion.button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(15px)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--glass-shadow)'
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      title="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <FaSun className="absolute inset-0 text-amber-400 transition-all duration-300" 
                style={{
                  opacity: theme === 'light' ? 1 : 0,
                  transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0.8)'
                }} />
        <FaMoon className="absolute inset-0 text-blue-400 transition-all duration-300" 
                 style={{
                   opacity: theme === 'dark' ? 1 : 0,
                   transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.8)'
                 }} />
      </div>
      <span className="text-sm font-semibold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </motion.button>
  )
}


