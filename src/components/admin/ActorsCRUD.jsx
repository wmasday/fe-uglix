import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaUser, FaBirthdayCake, FaGlobe, FaFilm, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { 
  fetchActorsAdmin, createActor, updateActor, deleteActor 
} from '../../api'
import ModernModal from '../ModernModal'
import FormLabel from '../FormLabel'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../utils/sweetAlert'
import FileUpload from '../FileUpload';

export default function ActorsCRUD() {
  const [actors, setActors] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingActor, setEditingActor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    nationality: '',
    bio: '',
    photo_url: ''
  })
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    loadActors()
  }, [currentPage, search])

  const loadActors = async () => {
    setLoading(true)
    try {
      const response = await fetchActorsAdmin({
        page: currentPage,
        perPage: 10,
        search
      })
      setActors(response.data || [])
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error loading actors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (photoFile) {
        // With photo upload
        const form = new FormData();
        form.append('name', formData.name);
        form.append('birth_date', formData.birth_date);
        form.append('nationality', formData.nationality);
        form.append('bio', formData.bio);
        if (photoFile) form.append('photo', photoFile);
        if (editingActor) {
          result = await updateActor(editingActor.id, form, true);
        } else {
          result = await createActor(form, true);
        }
      } else {
        // Only photo_url as string
        if (editingActor) {
          result = await updateActor(editingActor.id, formData);
        } else {
          result = await createActor(formData);
        }
      }
      setShowForm(false);
      setEditingActor(null);
      setFormData({ name: '', birth_date: '', nationality: '', bio: '', photo_url: '' });
      setPhotoFile(null);
      loadActors();
    } catch (error) {
      console.error('Error saving actor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (actor) => {
    setEditingActor(actor)
    setFormData({
      name: actor.name,
      birth_date: actor.birth_date || '',
      nationality: actor.nationality || '',
      bio: actor.bio || '',
      photo_url: actor.photo_url || ''
    })
    setPhotoFile(null); // Clear photo file when editing
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this actor?')) {
      try {
        await deleteActor(id)
        loadActors()
      } catch (error) {
        console.error('Error deleting actor:', error)
      }
    }
  }

  const getAge = (birthDate) => {
    if (!birthDate) return 'N/A'
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-secondary)' }}>
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Actors Management
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage cast members and performers
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            style={{ background: 'var(--gradient-secondary)' }}
          >
            <FaPlus />
            Add Actor
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search actors by name, nationality, or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-offset-0 transition-all duration-300"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <FaUser />
            <span>{actors.length} actors</span>
          </div>
        </div>
      </motion.div>

      {/* Actors Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <motion.div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: 'var(--primary-color)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          actors.map((actor, index) => (
            <motion.div
              key={actor.id}
              className="glass rounded-2xl p-6"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--glass-shadow)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {actor.photo_url ? (
                      <img 
                        src={actor.photo_url} 
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                        <FaUser className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {actor.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {actor.movies_count || 0} movies
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleEdit(actor)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      background: 'var(--glass-bg)',
                      color: 'var(--primary-color)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(actor.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ 
                      background: 'var(--glass-bg)',
                      color: 'var(--danger-color)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {actor.birth_date && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <FaBirthdayCake />
                    <span>Age {getAge(actor.birth_date)}</span>
                  </div>
                )}
                {actor.nationality && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <FaGlobe />
                    <span>{actor.nationality}</span>
                  </div>
                )}
              </div>

              {actor.bio && (
                <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                  {actor.bio}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <FaFilm />
                <span>Added {new Date(actor.created_at).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-between glass rounded-2xl p-6"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--glass-shadow)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{
                background: currentPage === 1 ? 'var(--bg-secondary)' : 'var(--glass-bg)',
                color: 'var(--text-primary)'
              }}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{
                background: currentPage === totalPages ? 'var(--bg-secondary)' : 'var(--glass-bg)',
                color: 'var(--text-primary)'
              }}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Actor Form Modal */}
      <ModernModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingActor(null);
          setPhotoFile(null);
          setFormData({ name: '', birth_date: '', nationality: '', bio: '', photo_url: '' });
        }}
        title={editingActor ? 'Edit Actor' : 'Add New Actor'}
        size="lg"
        loading={loading}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Actor Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="e.g., Tom Hanks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Birth Date
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="e.g., American, British"
              />
            </div>
            <div>
              <FileUpload
                label="Photo (optional)"
                onFileSelect={setPhotoFile}
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                preview={true}
              />
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>or use URL:</span>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-0"
                  placeholder="https://example.com/image.jpg"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  disabled={photoFile !== null}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Biography
            </label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-offset-0"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              placeholder="Brief biography of the actor..."
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <motion.button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingActor(null);
                setPhotoFile(null);
              }}
              className="px-6 py-3 rounded-xl font-medium"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-6 py-3"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <FaSave />
                  {editingActor ? 'Update Actor' : 'Create Actor'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </ModernModal>
      {/* END MODAL */}
    </div>
  )
}
