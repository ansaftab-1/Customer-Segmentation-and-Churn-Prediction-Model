import { useEffect, useRef, useMemo, useState, useCallback, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { PHOTOS } from '../photosData'

/* ══════════════════════════════════════════════════════════════════════════════
   SIGNATURE 3D MEMORY RIBBON & LIVING BACKGROUND
   Continuous parametric ribbon path · 60 FPS precomputed lookup physics
   3D depth layers · Optical focal lens · Living sunlight & particle atmosphere
   Fully responsive across mobile/tablet/desktop · Battery & GPU optimized
   ══════════════════════════════════════════════════════════════════════════════ */

/* SVG Path for the 3D continuous flowing ribbon curve.
   A sweeping S-curve with a majestic focal loop in the center.
   ViewBox: 0 0 1600 900 */
const RIBBON_SVG_PATH =
  'M -180,820 ' +
  'C 60,800 240,710 400,560 ' +
  'C 510,460 550,350 580,260 ' +
  'C 610,160 685,130 790,130 ' +
  'C 900,130 980,180 1000,280 ' +
  'C 1015,390 950,510 850,545 ' +
  'C 750,575 650,540 610,445 ' +
  'C 570,350 600,265 680,235 ' +
  'C 770,205 870,280 970,405 ' +
  'C 1090,550 1260,670 1470,720 ' +
  'C 1600,750 1720,780 1880,790'

const VIEW_W = 1600
const VIEW_H = 900
const CARD_COUNT = 24 // 24 cards (12 photos repeated seamlessly for dense infinite ribbon)
const LOOKUP_SAMPLES = 600

/* ══════════════════════════════════════════════════════════════
   LAYER: LIVING SUNLIGHT & BOKEH PARTICLES CANVAS
   Living golden hour light source + drifting champagne dust
   ══════════════════════════════════════════════════════════════ */
const LivingAtmosphereCanvas = memo(function LivingAtmosphereCanvas({ mouseRef, focalPosRef, isInView = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isInView) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const isMobile = window.innerWidth < 768
    const numParticles = isMobile ? 12 : 24

    // Champagne dust / golden bokeh motes
    const particles = Array.from({ length: numParticles }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 1.5 + Math.random() * (i < (isMobile ? 3 : 5) ? 18 : 3.5),
      alpha: 0.15 + Math.random() * 0.4,
      baseAlpha: 0.15 + Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -0.1 - Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      hue: 35 + Math.random() * 15,
    }))

    let time = 0
    let smoothLightX = w * 0.5
    let smoothLightY = h * 0.35

    function render() {
      time += 0.012
      ctx.clearRect(0, 0, w, h)

      // Target position for living sunlight
      const mx = mouseRef.current.x * w
      const my = mouseRef.current.y * h

      const targetLightX = w * 0.5 + (mx - w * 0.5) * 0.12
      const targetLightY = h * 0.45 + (my - h * 0.5) * 0.1
      smoothLightX += (targetLightX - smoothLightX) * 0.03
      smoothLightY += (targetLightY - smoothLightY) * 0.03

      // 1. Soft Warm Ambient Glow
      const sunBeamGrad = ctx.createRadialGradient(
        smoothLightX,
        smoothLightY,
        0,
        smoothLightX,
        smoothLightY,
        Math.min(w, h) * (isMobile ? 0.38 : 0.45)
      )
      sunBeamGrad.addColorStop(0, 'rgba(255, 248, 230, 0.22)')
      sunBeamGrad.addColorStop(0.5, 'rgba(245, 230, 205, 0.07)')
      sunBeamGrad.addColorStop(1, 'rgba(245, 230, 205, 0)')
      ctx.fillStyle = sunBeamGrad
      ctx.fillRect(0, 0, w, h)

      // 2. Optical Lens Glint tracking the focal ribbon node
      if (focalPosRef?.current) {
        const fx = (focalPosRef.current.x / 100) * w
        const fy = (focalPosRef.current.y / 100) * h

        const glintGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, isMobile ? 80 : 140)
        glintGrad.addColorStop(0, 'rgba(255, 245, 200, 0.35)')
        glintGrad.addColorStop(0.3, 'rgba(255, 215, 0, 0.12)')
        glintGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glintGrad
        ctx.beginPath()
        ctx.arc(fx, fy, isMobile ? 80 : 140, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Champagne Bokeh & Golden Dust Motes
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.alpha = p.baseAlpha + Math.sin(time * 3 + p.phase) * 0.12

        // Wrap around boundaries
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        ctx.save()
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha))
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        pGrad.addColorStop(0, `hsla(${p.hue}, 90%, 85%, 0.8)`)
        pGrad.addColorStop(0.5, `hsla(${p.hue}, 80%, 65%, 0.25)`)
        pGrad.addColorStop(1, `hsla(${p.hue}, 70%, 50%, 0)`)
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [mouseRef, focalPosRef, isInView])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
})

