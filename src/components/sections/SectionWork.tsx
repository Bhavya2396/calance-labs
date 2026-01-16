'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

// SVG Visualizations for each project
function TrafficVisualization({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Grid */}
      {[40, 80, 120, 160].map((x) => (
        <motion.line key={x} x1={x} y1="0" x2={x} y2="150" stroke="rgba(201,149,108,0.1)" strokeWidth="1" />
      ))}
      {[30, 60, 90, 120].map((y) => (
        <motion.line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(201,149,108,0.1)" strokeWidth="1" />
      ))}
      
      {/* Roads */}
      <motion.path d="M0 75 L200 75" stroke={active ? 'rgba(201,149,108,0.4)' : 'rgba(255,255,255,0.1)'} strokeWidth="20"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d="M100 0 L100 150" stroke={active ? 'rgba(201,149,108,0.4)' : 'rgba(255,255,255,0.1)'} strokeWidth="20"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
      
      {/* Intersection */}
      <motion.rect x="85" y="60" width="30" height="30" fill={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} rx="4"
        initial={{ scale: 0 }} animate={{ scale: active ? [1, 1.1, 1] : 1 }} transition={{ duration: 1.5, repeat: Infinity }} />
      
      {/* Traffic nodes */}
      {[[50, 50], [150, 50], [50, 100], [150, 100]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="8" fill={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
          initial={{ scale: 0 }} animate={{ scale: 1, opacity: active ? [0.4, 1, 0.4] : 1 }}
          transition={{ scale: { delay: 0.4 + i * 0.1 }, opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 } }} />
      ))}
      
      {/* Animated vehicles */}
      {active && (
        <>
          <motion.rect width="12" height="6" fill="white" rx="1"
            initial={{ x: -15, y: 72 }} animate={{ x: 200 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
          <motion.rect width="6" height="12" fill="white" rx="1"
            initial={{ x: 97, y: -15 }} animate={{ y: 150 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }} />
        </>
      )}
    </svg>
  )
}

function MaintenanceVisualization({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Machine outline */}
      <motion.rect x="30" y="40" width="140" height="80" rx="8" fill="none" 
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      
      {/* Gears */}
      <motion.circle cx="70" cy="80" r="20" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="2"
        animate={{ rotate: active ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
      <motion.circle cx="120" cy="80" r="15" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="2"
        animate={{ rotate: active ? -360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line key={i} x1={70 + 20 * Math.cos(angle * Math.PI / 180)} y1={80 + 20 * Math.sin(angle * Math.PI / 180)}
          x2={70 + 25 * Math.cos(angle * Math.PI / 180)} y2={80 + 25 * Math.sin(angle * Math.PI / 180)}
          stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="2"
          animate={{ rotate: active ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '70px 80px' }} />
      ))}
      
      {/* Sensor readings */}
      {active && (
        <>
          <motion.path d="M150 50 Q160 60 150 70 Q140 80 150 90" fill="none" stroke="#c9956c" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} />
          <motion.circle cx="158" cy="55" r="3" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
        </>
      )}
      
      {/* Status indicator */}
      <motion.rect x="40" y="130" width="120" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
      <motion.rect x="40" y="130" rx="4" height="8" fill={active ? '#c9956c' : 'rgba(255,255,255,0.2)'}
        initial={{ width: 0 }} animate={{ width: active ? 100 : 40 }} transition={{ duration: 1.5, delay: 0.5 }} />
    </svg>
  )
}

function HealthcareVisualization({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Heart rate line */}
      <motion.path 
        d="M0 75 L30 75 L40 75 L50 50 L60 100 L70 75 L80 75 L90 75 L100 75 L110 50 L120 100 L130 75 L140 75 L200 75"
        fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
      
      {/* Data points */}
      {active && [[50, 50], [60, 100], [110, 50], [120, 100]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="4" fill="#c9956c"
          initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 0.5 + i * 0.2 }} />
      ))}
      
      {/* AI analysis box */}
      <motion.rect x="140" y="20" width="50" height="40" rx="4" fill="none"
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
      <motion.text x="165" y="35" fill={active ? '#c9956c' : 'rgba(255,255,255,0.3)'} fontSize="8" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>AI</motion.text>
      <motion.text x="165" y="50" fill={active ? '#c9956c' : 'rgba(255,255,255,0.3)'} fontSize="8" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>94%</motion.text>
      
      {/* Connection line */}
      {active && (
        <motion.path d="M130 75 L140 40" fill="none" stroke="#c9956c" strokeWidth="1" strokeDasharray="4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5 }} />
      )}
      
      {/* Bottom stats */}
      {[20, 60, 100, 140].map((x, i) => (
        <motion.rect key={i} x={x} y={120} width="30" height="20" rx="3" fill={active && i < 3 ? 'rgba(201,149,108,0.2)' : 'rgba(255,255,255,0.05)'}
          stroke={active ? 'rgba(201,149,108,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1"
          initial={{ opacity: 0, y: 130 }} animate={{ opacity: 1, y: 120 }} transition={{ delay: 0.3 + i * 0.1 }} />
      ))}
    </svg>
  )
}

