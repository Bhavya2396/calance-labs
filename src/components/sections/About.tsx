'use client'

import { motion } from 'framer-motion'

// ========================================
// ANIMATED PROCESS SVGs - Matching Discovery style
// ========================================

function DiscoverSvg({ active = false }: { active?: boolean }) {
  const color = active ? '#f97316' : 'rgba(255,255,255,0.4)'
  const bgColor = active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)'
  
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Magnifying glass */}
      <motion.circle 
        cx="45" cy="40" r="28" 
        fill={bgColor}
        stroke={color} strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.line 
        x1="66" y1="62" x2="95" y2="90" 
        stroke={color} strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      {/* Data points */}
      {[[35, 32], [45, 45], [55, 35]].map(([x, y], i) => (
        <motion.circle 
          key={i} 
          cx={x} cy={y} r="5" 
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.8 + i * 0.15 }}
        />
      ))}
      {/* Scan lines */}
      <motion.line 
        x1="25" y1="30" x2="65" y2="30" 
        stroke={color} strokeWidth="1.5" opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2 }}
      />
      <motion.line 
        x1="28" y1="50" x2="62" y2="50" 
        stroke={color} strokeWidth="1.5" opacity={0.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.3 }}
      />
    </svg>
  )
}

function ArchitectSvg({ active = false }: { active?: boolean }) {
  const color = active ? '#f97316' : 'rgba(255,255,255,0.4)'
  const bgColor = active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)'
  
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Blueprint frame */}
      <motion.rect 
        x="10" y="10" width="100" height="80" rx="8"
        fill={bgColor}
        stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Grid */}
      {[35, 60, 85].map((x, i) => (
        <motion.line key={`v${i}`} x1={x} y1="10" x2={x} y2="90" stroke={color} strokeWidth="1" opacity={0.3}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 + i * 0.1 }} />
      ))}
      {[30, 50, 70].map((y, i) => (
        <motion.line key={`h${i}`} x1="10" y1={y} x2="110" y2={y} stroke={color} strokeWidth="1" opacity={0.3}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 + i * 0.1 }} />
      ))}
      {/* Architecture blocks */}
      <motion.rect x="18" y="18" width="30" height="25" rx="4" fill={color} opacity={0.6}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} />
      <motion.rect x="65" y="18" width="38" height="18" rx="4" fill={color} opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
      <motion.rect x="40" y="55" width="50" height="28" rx="4" fill={color} opacity={0.5}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }} />
      {/* Connections */}
      <motion.path d="M33 43 L33 55 L40 55" fill="none" stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1 }} />
      <motion.path d="M84 36 L84 45 L90 55" fill="none" stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2 }} />
    </svg>
  )
}

function BuildSvg({ active = false }: { active?: boolean }) {
  const color = active ? '#f97316' : 'rgba(255,255,255,0.4)'
  const bgColor = active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)'
  
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Terminal window */}
      <motion.rect x="10" y="10" width="100" height="80" rx="8" fill={bgColor} stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      <motion.line x1="10" y1="28" x2="110" y2="28" stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      {/* Window buttons */}
      {[22, 34, 46].map((x, i) => (
        <motion.circle key={i} cx={x} cy="19" r="4" fill={color} opacity={0.8 - i * 0.2}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} />
      ))}
      {/* Code lines */}
      {[40, 52, 64, 76].map((y, i) => (
        <motion.rect key={i} x="20" y={y} width={[45, 60, 35, 55][i]} height="5" rx="2" fill={color} opacity={0.6}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} 
          transition={{ delay: 0.9 + i * 0.15 }} style={{ transformOrigin: 'left' }} />
      ))}
      {/* Cursor */}
      <motion.rect x="75" y="76" width="3" height="8" fill={color}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 1] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }} />
    </svg>
  )
}