/* ══════════════════════════════════════════════════════════════
   LAYER: CINEMATIC EDITORIAL TITLE
   Breathing typography · Luminous gold shimmer · Clear high-contrast reveal
   ══════════════════════════════════════════════════════════════ */
const CinematicHeroTitle = memo(function CinematicHeroTitle({ activePhoto }) {
  return (
    <div
      className="absolute pointer-events-none z-30 max-w-[92vw] sm:max-w-[75vw]"
      style={{
        top: 'clamp(14px, 4.5vh, 44px)',
        left: 'clamp(14px, 4.5vw, 44px)',
      }}
    >
      {/* Editorial Category Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(9px, 1.8vw, 11px)',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#FFE699',
            textShadow: '0 0 12px rgba(255, 230, 153, 0.6), 0 2px 8px rgba(0, 0, 0, 0.95)',
          }}
        >
          ✦ A Collection of Moments ✦
        </span>
        <span style={{ width: 28, height: 1.5, background: '#FFD700', boxShadow: '0 0 10px #FFD700', opacity: 0.85 }} />
      </motion.div>

      {/* "Happy Birthday" — Grand Display Serif in Luminous White & Radiant Gold */}
      <div style={{ overflow: 'hidden' }}>
        <motion.h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 6vw, 82px)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textShadow: '0 0 32px rgba(255, 230, 150, 0.7), 0 3px 18px rgba(0, 0, 0, 0.98)',
          }}
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Happy
        </motion.h1>
      </div>

      <div style={{ overflow: 'hidden' }}>
        <motion.h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 6vw, 82px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#FFF4BD',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textShadow: '0 0 32px rgba(255, 215, 0, 0.7), 0 3px 18px rgba(0, 0, 0, 0.98)',
          }}
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          Birthday
        </motion.h1>
      </div>

      {/* "Sweety" in Radiant Shimmer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.3, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="text-shimmer"
          style={{
            display: 'block',
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(42px, 7.5vw, 96px)',
            marginTop: '2px',
            marginLeft: '6px',
            lineHeight: 1.05,
            filter: 'drop-shadow(0 0 24px rgba(255, 215, 0, 0.85)) drop-shadow(0 3px 14px rgba(0, 0, 0, 0.95))',
          }}
        >
          Sweety
        </span>
      </motion.div>

      {/* Active focal memory tag — Frosted pill for clear legibility */}
      {activePhoto && (
        <motion.div
          key={activePhoto.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 999,
            background: 'rgba(6, 12, 27, 0.72)',
            border: '1px solid rgba(255, 215, 0, 0.38)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 215, 0, 0.15)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#FFD700',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(10px, 2vw, 11.5px)',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FFE699',
              textShadow: '0 0 8px rgba(255, 230, 153, 0.5)',
            }}
          >
            Focal Memory: <strong style={{ color: '#FFFFFF', fontWeight: 700, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>{activePhoto.title} {activePhoto.emoji}</strong>
          </span>
        </motion.div>
      )}
    </div>
  )
})

/* ══════════════════════════════════════════════════════════════
   LAYER: EDITORIAL CORNER COUNTER & CONTROL INDICATOR
   ══════════════════════════════════════════════════════════════ */
