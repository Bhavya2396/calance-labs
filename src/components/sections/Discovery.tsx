'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { generateBlueprint } from '@/services/gemini'
import { MermaidRenderer, DiagramViewer } from '@/components/ui/MermaidRenderer'

// ========================================
// AI CAPABILITY SVG ILLUSTRATIONS
// ========================================

function ConversationalAiSvg({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Chat bubbles */}
      <motion.rect 
        x="10" y="20" width="50" height="30" rx="8" 
        fill={active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.rect 
        x="60" y="55" width="50" height="30" rx="8" 
        fill={active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {/* Chat lines */}
      {[28, 35, 42].map((y, i) => (
        <motion.rect
          key={i}
          x="18" y={y} width={35 - i * 8} height="3" rx="1"
          fill={active ? '#f97316' : 'rgba(255,255,255,0.4)'}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          style={{ transformOrigin: 'left' }}
        />
      ))}
      {[63, 70, 77].map((y, i) => (
        <motion.rect
          key={i}
          x="68" y={y} width={35 - i * 8} height="3" rx="1"
          fill={active ? '#f97316' : 'rgba(255,255,255,0.4)'}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 + i * 0.1 }}
          style={{ transformOrigin: 'left' }}
        />
      ))}
      {/* AI brain indicator */}
      <motion.circle
        cx="95" cy="35" r="12"
        fill={active ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ delay: 0.8 }}
      />
      <motion.path
        d="M90 35 Q95 28 100 35 Q95 42 90 35"
        fill="none" stroke={active ? '#f97316' : 'rgba(255,255,255,0.5)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1 }}
      />
    </svg>
  )
}

function ComputerVisionSvg({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Camera/Eye frame */}
      <motion.rect
        x="20" y="15" width="80" height="60" rx="8"
        fill={active ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.05)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Scanning grid */}
      {[30, 45, 60].map((x, i) => (
        <motion.line
          key={`v${i}`}
          x1={x} y1="20" x2={x} y2="70"
          stroke={active ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        />
      ))}
      {[30, 45, 60].map((y, i) => (
        <motion.line
          key={`h${i}`}
          x1="25" y1={y} x2="95" y2={y}
          stroke={active ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        />
      ))}
      {/* Detection boxes */}
      <motion.rect
        x="35" y="30" width="25" height="30" rx="4"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.5)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      />
      <motion.rect
        x="70" y="35" width="18" height="22" rx="4"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.4)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8 }}
      />
      {/* Labels */}
      <motion.rect
        x="35" y="62" width="25" height="6" rx="2"
        fill={active ? '#f97316' : 'rgba(255,255,255,0.4)'}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9 }}
        style={{ transformOrigin: 'left' }}
      />
      {/* Eye icon */}
      <motion.circle
        cx="60" cy="85" r="8"
        fill={active ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      />
      <motion.circle
        cx="60" cy="85" r="3"
        fill={active ? '#f97316' : 'rgba(255,255,255,0.5)'}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 1.1 }}
      />
    </svg>
  )
}

function PredictiveAnalyticsSvg({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Chart area */}
      <motion.path
        d="M20 80 L20 20 L100 20"
        fill="none"
        stroke={active ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.2)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Grid lines */}
      {[35, 50, 65].map((y, i) => (
        <motion.line
          key={i}
          x1="20" y1={y} x2="100" y2={y}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        />
      ))}
      {/* Historical data line */}
      <motion.path
        d="M25 70 Q40 65 50 55 Q60 45 70 50"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.6)'} strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      {/* Prediction line (dashed) */}
      <motion.path
        d="M70 50 Q80 55 90 35 Q95 25 100 30"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.4)'} 
        strokeWidth="2.5" strokeDasharray="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      />
      {/* Confidence area */}
      <motion.path
        d="M70 50 Q80 60 90 45 Q95 35 100 40 L100 30 Q95 25 90 35 Q80 55 70 50"
        fill={active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.05)'}
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      {/* Data points */}
      {[[25, 70], [50, 55], [70, 50]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r="4"
          fill={active ? '#f97316' : 'rgba(255,255,255,0.6)'}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.7 + i * 0.15 }}
        />
      ))}
      {/* Forecast indicator */}
      <motion.text
        x="85" y="25"
        fill={active ? '#f97316' : 'rgba(255,255,255,0.4)'}
        fontSize="10" fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        AI
      </motion.text>
    </svg>
  )
}

