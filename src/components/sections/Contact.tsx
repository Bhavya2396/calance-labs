'use client'

import { motion } from 'framer-motion'

const cardStyle = "p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl"

export function Contact() {
  return (
    <section id="contact" className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-12">
      {/* Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 bg-white/[0.02] border border-white/[0.05] rounded-3xl mb-8"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left - CTA */}
            <div>
              <p className="text-xs text-white/40 tracking-widest uppercase mb-6">
                Get In Touch
              </p>

              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                Ready to build with
                <br />
                <span className="text-white/50">intelligence?</span>
              </h2>

              <p className="text-sm text-white/50 mb-8 max-w-sm">
                Let's discuss how AI can transform your business operations. 
                Custom solutions, real results.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:connect@calance.com"
                  className="px-6 py-3 bg-white text-black text-sm tracking-wider hover:bg-white/90 transition-all rounded-full"
                >
                  START A CONVERSATION →
                </a>
                <button
                  onClick={() => document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3 border border-white/20 text-white text-sm tracking-wider hover:bg-white/5 transition-all rounded-full"
                >
                  GET AI BLUEPRINT
                </button>
              </div>
            </div>

            {/* Right - Contact Info */}
            <div className="space-y-4">
              <div className={cardStyle}>
                <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Email</div>
                <div className="text-white">connect@calance.com</div>
              </div>
              
              <div className={cardStyle}>
                <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Headquarters</div>
                <div className="text-white/70 text-sm">
                  888 S. Disneyland Drive, Suite 500<br />
                  Anaheim, CA 92802
                </div>
              </div>
              
              <div className={cardStyle}>
                <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Global Presence</div>
                <div className="flex gap-4 text-white/60 text-sm">
                  <span>United States</span>
                  <span>•</span>
                  <span>Canada</span>
                  <span>•</span>
                  <span>India</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-t border-white/[0.05]">
          <div className="text-xs text-white/30">
            © 2024 Calance. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="https://calance.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">
              calance.com
            </a>
            <a href="mailto:connect@calance.com" className="hover:text-white/60 transition-colors">
              contact
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
