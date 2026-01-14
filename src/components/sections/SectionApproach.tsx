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
      {/* Content positioned left */}
      <div className="p-6 md:p-12 lg:p-20 max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/30 text-xs tracking-[0.3em] mb-6"
        >
          OUR APPROACH
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-12"
        >
          We listen first.
          <br />
          <span className="text-white/40">Then architect.</span>
        </motion.h2>

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-4 group"
            >
              <span className="text-white/15 text-2xl font-light group-hover:text-[#c9956c]/50 transition-colors">
                {step.num}
              </span>
              <div>
                <div className="text-white/80 text-sm font-medium mb-1 group-hover:text-white transition-colors">
                  {step.title}
                </div>
                <div className="text-white/30 text-xs">
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
