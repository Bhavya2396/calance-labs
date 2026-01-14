'use client'

import { motion } from 'framer-motion'

export function SectionProblem() {
  return (
    <section id="problem" className="relative min-h-screen flex items-center justify-end">
      {/* Content positioned right, away from 3D on left */}
      <div className="p-6 md:p-12 lg:p-20 max-w-lg text-right">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/30 text-xs tracking-[0.3em] mb-6"
        >
          THE CHALLENGE
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-8"
        >
          Most businesses know
          <br />
          AI can help.
          <br />
          <span className="text-white/40">But don't know where to start.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-sm leading-relaxed"
        >
          The technology exists. The potential is clear.
          <br />
          What's missing is clarity.
        </motion.p>
      </div>
    </section>
  )
}
