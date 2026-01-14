'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { generateBlueprint } from '@/services/gemini'
import { MermaidRenderer, DiagramViewer } from '@/components/ui/MermaidRenderer'

// Consistent card style class
const cardStyle = "p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#c9956c]/20 transition-all"

const AI_CAPABILITIES = [
  {
    id: 'conversational',
    title: 'Conversational AI',
    description: 'Intelligent chatbots that understand context and deliver human-like interactions.',
  },
  {
    id: 'vision',
    title: 'Computer Vision',
    description: 'Image and video analysis for quality control and visual monitoring.',
  },
  {
    id: 'analytics',
    title: 'Predictive Analytics',
    description: 'Data-driven forecasting that anticipates market trends.',
  },
  {
    id: 'automation',
    title: 'Process Automation',
    description: 'Workflow automation that eliminates repetitive tasks.',
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
    <section id="discovery" className="relative min-h-screen px-6 md:px-12 lg:px-20 py-24">
      {/* Diagram Viewer Modal */}
      {companyData?.mermaidDiagram && (
        <DiagramViewer
          chart={companyData.mermaidDiagram}
          isOpen={showDiagramViewer}
          onClose={() => setShowDiagramViewer(false)}
          company={companyData.company}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/40 tracking-widest uppercase mb-6"
          >
            AI Blueprint Generator
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light tracking-tight mb-6"
          >
            Not sure where AI
            <br />
            <span className="text-white/50">fits your business?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-white/50 max-w-xl mb-8"
          >
            Most businesses know AI can help — but don't know where to start. 
            Our AI engine analyzes your company and generates a custom blueprint in seconds.
          </motion.p>

          {/* Input Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              disabled={isGenerating}
              className="flex-1 px-5 py-4 bg-white/[0.03] border border-white/10 text-white placeholder-white/30 
                         focus:outline-none focus:border-[#c9956c]/50 transition-colors rounded-xl"
            />
            <button
              type="submit"
              disabled={isGenerating || !companyName.trim()}
              className="px-8 py-4 bg-[#c9956c] text-white text-sm tracking-wider
                         hover:bg-[#b8855c] transition-all disabled:opacity-50 disabled:cursor-not-allowed
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
                'GET BLUEPRINT →'
              )}
            </button>
          </motion.form>
        </div>

        {/* Results or Capabilities */}
        <AnimatePresence mode="wait">
          {companyData ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Company Card */}
              <div className={cardStyle}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#c9956c] rounded-xl flex items-center justify-center text-xl font-semibold text-white">
                      {companyData.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xl text-white font-medium">{companyData.company}</div>
                      <div className="text-sm text-[#c9956c]">{companyData.industry}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDiagramViewer(true)}
                      className="px-5 py-3 bg-white/5 border border-white/10 text-white text-sm tracking-wider 
                                 hover:bg-white/10 transition-all rounded-xl"
                    >
                      VIEW ARCHITECTURE
                    </button>
                    <button
                      onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-5 py-3 bg-[#c9956c] text-white text-sm tracking-wider 
                                 hover:bg-[#b8855c] transition-all rounded-xl"
                    >
                      TRY SANDBOX →
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/60">{companyData.summary}</p>
              </div>

              {/* Solutions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {companyData.solutions.map((solution, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cardStyle}
                  >
                    <h4 className="text-base text-white font-medium mb-2">{solution.name}</h4>
                    <p className="text-sm text-white/50 mb-3">{solution.description}</p>
                    <div className="text-xs text-[#c9956c]">{solution.impact}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="capabilities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xs text-white/30 tracking-widest uppercase mb-6">
                Explore our AI capabilities
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {AI_CAPABILITIES.map((capability, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`${cardStyle} group cursor-pointer`}
                  >
                    <div className="w-10 h-10 mb-4 rounded-lg bg-white/5 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#c9956c]/50 group-hover:bg-[#c9956c] transition-colors" />
                    </div>
                    <h4 className="text-base text-white/80 group-hover:text-white font-medium mb-2 transition-colors">
                      {capability.title}
                    </h4>
                    <p className="text-sm text-white/40 group-hover:text-white/50 transition-colors">
                      {capability.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
