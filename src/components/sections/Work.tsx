'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

// ========================================
// PROJECT DATA
// ========================================

const PROJECTS = [
  {
    id: 1,
    client: 'Ujjain Smart City',
    year: '2024',
    title: 'AI-Powered Traffic Management',
    description: 'Computer vision system deployed across city intersections for real-time traffic optimization, congestion detection, and automated signal control.',
    impact: 'Reduced Urban Congestion',
    color: '#ff8800',
  },
  {
    id: 2,
    client: 'Indian Railways',
    year: '2023',
    title: 'Predictive Maintenance Platform',
    description: 'Machine learning system for equipment monitoring that predicts failures before they occur, analyzing sensor data and operational patterns.',
    impact: 'Improved Operational Efficiency',
    color: '#ff7700',
  },
  {
    id: 3,
    client: 'Healthcare Network',
    year: '2024',
    title: 'Clinical Decision Support AI',
    description: 'AI assistant for healthcare professionals providing evidence-based diagnosis recommendations by analyzing patient data and medical history.',
    impact: 'Enhanced Diagnostic Accuracy',
    color: '#ff9933',
  },
  {
    id: 4,
    client: 'E-commerce Platform',
    year: '2023',
    title: 'Intelligent Customer Service',
    description: 'Conversational AI handling customer inquiries, order tracking, and recommendations with natural language understanding across channels.',
    impact: 'Streamlined Customer Support',
    color: '#ffaa44',
  },
]

// ========================================
// SVG VISUALIZATIONS
// ========================================

function TrafficViz({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      {/* Grid background */}
      {[50, 100, 150, 200, 250].map((x) => (
        <motion.line key={`v-${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,136,0,0.1)" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.3 }} transition={{ duration: 0.5 }} />
      ))}
      {[40, 80, 120, 160].map((y) => (
        <motion.line key={`h-${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,136,0,0.1)" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.3 }} transition={{ duration: 0.5 }} />
      ))}
      
      {/* Main roads */}
      <motion.path d="M0 100 L300 100" stroke="rgba(255,136,0,0.4)" strokeWidth="24"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 1 }} />
      <motion.path d="M150 0 L150 200" stroke="rgba(255,136,0,0.4)" strokeWidth="24"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 1, delay: 0.2 }} />
      
      {/* Intersection center */}
      <motion.rect x="138" y="88" width="24" height="24" fill="#ff8800"
        initial={{ scale: 0 }} animate={{ scale: active ? [1, 1.1, 1] : 0 }}
        transition={{ duration: 2, repeat: Infinity }} />
      
      {/* Traffic nodes */}
      {[[75, 70], [225, 70], [75, 130], [225, 130], [150, 40], [150, 160]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="10" fill="#ff8800"
          initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0, opacity: active ? [0.5, 1, 0.5] : 0 }}
          transition={{ scale: { delay: 0.5 + i * 0.1 }, opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 } }} />
      ))}
      
      {/* Moving vehicles */}
      {active && [0, 1, 2].map((i) => (
        <motion.rect key={`car-h-${i}`} width="12" height="6" fill="#fff" rx="1"
          initial={{ x: -20, y: 97 }} animate={{ x: [-20, 320] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 1.2, ease: 'linear' }} />
      ))}
      {active && [0, 1].map((i) => (
        <motion.rect key={`car-v-${i}`} width="6" height="12" fill="#fff" rx="1"
          initial={{ x: 147, y: -20 }} animate={{ y: [-20, 220] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 2, ease: 'linear' }} />
      ))}
    </svg>
  )
}

function MaintenanceViz({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      {/* Train body */}
      <motion.rect x="40" y="60" width="220" height="80" rx="12" fill="none" stroke="rgba(255,119,0,0.6)" strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 1 }} />
      
      {/* Front cabin */}
      <motion.path d="M40 60 L40 140 L20 160 L20 80 Q20 60 40 60" fill="none" stroke="rgba(255,119,0,0.6)" strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.3 }} />
      
      {/* Windows */}
      {[80, 130, 180, 230].map((x, i) => (
        <motion.rect key={i} x={x} y="75" width="30" height="20" fill="rgba(255,119,0,0.2)" stroke="#ff7700" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.3 }} transition={{ delay: 0.5 + i * 0.1 }} />
      ))}
      
      {/* Wheels */}
      {[60, 120, 180, 240].map((x, i) => (
        <motion.circle key={i} cx={x} cy="150" r="12" fill="none" stroke="#ff7700" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ delay: 0.8 + i * 0.1 }} />
      ))}
      
      {/* Sensor points with data lines */}
      {[[70, 100], [120, 100], [170, 100], [220, 100]].map(([x, y], i) => (
        <g key={i}>
          <motion.circle cx={x} cy={y} r="8" fill="#ff7700"
            initial={{ scale: 0 }} animate={{ scale: active ? [1, 1.4, 1] : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
          {active && (
            <motion.line x1={x} y1={y + 12} x2={x} y2="180" stroke="#ff7700" strokeWidth="1" strokeDasharray="3 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.2 }} />
          )}
        </g>
      ))}
      
      {/* Data collection bar */}
      <motion.rect x="60" y="185" width="180" height="8" rx="4" fill="rgba(255,119,0,0.3)"
        initial={{ scaleX: 0 }} animate={{ scaleX: active ? 1 : 0 }} transition={{ delay: 1.5, duration: 0.5 }} style={{ transformOrigin: 'left' }} />
    </svg>
  )
}

