'use client'

import { motion } from 'framer-motion'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-12 overflow-hidden"
    >
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent pointer-events-none z-[1]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        
        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            
            {/* Left - CTA */}
            <div className="max-w-xl">
              <span className="text-xs text-white/30 tracking-[0.3em] uppercase mb-4 block">
                // GET IN TOUCH
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-8">
                <span className="text-white">Ready to build with</span>
                <br />
                <span className="text-white/80">intelligence?</span>
              </h2>

              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:connect@calance.com"
                  className="group flex items-center gap-3 px-6 py-3 bg-white text-[#050505] text-sm font-medium 
                             tracking-wider hover:bg-white/90 transition-all duration-300 rounded-full"
                >
                  START A CONVERSATION
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <button
                  onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 border border-white/20 text-white text-sm font-medium 
                             tracking-wider hover:bg-white/5 hover:border-white/30 transition-all duration-300 rounded-full"
                >
                  GET AI BLUEPRINT
                </button>
              </div>
            </div>

            {/* Right - Contact Info */}
            <div className="lg:max-w-sm space-y-4">
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Email</div>
                <div className="text-white/80">connect@calance.com</div>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Headquarters</div>
                <div className="text-white/60 text-sm">
                  888 S. Disneyland Drive, Suite 500<br />
                  Anaheim, CA 92802
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.03]">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Global Presence</div>
                <div className="text-white/50 text-sm">United States • Canada • India</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-t border-white/[0.05]"
        >
          <div className="text-[10px] text-white/30 tracking-wider">
            © 2024 CALANCE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-[10px] text-white/30 tracking-wider">
            <a href="https://calance.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">CALANCE.COM</a>
            <a href="mailto:connect@calance.com" className="hover:text-white/60 transition-colors">CONTACT</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
