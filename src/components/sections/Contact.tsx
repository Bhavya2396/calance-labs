'use client'

import { motion } from 'framer-motion'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 overflow-hidden"
    >
      {/* Background Shield for Readability */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none z-[1]" />
      
      {/* Bottom Content Layout */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        
        {/* Content Card with Background */}
        <div className="p-8 md:p-12 bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            {/* Left Side - Main CTA */}
            <div className="max-w-2xl">
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <span className="text-sm text-orange-400 font-medium tracking-wider">
                  // GET IN TOUCH
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-8"
              >
                <span className="text-white">
                  Ready to build with
                </span>
                <br />
                <span className="text-white">
                  intelligence?
                </span>
              </motion.h2>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="mailto:connect@calance.com"
                  className="flex items-center gap-3 px-6 py-4 bg-white text-black text-sm font-medium 
                             tracking-wider hover:bg-white/90 transition-all duration-300 rounded-xl"
                >
                  START A CONVERSATION
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
                <button
                  onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-4 border border-white/30 text-white text-sm font-medium 
                             tracking-wider hover:bg-white/10 transition-all duration-300 rounded-xl"
                >
                  GET AI BLUEPRINT
                </button>
              </motion.div>
            </div>

            {/* Right Side - Info */}
            <div className="max-w-sm">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-xs text-white/60 uppercase tracking-wide leading-relaxed mb-8"
              >
                Let's discuss how AI can transform your business operations. 
                Custom solutions, real results, measurable impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="space-y-4 text-xs uppercase tracking-wider"
              >
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/40 mb-1">Email</div>
                  <div className="text-white text-sm normal-case">connect@calance.com</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/40 mb-1">Headquarters</div>
                  <div className="text-white/70 normal-case text-sm">
                    888 S. Disneyland Drive, Suite 500<br />
                    Anaheim, CA 92802
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-white/40 mb-1">Global Presence</div>
                  <div className="text-white/60 normal-case text-sm">United States • Canada • India</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="text-xs text-white/40 tracking-wider">
            © 2024 CALANCE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-xs text-white/40 tracking-wider">
            <a href="https://calance.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">CALANCE.COM</a>
            <a href="mailto:connect@calance.com" className="hover:text-white transition-colors">CONTACT</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