function HealthcareViz({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      {/* Brain/head outline */}
      <motion.ellipse
        cx="100" cy="55" rx="45" ry="40"
        fill="none"
        stroke="rgba(255,153,51,0.6)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      />
      
      {/* Neural connections */}
      {[[80, 45], [100, 35], [120, 45], [85, 60], [115, 60], [100, 70]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="4"
          fill="#ff9933"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: active ? 1 : 0, 
            opacity: active ? [0.4, 1, 0.4] : 0 
          }}
          transition={{ 
            scale: { duration: 0.3, delay: 0.8 + i * 0.1 },
            opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.2 }
          }}
        />
      ))}
      
      {/* Pulse indicator */}
      <motion.path
        d="M60 100 L80 100 L90 85 L100 115 L110 85 L120 100 L140 100"
        fill="none"
        stroke="#ff9933"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  )
}

function CommerceViz({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      {/* Chat bubbles */}
      <motion.rect
        x="20" y="20" width="70" height="40" rx="8"
        fill="none"
        stroke="rgba(255,170,68,0.6)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.rect
        x="110" y="50" width="70" height="40" rx="8"
        fill="none"
        stroke="rgba(255,170,68,0.6)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      
      {/* Message indicators */}
      {[[35, 35], [50, 35], [65, 35], [125, 65], [140, 65], [155, 65]].map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x - 5}
          y={y}
          width="10"
          height="3"
          rx="1"
          fill="#ffaa44"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
        />
      ))}
      
      {/* Connection arrow */}
      <motion.path
        d="M90 45 Q100 55 110 65"
        fill="none"
        stroke="#ffaa44"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
    </svg>
  )
}

const VISUALIZATIONS = [TrafficViz, MaintenanceViz, HealthcareViz, CommerceViz]

// ========================================
// MAIN COMPONENT
// ========================================

export function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { setActiveWorkIndex, triggerPulse } = useStore()

  useEffect(() => {
    setActiveWorkIndex(activeIndex)
  }, [activeIndex, setActiveWorkIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROJECTS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    triggerPulse()
    setActiveIndex((activeIndex + 1) % PROJECTS.length)
  }

  const prevSlide = () => {
    triggerPulse()
    setActiveIndex((activeIndex - 1 + PROJECTS.length) % PROJECTS.length)
  }

  const project = PROJECTS[activeIndex]
  const Visualization = VISUALIZATIONS[activeIndex]

  return (
    <section
      id="work"
      className="relative min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 overflow-hidden"
    >
      {/* Bottom Content Layout */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          
          {/* Left Side - Project Info */}
          <div className="max-w-xl">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="text-sm text-orange-400 font-medium tracking-wider">
                // OUR WORK
              </span>
            </motion.div>

            {/* Project Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Client & Year */}
                <div className="flex items-center gap-4">
                  <span className="text-xl text-white font-medium">{project.client}</span>
                  <span className="text-sm text-orange-400 font-medium">{project.year}</span>
                </div>

                {/* Title - Larger */}
                <h3 className="text-4xl md:text-5xl lg:text-6xl text-white font-light leading-[1.05] tracking-tight">
                  {project.title}
                </h3>

                {/* Description - Larger */}
                <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-lg">
                  {project.description}
                </p>

                {/* Impact - In a box */}
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-neutral-900 border border-white/10">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-base font-medium" style={{ color: project.color }}>
                    {project.impact}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 border border-white/20 flex items-center justify-center 
                           hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Progress Dots */}
              <div className="flex gap-2">
                {PROJECTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      triggerPulse()
                      setActiveIndex(i)
                    }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-8 bg-orange-500'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextSlide}
                className="w-12 h-12 border border-white/20 flex items-center justify-center 
                           hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side - Visualization - DOUBLED SIZE */}
          <div className="max-w-2xl w-full">
            <div className="w-full aspect-[16/10] bg-neutral-900 border border-white/10 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Visualization active={true} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
