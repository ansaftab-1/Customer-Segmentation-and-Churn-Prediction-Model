import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import RibbonCarousel from './components/RibbonCarousel'
import ScatteredGallery from './components/ScatteredGallery'
import Sketchbook from './components/Sketchbook'
import StarlightGalaxy from './components/StarlightGalaxy'
import BirthdayFinale from './components/BirthdayFinale'
import ImageModal from './components/ImageModal'
/* ── Unified Living Background Video for Page 2 & Page 3 (page-4.mp4 - Pure & Unblurred) ── */
function ContinuousMemoriesBackground() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) video.play().catch(() => {})
  }, [])

  return (
    <div
      className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/page-4.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

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
    <main className="relative w-full min-h-screen select-none" style={{ overflowX: 'clip' }}>
      {/* Global fine parchment texture (seamless across all sections) */}
      <div className="film-grain" />

      {/* Scroll Progress Bar */}
      <div ref={progressRef} className="scroll-progress" />

      {/* ── Act 1: Birthday Celebration & Finale ── */}
      <BirthdayFinale />

      {/* ── Continuous Living Universe: Page 2 (Ribbon Carousel) & Page 3 (Scattered Gallery) ── */}
      <div className="relative w-full" id="memories-universe">
        {/* Unified sticky video background that persists seamlessly across Page 2 & Page 3 */}
        <ContinuousMemoriesBackground />

        {/* Page 2 & Page 3 content layered seamlessly with zero separation seam */}
        <div className="relative z-10 -mt-[100vh]">
          <RibbonCarousel onPhotoClick={handlePhotoClick} />
          <ScatteredGallery onPhotoClick={handlePhotoClick} />
        </div>
      </div>

      {/* ── Act 4: Intimacy — Interactive Sketchbook ── */}
      <Sketchbook onPhotoClick={handlePhotoClick} />

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
