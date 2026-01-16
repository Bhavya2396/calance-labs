'use client'

import { motion } from 'framer-motion'

export function SectionContact() {
  return (
    <section id="contact" className="relative min-h-screen flex flex-col justify-end">
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      
      {/* Content centered at bottom */}
      <div className="relative z-10 p-6 md:p-12 lg:p-20 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            className="text-white/40 text-xs tracking-[0.3em] mb-6"
          >
            START THE DIALOGUE
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-8"
          >
            Ready to build with
            <br />
            <span className="text-[#f9a86c]">intelligence</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm leading-relaxed mb-10 max-w-md mx-auto"
          >
            Let's discuss how AI can transform your operations.
            <br />
            <span className="text-white/60">Custom solutions, real results.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <a
              href="mailto:connect@calance.com"
              className="px-8 py-4 bg-[#f9a86c] text-white text-xs tracking-widest hover:bg-[#e89758] transition-all rounded-full"
            >
              CONNECT@CALANCE.COM
            </a>
            <button
              onClick={() => document.getElementById('blueprint')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-white/30 text-white text-xs tracking-widest hover:bg-white/5 hover:border-[#f9a86c]/50 transition-all rounded-full"
            >
              GET AI BLUEPRINT
            </button>
          </motion.div>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white/30 text-xs">
              <div>
                888 S. Disneyland Drive, Suite 500, Anaheim, CA
              </div>
              <div className="flex gap-6">
                <span>United States</span>
                <span>•</span>
                <span>Canada</span>
                <span>•</span>
                <span>India</span>
              </div>
            </div>
            <div className="mt-6 text-white/20 text-xs">
              © 2024 Calance. All rights reserved.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
