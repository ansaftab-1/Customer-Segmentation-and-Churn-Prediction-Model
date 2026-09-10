import { useRef, useEffect, memo } from 'react'
import { motion } from 'framer-motion'

/* ══════════════════════════════════════════════════════════════
   WIND PARTICLES: FLOATING GOLDEN LEAVES & FLOWER PETALS CANVAS
   Organic 3D tumbling, wind gusts, fluttering tilt & swaying physics
   ══════════════════════════════════════════════════════════════ */
const FloatingFloraCanvas = memo(function FloatingFloraCanvas({ isVisible = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let h = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const handleResize = () => {
      if (canvas.parentElement) {
        w = canvas.width = canvas.parentElement.clientWidth
        h = canvas.height = canvas.parentElement.clientHeight
      }
    }
    window.addEventListener('resize', handleResize)

    // Mouse wind interaction ref
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 }
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top
      mouse.vx = (currentX - mouse.lastX) * 0.15
      mouse.vy = (currentY - mouse.lastY) * 0.15
      mouse.x = currentX
      mouse.y = currentY
      mouse.lastX = currentX
      mouse.lastY = currentY
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Generate diverse floating flora: Gold leaves, rose petals, and mini cherry blossoms
    const FLORA_TYPES = ['leaf_gold', 'leaf_gold', 'petal_rose', 'petal_champagne', 'blossom_flower', 'petal_gold']

    const items = Array.from({ length: 32 }, (_, i) => {
      const type = FLORA_TYPES[i % FLORA_TYPES.length]
      const size = type === 'blossom_flower' ? (10 + Math.random() * 8) : (12 + Math.random() * 12)
      return {
        type,
        x: Math.random() * (w + 200) - 100,
        y: Math.random() * (h + 200) - 100,
        size,
        baseSize: size,
        // Wind drift velocities (soft breeze moving down-right)
        vx: 0.45 + Math.random() * 0.65,
        vy: 0.35 + Math.random() * 0.55,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmp: 0.6 + Math.random() * 0.8,
        // 3D rotation and tumbling flutter
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.035,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.035,
        alpha: 0.7 + Math.random() * 0.28,
        hueOffset: Math.random() * 10 - 5,
      }
    })

    let time = 0

    /* ── Drawing Sub-Routines for Flora Types ── */

    // 1. Gilded Autumn / Eucalyptus Leaf with Vein
    function drawGoldLeaf(c, size) {
      const grad = c.createLinearGradient(-size * 0.5, -size, size * 0.5, size)
      grad.addColorStop(0, '#fff5cc')
      grad.addColorStop(0.3, '#ffd700')
      grad.addColorStop(0.7, '#e6c86a')
      grad.addColorStop(1, '#c59b27')

      c.fillStyle = grad
      c.beginPath()
      c.moveTo(0, -size)
      c.bezierCurveTo(size * 0.75, -size * 0.45, size * 0.7, size * 0.45, 0, size)
      c.bezierCurveTo(-size * 0.7, size * 0.45, -size * 0.75, -size * 0.45, 0, -size)
      c.fill()

      // Center Stem & subtle vein
      c.strokeStyle = 'rgba(255, 255, 255, 0.45)'
      c.lineWidth = 0.8
      c.beginPath()
      c.moveTo(0, -size * 0.85)
      c.lineTo(0, size * 0.85)
      c.stroke()
    }

    // 2. Soft Romantic Rose / Sakura Flower Petal
    function drawRosePetal(c, size, isChampagne = false) {
      const grad = c.createRadialGradient(0, size * 0.2, 0, 0, 0, size)
      if (isChampagne) {
        grad.addColorStop(0, 'rgba(255, 248, 235, 0.95)')
        grad.addColorStop(0.5, 'rgba(247, 219, 167, 0.85)')
        grad.addColorStop(1, 'rgba(224, 163, 110, 0.75)')
      } else {
        grad.addColorStop(0, 'rgba(255, 235, 240, 0.95)')
        grad.addColorStop(0.4, 'rgba(244, 165, 175, 0.85)')
        grad.addColorStop(1, 'rgba(224, 122, 122, 0.75)')
      }

      c.fillStyle = grad
      c.beginPath()
      c.moveTo(0, -size * 0.9)
      c.bezierCurveTo(size * 0.85, -size * 0.7, size * 0.9, size * 0.4, 0, size)
      c.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.85, -size * 0.7, 0, -size * 0.9)
      c.fill()

      // Delicate gold rim highlight
      c.strokeStyle = 'rgba(255, 230, 150, 0.35)'
      c.lineWidth = 0.6
      c.stroke()
    }

    // 3. Mini 5-Petal Flower Blossom
    function drawBlossom(c, size) {
      const petalCount = 5
      const petalRadius = size * 0.45

      c.fillStyle = 'rgba(255, 240, 245, 0.88)'
      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2
        const px = Math.cos(angle) * petalRadius
        const py = Math.sin(angle) * petalRadius

        c.beginPath()
        c.arc(px, py, petalRadius * 0.85, 0, Math.PI * 2)
        c.fill()
      }

      // Golden center nucleus
      c.fillStyle = '#ffd700'
      c.beginPath()
      c.arc(0, 0, size * 0.22, 0, Math.PI * 2)
      c.fill()
    }

    function render() {
      time += 0.016
      ctx.clearRect(0, 0, w, h)

      // Dynamic wind breeze calculation (gentle continuous draft with periodic gusts)
      const breezeGustX = Math.sin(time * 0.6) * 0.3 + Math.cos(time * 0.25) * 0.2
      const breezeGustY = Math.sin(time * 0.45) * 0.15

      items.forEach((p) => {
        // Wind propagation
        p.swayPhase += p.swaySpeed
        p.rotation += p.rotationSpeed
        p.flipAngle += p.flipSpeed

        const swayOffset = Math.sin(p.swayPhase) * p.swayAmp
        p.x += p.vx + breezeGustX + swayOffset * 0.3
        p.y += p.vy + breezeGustY

        // Interactive mouse wind push
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140) {
          const pushForce = (1 - dist / 140) * 3.5
          p.x += (dx / dist) * pushForce
          p.y += (dy / dist) * pushForce
          p.rotation += 0.05
        }

        // Screen boundary wrap-around
        if (p.x > w + 40) p.x = -40
        if (p.x < -50) p.x = w + 30
        if (p.y > h + 40) {
          p.y = -40
          p.x = Math.random() * w
        }
        if (p.y < -50) p.y = h + 30

        // 3D Perspective Matrix Transformation
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        // 3D Flip Scale (tumbles like real leaves in the breeze)
        const flipScale = Math.cos(p.flipAngle)
        ctx.scale(flipScale, 1)

        ctx.globalAlpha = p.alpha * Math.min(1, Math.max(0.4, Math.abs(flipScale) + 0.3))

        // Draw according to flora particle type
        if (p.type === 'leaf_gold' || p.type === 'petal_gold') {
          drawGoldLeaf(ctx, p.size)
        } else if (p.type === 'petal_rose') {
          drawRosePetal(ctx, p.size, false)
        } else if (p.type === 'petal_champagne') {
          drawRosePetal(ctx, p.size, true)
        } else if (p.type === 'blossom_flower') {
          drawBlossom(ctx, p.size)
        }

        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [isVisible])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
      style={{ opacity: 0.95 }}
    />
  )
})

