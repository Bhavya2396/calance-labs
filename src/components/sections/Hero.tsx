'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface HeroProps {
  isLoaded?: boolean
}

export function Hero({ isLoaded = true }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-12 overflow-hidden"
    >
      {/* Bottom Content Layout - Animated after 3D loads */}
      <AnimatePresence>
        {isLoaded && (
          <div className="relative z-10 w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              
              {/* Left Side - Main Headline */}
              <div className="max-w-2xl">
                {/* Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="mb-4"
                >
                  <span className="text-sm text-orange-400 font-medium tracking-wider">
                    // CALANCE LABS
                  </span>
                </motion.div>

                {/* Main Heading - Large, clean */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
                >
                  <span className="text-white">
                    Build intelligent
                  </span>
                  <br />
                  <span className="text-white">
                    software with AI.
                  </span>
                </motion.h1>
              </div>

              {/* Right Side - Description & CTA */}
              <div className="max-w-md">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-xs md:text-sm text-white/60 leading-relaxed tracking-wide uppercase mb-6"
                >
                  Enterprise AI solutions that transform operations. 
                  From conversational AI to computer vision — 
                  custom software that thinks, learns, and evolves.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-3 px-6 py-3 bg-white text-black text-sm font-medium 
                             tracking-wider hover:bg-white/90 transition-all duration-300 rounded-lg"
                >
                  EXPLORE CALANCE
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Center - Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/40 tracking-[0.3em] uppercase">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
