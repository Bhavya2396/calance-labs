'use client'

import { motion } from 'framer-motion'

export function SectionHero() {
  return (
    <section id="hero" className="relative h-screen flex items-end bg-black pointer-events-auto">
      {/* Content positioned bottom-left, away from 3D */}
      <div className="p-6 md:p-12 lg:p-20 pb-24 max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-xs tracking-[0.3em] mb-6"
        >
          CALANCE LABS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6"
        >
          <span className="text-[#f9a86c]">Intelligence</span> that
          <br />
          <span className="text-white/60">understands your business.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm"
        >
          We build AI systems that listen, learn, and transform 
          how your organization operates.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          onClick={() => document.getElementById('blueprint')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-white/70 text-xs tracking-[0.2em] hover:text-[#f9a86c] transition-colors"
        >
          DISCOVER →
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}