function DeploySvg({ active = false }: { active?: boolean }) {
  const color = active ? '#f97316' : 'rgba(255,255,255,0.4)'
  const bgColor = active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)'
  
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Cloud */}
      <motion.path 
        d="M25 55 Q8 55 8 42 Q8 28 28 28 Q30 12 60 12 Q90 12 92 28 Q112 28 112 42 Q112 55 95 55"
        fill={bgColor} stroke={color} strokeWidth="2.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      {/* Server */}
      <motion.rect x="35" y="65" width="50" height="28" rx="6" fill={bgColor} stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <motion.line x1="35" y1="78" x2="85" y2="78" stroke={color} strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
      {/* Server lights */}
      {[45, 60, 75].map((x, i) => (
        <motion.circle key={i} cx={x} cy="85" r="3" fill={color}
          initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }}
          transition={{ delay: 1 + i * 0.15, repeat: Infinity, repeatDelay: 2 }} />
      ))}
      {/* Upload arrow */}
      <motion.path d="M60 60 L60 40" stroke={color} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2 }} />
      <motion.path d="M50 48 L60 38 L70 48" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4 }} />
    </svg>
  )
}

// Services illustration
function ServicesIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Central hub */}
      <motion.circle cx="200" cy="150" r="50" fill="rgba(249,115,22,0.15)" stroke="rgba(249,115,22,0.5)" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} />
      <motion.text x="200" y="155" fill="rgba(249,115,22,0.8)" fontSize="14" textAnchor="middle" fontWeight="500"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        CALANCE
      </motion.text>
      
      {/* Service nodes */}
      {[
        { x: 60, y: 80, label: 'Gen AI' },
        { x: 340, y: 80, label: 'BI' },
        { x: 60, y: 220, label: 'DevOps' },
        { x: 340, y: 220, label: 'RPA' },
        { x: 200, y: 40, label: 'Data Science' },
        { x: 200, y: 260, label: 'Cybersecurity' },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.line x1={node.x} y1={node.y} x2="200" y2="150"
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} />
          <motion.circle cx={node.x} cy={node.y} r="30" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} />
          <motion.text x={node.x} y={node.y + 4} fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.1 }}>
            {node.label}
          </motion.text>
        </motion.g>
      ))}
      
      {/* Animated data flow */}
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} r="4" fill="#f97316"
          initial={{ x: 60, y: 80, opacity: 0 }}
          animate={{ x: [60, 130, 200], y: [80, 115, 150], opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: i * 0.7, repeat: Infinity }} />
      ))}
    </svg>
  )
}

const PROCESS = [
  { num: '01', title: 'Discover', desc: 'Analyze your business processes and identify where AI can create the most impact.', icon: DiscoverSvg },
  { num: '02', title: 'Architect', desc: 'Design scalable solutions that integrate with your existing infrastructure.', icon: ArchitectSvg },
  { num: '03', title: 'Build', desc: 'Develop and test using DevOps best practices and cutting-edge frameworks.', icon: BuildSvg },
  { num: '04', title: 'Deploy', desc: 'Enterprise deployment with security, monitoring, and ongoing support.', icon: DeploySvg },
]

export function About() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* Header with Illustration */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-16">
          
          {/* Left - Content */}
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
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-white">Global IT services.</span>
              <br />
              <span className="text-white">Intelligent solutions.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl"
            >
              Calance is a global IT services firm providing solutions in Gen AI, Business Intelligence, 
              Data Science, Application Development, RPA, Cybersecurity, and Microsoft technologies.
              Operating in the United States, Canada, and India — helping clients bring their ideas to life.
            </motion.p>
          </div>

          {/* Right - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-[400px] h-[300px]"
          >
            <ServicesIllustration />
          </motion.div>
        </div>

        {/* Process Grid */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/40 uppercase tracking-wider mb-6"
          >
            Our Process
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-6 bg-neutral-900/60 border border-white/10 hover:border-orange-500/30 transition-all rounded-2xl group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl font-light text-white/20 group-hover:text-orange-400/40 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-20 h-16">
                      <Icon active={false} />
                    </div>
                  </div>
                  <h3 className="text-xl text-white/80 group-hover:text-white font-medium mb-2 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 group-hover:text-white/60 leading-relaxed transition-colors">
                    {step.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
