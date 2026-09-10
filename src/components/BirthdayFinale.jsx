import { useRef, useEffect, useState, useCallback, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import WatercolorGoldBackground from './WatercolorGoldBackground'

/* ── Confetti Celebration Burst ── */
function fireConfetti() {
  const duration = 4000
  const end = Date.now() + duration

  const defaults = {
    startVelocity: 35,
    spread: 360,
    ticks: 90,
    zIndex: 9999,
    colors: ['#FFD700', '#FFF6D6', '#E6C86A', '#FFA07A', '#FF6B81', '#E3A36E', '#FFF5D4'],
  }

  function frame() {
    confetti({
      ...defaults,
      particleCount: 4,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  // Initial burst from sides
  confetti({
    ...defaults,
    particleCount: 90,
    origin: { x: 0.2, y: 0.55 },
    angle: 60,
  })
  confetti({
    ...defaults,
    particleCount: 90,
    origin: { x: 0.8, y: 0.55 },
    angle: 120,
  })

  frame()
}

/* ── Cinematic Ultra-Smooth Slow Glide ── */
function smoothGlideTo(targetElement, duration = 3200) {
  if (!targetElement) return () => {}

  const rootEl = document.documentElement
  const bodyEl = document.body
  const prevRootBehavior = rootEl.style.scrollBehavior
  const prevBodyBehavior = bodyEl.style.scrollBehavior

  rootEl.style.scrollBehavior = 'auto'
  bodyEl.style.scrollBehavior = 'auto'

  const startY = window.pageYOffset || window.scrollY || rootEl.scrollTop || bodyEl.scrollTop || 0
  const targetRect = targetElement.getBoundingClientRect()
  const targetY = startY + targetRect.top
  const distance = targetY - startY

  if (Math.abs(distance) < 5) {
    rootEl.style.scrollBehavior = prevRootBehavior
    bodyEl.style.scrollBehavior = prevBodyBehavior
    return () => {}
  }

  let startTime = null
  let animId = null
  let isCancelled = false

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function step(currentTime) {
    if (isCancelled) return
    if (!startTime) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = easeInOutCubic(progress)
    const currentY = startY + distance * ease

    window.scrollTo(0, currentY)
    rootEl.scrollTop = currentY
    bodyEl.scrollTop = currentY

    if (progress < 1) {
      animId = requestAnimationFrame(step)
    } else {
      rootEl.style.scrollBehavior = prevRootBehavior
      bodyEl.style.scrollBehavior = prevBodyBehavior
    }
  }

  animId = requestAnimationFrame(step)

  return () => {
    isCancelled = true
    if (animId) cancelAnimationFrame(animId)
    rootEl.style.scrollBehavior = prevRootBehavior
    bodyEl.style.scrollBehavior = prevBodyBehavior
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN ROYAL BIRTHDAY FINALE COMPONENT (ACT 1)
   ═══════════════════════════════════════════════════════════ */
function BirthdayFinale() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const isSectionActive = useInView(sectionRef, { margin: '150px 0px' })
  const [wished, setWished] = useState(false)

  const scrollTimeoutRef = useRef(null)
  const cancelScrollRef = useRef(null)

  const triggerGlideDown = useCallback(() => {
    const nextSection = document.getElementById('hero') || document.querySelector('.ribbon-section') || sectionRef.current?.nextElementSibling
    if (nextSection) {
      if (cancelScrollRef.current) cancelScrollRef.current()
      cancelScrollRef.current = smoothGlideTo(nextSection, 3200)
    }
  }, [])

  const handleWish = useCallback(() => {
    if (wished) {
      triggerGlideDown()
      return
    }
    setWished(true)
    fireConfetti()

    // Display the beautiful wish line, then automatically glide down smoothly
    scrollTimeoutRef.current = setTimeout(() => {
      triggerGlideDown()
    }, 2800)
  }, [wished, triggerGlideDown])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (cancelScrollRef.current) {
        cancelScrollRef.current()
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="finale-section" id="birthday-finale">
      {/* ── Deep Navy Watercolor & Gold Glitter Animated Backdrop with Flying Petals ── */}
      <WatercolorGoldBackground isVisible={isSectionActive} />

      {/* Main Plaque Container */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(28px, 5vh, 40px) 14px clamp(32px, 6vh, 50px)',
        width: '100%',
        maxWidth: 450,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {/* ── Frosted Royal Glass Plaque ── */}
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            background: 'radial-gradient(130% 120% at 50% 0%, rgba(20, 34, 68, 0.72) 0%, rgba(6, 12, 27, 0.88) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 215, 0, 0.32)',
            borderRadius: '22px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(255, 215, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 20px) clamp(22px, 4.5vw, 30px)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative Corner Filigree Stars */}
          <span className="absolute top-3 left-3.5 text-[11px] select-none" style={{ color: '#FFD700', opacity: 0.6 }}>✦</span>
          <span className="absolute top-3 right-3.5 text-[11px] select-none" style={{ color: '#FFD700', opacity: 0.6 }}>✦</span>
          <span className="absolute bottom-3 left-3.5 text-[11px] select-none" style={{ color: '#FFD700', opacity: 0.6 }}>✦</span>
          <span className="absolute bottom-3 right-3.5 text-[11px] select-none" style={{ color: '#FFD700', opacity: 0.6 }}>✦</span>

          {/* Chapter & Milestone Pill Badge */}
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 215, 0, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              marginBottom: 14,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '9.5px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#FFE699',
              textShadow: '0 0 10px rgba(255, 230, 153, 0.5)',
            }}>
              ✦ Chapter One · A Special Milestone ✦
            </span>
          </motion.div>

          {/* Milestone Number '19' with Golden Sunburst Crest */}
          <motion.div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 0 4px',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient Radial Golden Aura behind Number */}
            <div style={{
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.22) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(52px, 10vw, 82px)',
              fontWeight: 300,
              color: '#FFF8E7',
              lineHeight: 1,
              display: 'block',
              textShadow: '0 0 28px rgba(255, 215, 0, 0.65), 0 4px 16px rgba(0, 0, 0, 0.95)',
            }}>
              19
            </span>
          </motion.div>

          {/* Calligraphic "Happy Birthday" */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <span style={{
              fontFamily: 'var(--font-pinyon, var(--font-script))',
              fontSize: 'clamp(28px, 5.2vw, 44px)',
              color: '#FFF2B2',
              display: 'block',
              marginBottom: 6,
              lineHeight: 1.15,
              textShadow: '0 0 24px rgba(255, 220, 100, 0.8), 0 2px 12px rgba(0, 0, 0, 0.95)',
            }}>
              Happy Birthday
            </span>
          </motion.div>

          {/* Decorative Delicate Golden Bar */}
          <motion.div
            style={{
              width: 50,
              height: 1.5,
              background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
              margin: '8px 0 16px',
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
          />

          {/* ── Interactive Wish Section ── */}
          <motion.div
            style={{
              width: '100%',
              minHeight: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {!wished ? (
              <div className="flex flex-col items-center gap-2.5">
                {/* Glowing Candle Flame Graphic */}
                <motion.div
                  className="flex flex-col items-center select-none"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.svg
                    width="26"
                    height="34"
                    viewBox="0 0 32 42"
                    fill="none"
                    animate={{
                      scale: [1, 1.1, 0.96, 1],
                      rotate: [-2, 2, -1, 0],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Flame glow */}
                    <ellipse cx="16" cy="14" rx="9" ry="12" fill="url(#flameGlow)" opacity="0.4" />
                    {/* Outer flame */}
                    <path d="M16 2 C13 8 9 14 9 20 C9 25 12 28 16 28 C20 28 23 25 23 20 C23 14 19 8 16 2 Z" fill="url(#flameOuter)" />
                    {/* Inner core flame */}
                    <path d="M16 9 C14 14 12 18 12 21 C12 24 14 26 16 26 C18 26 20 24 20 21 C20 18 18 14 16 9 Z" fill="#FFFFFF" />
                    {/* Candle wick & top */}
                    <line x1="16" y1="28" x2="16" y2="33" stroke="#573D21" strokeWidth="2" strokeLinecap="round" />
                    <rect x="11" y="33" width="10" height="8" rx="2" fill="#E6C86A" />
                    <defs>
                      <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FF6B81" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="flameOuter" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFF2B2" />
                        <stop offset="40%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF6B81" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </motion.div>

                {/* Make a Wish Button */}
                <button
                  className="wish-button"
                  onClick={handleWish}
                >
                  Make a Wish ✨
                </button>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.16em',
                    color: '#FFE699',
                    textTransform: 'uppercase',
                    marginTop: 2,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
                  }}
                >
                  Tap to blow out the candle & make your wish
                </p>
              </div>
            ) : (
              <motion.div
                onClick={triggerGlideDown}
                className="cursor-pointer flex flex-col items-center gap-2.5 w-full"
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              >
                {/* Beautiful Wish Title */}
                <div
                  style={{
                    fontFamily: 'var(--font-pinyon, var(--font-script))',
                    fontSize: 'clamp(20px, 4vw, 30px)',
                    color: '#FFF2B2',
                    textShadow: '0 0 24px rgba(255, 225, 120, 0.9), 0 2px 14px rgba(0, 0, 0, 0.95)',
                    lineHeight: 1.2,
                    padding: '0 4px',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  May all your sweetest dreams come true ✨
                </div>

                {/* Heartfelt Poetic Blessing Line */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(13px, 2.3vw, 16px)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#FFFFFF',
                    lineHeight: 1.55,
                    maxWidth: 390,
                    padding: '0 6px',
                    marginTop: 3,
                    textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 16px rgba(255, 235, 170, 0.45)',
                  }}
                >
                  "You make every ordinary moment feel magical. Here's to 19 years of pure brilliance, and a lifetime of laughter, joy, and unforgettable memories."
                </motion.p>

                {/* Signature with Glowing Heart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-2 mt-1"
                >
                  <span style={{
                    fontFamily: 'var(--font-pinyon, var(--font-script))',
                    fontSize: 'clamp(18px, 2.8vw, 24px)',
                    color: '#FFE699',
                    textShadow: '0 0 14px rgba(255, 230, 153, 0.7), 0 2px 10px rgba(0, 0, 0, 0.9)',
                  }}>
                    With all my love
                  </span>
                  <svg width="18" height="16" viewBox="0 0 24 22" fill="#FF5E7E" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 94, 126, 0.95))' }}>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>

                {/* Animated Floating Down Arrow */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '9.5px',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#FFE699',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 10,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 230, 153, 0.6)',
                  }}
                >
                  <span>Entering memories</span>
                  <span>↓</span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 9.5,
            fontWeight: 500,
            color: '#D1C7B7',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginTop: 20,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Made with love
        </motion.p>
      </div>
    </section>
  )
}

export default memo(BirthdayFinale)