/* ── Floating Gold Dust Particles Canvas ── */
const GoldDustCanvas = memo(function GoldDustCanvas({ isVisible = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return
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

    // Generate loose shimmering gold dust particles & champagne orbs
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 900),
      radius: Math.random() * 2.4 + 0.8,
      baseRadius: Math.random() * 2.4 + 0.8,
      alpha: Math.random() * 0.6 + 0.25,
      baseAlpha: Math.random() * 0.6 + 0.25,
      speedY: -(0.18 + Math.random() * 0.35), // Gentle upward drift
      speedXFreq: 0.008 + Math.random() * 0.015,
      speedXAmp: 0.35 + Math.random() * 0.45,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.012 + Math.random() * 0.02,
      hue: 43 + (Math.random() * 10 - 5), // Warm gold to champagne
    }))

    let time = 0

    function draw() {
      time += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.y += p.speedY
        p.x += Math.sin(time * p.speedXFreq + p.pulse) * p.speedXAmp
        p.pulse += p.pulseSpeed

        // Wrap around smoothly
        if (p.y < -15) {
          p.y = canvas.height + 15
          p.x = Math.random() * canvas.width
        }
        if (p.x < -15) p.x = canvas.width + 15
        if (p.x > canvas.width + 15) p.x = -15

        const currentAlpha = p.baseAlpha * (0.65 + Math.sin(p.pulse) * 0.35)
        const currentRadius = p.baseRadius * (0.85 + Math.sin(p.pulse * 1.5) * 0.15)

        // Radial golden bokeh glow
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentRadius * 3
        )
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 75%, ${currentAlpha})`)
        gradient.addColorStop(0.4, `hsla(${p.hue}, 85%, 62%, ${currentAlpha * 0.5})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius * 3, 0, Math.PI * 2)
        ctx.fill()

        // Crisp central glint
        ctx.fillStyle = `rgba(255, 252, 235, ${currentAlpha * 0.95})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [isVisible])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  )
})

/* ── Sparkling Twinkle Starburst Glints on Gold Foliage ── */
const FoliageTwinkles = memo(function FoliageTwinkles() {
  const glints = [
    { top: '8%', left: '10%', delay: 0, size: 14 },
    { top: '15%', left: '18%', delay: 1.8, size: 12 },
    { top: '22%', left: '8%', delay: 3.2, size: 16 },
    { top: '5%', left: '4%', delay: 2.1, size: 10 },
    { bottom: '12%', right: '12%', delay: 0.9, size: 15 },
    { bottom: '20%', right: '18%', delay: 2.6, size: 13 },
    { bottom: '8%', right: '6%', delay: 4.1, size: 14 },
    { bottom: '26%', right: '8%', delay: 1.4, size: 11 },
  ]

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {glints.map((g, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: g.top,
            left: g.left,
            bottom: g.bottom,
            right: g.right,
            width: g.size,
            height: g.size,
          }}
          animate={{
            scale: [0.3, 1.2, 0.3],
            opacity: [0.1, 0.95, 0.1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 3.8,
            delay: g.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#sparkleRadial)" />
            <path d="M 12 2 L 12 22 M 2 12 L 22 12" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <defs>
              <radialGradient id="sparkleRadial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor="#ffe680" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c59b27" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  )
})

/* ══════════════════════════════════════════════════════════════
   FULL-SCREEN ANIMATED WATERCOLOR & GOLD GLITTER BACKGROUND
   ══════════════════════════════════════════════════════════════ */
function WatercolorGoldBackground({ isVisible = true }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 1. User Uploaded Deep Navy Watercolor Image Layer with Gentle Breathing */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/navy_gold_watercolor.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        animate={{
          scale: [1.0, 1.025, 1.0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. Soft Breathing Central Radial Glow Layer */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 235, 160, 0.16) 0%, rgba(197, 155, 39, 0.06) 45%, transparent 75%)',
          mixBlendMode: 'screen',
        }}
        animate={{
          opacity: [0.65, 1.0, 0.65],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 3. Floating Shimmering Gold Dust Particles Canvas */}
      <GoldDustCanvas isVisible={isVisible} />

      {/* 4. Beautiful Leaves & Romantic Flower Petals Flying in the Wind */}
      <FloatingFloraCanvas isVisible={isVisible} />

      {/* 5. Twinkle Sparkle Stars on Gold Foliage */}
      <FoliageTwinkles />

      {/* 6. Delicate Vignette Depth */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 80px rgba(4, 8, 18, 0.55)',
        }}
      />

      {/* 7. Bottom Feather Dissolve into Page 2 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(6, 12, 27, 0.35) 35%, rgba(6, 12, 27, 0.85) 75%, #060c1b 100%)',
        }}
      />
      {/* Soft Ambient Horizon Mist */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(230, 200, 106, 0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

export default memo(WatercolorGoldBackground)
