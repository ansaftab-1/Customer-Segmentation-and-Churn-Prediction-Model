import { useMemo, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PHOTOS } from '../photosData'

/* ── Heart SVG Badge ── */
function HeartBadge() {
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
}

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
function GalleryCard({ layout, photo, onClick, index }) {
  const depthClass =
    layout.depth === 'bg'
      ? 'depth-bg'
      : layout.depth === 'mid'
        ? 'depth-mid'
        : ''

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
        initial={{ opacity: 0, y: 50, scale: 0.8, rotate: layout.rot + (Math.random() > 0.5 ? 8 : -8) }}
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
}

/* ── Page 3 Video Background (0.5x Slow Playback) ── */
function GalleryBackgroundVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = 0.5

    const applySlowSpeed = () => {
      if (video) video.playbackRate = 0.5
    }

    video.addEventListener('play', applySlowSpeed)
    video.addEventListener('loadedmetadata', applySlowSpeed)

    return () => {
      video.removeEventListener('play', applySlowSpeed)
      video.removeEventListener('loadedmetadata', applySlowSpeed)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Video with top and bottom soft mask feathering */}
      <div
        className="w-full h-full"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.95) contrast(1.02)',
          }}
        >
          <source src="/2-page.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Top seamless blend fade into Page 2 */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #060c1b 0%, rgba(6, 12, 27, 0.7) 45%, transparent 100%)',
        }}
      />

      {/* Bottom seamless blend fade into Page 4 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, #060c1b 0%, rgba(6, 12, 27, 0.7) 45%, transparent 100%)',
        }}
      />
    </div>
  )
}

/* ── Main Scattered Gallery with Mouse-Tracking Parallax ── */
export default function ScatteredGallery({ onPhotoClick }) {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const rafRef = useRef(null)

  /* Mouse-tracking parallax effect */
  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Normalized coordinates (-1 to 1 from center)
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseRef.current.targetX = (e.clientX - cx) / (rect.width / 2)
    mouseRef.current.targetY = (e.clientY - cy) / (rect.height / 2)
  }, [])

  /* ── 60 FPS Smooth Parallax Loop ── */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cardElements = container.querySelectorAll('.float-anim')

    function tick() {
      // Lerp mouse position for silky smooth movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      cardElements.forEach((el) => {
        const factor = parseFloat(el.getAttribute('data-parallax') || '0.5')
        const maxOffset = 25 * factor
        const px = mx * maxOffset
        const py = my * maxOffset

        el.style.transform = `translate3d(${px}px, ${py}px, 0)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="gallery-section relative overflow-hidden"
      id="gallery"
      onMouseMove={handleMouseMove}
    >
      {/* ── Page 3 Video Background (0.5x Slow Motion) ── */}
      <GalleryBackgroundVideo />

      {/* Section Header */}
      <motion.div
        className="relative z-10 text-center pt-16 pb-4 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#e6c86a',
            marginBottom: 12,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          Chapter Two — Our Moments
        </p>
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
