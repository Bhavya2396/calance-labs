'use client'

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

// ========================================
// ANIMATED PROCESS SVGs
// ========================================

function DiscoverySvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Magnifying glass */}
      <motion.circle cx="42" cy="42" r="25" fill="none" stroke="currentColor" strokeWidth="3"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} />
      <motion.line x1="60" y1="60" x2="85" y2="85" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }} />
      {/* Data points inside */}
      {[[35, 35], [42, 45], [50, 38]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="4" fill="currentColor"
          initial={{ scale: 0 }} whileInView={{ scale: [0, 1.3, 1] }} 
          transition={{ delay: 0.8 + i * 0.15 }} viewport={{ once: true }} />
      ))}
      {/* Scanning lines */}
      <motion.line x1="25" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.4"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.2 }} viewport={{ once: true }} />
      <motion.line x1="28" y1="50" x2="56" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.4"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.3 }} viewport={{ once: true }} />
    </svg>
  )
}

function ArchitectSvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Blueprint grid */}
      <motion.rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" rx="4"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} />
      {/* Grid lines */}
      {[30, 50, 70].map((pos, i) => (
        <motion.g key={i}>
          <motion.line x1={pos} y1="10" x2={pos} y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1 }} viewport={{ once: true }} />
          <motion.line x1="10" y1={pos} x2="90" y2={pos} stroke="currentColor" strokeWidth="1" opacity="0.3"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1 }} viewport={{ once: true }} />
        </motion.g>
      ))}
      {/* Architecture blocks */}
      <motion.rect x="15" y="15" width="25" height="25" fill="currentColor" opacity="0.7" rx="3"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} viewport={{ once: true }} />
      <motion.rect x="55" y="15" width="30" height="15" fill="currentColor" opacity="0.5" rx="3"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} viewport={{ once: true }} />
      <motion.rect x="35" y="55" width="40" height="25" fill="currentColor" opacity="0.6" rx="3"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }} viewport={{ once: true }} />
      {/* Connection lines */}
      <motion.path d="M27 40 L27 55 L35 55" fill="none" stroke="currentColor" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.1 }} viewport={{ once: true }} />
      <motion.path d="M70 30 L70 45 L75 55" fill="none" stroke="currentColor" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.2 }} viewport={{ once: true }} />
    </svg>
  )
}

function BuildSvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Terminal/Code window */}
      <motion.rect x="10" y="15" width="80" height="70" fill="none" stroke="currentColor" strokeWidth="2" rx="8"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} />
      {/* Title bar */}
      <motion.line x1="10" y1="28" x2="90" y2="28" stroke="currentColor" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }} />
      {/* Window buttons */}
      {[20, 30, 40].map((x, i) => (
        <motion.circle key={i} cx={x} cy="21" r="3" fill="currentColor" opacity={0.8 - i * 0.2}
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} viewport={{ once: true }} />
      ))}
      {/* Code lines */}
      {[38, 48, 58, 68].map((y, i) => (
        <motion.g key={i}>
          <motion.rect x="18" y={y} width={[35, 50, 28, 45][i]} height="4" fill="currentColor" opacity="0.6" rx="2"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} 
            transition={{ delay: 0.8 + i * 0.15 }} viewport={{ once: true }} style={{ transformOrigin: 'left' }} />
        </motion.g>
      ))}
      {/* Cursor blink */}
      <motion.rect x="63" y="68" width="2" height="6" fill="currentColor"
        initial={{ opacity: 0 }} whileInView={{ opacity: [0, 1, 0, 1] }}
        transition={{ delay: 1.4, duration: 1.5, repeat: Infinity }} viewport={{ once: true }} />
    </svg>
  )
}

