import { useRef, useEffect, useCallback, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { PHOTOS } from '../photosData'

/* ── Heart SVG Badge ── */
const HeartBadge = memo(function HeartBadge() {
  return (
    <svg
      className="gallery-heart"
      viewBox="0 0 24 24"
      fill="#e07a7a"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
})

/* ── Card layout data — three depth layers with parallax multipliers ── */
const CARD_LAYOUTS = [
  /* Background layer — small, blurred, at edges, high parallax */
  {
    photoIdx: 6, x: 2, y: 22, w: 115, h: 145, rot: -4, depth: 'bg',
    floatDur: 7.5, floatY: -5, floatDelay: 0, parallax: 0.8,
  },
  {
    photoIdx: 8, x: 4, y: 60, w: 105, h: 132, rot: 3, depth: 'bg',
    floatDur: 8.5, floatY: -4, floatDelay: 1.4, parallax: 0.9,
  },
  {
    photoIdx: 10, x: 70, y: 6, w: 110, h: 140, rot: 5, depth: 'bg',
    floatDur: 7, floatY: -6, floatDelay: 0.8, parallax: 0.7,
  },
  {
    photoIdx: 11, x: 86, y: 50, w: 112, h: 142, rot: -5, depth: 'bg',
    floatDur: 9, floatY: -4, floatDelay: 2.2, parallax: 0.85,
  },

  /* Mid layer — medium cards, moderate parallax */
  {
    photoIdx: 1, x: 10, y: 40, w: 150, h: 195, rot: -5, depth: 'mid',
    floatDur: 6, floatY: -7, floatDelay: 0.5, parallax: 0.45,
  },
  {
    photoIdx: 2, x: 28, y: 44, w: 158, h: 205, rot: 6, depth: 'mid',
    floatDur: 6.5, floatY: -8, floatDelay: 1.5, parallax: 0.5,
  },
  {
    photoIdx: 4, x: 52, y: 40, w: 155, h: 200, rot: -3, depth: 'mid',
    floatDur: 6.2, floatY: -6, floatDelay: 1, parallax: 0.4,
  },

  /* Foreground layer — large, sharp, prominent, low parallax */
  {
    photoIdx: 0, x: 14, y: 8, w: 180, h: 230, rot: -7, depth: 'fg',
    floatDur: 5.5, floatY: -9, floatDelay: 0, parallax: 0.15,
  },
  {
    photoIdx: 3, x: 38, y: 10, w: 195, h: 255, rot: 2, depth: 'fg',
    floatDur: 5, floatY: -9, floatDelay: 0.7, parallax: 0.12,
  },
  {
    photoIdx: 5, x: 68, y: 20, w: 182, h: 235, rot: 4, depth: 'fg',
    floatDur: 5.8, floatY: -8, floatDelay: 1.3, parallax: 0.18,
  },
]

/* ── Single Gallery Card ── */
const GalleryCard = memo(function GalleryCard({ layout, photo, onClick, index }) {
  const depthClass =
    layout.depth === 'bg'
      ? 'depth-bg'
      : layout.depth === 'mid'
        ? 'depth-mid'
        : ''

  const initialRotOffset = index % 2 === 0 ? 8 : -8

  return (
    <motion.div
      className="float-anim"
      style={{
        position: 'absolute',
        left: layout.x + '%',
        top: layout.y + '%',
        zIndex: layout.depth === 'fg' ? 20 : layout.depth === 'mid' ? 10 : 2,
        '--float-y': layout.floatY + 'px',
        '--float-dur': layout.floatDur + 's',
        '--float-delay': layout.floatDelay + 's',
      }}
      data-parallax={layout.parallax}
    >
      <motion.div
        className={`gallery-polaroid ${depthClass}`}
        style={{
          width: layout.w,
          transform: `rotate(${layout.rot}deg)`,
        }}
        initial={{ opacity: 0, y: 50, scale: 0.8, rotate: layout.rot + initialRotOffset }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotate: layout.rot }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{
          duration: 0.8,
          delay: index * 0.07,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.08,
          y: -8,
          rotate: 0,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        onClick={() => onClick(photo)}
      >
        {/* Heart badge — only on foreground + mid cards */}
        {layout.depth !== 'bg' && <HeartBadge />}

        {/* Photo */}
        <div className="gp-img-wrap" style={{ height: layout.h - 45 }}>
          <img
            src={photo.src}
            alt={photo.title}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Caption */}
        <div className="gp-caption">
          {photo.title} {photo.emoji}
        </div>
      </motion.div>
    </motion.div>
  )
})


/* ── Main Scattered Gallery with Mouse-Tracking Parallax ── */
function ScatteredGallery({ onPhotoClick }) {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const rectRef = useRef(null)
  const rafRef = useRef(null)
  const isInView = useInView(sectionRef, { margin: '200px 0px' })

  // Cache bounding rect to prevent expensive layout thrashing on every mousemove
  const updateRect = useCallback(() => {
    if (sectionRef.current) {
      rectRef.current = sectionRef.current.getBoundingClientRect()
    }
  }, [])

  useEffect(() => {
    updateRect()
    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [updateRect])

  /* Mouse-tracking parallax effect using cached rect */
  const handleMouseMove = useCallback((e) => {
    if (!rectRef.current) {
      if (!sectionRef.current) return
      rectRef.current = sectionRef.current.getBoundingClientRect()
    }
    const rect = rectRef.current

    // Normalized coordinates (-1 to 1 from center)
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseRef.current.targetX = (e.clientX - cx) / (rect.width / 2)
    mouseRef.current.targetY = (e.clientY - cy) / (rect.height / 2)
  }, [])

  /* ── 60 FPS Smooth Parallax Loop (Active only when section isInView) ── */
  useEffect(() => {
    if (!isInView) return
    const container = containerRef.current
    if (!container) return

    // Precompute DOM references and parallax factors once to avoid DOM reads in 60fps tick
    const cardElements = container.querySelectorAll('.float-anim')
    const cardsData = Array.from(cardElements).map((el) => {
      const factor = parseFloat(el.getAttribute('data-parallax') || '0.5')
      return { el, maxOffset: 25 * factor }
    })

    function tick() {
      // Lerp mouse position for silky smooth movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let i = 0; i < cardsData.length; i++) {
        const item = cardsData[i]
        const px = mx * item.maxOffset
        const py = my * item.maxOffset
        item.el.style.transform = `translate3d(${px}px, ${py}px, 0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="gallery-section relative overflow-hidden"
      id="gallery"
      onMouseMove={handleMouseMove}
    >

      {/* Section Header */}
      <motion.div
        className="relative z-10 text-center pt-16 pb-4 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2
          className="text-shimmer"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
            lineHeight: 1.1,
            filter: 'drop-shadow(0 2px 14px rgba(230, 200, 106, 0.35))',
          }}
        >
          Collected Memories
        </h2>
        <div
          style={{
            width: 70,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #e6c86a, transparent)',
            margin: '16px auto 0',
          }}
        />
      </motion.div>

      {/* Cards Container with parallax */}
      <div
        ref={containerRef}
        className="relative w-full z-10"
        style={{ height: 'calc(100vh - 140px)', maxHeight: '850px', minHeight: '550px' }}
      >
        {CARD_LAYOUTS.map((layout, i) => {
          const photo = PHOTOS[layout.photoIdx]
          if (!photo) return null

          return (
            <GalleryCard
              key={`gallery-${layout.photoIdx}-${i}`}
              layout={layout}
              photo={photo}
              onClick={onPhotoClick}
              index={i}
            />
          )
        })}
      </div>
    </section>
  )
}

export default memo(ScatteredGallery)
