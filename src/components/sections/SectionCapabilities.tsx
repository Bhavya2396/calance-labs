'use client'

import { motion } from 'framer-motion'

const CAPABILITIES = [
  { title: 'Conversational AI', desc: 'Chatbots that understand context and emotion.' },
  { title: 'Computer Vision', desc: 'Systems that see, analyze, and act.' },
  { title: 'Predictive Analytics', desc: 'Forecasts that guide decisions.' },
  { title: 'Process Automation', desc: 'Workflows that run themselves.' },
]

export function SectionCapabilities() {
  return (
    <section id="capabilities" className="relative min-h-screen flex items-center justify-end">
      {/* Content positioned right */}
      <div className="p-6 md:p-12 lg:p-20 max-w-lg text-right">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/30 text-xs tracking-[0.3em] mb-6"
        >
          CAPABILITIES
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-12"
        >
          What we build
          <br />
          <span className="text-white/40">with intelligence.</span>
        </motion.h2>

        <div className="space-y-8">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="group"
            >
              <div className="text-white/80 text-base font-medium mb-1 group-hover:text-white transition-colors">
                {cap.title}
              </div>
              <div className="text-white/30 text-sm">
                {cap.desc}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <p className="text-white/20 text-xs mb-4">ALSO</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {['Gen AI', 'BI', 'Data Science', 'RPA', 'DevOps'].map((tag) => (
              <span key={tag} className="px-3 py-1 text-white/30 text-xs bg-white/[0.02] rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
