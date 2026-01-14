'use client'

import { motion } from 'framer-motion'

interface HeroProps {
  isLoaded?: boolean
}

export function Hero({ isLoaded = true }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Content - Positioned to the left, away from 3D */}
      {isLoaded && (
        <div className="relative z-10 w-full max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="text-xs text-white/40 font-medium tracking-[0.3em] uppercase">
                // CALANCE LABS
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-[1.1] mb-8"
            >
              <span className="text-white">
                Build intelligent
              </span>
              <br />
              <span className="text-white/90">
                software with AI.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm md:text-base text-white/50 leading-relaxed max-w-lg mb-10"
            >
              Enterprise AI solutions that transform operations. 
              Custom software that thinks, learns, and evolves with your business.
            </motion.p>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20
                         text-white text-sm font-medium tracking-wider 
                         hover:bg-white/20 hover:border-white/30 transition-all duration-500 rounded-full"
            >
              EXPLORE
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-0 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 
                       flex flex-col items-center gap-3"
          >
            <span className="text-[10px] text-white/30 tracking-[0.4em] uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </div>
      )}
    </section>
  )
}
