import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import RibbonCarousel from './components/RibbonCarousel'
import ScatteredGallery from './components/ScatteredGallery'
import Sketchbook from './components/Sketchbook'
import StarlightGalaxy from './components/StarlightGalaxy'
import BirthdayFinale from './components/BirthdayFinale'
import ImageModal from './components/ImageModal'

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const progressRef = useRef(null)

  const handlePhotoClick = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null)
  }, [])

  const handleNavigate = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  /* Scroll progress bar */
  useEffect(() => {
    const updateProgress = () => {
      const el = progressRef.current
      if (!el) return

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0

      el.style.transform = `scaleX(${progress})`
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden select-none">
      {/* Global fine parchment texture (seamless across all sections) */}
      <div className="film-grain" />

      {/* Scroll Progress Bar */}
      <div ref={progressRef} className="scroll-progress" />

      {/* ── Act 1: Birthday Celebration & Finale (Moved to Top) ── */}
      <BirthdayFinale />

      {/* ── Act 2: Overture — Ribbon Carousel ── */}
      <RibbonCarousel onPhotoClick={handlePhotoClick} />

      {/* ── Act 3: Discovery — Scattered Gallery ── */}
      <ScatteredGallery onPhotoClick={handlePhotoClick} />

      {/* ── Act 4: Intimacy — Interactive Sketchbook ── */}
      <Sketchbook />

      {/* ── Act 5: Cosmos — Starlight Galaxy ── */}
      <StarlightGalaxy />

      {/* ── Full-screen Image Modal ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <ImageModal
            photo={selectedPhoto}
            onClose={handleCloseModal}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
