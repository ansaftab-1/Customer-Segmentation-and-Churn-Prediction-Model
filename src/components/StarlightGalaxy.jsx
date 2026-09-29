import { useRef, useEffect, useState, useCallback, memo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, Download, Heart } from 'lucide-react'
import { PHOTOS } from '../photosData'

/* ── 3D Galaxy Celestial Configuration ── */
const GALAXY_CARDS = [
  { ...PHOTOS[0], title: 'Sweetheart', cx: 25, cy: 30, rx: 14, ry: 8, rz: 240, tiltX: 18, tiltY: -15, speed: 0.007, phase: 0 },
  { ...PHOTOS[1], title: 'Babe', cx: 16, cy: 62, rx: 12, ry: 7, rz: 190, tiltX: -14, tiltY: 18, speed: -0.006, phase: 1.2 },
  { ...PHOTOS[2], title: 'Queen', cx: 80, cy: 40, rx: 15, ry: 9, rz: 260, tiltX: 16, tiltY: -22, speed: 0.008, phase: 2.4 },
  { ...PHOTOS[3], title: 'Sunshine', cx: 50, cy: 70, rx: 14, ry: 8, rz: 210, tiltX: -16, tiltY: 14, speed: -0.005, phase: 3.6 },
  { ...PHOTOS[4], title: 'Dream Girl', cx: 74, cy: 20, rx: 11, ry: 6, rz: 180, tiltX: 12, tiltY: 16, speed: 0.006, phase: 4.8 },
  { ...PHOTOS[5], title: 'My Love', cx: 48, cy: 25, rx: 13, ry: 7, rz: 250, tiltX: -15, tiltY: -18, speed: -0.007, phase: 0.8 },
]

/* ── Twinkling Starfield + Shooting Stars Canvas ── */
const StarCanvas = memo(function StarCanvas({ mouseRef, isInView = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth
        canvas.height = canvas.parentElement.clientHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    /* Generate twinkling stars */
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 800),
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      speed: 0.004 + Math.random() * 0.012,
    }))

    /* Shooting star system */
    let shootingStars = []
    let lastShoot = 0

    function createShootingStar(time) {
      if (time - lastShoot < 3000 + Math.random() * 5000) return
      lastShoot = time
      shootingStars.push({
        x: Math.random() * canvas.width * 0.8,
        y: Math.random() * canvas.height * 0.3,
        vx: 4 + Math.random() * 3,
        vy: 2 + Math.random() * 2,
        length: 30 + Math.random() * 50,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.01,
      })
    }

    let time = 0
    function draw() {
      time += 16
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* Mouse-responsive nebula glow */
      const mx = (mouseRef?.current?.x ?? 0.5) * canvas.width
      const my = (mouseRef?.current?.y ?? 0.4) * canvas.height
      const nebulaGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 250)
      nebulaGrad.addColorStop(0, 'rgba(0, 242, 254, 0.03)')
      nebulaGrad.addColorStop(0.4, 'rgba(79, 172, 254, 0.015)')
      nebulaGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = nebulaGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      /* Draw stars */
      stars.forEach((star) => {
        star.alpha += star.speed
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed
        ctx.globalAlpha = Math.max(0.05, Math.min(1, star.alpha))
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      /* Shooting stars */
      createShootingStar(time)
      ctx.globalAlpha = 1
      shootingStars = shootingStars.filter((s) => {
        s.x += s.vx
        s.y += s.vy
        s.alpha -= s.decay

        if (s.alpha <= 0) return false

        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * (s.length / s.vx), s.y - s.vy * (s.length / s.vx))
        ctx.stroke()

        return true
      })

      animId = requestAnimationFrame(draw)
    }

    if (isInView) {
      animId = requestAnimationFrame(draw)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [mouseRef, isInView])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
})