const EditorialMetaInfo = memo(function EditorialMetaInfo({ currentFocalIndex, totalUnique }) {
  const formattedIndex = String((currentFocalIndex % totalUnique) + 1).padStart(2, '0')
  const formattedTotal = String(totalUnique).padStart(2, '0')

  return (
    <div
      className="absolute top-4 sm:top-8 right-4 sm:right-8 z-30 pointer-events-none flex flex-col items-end"
      style={{
        padding: '6px 14px',
        borderRadius: 12,
        background: 'rgba(6, 12, 27, 0.65)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1,
            textShadow: '0 0 18px rgba(255, 215, 0, 0.6), 0 2px 10px rgba(0, 0, 0, 0.95)',
          }}
        >
          {formattedIndex}
        </span>
        <span style={{ fontSize: '13px', color: '#FFD700', fontWeight: 300, textShadow: '0 0 10px #FFD700' }}>/</span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: '#FFE699',
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          {formattedTotal}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '8.5px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#E6C86A',
          marginTop: 2,
          textShadow: '0 1px 6px rgba(0, 0, 0, 0.9)',
        }}
      >
        Memory Orbit
      </span>
    </div>
  )
})

/* ══════════════════════════════════════════════════════════════
   LAYER: INTERACTION GUIDES & SCROLL INDICATOR
   ══════════════════════════════════════════════════════════════ */
const InteractionControls = memo(function InteractionControls() {
  return (
    <div
      className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1.5"
    >
      <div
        style={{
          padding: '5px 16px',
          borderRadius: 999,
          background: 'rgba(6, 12, 27, 0.72)',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#FFE699',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.7)',
          textShadow: '0 0 10px rgba(255, 230, 153, 0.6), 0 1px 4px rgba(0, 0, 0, 0.95)',
        }}
        className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10.5px] tracking-widest uppercase font-sans font-semibold"
      >
        <span>Drag / Swipe to Orbit</span>
        <span style={{ color: '#FFD700' }}>•</span>
        <span>Scroll to Travel</span>
      </div>

      <div className="scroll-indicator flex flex-col items-center">
        <svg width="18" height="24" viewBox="0 0 18 26" fill="none">
          <rect x="1" y="1" width="16" height="24" rx="8" stroke="#FFD700" strokeWidth="1.2" opacity="0.85" />
          <circle cx="9" cy="8" r="2.2" fill="#FFE699">
            <animate
              attributeName="cy"
              values="8;17;8"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  )
})

/* ══════════════════════════════════════════════════════════════
   LAYER: CINEMATIC BACKGROUND VIDEO (0.5x Slow Playback)
   ══════════════════════════════════════════════════════════════ */
const Page2BackgroundVideo = memo(function Page2BackgroundVideo({ isInView = true }) {
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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isInView) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isInView])

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Video with top and bottom soft mask feathering */}
      <div
        className="w-full h-full"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
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

      {/* Top seamless blend fade into Page 1 */}
      <div
        className="absolute top-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #060c1b 0%, rgba(6, 12, 27, 0.7) 45%, transparent 100%)',
        }}
      />

      {/* Bottom seamless blend fade into Page 3 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, #060c1b 0%, rgba(6, 12, 27, 0.7) 45%, transparent 100%)',
        }}
      />
    </div>
  )
})

/* ── Memoized 24 Cards Field: Prevents re-rendering 24 cards on focal index change ── */
const RibbonCardsField = memo(function RibbonCardsField({ cards, cardRefs, onPhotoClick, velocityRef }) {
  return (
    <>
      {cards.map((card, i) => (
        <div
          key={`ribbon-card-${card.idx}`}
          ref={(el) => { cardRefs.current[i] = el }}
          className="ribbon-polaroid pointer-events-auto"
          onClick={(e) => {
            if (Math.abs(velocityRef.current) < 0.003) {
              e.stopPropagation()
              onPhotoClick(card)
            }
          }}
          data-cursor="VIEW"
          style={{
            willChange: 'transform, left, top, opacity',
            transformOrigin: 'center center',
          }}
        >
          <div className="ribbon-polaroid-img">
            <img
              src={card.src}
              alt={card.title}
              loading={i < 8 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>
          <div
            className="text-center pt-0.5 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(9px, 1.8vw, 12px)',
              color: '#573d21',
              lineHeight: 1.2,
            }}
          >
            {card.title}
          </div>
        </div>
      ))}
    </>
  )
})

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT: RIBBON CAROUSEL (LIVING 3D MEMORY FIELD)
   ══════════════════════════════════════════════════════════════ */
