'use client'

import { motion } from 'framer-motion'

interface HeroProps {
  isLoaded?: boolean
}

export function Hero({ isLoaded = true }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-20">
      {isLoaded && (
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs text-white/40 tracking-widest uppercase mb-6"
          >
            Calance Labs
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6"
          >
            Build intelligent
            <br />
            <span className="text-white/70">software with AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base text-white/50 max-w-md mb-10"
          >
            Enterprise AI solutions that transform your operations. 
            Custom software that thinks, learns, and evolves with your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-4"
          >
            <button
              onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-[#c9956c] text-white text-sm tracking-wider hover:bg-[#b8855c] transition-all rounded-full"
            >
              GET AI BLUEPRINT →
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm tracking-wider hover:bg-white/10 transition-all rounded-full"
            >
              LEARN MORE
            </button>
          </motion.div>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
        />
      </motion.div>
    </section>
  )
}
