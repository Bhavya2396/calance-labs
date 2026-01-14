'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { generateBlueprint } from '@/services/gemini'
import { MermaidRenderer, DiagramViewer } from '@/components/ui/MermaidRenderer'

// Solution type icons
const SOLUTION_ICONS: Record<string, JSX.Element> = {
  agentic: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  vision: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  nlp: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  analytics: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  automation: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
}

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
        {/* Top Row: Header + Form | Company Info + Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          
          {/* Left Side - Header & Form */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="text-sm text-orange-400 font-medium tracking-wider">
                // AI DISCOVERY
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-8"
            >
              <span className="text-white">Your AI blueprint.</span>
            </motion.h2>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex gap-3"
            >
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                disabled={isGenerating}
                className="flex-1 px-5 py-4 bg-neutral-900 border border-white/20 text-white text-lg placeholder-white/40 
                           focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isGenerating || !companyName.trim()}
                className="px-8 py-4 bg-white text-black text-sm font-semibold tracking-wider
                           hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    />
                    ANALYZING
                  </>
                ) : (
                  'GENERATE'
                )}
              </button>
            </motion.form>
          </div>

          {/* Right Side - Company Result Card (when data exists) */}
          {companyData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:max-w-md p-6 bg-neutral-900 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-orange-500 flex items-center justify-center text-2xl font-semibold text-white">
                  {companyData.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xl text-white font-medium">{companyData.company}</div>
                  <div className="text-sm text-orange-400 uppercase tracking-wider">{companyData.industry}</div>
                </div>
              </div>
              
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                {companyData.summary}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDiagramViewer(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white text-sm font-medium 
                             tracking-wider hover:bg-white/20 transition-all"
                >
                  VIEW ARCHITECTURE
                </button>
                <button
                  onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white text-sm font-medium 
                             tracking-wider hover:bg-orange-400 transition-all"
                >
                  TRY IN SANDBOX
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content: Solutions Grid + Architecture Diagram */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          
          {/* Solutions Grid - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {companyData ? (
              companyData.solutions.map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-neutral-900 border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <div className="text-orange-400 mb-4">
                    {SOLUTION_ICONS[solution.type] || SOLUTION_ICONS.automation}
                  </div>
                  <h4 className="text-lg text-white font-medium mb-2">{solution.name}</h4>
                  <p className="text-sm text-white/60 leading-relaxed mb-4">{solution.description}</p>
                  <div className="text-sm text-orange-400 font-medium">{solution.impact}</div>
                </motion.div>
              ))
            ) : (
              // Empty state placeholder cards - SAME DARK STYLE
              [
                { title: 'Conversational AI', desc: 'Intelligent chatbots and voice assistants for customer engagement' },
                { title: 'Computer Vision', desc: 'Image and video analysis for quality control and monitoring' },
                { title: 'Predictive Analytics', desc: 'Data-driven forecasting and business intelligence' },
                { title: 'Process Automation', desc: 'Intelligent workflow automation and task execution' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-neutral-900 border border-white/10"
                >
                  <div className="text-white/40 mb-4">
                    {Object.values(SOLUTION_ICONS)[i]}
                  </div>
                  <h4 className="text-lg text-white/60 font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 text-sm text-white/30 italic">Enter a company to see specific use cases</div>
                </div>
              ))
            )}
          </motion.div>

          {/* Architecture Diagram - Always visible */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900 border border-white/10 p-4 min-h-[400px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
                System Architecture
              </span>
              {companyData && (
                <button
                  onClick={() => setShowDiagramViewer(true)}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  EXPAND
                </button>
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {companyData?.mermaidDiagram ? (
                <div className="w-full h-full">
                  <MermaidRenderer chart={companyData.mermaidDiagram} />
                </div>
              ) : (
                <div className="text-center p-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <p className="text-sm text-white/30">Enter a company name to generate architecture</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