function RibbonCarousel({ onPhotoClick, isViewerOpen = false }) {
  const sectionRef = useRef(null)
  const isSectionInView = useInView(sectionRef, { margin: '200px 0px' })

  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const cardRefs = useRef([])
  const rafRef = useRef(null)
  const lookupTableRef = useRef([])

  // Motion physics states (stored in mutable refs for 60fps zero-react-render pipeline)
  const progressRef = useRef(0.35)
  const velocityRef = useRef(0)
  const targetVelocityRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5, rawX: 0, rawY: 0 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const focalPosRef = useRef({ x: 50, y: 40 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, progress: 0, time: 0, isTouch: false, lockedAxis: null })
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 })

  // State only for high-level metadata (debounced / thresholded)
  const [focalCardIndex, setFocalCardIndex] = useState(0)

  // Card dataset: 24 cards evenly repeated from PHOTOS
  const cards = useMemo(() => {
    return Array.from({ length: CARD_COUNT }, (_, i) => ({
      ...PHOTOS[i % PHOTOS.length],
      idx: i,
      uniquePhotoId: PHOTOS[i % PHOTOS.length].id,
    }))
  }, [])

  // Precompute 600-point path lookup table with upright orientation guarantees
  const generateLookupTable = useCallback(() => {
    const pathEl = pathRef.current
    if (!pathEl) return

    const totalLen = pathEl.getTotalLength()
    const table = []

    for (let s = 0; s <= LOOKUP_SAMPLES; s++) {
      const dist = (s / LOOKUP_SAMPLES) * totalLen
      const pt = pathEl.getPointAtLength(dist)
      const ptNext = pathEl.getPointAtLength((dist + 4) % totalLen)

      let angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI)
      while (angle > 180) angle -= 360
      while (angle < -180) angle += 360

      // Normalize angle so photo cards are ALWAYS upright (never upside down)
      if (angle > 90) angle -= 180
      else if (angle < -90) angle += 180

      // Soft clamp to natural floating tilt [-28deg, 28deg]
      const clampedAngle = Math.max(-28, Math.min(28, angle * 0.55))

      table.push({
        x: pt.x,
        y: pt.y,
        angle: clampedAngle,
      })
    }

    lookupTableRef.current = table
  }, [])

  useEffect(() => {
    generateLookupTable()
    window.addEventListener('resize', generateLookupTable)
    return () => window.removeEventListener('resize', generateLookupTable)
  }, [generateLookupTable])

  // Desktop Mouse Parallax Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
        rawX: e.clientX,
        rawY: e.clientY,
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Wheel & Page Scroll Physics Impulse — Calibrated for smooth, gentle, natural motion
  useEffect(() => {
    let lastScrollY = window.scrollY

    const SCROLL_SENSITIVITY = 0.000002
    const SCROLL_MAX_IMPULSE = 0.00015
    const MAX_VELOCITY = 0.0010

    const handleScroll = () => {
      const currY = window.scrollY
      const deltaY = currY - lastScrollY
      lastScrollY = currY

      if (Math.abs(deltaY) < 0.5) return

      const impulse = Math.sign(deltaY) * Math.min(Math.abs(deltaY) * SCROLL_SENSITIVITY, SCROLL_MAX_IMPULSE)

      if (velocityRef.current !== 0 && Math.sign(velocityRef.current) !== Math.sign(impulse)) {
        velocityRef.current *= 0.4
      }

      velocityRef.current += impulse
      velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current))
    }

    const handleWheel = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      if (rect.top <= 80 && rect.bottom >= window.innerHeight - 80) {
        const delta = e.deltaY
        const WHEEL_SENSITIVITY = 0.000004
        const WHEEL_MAX_IMPULSE = 0.00035

        const impulse = Math.sign(delta) * Math.min(Math.abs(delta) * WHEEL_SENSITIVITY, WHEEL_MAX_IMPULSE)

        if (velocityRef.current !== 0 && Math.sign(velocityRef.current) !== Math.sign(impulse)) {
          velocityRef.current *= 0.4
        }

        velocityRef.current += impulse
        velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Touch and Drag Gestures (Allows native vertical scroll on mobile)
  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true
    const isTouch = !!e.touches
    const clientX = isTouch ? e.touches[0].clientX : e.clientX
    const clientY = isTouch ? e.touches[0].clientY : e.clientY

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      progress: progressRef.current,
      time: performance.now(),
      isTouch,
      lockedAxis: null,
    }
    lastPointerRef.current = { x: clientX, y: clientY, time: performance.now() }
    velocityRef.current = 0
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    const isTouch = dragStartRef.current.isTouch
    const clientX = isTouch ? e.touches?.[0]?.clientX ?? 0 : e.clientX
    const clientY = isTouch ? e.touches?.[0]?.clientY ?? 0 : e.clientY
    const now = performance.now()

    const dx = clientX - dragStartRef.current.x
    const dy = clientY - dragStartRef.current.y

    // On mobile touch, disambiguate vertical scroll vs horizontal carousel orbit
    if (isTouch && !dragStartRef.current.lockedAxis) {
      if (Math.hypot(dx, dy) > 8) {
        if (Math.abs(dy) > Math.abs(dx) * 1.15) {
          dragStartRef.current.lockedAxis = 'y'
          isDraggingRef.current = false
          return
        } else {
          dragStartRef.current.lockedAxis = 'x'
        }
      } else {
        return
      }
    }

    if (dragStartRef.current.lockedAxis === 'y') return

    const dt = now - lastPointerRef.current.time
    // Calibrated gentle drag response (was 0.75, now 0.28)
    const progressDelta = (dx / window.innerWidth) * 0.28
    progressRef.current = (dragStartRef.current.progress - progressDelta + 1000) % 1.0

    if (dt > 10) {
      const stepDx = clientX - lastPointerRef.current.x
      const rawVel = -(stepDx / window.innerWidth) * (16 / Math.max(dt, 16)) * 0.12
      targetVelocityRef.current = Math.max(-0.0012, Math.min(0.0012, rawVel))
      lastPointerRef.current = { x: clientX, y: clientY, time: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    velocityRef.current = targetVelocityRef.current
    targetVelocityRef.current = 0
  }, [])

  // 60 FPS Optimized Animation Loop (Zero DOM queries, Precomputed Spline Interpolation)
  useEffect(() => {
    if (!isSectionInView) return

    const spacing = 1.0 / CARD_COUNT
    let time = 0
    let lastFocalCheck = 0

    function tick() {
      time += 0.016

      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.03
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.03
      const mx = smoothMouseRef.current.x
      const my = smoothMouseRef.current.y

      const speedMultiplier = isViewerOpen ? 0.18 : 1.0

      if (!isDraggingRef.current) {
        // Serene, tranquil ambient drift
        const ambientDrift = 0.00007 * speedMultiplier
        progressRef.current = (progressRef.current + ambientDrift + velocityRef.current * speedMultiplier + 1000) % 1.0

        // Stronger, natural damping (0.86) to quickly settle and avoid hyper-fast spinning
        velocityRef.current *= 0.86
        if (Math.abs(velocityRef.current) < 0.000005) velocityRef.current = 0
      }

      if (containerRef.current) {
        const tiltX = (my - 0.5) * -3.2
        const tiltY = (mx - 0.5) * 4.0
        containerRef.current.style.transform = `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }

      const table = lookupTableRef.current
      if (!table || table.length === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const tableLen = table.length
      const winW = window.innerWidth
      const winH = window.innerHeight
      const isMobile = winW < 768

      let bestFocalDist = 999
      let bestFocalCard = 0
      let focalPoint = { x: 50, y: 50 }

      for (let i = 0; i < CARD_COUNT; i++) {
        const el = cardRefs.current[i]
        if (!el) continue

        const s = ((progressRef.current + i * spacing) % 1.0 + 1.0) % 1.0
        const sampleIdx = s * (tableLen - 1)
        const baseIdx = Math.floor(sampleIdx)
        const frac = sampleIdx - baseIdx
        const p1 = table[baseIdx]
        const p2 = table[Math.min(baseIdx + 1, tableLen - 1)]

        const ptX = p1.x + (p2.x - p1.x) * frac
        const ptY = p1.y + (p2.y - p1.y) * frac
        const baseAngle = p1.angle + (p2.angle - p1.angle) * frac

        const focalCenter = 0.50
        const distToFocal = Math.abs(s - focalCenter)
        const focalRange = isMobile ? 0.22 : 0.28
        const focalStrength = Math.max(0, 1.0 - distToFocal / focalRange)
        const smoothedFocal = Math.pow(focalStrength, 1.6)

        if (distToFocal < bestFocalDist) {
          bestFocalDist = distToFocal
          bestFocalCard = i
          focalPoint = { x: (ptX / VIEW_W) * 100, y: (ptY / VIEW_H) * 100 }
        }

        const parallaxDepthFactor = 0.4 + smoothedFocal * 1.8
        const px = (mx - 0.5) * (isMobile ? 6 : 12) * parallaxDepthFactor
        const py = (my - 0.5) * (isMobile ? 3 : 6) * parallaxDepthFactor

        const breatheY = Math.sin(time * 1.2 + i * 0.35) * (1.2 + smoothedFocal * 1.8)

        let xPct = (ptX / VIEW_W) * 100 + (px / winW) * 100
        let yPct = (ptY / VIEW_H) * 82 + 9 + (py / winH) * 100 + breatheY * 0.05

        if (isMobile) {
          xPct = 50 + (xPct - 50) * 1.25
          yPct = 50 + (yPct - 50) * 1.12
        }

        const scale = isMobile
          ? 0.70 + smoothedFocal * 0.42
          : 0.78 + smoothedFocal * 0.48

        const zIndex = Math.round(10 + smoothedFocal * 120)

        let opacity = Math.min(1, 0.55 + smoothedFocal * 0.45)
        if (isMobile && distToFocal > 0.20) {
          opacity = Math.max(0, (0.28 - distToFocal) / 0.08) * 0.55
        }

        // Culling optimization: Completely hide off-arc cards on mobile
        if (opacity <= 0.02) {
          el.style.visibility = 'hidden'
          continue
        } else {
          el.style.visibility = 'visible'
        }

        const dynamicTilt = Math.sin(time + i * 0.7) * 2.0
        const finalAngle = baseAngle + dynamicTilt

        el.style.left = `${xPct}%`
        el.style.top = `${yPct}%`
        el.style.zIndex = zIndex
        el.style.opacity = opacity

        // Performance: Avoid expensive CSS filter blur on mobile devices
        if (!isMobile && smoothedFocal < 0.8) {
          const blurAmount = Math.max(0, (1 - smoothedFocal) * 2.0).toFixed(1)
          el.style.filter = blurAmount > 0.4 ? `blur(${blurAmount}px)` : 'none'
        } else {
          el.style.filter = 'none'
        }

        el.style.transform = `translate(-50%, -50%) rotate(${finalAngle}deg) scale(${scale})`

        if (smoothedFocal > 0.65) {
          el.style.boxShadow = `0 16px 40px rgba(197, 155, 39, ${0.25 * smoothedFocal}), 0 6px 16px rgba(87, 61, 33, 0.12)`
        } else {
          el.style.boxShadow = `0 4px 14px rgba(87, 61, 33, 0.10)`
        }
      }

      focalPosRef.current = focalPoint

      if (Math.abs(time - lastFocalCheck) > 0.15) {
        lastFocalCheck = time
        setFocalCardIndex((prev) => (prev !== bestFocalCard ? bestFocalCard : prev))
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isSectionInView, isViewerOpen])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="ribbon-section relative w-full h-screen h-[100dvh] overflow-hidden select-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        touchAction: 'pan-y',
      }}
    >
      {/* ── Page 2 Video Background (0.5x Slow Motion, paused when offscreen) ── */}
      <Page2BackgroundVideo isInView={isSectionInView} />

      {/* ── Living Sunlight, Ambient Aura & Golden Dust Particles ── */}
      <LivingAtmosphereCanvas mouseRef={mouseRef} focalPosRef={focalPosRef} isInView={isSectionInView} />

      {/* ── Cinematic Editorial Title Sequence ── */}
      <CinematicHeroTitle activePhoto={cards[focalCardIndex]} />

      {/* ── Editorial Top-Right Index Counter ── */}
      <EditorialMetaInfo currentFocalIndex={focalCardIndex} totalUnique={PHOTOS.length} />

      {/* ── Hidden Parametric 3D SVG Ribbon Curve Guide ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={RIBBON_SVG_PATH} fill="none" stroke="none" />
      </svg>

      {/* ── 3D Master Ribbon Carousel Field (Perspective Matrix) ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <RibbonCardsField
          cards={cards}
          cardRefs={cardRefs}
          onPhotoClick={onPhotoClick}
          velocityRef={velocityRef}
        />
      </div>

      {/* ── Bottom Controls & Scroll Down Indicator ── */}
      <InteractionControls />
    </section>
  )
}

export default memo(RibbonCarousel)
