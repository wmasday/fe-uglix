import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUpload, FaImage, FaTimes, FaCheck } from 'react-icons/fa'

export default function FileUpload({ 
  onFileSelect, 
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  label,
  className = '',
  preview = true
}) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file) => {
    setError('')
    
    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError('Invalid file type. Please select an image.')
      return
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }
    
    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileSelect(null)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          dragActive ? 'border-opacity-100' : 'border-opacity-50'
        }`}
        style={{
          background: dragActive ? 'var(--glass-bg)' : 'var(--bg-secondary)',
          borderColor: error ? 'var(--danger-color)' : 'var(--border-color)'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3"
            >
              {preview && selectedFile.type.startsWith('image/') && (
                <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2">
                <FaCheck className="text-green-500" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {selectedFile.name}
                </span>
                <motion.button
                  onClick={removeFile}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-red-500 text-xs" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3"
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <FaUpload className="text-white text-xl" />
              </div>
              
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Drop your image here or{' '}
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="underline hover:no-underline"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 flex items-center gap-1"
        >
          <FaTimes className="text-xs" />
          {error}
        </motion.p>
      )}
    </div>
  )
}
