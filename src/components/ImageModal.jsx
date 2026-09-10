import { useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { PHOTOS } from '../photosData'

function ImageModal({ photo, onClose, onNavigate }) {
  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* Find current index for navigation */
  const currentIndex = PHOTOS.findIndex((p) => p.id === photo?.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < PHOTOS.length - 1

  const goPrev = useCallback(() => {
    if (hasPrev && onNavigate) onNavigate(PHOTOS[currentIndex - 1])
  }, [currentIndex, hasPrev, onNavigate])

  const goNext = useCallback(() => {
    if (hasNext && onNavigate) onNavigate(PHOTOS[currentIndex + 1])
  }, [currentIndex, hasNext, onNavigate])

  /* Keyboard: Esc to close, arrows to navigate */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goPrev, goNext])

  if (!photo) return null

  return (
    <motion.div
      id="image-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        id="modal-close-btn"
        className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.1, rotate: 90, background: 'rgba(255,255,255,0.2)' }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-4 h-4 text-white" />
      </motion.button>

      {/* Navigation arrows */}
      {onNavigate && hasPrev && (
        <motion.button
          className="absolute left-4 sm:left-8 z-50 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
          }}
          whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
      )}

      {onNavigate && hasNext && (
        <motion.button
          className="absolute right-4 sm:right-8 z-50 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
          }}
          whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); goNext() }}
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      )}

      {/* Main polaroid card */}
      <motion.div
        className="modal-card overflow-hidden flex flex-col items-center"
        style={{ maxWidth: 460, width: '100%', padding: '10px 10px 6px 10px' }}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.03 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full overflow-hidden rounded-md"
          style={{ background: '#f0e6d6' }}
        >
          <motion.img
            key={photo.id}
            src={photo.src}
            alt={photo.title || 'Memory'}
            className="w-full h-auto max-h-[72vh] object-contain"
            style={{ display: 'block' }}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="w-full py-3 text-center">
          <motion.h3
            key={photo.title}
            className="text-2xl sm:text-3xl font-normal"
            style={{
              fontFamily: 'var(--font-script)',
              color: '#573d21',
              letterSpacing: '0.02em',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {photo.title} {photo.emoji || ''}
          </motion.h3>

          {/* Photo counter */}
          {onNavigate && (
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              color: '#a09485',
              marginTop: 4,
              letterSpacing: '0.08em',
            }}>
              {currentIndex + 1} / {PHOTOS.length}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default memo(ImageModal)
