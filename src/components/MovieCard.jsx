import { motion } from 'framer-motion'

export default function MovieCard({ movie }) {
  const genreName = movie.genre?.name || movie.genre_name || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative cursor-pointer"
    >
      <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl glass"
           style={{
             background:'var(--glass-bg)',
             border:'1px solid var(--border-color)',
             boxShadow:'var(--glass-shadow)'
           }}>
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center" style={{color:'var(--text-muted)'}}>
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-sm font-bold line-clamp-1" style={{color:'var(--text-primary)'}}>{movie.title}</h3>
        {genreName && <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>{genreName}</p>}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
           style={{
             background:'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
             backdropFilter:'blur(2px)'
           }} />

      <motion.div 
        className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500"
        initial={{ y: 20 }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-white text-xs line-clamp-3 font-medium leading-relaxed">
          {movie.description || 'No description available.'}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full" style={{background:'rgba(255,255,255,0.2)'}}>
            {movie.type || 'Movie'}
          </span>
          {movie.rating && (
            <span className="text-xs px-2 py-1 rounded-full" style={{background:'rgba(255,255,255,0.2)'}}>
              ⭐ {movie.rating}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}