function ProcessAutomationSvg({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Workflow nodes */}
      <motion.rect
        x="10" y="35" width="25" height="25" rx="6"
        fill={active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      />
      <motion.rect
        x="47" y="35" width="25" height="25" rx="6"
        fill={active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      />
      <motion.rect
        x="85" y="35" width="25" height="25" rx="6"
        fill={active ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.1)'}
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.3)'} strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      />
      {/* Connection arrows */}
      <motion.path
        d="M35 47.5 L42 47.5"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.4)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.path
        d="M72 47.5 L80 47.5"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.4)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* Arrow heads */}
      <motion.polygon
        points="42,44 47,47.5 42,51"
        fill={active ? '#f97316' : 'rgba(255,255,255,0.4)'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />
      <motion.polygon
        points="80,44 85,47.5 80,51"
        fill={active ? '#f97316' : 'rgba(255,255,255,0.4)'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      />
      {/* Gear icons in nodes */}
      <motion.circle
        cx="22" cy="47.5" r="6"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle
        cx="60" cy="47.5" r="6"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      {/* Output indicator */}
      <motion.path
        d="M97.5 42 L97.5 53"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.5)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8 }}
      />
      <motion.path
        d="M94 45 L97.5 42 L101 45"
        fill="none"
        stroke={active ? '#f97316' : 'rgba(255,255,255,0.5)'} strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.9 }}
      />
      {/* Speed lines */}
      {[70, 75, 80].map((y, i) => (
        <motion.line
          key={i}
          x1="20" y1={y} x2={40 + i * 15} y2={y}
          stroke={active ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.15)'} strokeWidth="2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1 + i * 0.1 }}
          style={{ transformOrigin: 'left' }}
        />
      ))}
    </svg>
  )
}

// Main illustration for the section
function BlueprintIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Central brain/network */}
      <motion.circle
        cx="200" cy="150" r="60"
        fill="rgba(249,115,22,0.1)"
        stroke="rgba(249,115,22,0.5)" strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 1 }}
      />
      <motion.circle
        cx="200" cy="150" r="40"
        fill="rgba(249,115,22,0.15)"
        stroke="rgba(249,115,22,0.6)" strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.circle
        cx="200" cy="150" r="20"
        fill="rgba(249,115,22,0.3)"
        stroke="#f97316" strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      
      {/* Connecting nodes */}
      {[
        { x: 80, y: 80, delay: 0.5 },
        { x: 320, y: 80, delay: 0.6 },
        { x: 80, y: 220, delay: 0.7 },
        { x: 320, y: 220, delay: 0.8 },
        { x: 50, y: 150, delay: 0.55 },
        { x: 350, y: 150, delay: 0.65 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.line
            x1={node.x} y1={node.y} x2="200" y2="150"
            stroke="rgba(249,115,22,0.3)" strokeWidth="1" strokeDasharray="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: node.delay, duration: 0.5 }}
          />
          <motion.circle
            cx={node.x} cy={node.y} r="15"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: node.delay + 0.3 }}
          />
        </motion.g>
      ))}
      
      {/* Data flow particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.circle
          key={i}
          r="3"
          fill="#f97316"
          initial={{ x: 80, y: 80, opacity: 0 }}
          animate={{
            x: [80, 140, 200],
            y: [80, 115, 150],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Labels */}
      <motion.text
        x="200" y="260"
        fill="rgba(255,255,255,0.4)"
        fontSize="12" textAnchor="middle" fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        AI ARCHITECTURE
      </motion.text>
    </svg>
  )
}

const AI_CAPABILITIES = [
  {
    id: 'conversational',
    title: 'Conversational AI',
    description: 'Intelligent chatbots and voice assistants that understand context and deliver human-like interactions.',
    icon: ConversationalAiSvg,
  },
  {
    id: 'vision',
    title: 'Computer Vision',
    description: 'Image and video analysis for quality control, object detection, and visual monitoring.',
    icon: ComputerVisionSvg,
  },
  {
    id: 'analytics',
    title: 'Predictive Analytics',
    description: 'Data-driven forecasting and business intelligence that anticipates market trends.',
    icon: PredictiveAnalyticsSvg,
  },
  {
    id: 'automation',
    title: 'Process Automation',
    description: 'Intelligent workflow automation that eliminates repetitive tasks and accelerates operations.',
    icon: ProcessAutomationSvg,
  },
]

