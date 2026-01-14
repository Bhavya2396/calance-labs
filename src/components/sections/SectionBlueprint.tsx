'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { generateBlueprint } from '@/services/gemini'
import { MermaidRenderer } from '@/components/ui/MermaidRenderer'

// Inline zoomable diagram component
function InlineDiagram({ chart, company }: { chart: string; company: string }) {
  const [zoom, setZoom] = useState(0.8)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }, [position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.4, Math.min(2, prev + delta)))
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      {/* Inline preview */}
      <div className="relative">
        {/* Controls */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
            className="p-1.5 bg-black/50 hover:bg-black/70 rounded text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="px-2 py-1 bg-black/50 rounded text-white/40 text-xs">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.2))}
            className="p-1.5 bg-black/50 hover:bg-black/70 rounded text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 bg-black/50 hover:bg-black/70 rounded text-white/60 hover:text-white transition-colors ml-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        {/* Diagram container */}
        <div
          className="h-[280px] overflow-hidden bg-black/30 border border-white/5 rounded-lg cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="w-full h-full flex items-center justify-center p-4"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <MermaidRenderer chart={chart} />
          </div>
        </div>
        <p className="text-white/20 text-xs mt-2 text-center">Drag to pan • Scroll to zoom • Click expand for fullscreen</p>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div>
                <h3 className="text-white font-medium">AI Architecture</h3>
                <p className="text-sm text-[#c9956c]">{company}</p>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="max-w-4xl w-full">
                <MermaidRenderer chart={chart} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function SectionBlueprint() {
  const [companyName, setCompanyName] = useState('')
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

  return (
    <section id="blueprint" className="relative min-h-screen py-20">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left column - Input and results */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/30 text-xs tracking-[0.3em] mb-6"
            >
              AI BLUEPRINT
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-light leading-[1.1] tracking-tight mb-6"
            >
              Your AI roadmap
              <br />
              <span className="text-white/40">generated instantly.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/40 text-sm leading-relaxed mb-8"
            >
              Enter your company name. Our AI analyzes your industry and generates 
              a custom implementation blueprint with architecture diagram.
            </motion.p>

            {/* Input form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="mb-8"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
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
                             flex items-center justify-center min-w-[110px]"
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

            {/* Results */}
            <AnimatePresence mode="wait">
              {companyData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Company header */}
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-[#c9956c] rounded-lg flex items-center justify-center text-lg font-medium text-white">
                      {companyData.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{companyData.company}</div>
                      <div className="text-[#c9956c] text-xs tracking-wider">{companyData.industry.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-white/50 text-sm leading-relaxed">
                    {companyData.summary}
                  </p>

                  {/* Solutions */}
                  <div className="space-y-3">
                    <p className="text-white/20 text-xs tracking-wider">RECOMMENDED SOLUTIONS</p>
                    {companyData.solutions.map((solution, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-[#c9956c]/20 transition-colors"
                      >
                        <div className="w-6 h-6 bg-[#c9956c]/20 rounded flex items-center justify-center shrink-0">
                          <span className="text-[#c9956c] text-xs">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white/80 text-sm font-medium">{solution.name}</div>
                          <div className="text-white/40 text-xs mt-1">{solution.description}</div>
                          <div className="text-[#c9956c] text-xs mt-2">{solution.impact}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA to sandbox */}
                  <button
                    onClick={() => document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3 border border-[#c9956c]/30 text-[#c9956c] text-xs tracking-wider
                               hover:bg-[#c9956c]/10 transition-all rounded-lg"
                  >
                    TRY THESE SOLUTIONS IN SANDBOX →
                  </button>

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

          {/* Right column - Architecture diagram */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {companyData?.mermaidDiagram ? (
                <motion.div
                  key="diagram"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <p className="text-white/30 text-xs tracking-[0.3em] mb-4">ARCHITECTURE DIAGRAM</p>
                  <InlineDiagram chart={companyData.mermaidDiagram} company={companyData.company} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[350px] border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center"
                >
                  <svg className="w-16 h-16 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  <p className="text-white/30 text-sm">Architecture diagram will appear here</p>
                  <p className="text-white/20 text-xs mt-1">Enter a company name to generate</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
