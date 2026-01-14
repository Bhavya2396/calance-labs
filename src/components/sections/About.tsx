'use client'

import { motion } from 'framer-motion'

const PROCESS = [
  { num: '01', title: 'Discover', desc: 'Analyze your business to find AI opportunities' },
  { num: '02', title: 'Architect', desc: 'Design solutions that fit your infrastructure' },
  { num: '03', title: 'Build', desc: 'Develop and test with DevOps best practices' },
  { num: '04', title: 'Deploy', desc: 'Enterprise deployment with ongoing support' },
]

export function About() {
  return (
    <section id="about" className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-white/40 tracking-widest uppercase mb-6"
        >
          Who We Are
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-light tracking-tight mb-6"
        >
          Global IT services.
          <br />
          <span className="text-white/60">Intelligent solutions.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-white/50 max-w-xl mb-12"
        >
          Calance provides solutions in Gen AI, Business Intelligence, Data Science, 
          Application Development, RPA, and Cybersecurity. Operating in the US, Canada, and India.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl"
            >
              <div className="text-2xl text-white/20 font-light mb-3">{step.num}</div>
              <div className="text-white/80 font-medium mb-1">{step.title}</div>
              <div className="text-xs text-white/40">{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
