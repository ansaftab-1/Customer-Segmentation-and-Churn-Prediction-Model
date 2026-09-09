import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PHOTOS } from '../photosData'

/* ═══════════════════════════════════════════════════════════
   ASSET PATHS
   ═══════════════════════════════════════════════════════════ */
const ASSETS = {
  cover: '/book-images/book-cover page (1).gif',
  backCover: '/book-images/back-oage.gif',
  pageBg: '/book-images/page (1).png',
  page2Video: '/2-page.mp4',
  page3Image: '/design-01m0jnzgyd-1787334029.png',
  page4Video: '/page-3.mp4',
  page5Video1: '/pagge-5 (1).mp4',
  page5Video2: '/pagge-5 (2).mp4',
  flowers: [
    '/book-images/page-flower (1).gif',  // Page 1 (Flower 1 GIF)
    '/book-images/page-flower (2).gif',  // Page 2 (Flower 2 GIF)
    '/book-images/page-flower ().png',   // Page 3 (Page Flower 3 PNG)
    '/book-images/page-flower (4).gif',  // Page 4 (Flower 4 GIF)
    '/book-images/page-flower (5).gif',  // Page 5 (Flower 5 GIF)
    '/book-images/page-flower 6.gif',    // Page 6 (Flower 6 GIF)
  ]
}

/* ═══════════════════════════════════════════════════════════
   DECORATIVE SCRAPBOOK ELEMENTS
   ═══════════════════════════════════════════════════════════ */

function WashiTape({ top, left, right, bottom, color = 'rgba(197, 155, 39, 0.35)', rotation = -4, width = 70 }) {
  return (
    <div
      style={{
        position: 'absolute',
        top, left, right, bottom,
        width,
        height: 20,
        background: color,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.8,
        zIndex: 12,
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.18) 4px, rgba(255,255,255,0.18) 8px)',
      }} />
    </div>
  )
}

/* Animated Flower component that preserves infinite loop animation */
function AnimatedPageFlower({ src, style = {}, size = 95, rotation = 0, className = '' }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        transform: `rotate(${rotation}deg)`,
        zIndex: 15,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))',
        ...style,
      }}
      className={className}
    >
      <img
        src={src}
        alt="Animated Flower"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
        loading="eager"
        draggable={false}
      />
    </div>
  )
}

function DecorativeLine({ style = {} }) {
  return (
    <div style={{
      width: 70,
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(169, 116, 79, 0.45), transparent)',
      ...style,
    }} />
  )
}

/* Polaroid photo component with washi tape */
function ScrapPhoto({ src, alt, width = 110, rotation = 0, tapeColor, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width,
      background: '#ffffff',
      padding: `${width * 0.045}px ${width * 0.045}px ${width * 0.16}px`,
      boxShadow: '0 8px 22px rgba(0,0,0,0.22)',
      transform: `rotate(${rotation}deg)`,
      zIndex: 8,
      borderRadius: 2,
      ...style,
    }}>
      {tapeColor && (
        <WashiTape top={-9} left="18%" color={tapeColor} rotation={Math.random() * 6 - 3} width={width * 0.55} />
      )}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: width * 0.88, objectFit: 'cover', display: 'block', borderRadius: 1 }}
        loading="eager"
        draggable={false}
      />
    </div>
  )
}

