'use client'

import { motion } from 'framer-motion'

export function Contact() {
  return (
    <section id="contact" className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-12">
      {/* Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-white/40 tracking-widest uppercase mb-6"
        >
          Get In Touch
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-light tracking-tight mb-8"
        >
          Ready to build with
          <br />
          <span className="text-white/60">intelligence?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <a
            href="mailto:connect@calance.com"
            className="px-6 py-3 bg-white text-black text-sm tracking-wider hover:bg-white/90 transition-all rounded-full"
          >
            START A CONVERSATION →
          </a>
          <button
            onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 border border-white/20 text-white text-sm tracking-wider hover:bg-white/10 transition-all rounded-full"
          >
            GET AI BLUEPRINT
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-8 text-sm text-white/40 mb-8"
        >
          <div>
            <div className="text-white/60 mb-1">connect@calance.com</div>
          </div>
          <div>
            <div>888 S. Disneyland Drive, Suite 500</div>
            <div>Anaheim, CA 92802</div>
          </div>
          <div>
            <div>US • Canada • India</div>
          </div>
        </motion.div>

        <div className="text-xs text-white/20 pt-6 border-t border-white/10">
          © 2024 Calance. All rights reserved.
        </div>
      </div>
    </section>
  )
}
