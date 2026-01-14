'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

// Animated SVG icons for each process step
function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <motion.circle
        cx="35" cy="35" r="20"
        fill="none"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.line
        x1="50" y1="50" x2="70" y2="70"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      {active && (
        <>
          <motion.circle cx="30" cy="30" r="3" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
          <motion.circle cx="40" cy="35" r="3" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
          <motion.circle cx="35" cy="42" r="3" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} />
        </>
      )}
    </svg>
  )
}

function ArchitectIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <motion.rect
        x="10" y="10" width="60" height="60" rx="4"
        fill="none"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {[25, 40, 55].map((pos, i) => (
        <motion.line
          key={i}
          x1={pos} y1="10" x2={pos} y2="70"
          stroke={active ? 'rgba(201,149,108,0.3)' : 'rgba(255,255,255,0.1)'}
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        />
      ))}
      {active && (
        <>
          <motion.rect x="15" y="15" width="18" height="18" rx="2" fill="rgba(201,149,108,0.4)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
          <motion.rect x="45" y="42" width="20" height="20" rx="2" fill="rgba(201,149,108,0.3)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
        </>
      )}
    </svg>
  )
}

function BuildIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <motion.rect
        x="10" y="15" width="60" height="50" rx="4"
        fill="none"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.line
        x1="10" y1="28" x2="70" y2="28"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      {[18, 23, 28].map((cx, i) => (
        <motion.circle
          key={i} cx={cx} cy="21" r="2"
          fill={active ? '#c9956c' : 'rgba(255,255,255,0.3)'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
      {active && [36, 44, 52].map((y, i) => (
        <motion.rect
          key={i}
          x="16" y={y}
          width={[30, 45, 25][i]}
          height="3"
          rx="1"
          fill="rgba(201,149,108,0.5)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 + i * 0.1 }}
          style={{ transformOrigin: 'left' }}
        />
      ))}
    </svg>
  )
}

function DeployIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <motion.path
        d="M20 50 Q8 50 8 40 Q8 28 22 28 Q24 18 40 18 Q56 18 58 28 Q72 28 72 40 Q72 50 60 50"
        fill="none"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M40 55 L40 38"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.3)'}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8 }}
      />
      <motion.path
        d="M34 44 L40 38 L46 44"
        fill="none"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.3)'}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.9 }}
      />
      {active && (
        <motion.rect
          x="28" y="60" width="24" height="12" rx="2"
          fill="none"
          stroke="#c9956c"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1 }}
        />
      )}
    </svg>
  )
}

const PROCESS = [
  { 
    num: '01', 
    title: 'Discover', 
    desc: 'We analyze your business processes, technology stack, and goals to identify where AI can create the most impact.',
    icon: DiscoverIcon,
    details: ['Business analysis', 'Tech audit', 'Opportunity mapping']
  },
  { 
    num: '02', 
    title: 'Architect', 
    desc: 'We design scalable AI solutions that integrate with your existing infrastructure.',
    icon: ArchitectIcon,
    details: ['System design', 'Integration planning', 'Security architecture']
  },
  { 
    num: '03', 
    title: 'Build', 
    desc: 'Our global team develops and tests using DevOps best practices.',
    icon: BuildIcon,
    details: ['Agile development', 'Continuous testing', 'Quality assurance']
  },
  { 
    num: '04', 
    title: 'Deploy', 
    desc: 'Enterprise-grade deployment with continuous monitoring and support.',
    icon: DeployIcon,
    details: ['Cloud deployment', '24/7 monitoring', 'Ongoing optimization']
  },
]

const SERVICES = [
  'Gen AI', 'Business Intelligence', 'Data Science', 'Application Development',
  'RPA', 'Cybersecurity', 'Microsoft Technologies', 'Infrastructure'
]

export function About() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section id="about" className="relative min-h-screen px-6 md:px-12 lg:px-20 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
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
            className="text-4xl md:text-5xl font-light tracking-tight mb-6"
          >
            Global IT services.
            <br />
            <span className="text-white/50">Intelligent solutions.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-white/50 max-w-2xl mb-8"
          >
            Calance is a global IT Services firm helping clients bring their ideas to life. 
            Operating in the United States, Canada, and India with expertise across:
          </motion.p>

          {/* Services Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {SERVICES.map((service, i) => (
              <motion.span
                key={service}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-4 py-2 text-xs text-white/60 bg-white/[0.03] border border-white/[0.08] rounded-full
                           hover:border-[#c9956c]/30 hover:text-white/80 transition-all cursor-default"
              >
                {service}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Process Section */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/30 tracking-widest uppercase mb-8"
          >
            Our Process
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((step, i) => {
              const Icon = step.icon
              const isActive = activeStep === i
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'bg-[#c9956c]/10 border-[#c9956c]/30' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-3xl font-light transition-colors ${isActive ? 'text-[#c9956c]' : 'text-white/15'}`}>
                      {step.num}
                    </span>
                    <div className="w-12 h-12">
                      <Icon active={isActive} />
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-medium mb-2 transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {step.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed mb-4 transition-colors ${isActive ? 'text-white/70' : 'text-white/40'}`}>
                    {step.desc}
                  </p>
                  
                  {/* Details that appear on hover */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/10">
                      {step.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-[#c9956c] mb-1">
                          <span className="w-1 h-1 bg-[#c9956c] rounded-full" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