/* Polaroid video component with washi tape & glass luster */
function ScrapVideo({
  src,
  width = 150,
  rotation = 0,
  tapeColor,
  caption,
  style = {}
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [src])

  return (
    <div style={{
      position: 'relative',
      width,
      background: '#ffffff',
      padding: `${width * 0.04}px ${width * 0.04}px ${caption ? width * 0.16 : width * 0.08}px`,
      boxShadow: '0 10px 28px rgba(87, 61, 33, 0.22), 0 2px 8px rgba(0,0,0,0.08)',
      transform: `rotate(${rotation}deg)`,
      zIndex: 8,
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.85)',
      ...style,
    }}>
      {tapeColor && (
        <WashiTape
          top={-9}
          left="22%"
          color={tapeColor}
          rotation={rotation >= 0 ? -3 : 3}
          width={width * 0.52}
        />
      )}
      <div style={{
        width: '100%',
        height: width * 0.82,
        overflow: 'hidden',
        borderRadius: 2,
        background: '#0d1322',
        position: 'relative',
      }}>
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'contrast(1.05) saturate(1.08)',
          }}
        />
        {/* Subtle glass reflection sheen */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
      </div>
      {caption && (
        <div style={{
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(10px, 2.2vw, 13px)',
          color: '#573d21',
          textAlign: 'center',
          marginTop: 4,
          lineHeight: 1.2,
          letterSpacing: '0.02em',
        }}>
          {caption}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE 5: MERGED DUAL-VIDEO CELESTIAL BACKGROUND
   Seamless Synchronized Fusion of Golden Wave & Cosmic Spiral
   Zero delay, lockstep preloading, 60fps compositing
   ═══════════════════════════════════════════════════════════ */
function MergedDualVideoBackground({ videoSrc1, videoSrc2 }) {
  const vRef1 = useRef(null)
  const vRef2 = useRef(null)
  const containerRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const v1 = vRef1.current
    const v2 = vRef2.current
    if (!v1 || !v2) return

    let isCancelled = false

    const syncAndPlay = async () => {
      try {
        v1.currentTime = 0
        v2.currentTime = 0
        v1.muted = true
        v2.muted = true
        
        // Trigger both videos in strict simultaneous lockstep
        await Promise.all([
          v1.play().catch(() => {}),
          v2.play().catch(() => {})
        ])
      } catch (err) {
        console.warn('Sync play exception:', err)
      }
    }

    // Monitor for time drift and realign instantly (<35ms drift threshold)
    const checkDrift = () => {
      if (!v1 || !v2 || isCancelled) return
      if (Math.abs(v1.currentTime - v2.currentTime) > 0.035) {
        v2.currentTime = v1.currentTime
      }
    }

    // Keep loop cycles in lockstep
    const syncLoop = () => {
      if (!v1 || !v2 || isCancelled) return
      v1.currentTime = 0
      v2.currentTime = 0
      v1.play().catch(() => {})
      v2.play().catch(() => {})
    }

    // Global interaction fallback to unlock autoplay if restricted
    const handleGesture = () => {
      if (v1 && v2 && (v1.paused || v2.paused)) {
        v1.play().catch(() => {})
        v2.play().catch(() => {})
      }
    }

    v1.addEventListener('timeupdate', checkDrift)
    v1.addEventListener('ended', syncLoop)
    v2.addEventListener('ended', syncLoop)
    window.addEventListener('pointerdown', handleGesture, { once: true })
    window.addEventListener('touchstart', handleGesture, { once: true })

    syncAndPlay()

    return () => {
      isCancelled = true
      if (v1) {
        v1.removeEventListener('timeupdate', checkDrift)
        v1.removeEventListener('ended', syncLoop)
      }
      if (v2) {
        v2.removeEventListener('ended', syncLoop)
      }
      window.removeEventListener('pointerdown', handleGesture)
      window.removeEventListener('touchstart', handleGesture)
    }
  }, [videoSrc1, videoSrc2])

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'auto',
      }}
    >
      {/* Base Layer: Cosmic Vortex Galaxy Video (Video 2) */}
      <video
        ref={vRef2}
        src={videoSrc2}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.95) contrast(1.15) saturate(1.1)',
          zIndex: 1,
          display: 'block',
        }}
      />

      {/* Merged Overlay Layer: Golden Particle Waves Video (Video 1) */}
      {/* Composited with mix-blend-mode: screen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          mixBlendMode: 'screen',
          opacity: isHovered ? 0.96 : 0.88,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      >
        <video
          ref={vRef1}
          src={videoSrc1}
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 0 16px rgba(255, 215, 0, 0.45))',
            display: 'block',
          }}
        />
      </div>

      {/* Dynamic Interactive Fusion Lens / Starlight Highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background: isHovered
            ? `radial-gradient(circle 130px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 223, 128, 0.3) 0%, rgba(255, 180, 50, 0.12) 40%, transparent 80%)`
            : 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
          transition: isHovered ? 'background 0.08s ease-out' : 'background 1.2s ease',
          mixBlendMode: 'color-dodge',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric Shimmering Depth Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background: 'linear-gradient(180deg, rgba(20, 15, 10, 0.42) 0%, rgba(10, 8, 6, 0.1) 40%, rgba(10, 8, 6, 0.1) 60%, rgba(20, 15, 10, 0.58) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Soft feathered borders blending the video canvas into the sketchbook paper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          boxShadow: 'inset 0 0 35px rgba(245, 239, 227, 0.35), inset 0 0 15px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

/* Handwritten text style */
const handStyle = {
  fontFamily: "'Alex Brush', 'Segoe Script', cursive",
  color: '#3d3427',
  lineHeight: 1.5,
  textShadow: '0 0.5px 1px rgba(255,255,255,0.6)',
}

const labelStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  color: '#8b5a2b',
  letterSpacing: '0.18em',
  fontWeight: 600,
  textTransform: 'uppercase',
}