export function Discovery() {
  const [companyName, setCompanyName] = useState('')
  const [showDiagramViewer, setShowDiagramViewer] = useState(false)
  const { companyData, isGenerating, setCompanyData, setIsGenerating, triggerPulse } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || isGenerating) return

    setIsGenerating(true)
    triggerPulse()
    
    const data = await generateBlueprint(companyName)
    setCompanyData(data)
    setIsGenerating(false)
    triggerPulse()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDiagramViewer(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section
      id="discovery"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-24 overflow-hidden"
    >
      {/* Fullscreen Diagram Viewer Modal */}
      {companyData?.mermaidDiagram && (
        <DiagramViewer
          chart={companyData.mermaidDiagram}
          isOpen={showDiagramViewer}
          onClose={() => setShowDiagramViewer(false)}
          company={companyData.company}
        />
      )}

      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-12">
          
          {/* Left Side - Main Message */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="text-sm text-orange-400 font-medium tracking-wider">
                // AI BLUEPRINT GENERATOR
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-white">Not sure where AI</span>
              <br />
              <span className="text-white">fits your business?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-white/60 leading-relaxed mb-8 max-w-xl"
            >
              Most businesses know AI can help — but don't know <em>where</em> to start or <em>how</em> to implement it. 
              Our AI engine analyzes your company and generates a custom blueprint in seconds.
            </motion.p>

            {/* Input Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                disabled={isGenerating}
                className="flex-1 px-5 py-4 bg-neutral-900 border border-white/20 text-white text-lg placeholder-white/40 
                           focus:outline-none focus:border-orange-500/50 transition-colors rounded-xl"
              />
              <button
                type="submit"
                disabled={isGenerating || !companyName.trim()}
                className="px-8 py-4 bg-orange-500 text-white text-sm font-semibold tracking-wider
                           hover:bg-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    ANALYZING
                  </>
                ) : (
                  <>
                    GET BLUEPRINT
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* Right Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-[400px] h-[300px]"
          >
            <BlueprintIllustration />
          </motion.div>
        </div>

        {/* Results or Capabilities Grid */}
        <AnimatePresence mode="wait">
          {companyData ? (
            // Results View
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Company Card */}
              <div className="p-6 bg-neutral-900/80 border border-white/10 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-2xl font-semibold text-white">
                      {companyData.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-2xl text-white font-medium">{companyData.company}</div>
                      <div className="text-sm text-orange-400 uppercase tracking-wider">{companyData.industry}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDiagramViewer(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white text-sm font-medium 
                                 tracking-wider hover:bg-white/20 transition-all rounded-xl"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      VIEW ARCHITECTURE
                    </button>
                    <button
                      onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                      className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white text-sm font-medium 
                                 tracking-wider hover:bg-orange-400 transition-all rounded-xl"
                    >
                      TRY IN SANDBOX
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-base text-white/70 leading-relaxed">{companyData.summary}</p>
              </div>

              {/* Solutions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {companyData.solutions.map((solution, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-neutral-900/80 border border-white/10 hover:border-orange-500/30 transition-all rounded-2xl"
                  >
                    <div className="w-16 h-16 mb-4 text-orange-400">
                      {AI_CAPABILITIES.find(c => c.id === solution.type)?.icon({ active: true }) || 
                       <ProcessAutomationSvg active />}
                    </div>
                    <h4 className="text-lg text-white font-medium mb-2">{solution.name}</h4>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">{solution.description}</p>
                    <div className="text-sm text-orange-400 font-medium">{solution.impact}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Default Capabilities View
            <motion.div
              key="capabilities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-xs text-white/40 uppercase tracking-wider mb-6">
                Explore our AI capabilities
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {AI_CAPABILITIES.map((capability, i) => {
                  const Icon = capability.icon
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
                      <div className="w-20 h-16 mb-4">
                        <Icon active={false} />
                      </div>
                      <h4 className="text-lg text-white/80 group-hover:text-white font-medium mb-2 transition-colors">
                        {capability.title}
                      </h4>
                      <p className="text-sm text-white/50 group-hover:text-white/60 leading-relaxed transition-colors">
                        {capability.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
