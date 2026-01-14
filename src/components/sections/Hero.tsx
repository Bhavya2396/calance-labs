'use client'

import { motion } from 'framer-motion'

// Hero Illustration - Network/AI themed
function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Central node */}
      <motion.circle
        cx="200" cy="200" r="40"
        fill="rgba(249,115,22,0.2)"
        stroke="rgba(249,115,22,0.6)" strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <motion.circle
        cx="200" cy="200" r="20"
        fill="rgba(249,115,22,0.4)"
        stroke="#f97316" strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      
      {/* Outer ring */}
      <motion.circle
        cx="200" cy="200" r="120"
        fill="none"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        strokeDasharray="8 8"
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{ pathLength: 1, rotate: 360 }}
        transition={{ pathLength: { duration: 2 }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
      />
      
      {/* Connecting nodes */}
      {[
        { x: 80, y: 120, delay: 0.6 },
        { x: 320, y: 120, delay: 0.7 },
        { x: 80, y: 280, delay: 0.8 },
        { x: 320, y: 280, delay: 0.9 },
        { x: 200, y: 60, delay: 0.65 },
        { x: 200, y: 340, delay: 0.85 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.line
            x1={node.x} y1={node.y} x2="200" y2="200"
            stroke="rgba(249,115,22,0.3)" strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: node.delay, duration: 0.6 }}
          />
          <motion.circle
            cx={node.x} cy={node.y} r="12"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: node.delay + 0.3 }}
          />
          <motion.circle
            cx={node.x} cy={node.y} r="4"
            fill="rgba(249,115,22,0.6)"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: node.delay + 0.4 }}
          />
        </motion.g>
      ))}
      
      {/* Animated pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="200" cy="200" r="60"
          fill="none"
          stroke="rgba(249,115,22,0.3)"
          strokeWidth="1"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

interface HeroProps {
  isLoaded?: boolean
}

export function Hero({ isLoaded = true }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
    >
      {isLoaded && (
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            
            {/* Left - Content */}
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4"
              >
                <span className="text-sm text-orange-400 font-medium tracking-wider">
                  // CALANCE LABS
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6"
              >
                <span className="text-white">Build intelligent</span>
                <br />
                <span className="text-white">software with AI.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mb-8"
              >
                Enterprise AI solutions that transform your operations. 
                Custom software that thinks, learns, and evolves with your business.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-orange-500 text-white text-sm font-semibold tracking-wider
                             hover:bg-orange-400 transition-all rounded-xl flex items-center gap-2"
                >
                  GET AI BLUEPRINT
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-neutral-900 border border-white/20 text-white text-sm tracking-wider
                             hover:bg-neutral-800 transition-all rounded-xl"
                >
                  LEARN MORE
                </button>
              </motion.div>
            </div>

            {/* Right - Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-[400px] h-[400px] hidden lg:block"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-orange-500/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}