/* Page background using authentic page (1).png texture */
const pageBase = (dir = 'left') => ({
  height: '100%',
  width: '100%',
  padding: '22px 18px',
  position: 'relative',
  backgroundImage: `url('${ASSETS.pageBg}')`,
  backgroundSize: '200% 100%',
  backgroundPosition: dir === 'left' ? 'left center' : 'right center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#f5efe3',
  overflow: 'hidden',
  boxSizing: 'border-box',
})

/* ═══════════════════════════════════════════════════════════
   SPREAD 1: "The Beginning" (Flowers 1 & 2)
   ═══════════════════════════════════════════════════════════ */
function Spread1Left() {
  return (
    <div style={pageBase('left')} className="page-paper">
      <div style={{ ...labelStyle, fontSize: 9, marginBottom: 6 }}>PAGE 01 — THE BEGINNING</div>

      {/* Main polaroid with washi tape */}
      <div style={{ position: 'absolute', top: 30, right: 18 }}>
        <ScrapPhoto src={PHOTOS[0].src} alt="Memory" width={118} rotation={-4} tapeColor="rgba(197, 155, 39, 0.4)" />
      </div>

      {/* Animated Flower 1 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[0]}
        top={12}
        left={12}
        size={94}
        rotation={-8}
      />

      {/* Handwritten quote */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '8%',
        right: '8%',
        ...handStyle,
        fontSize: 'clamp(15px, 3.2vw, 21px)',
        textAlign: 'center',
        zIndex: 10,
      }}>
        You are the stars in my dark and cold nights — shining and unwavering.
      </div>

      {/* Bottom decorative line */}
      <DecorativeLine style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)' }} />
    </div>
  )
}