/* ── Galaxy Photo Modal — cinematic zoom ── */
const GalaxyModal = memo(function GalaxyModal({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [photo])

  useEffect(() => {
    if (!photo) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photo, onClose])

  const handleDownload = useCallback(() => {
    if (!photo) return
    const link = document.createElement('a')
    link.href = photo.src
    link.download = `${photo.title || 'photo'}.jpg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [photo])

  if (!photo) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 110,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.1, rotate: 90, background: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        aria-label="Close"
      >
        <X size={18} />
      </motion.button>

      {/* Modal Card */}
      <motion.div
        style={{
          position: 'relative',
          maxWidth: 380,
          width: '100%',
          background: 'rgba(24, 24, 34, 0.95)',
          padding: 14,
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        <div style={{
          width: '100%',
          height: 310,
          overflow: 'hidden',
          borderRadius: 12,
          background: '#000',
        }}>
          <img
            src={photo.src}
            alt={photo.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Caption */}
        <div style={{
          marginTop: 12,
          textAlign: 'center',
          color: '#ffffff',
          fontWeight: 400,
          fontSize: 15,
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.04em',
        }}>
          {photo.title}
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.button
            onClick={handleDownload}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#000',
              fontWeight: 600,
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={15} />
            Download
          </motion.button>

          <motion.button
            style={{
              padding: 10,
              borderRadius: 10,
              border: '1px solid rgba(0, 242, 254, 0.3)',
              background: 'rgba(0, 242, 254, 0.08)',
              color: '#00f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <Heart size={18} fill="#00f2fe" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════
   MAIN STARLIGHT GALAXY
   ═══════════════════════════════════════════════════════════
   PERFORMANCE FIX: Previous version called setCards() on every
   frame (60x/sec), causing full React re-renders. Now uses
   direct DOM manipulation via refs — zero re-renders during
   animation. Cards are only positioned via transform. */
function StarlightGalaxy() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [activeGlowId, setActiveGlowId] = useState(null)

  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const videoBgRef = useRef(null)
  const cardRefs = useRef([])
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef(null)

  // 3D drag & inertia rotation tracking
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    rotX: 0,
    rotY: 0,
    vx: 0,
    vy: 0,
  })

  const isInView = useInView(sectionRef, { amount: 0.15 })

  /* Viewport visibility control for video to save GPU/battery */
  useEffect(() => {
    const video = videoBgRef.current
    if (!video) return
    if (isInView) {
      video.play().catch(() => { })
    } else {
      video.pause()
    }
  }, [isInView])

  const rectRef = useRef(null)

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

  /* Pointer tracking for 3D celestial sphere drag & mouse parallax */
  const handlePointerDown = useCallback((e) => {
    if (e.target.closest('.galaxy-card-3d') || e.target.closest('button')) return
    dragRef.current.isDragging = true
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
    dragRef.current.vx = 0
    dragRef.current.vy = 0
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!rectRef.current && sectionRef.current) {
      rectRef.current = sectionRef.current.getBoundingClientRect()
    }
    const rect = rectRef.current
    if (rect) {
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    if (!dragRef.current.isDragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    dragRef.current.rotX += dx * 0.0035
    dragRef.current.rotY = Math.max(-0.5, Math.min(0.5, dragRef.current.rotY + dy * 0.0025))
    dragRef.current.vx = dx * 0.0035
    dragRef.current.vy = dy * 0.0025
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
  }, [])

  const handlePointerUp = useCallback(() => {
    dragRef.current.isDragging = false
  }, [])

  /* 3D Celestial Physics Animation Loop — 60 FPS via direct hardware-accelerated transforms */
  useEffect(() => {
    if (!isInView) return

    let time = 0

    function animate() {
      time += 0.012

      // Inertia decay on release
      if (!dragRef.current.isDragging) {
        dragRef.current.rotX += dragRef.current.vx
        dragRef.current.rotY = Math.max(-0.5, Math.min(0.5, dragRef.current.rotY + dragRef.current.vy))
        dragRef.current.vx *= 0.94
        dragRef.current.vy *= 0.94
      }

      const userDragX = dragRef.current.rotX
      const userDragY = dragRef.current.rotY

      // Smooth mouse parallax
      const mx = mouseRef.current.x - 0.5
      const my = mouseRef.current.y - 0.5

      // 3D stage global perspective tilt
      if (stageRef.current) {
        const stageTiltX = -my * 12 + userDragY * 16
        const stageTiltY = mx * 16 + userDragX * 20
        stageRef.current.style.transform = `rotateX(${stageTiltX}deg) rotateY(${stageTiltY}deg)`
      }

      GALAXY_CARDS.forEach((card, i) => {
        const el = cardRefs.current[i]
        if (!el) return

        const angle = time * card.speed * 4 + card.phase + userDragX

        // 3D spatial orbit coords:
        const ox = Math.cos(angle) * card.rx
        const oy = Math.sin(angle) * card.ry
        const oz = Math.sin(angle) * card.rz // -260px to +260px in depth

        const posX = card.cx + ox + mx * 4
        const posY = card.cy + oy + my * 3
        const posZ = oz

        // 3D card tilt & pitch facing camera
        const rotX = -Math.sin(angle) * card.tiltX - my * 10 + userDragY * 14
        const rotY = Math.cos(angle) * card.tiltY + mx * 14
        const rotZ = Math.sin(angle * 0.7) * 6

        // Depth cueing: 0 (far) to 1 (close)
        const normZ = Math.max(0, Math.min(1, (posZ + 260) / 520))
        const scale = 0.74 + normZ * 0.44 // Farthest 0.74x, closest 1.18x
        const opacity = 0.58 + normZ * 0.42
        const zIndex = Math.round(normZ * 50 + 10)

        el.style.left = `${posX}%`
        el.style.top = `${posY}%`
        el.style.zIndex = zIndex
        el.style.opacity = opacity
        el.style.transform = `translate3d(-50%, -50%, ${posZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isInView])

  const handleCardClick = useCallback((card) => {
    setActiveGlowId(card.id)
    setTimeout(() => setSelectedPhoto(card), 250)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="galaxy-section relative overflow-hidden"
      id="starlight-galaxy"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        backgroundColor: '#060c1b',
        cursor: 'grab',
      }}
    >
      {/* ── Background Video: footer1.mp4 (Golden stardust streams) ── */}
      <video
        ref={videoBgRef}
        src="/footer1.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          opacity: 0.72,
          zIndex: 0,
        }}
      />

      {/* Cinematic dark vignette for contrast & seamless blend */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6, 12, 27, 0.2) 0%, rgba(6, 12, 27, 0.6) 75%, #060c1b 100%)',
          zIndex: 1,
        }}
      />

      {/* Top seamless blend fade from previous chapter */}
      <div
        className="absolute top-0 left-0 right-0 h-44 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to bottom, #060c1b 0%, rgba(6, 12, 27, 0.75) 45%, transparent 100%)',
        }}
      />

      {/* Canvas Starfield with nebula */}
      <StarCanvas mouseRef={mouseRef} isInView={isInView} />

      {/* Section Title */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: 48,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 300,
          color: '#ffffff',
          letterSpacing: '0.1em',
          fontStyle: 'italic',
          textShadow: '0 2px 20px rgba(245, 208, 97, 0.3)',
        }}
          className="text-shimmer"
        >
          Starlight Memories
        </h2>
      </motion.div>

      {/* ── 3D Dimensional Celestial Stage ── */}
      <div
        ref={stageRef}
        className="galaxy-3d-stage"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          flex: 1,
          minHeight: 'clamp(420px, 55vh, 680px)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* 3D Celestial Orbital Rings */}
        <div
          className="celestial-orbit-ring"
          style={{
            width: 'clamp(320px, 46vw, 640px)',
            height: 'clamp(320px, 46vw, 640px)',
            transform: 'translate(-50%, -50%) rotateX(68deg) rotateY(-16deg) translateZ(-40px)',
          }}
        />
        <div
          className="celestial-orbit-ring"
          style={{
            width: 'clamp(460px, 62vw, 880px)',
            height: 'clamp(460px, 62vw, 880px)',
            transform: 'translate(-50%, -50%) rotateX(62deg) rotateY(22deg) translateZ(-80px)',
            borderStyle: 'dotted',
            borderColor: 'rgba(0, 242, 254, 0.18)',
          }}
        />

        {/* 3D Floating Memory Cards */}
        {GALAXY_CARDS.map((card, i) => {
          const isGlowing = activeGlowId === card.id

          return (
            <div
              key={`galaxy-${card.id}`}
              ref={(el) => { cardRefs.current[i] = el }}
              style={{
                position: 'absolute',
                left: `${card.cx}%`,
                top: `${card.cy}%`,
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                transition: isGlowing ? 'box-shadow 0.3s ease' : 'none',
              }}
              onClick={() => handleCardClick(card)}
            >
              <div
                className={`galaxy-card-3d ${isGlowing ? 'active-glow' : ''}`}
                style={{
                  width: 'clamp(115px, 11vw, 145px)',
                }}
              >
                {/* 3D Specular Light Sheen */}
                <div className="galaxy-card-sheen" />

                {/* 3D Elevated Photo */}
                <div style={{
                  width: '100%',
                  height: 'clamp(105px, 10.5vw, 135px)',
                  overflow: 'hidden',
                  borderRadius: 10,
                  background: '#000',
                  transform: 'translateZ(12px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                }}>
                  <img
                    src={card.src}
                    alt={card.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    loading="lazy"
                    draggable={false}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  />
                </div>

                {/* 3D Elevated Title Badge */}
                <div style={{
                  marginTop: 8,
                  textAlign: 'center',
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  color: '#ffffff',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.04em',
                  transform: 'translateZ(20px)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(245,208,97,0.4)',
                }}>
                  {card.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom spacer */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: 48 }} />

      {/* Galaxy Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <GalaxyModal
            photo={selectedPhoto}
            onClose={() => {
              setSelectedPhoto(null)
              setActiveGlowId(null)
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default memo(StarlightGalaxy)