function DeploySvg() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Cloud shape */}
      <motion.path 
        d="M25 60 Q10 60 10 48 Q10 35 28 35 Q30 22 50 22 Q70 22 72 35 Q90 35 90 48 Q90 60 75 60" 
        fill="none" stroke="currentColor" strokeWidth="3"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.2 }} viewport={{ once: true }} />
      {/* Server racks */}
      <motion.rect x="30" y="70" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="4"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} />
      <motion.line x1="30" y1="78" x2="70" y2="78" stroke="currentColor" strokeWidth="1"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 0.8 }} viewport={{ once: true }} />
      {/* Server lights */}
      {[38, 50, 62].map((x, i) => (
        <motion.circle key={i} cx={x} cy="84" r="2" fill="currentColor"
          initial={{ scale: 0 }} whileInView={{ scale: [0, 1.5, 1] }}
          transition={{ delay: 1 + i * 0.1, repeat: Infinity, repeatDelay: 2 }} viewport={{ once: true }} />
      ))}
      {/* Upload arrow */}
      <motion.path d="M50 65 L50 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.2 }} viewport={{ once: true }} />
      <motion.path d="M42 52 L50 44 L58 52" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: 1.4 }} viewport={{ once: true }} />
    </svg>
  )
}

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'We analyze your business processes, technology stack, and strategic goals to identify where AI can create the most impact.',
    icon: DiscoverySvg,
  },
  {
    number: '02',
    title: 'Architect',
    description: 'We design scalable AI solutions that integrate seamlessly with your existing infrastructure and Microsoft technologies.',
    icon: ArchitectSvg,
  },
  {
    number: '03',
    title: 'Build',
    description: 'Our global team develops, trains, and rigorously tests AI models using best practices in DevOps and application development.',
    icon: BuildSvg,
  },
  {
    number: '04',
    title: 'Deploy',
    description: 'We deploy to production with enterprise-grade security, continuous monitoring, and ongoing optimization support.',
    icon: DeploySvg,
  },
]

// Helper component for animated process step
function ProcessStep({ 
  step, 
  index, 
  progress 
}: { 
  step: typeof PROCESS_STEPS[0]
  index: number
  progress: MotionValue<number>
}) {
  const Icon = step.icon
  const y = useTransform(progress, [0, 1], [50, 0])
  
  return (
    <motion.div
      style={{ opacity: progress, y }}
      className="p-6 bg-neutral-900/80 border border-white/10 hover:border-orange-500/30 transition-all group rounded-2xl"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-4xl font-light text-orange-400">{step.number}</span>
        <div className="w-20 h-20 text-orange-400 group-hover:text-orange-300 transition-colors">
          <Icon />
        </div>
      </div>
      <h3 className="text-2xl text-white font-medium mb-3">{step.title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
    </motion.div>
  )
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  // Create individual transforms for each step
  const step1Progress = useTransform(scrollYProgress, [0.1, 0.25], [0, 1])
  const step2Progress = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])
  const step3Progress = useTransform(scrollYProgress, [0.3, 0.45], [0, 1])
  const step4Progress = useTransform(scrollYProgress, [0.4, 0.55], [0, 1])
  const stepProgresses = [step1Progress, step2Progress, step3Progress, step4Progress]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-[200vh] px-6 md:px-12 lg:px-24 py-24 overflow-hidden"
    >
      <div className="sticky top-0 min-h-screen flex flex-col justify-center">
        <motion.div 
          style={{ opacity }}
          className="relative z-10 w-full max-w-[1600px] mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <span className="text-sm text-orange-400 font-medium tracking-wider">
                  // WHO WE ARE
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight"
              >
                <span className="text-white">
                  Global IT services.
                </span>
                <br />
                <span className="text-white">
                  Intelligent solutions.
                </span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-md"
            >
              <p className="text-base text-white/60 leading-relaxed mb-4">
                Calance is a global IT Services firm providing solutions in Gen AI, Business Intelligence, 
                Data Science, Application Development, RPA, Infrastructure, Cybersecurity, and Microsoft technologies.
              </p>
              <p className="text-sm text-white/40">
                Operating in United States, Canada and India — helping clients bring their ideas to life.
              </p>
            </motion.div>
          </div>

          {/* Process Steps - Scroll Animated */}
          <div className="mb-8">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-6">Our Process</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, i) => (
                <ProcessStep 
                  key={i} 
                  step={step} 
                  index={i} 
                  progress={stepProgresses[i]} 
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