function Spread1Right() {
  return (
    <div style={pageBase('right')} className="page-paper">
      <div style={{ ...labelStyle, fontSize: 9, textAlign: 'right', marginBottom: 6 }}>PAGE 02</div>

      {/* Handwritten text top */}
      <div style={{
        ...handStyle,
        fontSize: 'clamp(14px, 2.8vw, 18px)',
        maxWidth: '52%',
        marginTop: 4,
        zIndex: 10,
        position: 'relative',
      }}>
        and the flowers screamed as why the rain was so necessary
      </div>

      {/* Vertical photo strip with washi tapes */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        transform: 'rotate(2deg)',
      }}>
        {[PHOTOS[1], PHOTOS[2], PHOTOS[3]].map((p, i) => (
          <ScrapPhoto
            key={i}
            src={p.src}
            alt="Photo"
            width={70}
            rotation={i === 1 ? -2 : i === 2 ? 2 : 0}
            tapeColor={i === 0 ? 'rgba(227, 163, 110, 0.4)' : undefined}
          />
        ))}
      </div>

      {/* Animated Flower 2 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[1]}
        bottom={14}
        left={16}
        size={96}
        rotation={12}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SPREAD 2: "Precious Moments" (Page 3: Image Asset, Page 4: Video)
   ═══════════════════════════════════════════════════════════ */
function Spread2Left() {
  return (
    <div style={pageBase('left')} className="page-paper">
      {/* Header Label */}
      <div style={{
        ...labelStyle,
        fontSize: 9,
        position: 'relative',
        zIndex: 10,
        marginBottom: 6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>PAGE 03 — PRECIOUS MOMENTS</span>
        <span style={{ fontSize: 8, opacity: 0.7, letterSpacing: '0.1em' }}>EDITION I</span>
      </div>

      {/* Featured Image Asset on Page 3 (design-01m0jnzgyd-1787334029.png) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 68px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 8,
      }}>
        <div style={{
          position: 'relative',
          maxHeight: '100%',
          maxWidth: '86%',
          borderRadius: 4,
          boxShadow: '0 12px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)',
          transform: 'rotate(-1.2deg)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          overflow: 'hidden',
          background: '#e8ded0',
        }}>
          <WashiTape top={-7} right="16%" color="rgba(197, 155, 39, 0.4)" rotation={3} width={46} />
          <img
            src={ASSETS.page3Image}
            alt="Page 3 Artwork — What you think is important"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '265px',
              objectFit: 'contain',
              display: 'block',
              borderRadius: 3,
            }}
            loading="eager"
            draggable={false}
          />
        </div>
      </div>

      {/* Page Flower 3 PNG Accent */}
      <AnimatedPageFlower
        src={ASSETS.flowers[2]}
        top={8}
        left={8}
        size={76}
        rotation={-6}
      />

      {/* Handwritten note */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 14,
        right: 14,
        ...handStyle,
        fontSize: 'clamp(14px, 2.8vw, 18px)',
        textAlign: 'center',
        zIndex: 10,
        textShadow: '0 1px 3px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.9)',
      }}>
        every little thing reminds me of you
      </div>

      <DecorativeLine style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
    </div>
  )
}

function Spread2Right() {
  return (
    <div style={pageBase('right')} className="page-paper">
      {/* Background Video for Page 4 */}
      <video
        src={ASSETS.page4Video}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.80,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Parchment glass blend overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(245, 239, 227, 0.35) 0%, rgba(250, 246, 238, 0.2) 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      <div style={{ ...labelStyle, fontSize: 9, textAlign: 'right', position: 'relative', zIndex: 10 }}>PAGE 04</div>

      {/* Quote */}
      <div style={{
        ...handStyle,
        fontSize: 'clamp(15px, 3.2vw, 20px)',
        textAlign: 'center',
        marginTop: 10,
        maxWidth: '58%',
        zIndex: 10,
        position: 'relative',
        textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.85)',
      }}>
        and if 999 wishes came true it would've been you
      </div>

      {/* Center photo */}
      <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 8 }}>
        <ScrapPhoto src={PHOTOS[6].src} alt="Photo" width={105} rotation={-3} tapeColor="rgba(197, 155, 39, 0.35)" />
      </div>

      {/* Animated Flower 4 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[3]}
        bottom={14}
        right={14}
        size={95}
        rotation={-10}
      />

      <DecorativeLine style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SPREAD 3: "Golden Moments" (Page 5: Merged Dual-Video, Page 6: Chapters)
   ═══════════════════════════════════════════════════════════ */
function Spread3Left() {
  return (
    <div style={pageBase('left')} className="page-paper">
      {/* Full-bleed Merged Dual-Video Background */}
      <MergedDualVideoBackground
        videoSrc1={ASSETS.page5Video1}
        videoSrc2={ASSETS.page5Video2}
      />

      {/* Header Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 0 6px',
      }}>
        <div style={{
          ...labelStyle,
          fontSize: 9,
          color: '#FFE699',
          textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(255,215,0,0.6)',
        }}>
          PAGE 05 — GOLDEN MOMENTS
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 8,
          color: '#ffd700',
          letterSpacing: '0.14em',
          padding: '2px 8px',
          borderRadius: 999,
          background: 'rgba(20, 15, 10, 0.65)',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          SYNCHRONIZED FUSION
        </div>
      </div>

      {/* Centerpiece Atmospheric Scrapbook Accent / Floating Golden Frame */}
      <div style={{
        position: 'absolute',
        top: '44%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 8,
        width: '84%',
        height: '52%',
        borderRadius: 8,
        border: '1px solid rgba(255, 215, 0, 0.35)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45), inset 0 0 20px rgba(255, 215, 0, 0.1)',
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)',
        pointerEvents: 'none',
      }}>
        <WashiTape top={-9} left="12%" color="rgba(197, 155, 39, 0.45)" rotation={-3} width={50} />
        <WashiTape bottom={-9} right="12%" color="rgba(227, 163, 110, 0.45)" rotation={2} width={50} />
      </div>

      {/* Animated Flower 5 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[4]}
        bottom={10}
        right={10}
        size={86}
        rotation={15}
      />

      {/* Romantic handwritten quote in frosted glass pill */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 14,
        right: 80,
        zIndex: 10,
        padding: '6px 12px',
        borderRadius: 8,
        background: 'rgba(18, 14, 10, 0.62)',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          ...handStyle,
          fontSize: 'clamp(13px, 2.7vw, 17px)',
          color: '#FFF8E7',
          textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 10px rgba(255,215,0,0.4)',
          lineHeight: 1.35,
        }}>
          "every moment spent with you is a memory I treasure forever."
        </div>
      </div>
    </div>
  )
}

function Spread3Right() {
  return (
    <div style={pageBase('right')} className="page-paper">
      <div style={{ ...labelStyle, fontSize: 9, textAlign: 'right' }}>PAGE 06 — CHAPTERS</div>

      <div style={{ position: 'absolute', top: 30, right: 16 }}>
        <ScrapPhoto src={PHOTOS[8].src} alt="Photo" width={105} rotation={4} tapeColor="rgba(197, 155, 39, 0.3)" />
      </div>

      <div style={{ position: 'absolute', top: '48%', left: 16 }}>
        <ScrapPhoto src={PHOTOS[9].src} alt="Photo" width={96} rotation={-6} tapeColor="rgba(216, 222, 183, 0.4)" />
      </div>

      {/* Animated Flower 6 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[5]}
        bottom={14}
        left={14}
        size={78}
        rotation={8}
      />

      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 16,
        left: '42%',
        ...handStyle,
        fontSize: 'clamp(13px, 2.6vw, 17px)',
        zIndex: 10,
      }}>
        some pages are quiet, but our story keeps writing itself...
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SPREAD 4: "Celebration & The End"
   ═══════════════════════════════════════════════════════════ */
function Spread4Left() {
  return (
    <div style={{
      ...pageBase('left'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }} className="page-paper">
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(18px, 3.5vw, 24px)',
        color: '#573d21',
        letterSpacing: '0.04em',
        marginTop: 6,
        textAlign: 'center',
        fontWeight: 400,
        fontStyle: 'italic',
      }}>
        Happy Birthday ✨
      </div>

      <ScrapPhoto src={PHOTOS[10].src} alt="Photo" width={128} rotation={-2} tapeColor="rgba(197, 155, 39, 0.35)" />

      {/* Decorative animated flower accent */}
      <AnimatedPageFlower
        src={ASSETS.flowers[0]}
        top={8}
        right={12}
        size={70}
        rotation={-12}
      />

      <div style={{
        ...handStyle,
        fontSize: 'clamp(14px, 3vw, 18px)',
        textAlign: 'center',
        marginBottom: 10,
        zIndex: 10,
      }}>
        May your year be filled with endless joy, magic, and boundless love 💖
      </div>
    </div>
  )
}

function Spread4Right() {
  return (
    <div
      style={{
        ...pageBase('right'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 14px 12px',
        boxSizing: 'border-box',
      }}
      className="page-paper"
    >
      {/* Top Header Label */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 2,
        zIndex: 10,
      }}>
        <span style={{ ...labelStyle, fontSize: 8.5, letterSpacing: '0.18em' }}>
          PAGE 08 · THE FINALE
        </span>
        <span style={{
          ...labelStyle,
          fontSize: 8.5,
          fontWeight: 700,
          color: '#c59b27',
          letterSpacing: '0.22em',
        }}>
          THE END
        </span>
      </div>

      {/* Decorative animated flower accent */}
      <AnimatedPageFlower
        src={ASSETS.flowers[1]}
        top={8}
        right={10}
        size={68}
        rotation={18}
      />

      {/* Featured Video Card */}
      <div style={{ position: 'relative', margin: '4px 0', zIndex: 8 }}>
        <ScrapVideo
          src={ASSETS.page5Video2}
          width={154}
          rotation={2}
          tapeColor="rgba(197, 155, 39, 0.45)"
          caption="forever & always ✨"
        />
      </div>

      {/* Heartfelt Poetic Text */}
      <div
        style={{
          ...handStyle,
          fontSize: 'clamp(13px, 2.5vw, 16px)',
          textAlign: 'center',
          maxWidth: 230,
          zIndex: 10,
          lineHeight: 1.35,
          color: '#573d21',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          margin: '2px 0',
        }}
      >
        "Thank you for making every day brighter. To many more chapters together."
      </div>

      <DecorativeLine style={{ margin: '0 auto', opacity: 0.6 }} />

      {/* Footer Bar on Last Page */}
      <div
        style={{
          ...labelStyle,
          fontSize: 8.5,
          padding: '5px 16px',
          borderTop: '1px solid rgba(169, 116, 79, 0.22)',
          borderBottom: '1px solid rgba(169, 116, 79, 0.22)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          letterSpacing: '0.2em',
          color: '#7c664d',
          zIndex: 10,
        }}
      >
        <span>WITH LOVE, ALWAYS</span>
        <span style={{ color: '#e11d48', fontSize: 10 }}>❤️</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SPREADS LIST
   ═══════════════════════════════════════════════════════════ */
const SPREADS = [
  { left: <Spread1Left />, right: <Spread1Right /> },
  { left: <Spread2Left />, right: <Spread2Right /> },
  { left: <Spread3Left />, right: <Spread3Right /> },
  { left: <Spread4Left />, right: <Spread4Right /> },
]

/* ═══════════════════════════════════════════════════════════
   SPIRAL BINDING
   ═══════════════════════════════════════════════════════════ */
function CenterBinding() {
  const count = 14
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 0, bottom: 0,
      width: 16,
      zIndex: 45,
      pointerEvents: 'none',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${(i + 0.5) * (100 / count)}%`,
            left: 0,
            width: 16,
            height: 8,
            borderRadius: 4,
            background: 'linear-gradient(180deg, #d8d2c2 0%, #8f8a78 60%, #5a574e 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FRONT COVER — Continuous Animated Cover GIF
   ═══════════════════════════════════════════════════════════ */
function FrontCover({ onOpen }) {
  return (
    <motion.div
      key="cover"
      onClick={onOpen}
      initial={{ rotateY: 0, opacity: 1 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{
        rotateY: -170,
        transition: { duration: 0.75, ease: [0.45, 0, 0.2, 1] },
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 215, 0, 0.3)',
      }}
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        padding: 0,
        borderRadius: 8,
        boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 25px rgba(255, 215, 0, 0.2)',
        overflow: 'hidden',
        background: '#0a0a0e',
      }}
    >
      <img
        src={ASSETS.cover}
        alt="Sketchbook Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        loading="eager"
        draggable={false}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.25) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 24,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(18, 14, 10, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 215, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
        transition: 'transform 0.2s ease',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#FFE699',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          Click to Open 📖
        </span>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   BACK COVER — Continuous Animated Back Page GIF
   ═══════════════════════════════════════════════════════════ */
function BackCoverView({ onClose }) {
  return (
    <motion.div
      key="back-cover"
      onClick={onClose}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 215, 0, 0.3)',
      }}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 8,
        boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 25px rgba(255, 215, 0, 0.2)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#0a0a0e',
        border: '1px solid rgba(255, 215, 0, 0.4)',
      }}
    >
      <img
        src={ASSETS.backCover}
        alt="Sketchbook Back Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        loading="eager"
        draggable={false}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(18, 14, 10, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 215, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#FFE699',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          Click to Re-open ↺
        </span>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CORNER CURL HOVER HINT
   ═══════════════════════════════════════════════════════════ */
function PageCornerHint({ dir = 'right', onClick }) {
  const isRight = dir === 'right'
  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      title={isRight ? 'Turn page forward' : 'Turn page backward'}
      style={{
        position: 'absolute',
        bottom: 0,
        [isRight ? 'right' : 'left']: 0,
        width: 44,
        height: 44,
        cursor: 'pointer',
        zIndex: 35,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          [isRight ? 'right' : 'left']: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: isRight ? '0 0 32px 32px' : '0 32px 32px 0',
          borderColor: isRight
            ? 'transparent transparent rgba(197, 155, 39, 0.75) transparent'
            : 'transparent rgba(197, 155, 39, 0.75) transparent transparent',
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          [isRight ? 'right' : 'left']: 4,
          fontSize: 8,
          fontFamily: 'var(--font-sans)',
          color: '#ffffff',
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
        }}
      >
        {isRight ? '›' : '‹'}
      </div>
    </motion.div>
  )
}

function BackCoverInside() {
  return (
    <div style={pageBase('left')} className="page-paper">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 12,
      }}>
        <div style={{ ...labelStyle, fontSize: 10 }}>MEMORIES PRESERVED</div>
        <div style={{ ...handStyle, fontSize: 18, textAlign: 'center' }}>
          "Forever etched in our stars..."
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN SKETCHBOOK COMPONENT
   Realistic Dual-Sided 3D Page Turning Engine
   ═══════════════════════════════════════════════════════════ */
export default function Sketchbook() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [flip, setFlip] = useState(null)
  const [showBackCover, setShowBackCover] = useState(false)
  const touchStartX = useRef(0)

  const total = SPREADS.length
  const FLIP_MS = 900 // 900ms smooth tactile physical paper turn

  const goNext = useCallback(() => {
    if (flip) return
    if (index >= total - 1) {
      setFlip({ dir: 'next', from: index, to: index, closing: true })
      return
    }
    setFlip({ dir: 'next', from: index, to: index + 1 })
  }, [flip, index, total])

  const goPrev = useCallback(() => {
    if (flip) return
    if (index <= 0) {
      setOpen(false)
      setShowBackCover(false)
      return
    }
    setFlip({ dir: 'prev', from: index, to: index - 1 })
  }, [flip, index])

  const closeBook = useCallback(() => {
    if (flip) return
    setOpen(false)
    setShowBackCover(false)
    setIndex(0)
  }, [flip])

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') goPrev()
      if (e.key === 'Escape') closeBook()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, goNext, goPrev, closeBook])

  const handleFlipComplete = () => {
    if (!flip) return
    if (flip.closing) {
      setOpen(false)
      setShowBackCover(true)
      setIndex(0)
    } else {
      setIndex(flip.to)
    }
    setFlip(null)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff < -45) goNext()
    else if (diff > 45) goPrev()
  }

  return (
    <section className="sketchbook-section relative" id="sketchbook-section">
      {/* Top seamless blend fade */}
      <div
        className="absolute top-0 left-0 right-0 h-44 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #060c1b 0%, rgba(6, 12, 27, 0.7) 45%, transparent 100%)',
        }}
      />

      {/* Bottom seamless blend fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, #060c1b 0%, rgba(6, 12, 27, 0.7) 45%, transparent 100%)',
        }}
      />

      {/* Section Title */}
      <motion.div
        className="relative z-20"
        style={{ textAlign: 'center', marginBottom: 36 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(197, 155, 39, 0.6)',
          marginBottom: 10,
        }}>
          Chapter Three
        </p>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          color: '#f3ecdb',
          textAlign: 'center',
          fontWeight: 300,
          fontStyle: 'italic',
        }}>
          Our Memory Book
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          color: 'rgba(243, 236, 219, 0.5)',
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: '0.04em',
        }}>
          Click pages or arrows to turn · Feel every memory unfold
        </p>
      </motion.div>

      {/* Book Container */}
      <div style={{
        perspective: 2600,
        width: 'min(92vw, 760px)',
        aspectRatio: '16 / 10',
        position: 'relative',
      }}>
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            showBackCover ? (
              <BackCoverView onClose={() => {
                setShowBackCover(false)
                setOpen(true)
                setIndex(0)
              }} />
            ) : (
              <FrontCover onOpen={() => {
                setOpen(true)
                setShowBackCover(false)
              }} />
            )
          ) : (
            /* ── OPEN BOOK WITH 3D DOUBLE-SIDED REALISTIC TURNING ── */
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 32px 85px rgba(0,0,0,0.75), 0 0 35px rgba(255, 215, 0, 0.15)',
                background: '#f5efe3',
                perspective: 2600,
                transformStyle: 'preserve-3d',
              }}
            >
              <CenterBinding />

              {/* ── LEFT HALF ── */}
              <div
                onClick={() => !flip && index > 0 && goPrev()}
                style={{
                  position: 'relative',
                  width: '50%',
                  height: '100%',
                  cursor: index > 0 && !flip ? 'pointer' : 'default',
                  overflow: 'hidden',
                }}
              >
                {/* Base Left Page (Underneath) */}
                {flip?.dir === 'prev' ? (
                  SPREADS[flip.to]?.left
                ) : (
                  SPREADS[index]?.left
                )}

                {/* Page spine shadow */}
                <div
                  className="page-curl-shadow"
                  style={{
                    left: 0,
                    right: 'auto',
                    background: 'linear-gradient(270deg, transparent 60%, rgba(0,0,0,0.08) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Ambient dynamic shadow on Left Page during NEXT flip */}
                {flip?.dir === 'next' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.35, 0] }}
                    transition={{ duration: FLIP_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, transparent 65%)',
                      pointerEvents: 'none',
                      zIndex: 25,
                    }}
                  />
                )}

                {/* TURNING LEAF FOR PREV FLIP (Rotates 0deg -> 180deg from right edge) */}
                {flip?.dir === 'prev' && (
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 180 }}
                    transition={{
                      duration: FLIP_MS / 1000,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onAnimationComplete={handleFlipComplete}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transformOrigin: 'right center',
                      transformStyle: 'preserve-3d',
                      zIndex: 50,
                      boxShadow: '-14px 0 38px rgba(0,0,0,0.35)',
                    }}
                  >
                    {/* Front Face: current left page */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        zIndex: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {SPREADS[flip.from]?.left}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.45, 0.95] }}
                        transition={{ duration: FLIP_MS / 1000, ease: 'easeIn' }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(270deg, rgba(0,0,0,0.55) 0%, transparent 60%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>

                    {/* Back Face: target right page */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: 1,
                        overflow: 'hidden',
                      }}
                    >
                      {SPREADS[flip.to]?.right}
                      <motion.div
                        initial={{ opacity: 0.85 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: FLIP_MS / 1000, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, rgba(0,0,0,0.38) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Left corner hint */}
                {index > 0 && !flip && (
                  <PageCornerHint dir="left" onClick={goPrev} />
                )}
              </div>

              {/* ── RIGHT HALF ── */}
              <div
                onClick={() => !flip && goNext()}
                style={{
                  position: 'relative',
                  width: '50%',
                  height: '100%',
                  cursor: !flip ? 'pointer' : 'default',
                  overflow: 'hidden',
                }}
              >
                {/* Base Right Page (Underneath) */}
                {flip?.dir === 'next' ? (
                  flip.closing ? (
                    <BackCoverInside />
                  ) : (
                    SPREADS[flip.to]?.right
                  )
                ) : (
                  SPREADS[index]?.right
                )}

                {/* Page spine shadow */}
                <div
                  className="page-curl-shadow"
                  style={{
                    background: 'linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.08) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Ambient dynamic shadow on Right Page during PREV flip */}
                {flip?.dir === 'prev' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.35, 0] }}
                    transition={{ duration: FLIP_MS / 1000, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(270deg, rgba(0,0,0,0.42) 0%, transparent 65%)',
                      pointerEvents: 'none',
                      zIndex: 25,
                    }}
                  />
                )}

                {/* TURNING LEAF FOR NEXT FLIP (Rotates 0deg -> -180deg from left edge) */}
                {flip?.dir === 'next' && (
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{
                      duration: FLIP_MS / 1000,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onAnimationComplete={handleFlipComplete}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      zIndex: 50,
                      boxShadow: '14px 0 38px rgba(0,0,0,0.35)',
                    }}
                  >
                    {/* Front Face: current right page */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        zIndex: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {SPREADS[flip.from]?.right}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.45, 0.95] }}
                        transition={{ duration: FLIP_MS / 1000, ease: 'easeIn' }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 60%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>

                    {/* Back Face: target left page */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: 1,
                        overflow: 'hidden',
                      }}
                    >
                      {flip.closing ? (
                        <BackCoverInside />
                      ) : (
                        SPREADS[flip.to]?.left
                      )}
                      <motion.div
                        initial={{ opacity: 0.85 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: FLIP_MS / 1000, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(270deg, rgba(0,0,0,0.38) 0%, transparent 70%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Right corner hint */}
                {!flip && (
                  <PageCornerHint dir="right" onClick={goNext} />
                )}
              </div>

              {/* Luxury Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeBook()
                }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  zIndex: 60,
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  color: '#7c664d',
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(197, 155, 39, 0.3)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                  transition: 'all 0.2s ease',
                }}
              >
                close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <button onClick={goPrev} disabled={!!flip} style={navBtnStyle(!!flip)}>
            <ChevronLeft size={16} /> Prev
          </button>

          <div style={{ display: 'flex', gap: 6 }}>
            {SPREADS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: i === index ? '#ffd700' : 'rgba(255,255,255,0.25)',
                  boxShadow: i === index ? '0 0 8px rgba(255, 215, 0, 0.8)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <button onClick={goNext} disabled={!!flip} style={navBtnStyle(!!flip)}>
            Next <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </section>
  )
}

function navBtnStyle(disabled) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    color: disabled ? 'rgba(255,255,255,0.25)' : '#f3ecdb',
    background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: '8px 18px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.04em',
    backdropFilter: 'blur(8px)',
  }
}
