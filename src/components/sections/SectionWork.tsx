'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const WORK = [
  { client: 'Ujjain Smart City', project: 'AI Traffic Management', impact: 'Reduced congestion' },
  { client: 'Indian Railways', project: 'Predictive Maintenance', impact: 'Improved efficiency' },
  { client: 'Healthcare Network', project: 'Clinical Decision AI', impact: 'Better diagnostics' },
]

export function SectionWork() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="work" className="relative min-h-screen flex items-center">
      {/* Content positioned left */}
      <div className="p-6 md:p-12 lg:p-20 max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/30 text-xs tracking-[0.3em] mb-6"
        >
          WORK
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-12"
        >
          Real solutions.
          <br />
          <span className="text-white/40">Real impact.</span>
        </motion.h2>

        <div className="space-y-4">
          {WORK.map((item, i) => (
            <motion.button
              key={item.client}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => setActiveIndex(i)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                activeIndex === i 
                  ? 'bg-white/[0.03] border border-[#c9956c]/20' 
                  : 'bg-transparent border border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium transition-colors ${
                  activeIndex === i ? 'text-white' : 'text-white/60'
                }`}>
                  {item.client}
                </span>
                <span className="text-white/20 text-xs">
                  0{i + 1}
                </span>
              </div>
              <div className="text-white/40 text-sm mb-1">{item.project}</div>
              {activeIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 pt-2 border-t border-white/5"
                >
                  <span className="text-[#c9956c] text-xs">{item.impact}</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
