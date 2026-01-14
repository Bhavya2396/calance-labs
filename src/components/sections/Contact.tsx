'use client'

import { motion } from 'framer-motion'

// Contact Illustration
function ContactIllustration() {
  return (
    <svg viewBox="0 0 300 250" className="w-full h-full">
      {/* Globe */}
      <motion.circle cx="150" cy="125" r="80" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.4)" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} />
      
      {/* Latitude/longitude lines */}
      <motion.ellipse cx="150" cy="125" rx="80" ry="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.8 }} />
      <motion.ellipse cx="150" cy="125" rx="80" ry="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.8 }} />
      <motion.line x1="150" y1="45" x2="150" y2="205" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.line x1="70" y1="125" x2="230" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      
      {/* Location markers */}
      {[
        { x: 110, y: 105, label: 'US' },
        { x: 190, y: 115, label: 'India' },
        { x: 130, y: 90, label: 'Canada' },
      ].map((loc, i) => (
        <motion.g key={i}>
          <motion.circle cx={loc.x} cy={loc.y} r="8" fill="rgba(249,115,22,0.3)" stroke="#f97316" strokeWidth="2"
            initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.8 + i * 0.15 }} />
          <motion.circle cx={loc.x} cy={loc.y} r="3" fill="#f97316"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 + i * 0.15 }} />
        </motion.g>
      ))}
      
      {/* Connecting arcs */}
      <motion.path d="M110 105 Q150 70 190 115" fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5" strokeDasharray="4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.8 }} />
      <motion.path d="M130 90 Q160 80 190 115" fill="none" stroke="rgba(249,115,22,0.4)" strokeWidth="1.5" strokeDasharray="4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 0.8 }} />
      
      {/* Animated signal rings */}
      {[0, 1].map((i) => (
        <motion.circle key={i} cx="110" cy="105" r="8" fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, delay: i * 1, repeat: Infinity }} />
      ))}
    </svg>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-[1]" />
      
      <div className="relative z-10 max-w-[1600px] mx-auto w-full">
        
        {/* Header with Illustration */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 mb-12">
          
          {/* Left - Content */}
          <div className="max-w-2xl">
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

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-white">Ready to build with</span>
              <br />
              <span className="text-white">intelligence?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mb-8"
            >
              Let's discuss how AI can transform your business operations. 
              Custom solutions, real results, measurable impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="mailto:connect@calance.com"
                className="px-8 py-4 bg-orange-500 text-white text-sm font-semibold tracking-wider
                           hover:bg-orange-400 transition-all rounded-xl flex items-center gap-2"
              >
                START A CONVERSATION
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <button
                onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-neutral-900 border border-white/20 text-white text-sm tracking-wider
                           hover:bg-neutral-800 transition-all rounded-xl"
              >
                GET AI BLUEPRINT
              </button>
            </motion.div>
          </div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-[300px] h-[250px]"
          >
            <ContactIllustration />
          </motion.div>
        </div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-6 bg-neutral-900/60 border border-white/10 rounded-2xl">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Email</div>
            <div className="text-white/80 text-lg">connect@calance.com</div>
          </div>
          <div className="p-6 bg-neutral-900/60 border border-white/10 rounded-2xl">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Headquarters</div>
            <div className="text-white/60 text-sm">
              888 S. Disneyland Drive, Suite 500<br />
              Anaheim, CA 92802
            </div>
          </div>
          <div className="p-6 bg-neutral-900/60 border border-white/10 rounded-2xl">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Global Presence</div>
            <div className="text-white/60">United States • Canada • India</div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-white/10">
          <div className="text-xs text-white/30 tracking-wider">
            © 2024 CALANCE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 text-xs text-white/30 tracking-wider">
            <a href="https://calance.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
              CALANCE.COM
            </a>
            <a href="mailto:connect@calance.com" className="hover:text-white/60 transition-colors">
              CONTACT
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
