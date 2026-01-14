'use client'

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

// ========================================
// ANIMATED PROCESS SVGs
// ========================================

function DiscoverySvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.circle cx="42" cy="42" r="25" fill="none" stroke="currentColor" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} />
      <motion.line x1="60" y1="60" x2="80" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }} />
      {[[35, 35], [42, 45], [50, 38]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="3" fill="currentColor"
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} 
          transition={{ delay: 0.8 + i * 0.1 }} viewport={{ once: true }} />
      ))}
    </svg>
  )
}

function ArchitectSvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="2" rx="4"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} />
      {[35, 50, 65].map((pos, i) => (
        <motion.g key={i}>
          <motion.line x1={pos} y1="15" x2={pos} y2="85" stroke="currentColor" strokeWidth="1" opacity="0.3"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1 }} viewport={{ once: true }} />
          <motion.line x1="15" y1={pos} x2="85" y2={pos} stroke="currentColor" strokeWidth="1" opacity="0.3"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1 }} viewport={{ once: true }} />
        </motion.g>
      ))}
      <motion.rect x="20" y="20" width="20" height="20" fill="currentColor" opacity="0.5" rx="2"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.8 }} viewport={{ once: true }} />
      <motion.rect x="45" y="55" width="30" height="20" fill="currentColor" opacity="0.4" rx="2"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.9 }} viewport={{ once: true }} />
    </svg>
  )
}

function BuildSvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.rect x="15" y="20" width="70" height="60" fill="none" stroke="currentColor" strokeWidth="2" rx="6"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} />
      <motion.line x1="15" y1="32" x2="85" y2="32" stroke="currentColor" strokeWidth="1.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }} />
      {[24, 27, 30].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy="26" r="2" fill="currentColor" opacity={0.7 - i * 0.15}
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} viewport={{ once: true }} />
      ))}
      {[42, 52, 62].map((y, i) => (
        <motion.rect key={i} x="22" y={y} width={[30, 45, 25][i]} height="3" fill="currentColor" opacity="0.5" rx="1"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} 
          transition={{ delay: 0.8 + i * 0.1 }} viewport={{ once: true }} style={{ transformOrigin: 'left' }} />
      ))}
    </svg>
  )
}

function DeploySvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.path 
        d="M25 55 Q12 55 12 45 Q12 34 28 34 Q30 22 50 22 Q70 22 72 34 Q88 34 88 45 Q88 55 75 55" 
        fill="none" stroke="currentColor" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} />
      <motion.rect x="35" y="65" width="30" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" rx="3"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} />
      {[42, 50, 58].map((x, i) => (
        <motion.circle key={i} cx={x} cy="76" r="2" fill="currentColor" opacity="0.6"
          initial={{ scale: 0 }} whileInView={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.9 + i * 0.1, repeat: Infinity, repeatDelay: 3 }} viewport={{ once: true }} />
      ))}
      <motion.path d="M50 60 L50 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1 }} viewport={{ once: true }} />
      <motion.path d="M44 50 L50 44 L56 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.1 }} viewport={{ once: true }} />
    </svg>
  )
}

const PROCESS_STEPS = [
  { number: '01', title: 'Discover', description: 'We analyze your business to identify where AI creates impact.', icon: DiscoverySvg },
  { number: '02', title: 'Architect', description: 'We design solutions that integrate with your infrastructure.', icon: ArchitectSvg },
  { number: '03', title: 'Build', description: 'Our team develops and tests using DevOps best practices.', icon: BuildSvg },
  { number: '04', title: 'Deploy', description: 'Enterprise-grade deployment with continuous monitoring.', icon: DeploySvg },
]

function ProcessStep({ step, index, progress }: { step: typeof PROCESS_STEPS[0]; index: number; progress: MotionValue<number> }) {
  const Icon = step.icon
  const y = useTransform(progress, [0, 1], [40, 0])
  
  return (
    <motion.div
      style={{ opacity: progress, y }}
      className="p-5 md:p-6 bg-white/[0.02] border border-white/[0.05] 
                 hover:border-white/10 transition-all duration-500 rounded-2xl group"
    >
      <div className="flex items-start justify-between mb-5">
        <span className="text-3xl font-light text-white/20 group-hover:text-white/30 transition-colors">{step.number}</span>
        <div className="w-14 h-14 text-white/30 group-hover:text-white/50 transition-colors">
          <Icon />
        </div>
      </div>
      <h3 className="text-lg text-white/80 font-medium mb-2">{step.title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
    </motion.div>
  )
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  
  const step1Progress = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
  const step2Progress = useTransform(scrollYProgress, [0.15, 0.25], [0, 1])
  const step3Progress = useTransform(scrollYProgress, [0.2, 0.3], [0, 1])
  const step4Progress = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])
  const stepProgresses = [step1Progress, step2Progress, step3Progress, step4Progress]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-[180vh] px-6 md:px-12 lg:px-24 py-24 overflow-hidden"
    >
      <div className="sticky top-0 min-h-screen flex flex-col justify-center py-20">
        <motion.div style={{ opacity }} className="relative z-10 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-white/30 tracking-[0.3em] uppercase mb-4 block"
            >
              // WHO WE ARE
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] tracking-tight mb-6"
            >
              <span className="text-white">Global IT services.</span>
              <br />
              <span className="text-white/70">Intelligent solutions.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-white/40 leading-relaxed max-w-xl"
            >
              Calance provides solutions in Gen AI, Business Intelligence, Data Science, 
              Application Development, RPA, Cybersecurity, and Microsoft technologies. 
              Operating in the US, Canada, and India.
            </motion.p>
          </div>

          {/* Process Steps */}
          <div>
            <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] mb-6">Our Process</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROCESS_STEPS.map((step, i) => (
                <ProcessStep key={i} step={step} index={i} progress={stepProgresses[i]} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
