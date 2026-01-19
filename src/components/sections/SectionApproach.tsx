'use client'

import { motion } from 'framer-motion'

const STEPS = [
  { num: '01', title: 'Listen', desc: 'We understand your processes first.' },
  { num: '02', title: 'Architect', desc: 'Design solutions that fit your reality.' },
  { num: '03', title: 'Build', desc: 'Develop with precision and care.' },
  { num: '04', title: 'Deploy', desc: 'Launch with confidence and support.' },
]

export function SectionApproach() {
  return (
    <section id="approach" className="relative min-h-screen flex items-center">
      {/* Semi-transparent background - 3D clearly visible */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content positioned left */}
      <div className="relative p-6 md:p-12 lg:p-20 max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/40 text-xs tracking-[0.3em] mb-6"
        >
          OUR APPROACH
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-12"
        >
          We <span className="text-[#f9a86c]">listen</span> first.
          <br />
          <span className="text-white/50">Then architect.</span>
        </motion.h2>

        <div className="space-y-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-6 group"
            >
              <span className="text-white/20 text-4xl font-light group-hover:text-[#f9a86c] transition-colors">
                {step.num}
              </span>
              <div>
                <div className="text-white/90 text-xl font-medium mb-2 group-hover:text-white transition-colors">
                  {step.title}
                </div>
                <div className="text-white/50 text-base">
                  {step.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