function EcommerceVisualization({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      {/* Chat bubbles */}
      <motion.rect x="10" y="20" width="70" height="35" rx="8" fill={active ? 'rgba(201,149,108,0.15)' : 'rgba(255,255,255,0.05)'}
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />
      <motion.rect x="120" y="60" width="70" height="35" rx="8" fill={active ? 'rgba(201,149,108,0.15)' : 'rgba(255,255,255,0.05)'}
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.3 }} />
      <motion.rect x="10" y="100" width="70" height="35" rx="8" fill={active ? 'rgba(201,149,108,0.15)' : 'rgba(255,255,255,0.05)'}
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.6 }} />
      
      {/* Text lines */}
      {[28, 35, 42].map((y, i) => (
        <motion.rect key={i} x="18" y={y} width={40 - i * 8} height="3" rx="1" fill={active ? '#c9956c' : 'rgba(255,255,255,0.3)'}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 + i * 0.1 }} style={{ transformOrigin: 'left' }} />
      ))}
      {[68, 75, 82].map((y, i) => (
        <motion.rect key={i} x="128" y={y} width={45 - i * 10} height="3" rx="1" fill={active ? '#c9956c' : 'rgba(255,255,255,0.3)'}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7 + i * 0.1 }} style={{ transformOrigin: 'left' }} />
      ))}
      
      {/* AI brain */}
      <motion.circle cx="100" cy="75" r="20" fill={active ? 'rgba(201,149,108,0.2)' : 'rgba(255,255,255,0.05)'}
        stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.text x="100" y="79" fill={active ? '#c9956c' : 'rgba(255,255,255,0.4)'} fontSize="10" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>AI</motion.text>
      
      {/* Connection lines */}
      {active && (
        <>
          <motion.path d="M80 37 L85 65" stroke="#c9956c" strokeWidth="1" strokeDasharray="3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
          <motion.path d="M120 77 L115 77" stroke="#c9956c" strokeWidth="1" strokeDasharray="3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} />
          <motion.path d="M80 117 L85 85" stroke="#c9956c" strokeWidth="1" strokeDasharray="3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1 }} />
        </>
      )}
    </svg>
  )
}

const PROJECTS = [
  {
    id: 1,
    client: 'Ujjain Smart City',
    year: '2024',
    title: 'AI-Powered Traffic Management',
    description: 'Computer vision system deployed across 50+ city intersections for real-time traffic optimization, congestion detection, and automated signal control. Reduced average commute times by 23%.',
    impact: '23% faster commutes',
    tech: ['Computer Vision', 'Edge Computing', 'IoT'],
    visualization: TrafficVisualization,
  },
  {
    id: 2,
    client: 'Indian Railways',
    year: '2023',
    title: 'Predictive Maintenance Platform',
    description: 'Machine learning system analyzing sensor data from 10,000+ equipment units to predict failures 48 hours in advance. Prevented 340 potential breakdowns in first year.',
    impact: '40% less downtime',
    tech: ['Predictive Analytics', 'Sensor Fusion', 'ML'],
    visualization: MaintenanceVisualization,
  },
  {
    id: 3,
    client: 'Healthcare Network',
    year: '2024',
    title: 'Clinical Decision Support AI',
    description: 'AI assistant for healthcare professionals analyzing patient data, medical history, and latest research to provide evidence-based diagnosis recommendations.',
    impact: '94% accuracy',
    tech: ['NLP', 'Medical AI', 'Decision Support'],
    visualization: HealthcareVisualization,
  },
  {
    id: 4,
    client: 'E-commerce Platform',
    year: '2023',
    title: 'Intelligent Customer Service',
    description: 'Conversational AI handling 80% of customer inquiries autonomously across chat, email, and voice channels. Supports 12 languages with context-aware responses.',
    impact: '80% automation',
    tech: ['Conversational AI', 'Multi-channel', 'NLU'],
    visualization: EcommerceVisualization,
  },
]

export function SectionWork() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = PROJECTS[activeIndex]
  const Visualization = activeProject.visualization

  return (
    <section id="work" className="relative min-h-screen py-20">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-xs tracking-[0.3em] mb-6"
          >
            OUR WORK
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light leading-[1.1] tracking-tight mb-4"
          >
            <span className="text-[#f9a86c]">Real solutions.</span>
            <br />
            <span className="text-white/50">Real impact.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/50 text-sm max-w-lg"
          >
            We've helped organizations across industries transform their operations 
            with AI-powered solutions that deliver measurable results.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Project selector */}
          <div className="space-y-3">
            {PROJECTS.map((project, i) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveIndex(i)}
                className={`w-full text-left p-5 rounded-xl border transition-all ${
                  activeIndex === i
                    ? 'bg-[#c9956c]/10 border-[#c9956c]/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${activeIndex === i ? 'text-white' : 'text-white/60'}`}>
                    {project.client}
                  </span>
                  <span className="text-white/30 text-xs">{project.year}</span>
                </div>
                <div className={`text-sm mb-2 ${activeIndex === i ? 'text-white/80' : 'text-white/50'}`}>
                  {project.title}
                </div>
                {activeIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-3 border-t border-white/5 mt-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2 py-1 text-xs text-[#c9956c] bg-[#c9956c]/10 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Project details */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
              {/* Visualization */}
              <div className="h-[200px] p-6 border-b border-white/5 bg-black/20">
                <Visualization active={true} />
              </div>
              
              {/* Details */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[#f9a86c] text-xs tracking-wider mb-1">{activeProject.client}</p>
                  <h3 className="text-xl text-white font-medium">{activeProject.title}</h3>
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed">
                  {activeProject.description}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#f9a86c] rounded-full" />
                    <span className="text-white font-medium">{activeProject.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
