'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { generateBlueprint } from '@/services/gemini'
import { DiagramViewer } from '@/components/ui/MermaidRenderer'

export function SectionBlueprint() {
  const [companyName, setCompanyName] = useState('')
  const [showDiagram, setShowDiagram] = useState(false)
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

  // ESC to close diagram
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDiagram(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <section id="blueprint" className="relative min-h-screen flex items-center">
      {/* Diagram Viewer Modal */}
      {companyData?.mermaidDiagram && (
        <DiagramViewer
          chart={companyData.mermaidDiagram}
          isOpen={showDiagram}
          onClose={() => setShowDiagram(false)}
          company={companyData.company}
        />
      )}

      {/* Content positioned left */}
      <div className="p-6 md:p-12 lg:p-20 max-w-xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/30 text-xs tracking-[0.3em] mb-6"
        >
          AI BLUEPRINT
        </motion.p>

        <AnimatePresence mode="wait">
          {!companyData ? (
            // Pre-generation state
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-6"
              >
                Get your AI roadmap
                <br />
                <span className="text-white/40">in seconds.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.2 }}
                className="text-white/40 text-sm leading-relaxed mb-8"
              >
                Enter your company name. Our AI analyzes your industry 
                and generates a custom implementation blueprint.
              </motion.p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit}
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company name"
                    disabled={isGenerating}
                    className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 text-white text-sm 
                               placeholder-white/30 focus:outline-none focus:border-[#c9956c]/50 
                               transition-colors rounded-lg"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !companyName.trim()}
                    className="px-6 py-3 bg-[#c9956c] text-white text-xs tracking-wider
                               hover:bg-[#b8855c] transition-all disabled:opacity-50 rounded-lg
                               flex items-center justify-center min-w-[100px]"
                  >
                    {isGenerating ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      'GENERATE'
                    )}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          ) : (
            // Results state
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Company header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#c9956c] rounded-lg flex items-center justify-center text-lg font-medium text-white">
                  {companyData.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white text-lg font-medium">{companyData.company}</div>
                  <div className="text-[#c9956c] text-xs tracking-wider">{companyData.industry.toUpperCase()}</div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-white/50 text-sm leading-relaxed">
                {companyData.summary}
              </p>

              {/* Solutions - unraveling list */}
              <div className="space-y-3">
                {companyData.solutions.slice(0, 4).map((solution, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-1 h-1 bg-[#c9956c] rounded-full mt-2 group-hover:scale-150 transition-transform" />
                    <div>
                      <div className="text-white/80 text-sm group-hover:text-white transition-colors">{solution.name}</div>
                      <div className="text-white/30 text-xs">{solution.impact}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => setShowDiagram(true)}
                  className="px-4 py-2 bg-white/[0.03] border border-white/10 text-white text-xs tracking-wider
                             hover:bg-white/[0.06] transition-all rounded-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  VIEW ARCHITECTURE
                </button>
                <button
                  onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#c9956c] text-xs tracking-wider hover:text-white transition-colors"
                >
                  TRY SANDBOX →
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setCompanyData(null)
                  setCompanyName('')
                }}
                className="text-white/20 text-xs hover:text-white/40 transition-colors"
              >
                Generate for another company
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
