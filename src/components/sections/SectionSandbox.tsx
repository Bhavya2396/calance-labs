'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { chat, executeAgentWorkflow, analyzeData, type WorkflowStep, type AnalyticsResult } from '@/services/gemini'

// Minimal capability data
const CAPABILITIES = [
  { 
    id: 'chat', 
    title: 'Conversational AI',
    desc: 'Natural dialogue that understands context.',
    prompt: 'How can AI improve our customer experience?'
  },
  { 
    id: 'agents', 
    title: 'AI Agents',
    desc: 'Autonomous workflows that execute tasks.',
    prompt: 'Process a customer order and update inventory'
  },
  { 
    id: 'analytics', 
    title: 'Predictive Analytics',
    desc: 'Data-driven insights and forecasting.',
    prompt: 'Analyze our sales trends and predict next quarter'
  },
]

export function SectionSandbox() {
  const [activeCapability, setActiveCapability] = useState('chat')
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<string | WorkflowStep[] | AnalyticsResult | null>(null)
  const companyData = useStore((state) => state.companyData)

  const runDemo = async () => {
    setIsRunning(true)
    setResult(null)
    
    const capability = CAPABILITIES.find(c => c.id === activeCapability)
    const context = companyData 
      ? { company: companyData.company, industry: companyData.industry }
      : undefined

    try {
      if (activeCapability === 'chat') {
        const response = await chat(capability?.prompt || '', context)
        setResult(response)
      } else if (activeCapability === 'agents') {
        const steps = await executeAgentWorkflow(capability?.prompt || '', context)
        setResult(steps)
      } else if (activeCapability === 'analytics') {
        const analysis = await analyzeData(capability?.prompt || '', context)
        setResult(analysis)
      }
    } catch (error) {
      console.error('Demo error:', error)
      setResult('Demo completed. Connect your data for real insights.')
    }
    
    setIsRunning(false)
  }

  const currentCapability = CAPABILITIES.find(c => c.id === activeCapability)

  return (
    <section id="sandbox" className="relative min-h-screen flex items-center justify-end">
      {/* Content positioned right */}
      <div className="p-6 md:p-12 lg:p-20 max-w-lg">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          className="text-white/30 text-xs tracking-[0.3em] mb-6 text-right"
        >
          AI SANDBOX
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight mb-8 text-right"
        >
          Experience AI
          <br />
          <span className="text-white/40">in action.</span>
        </motion.h2>

        {/* Capability selector - minimal */}
        <div className="space-y-2 mb-8">
          {CAPABILITIES.map((cap, i) => (
            <motion.button
              key={cap.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => {
                setActiveCapability(cap.id)
                setResult(null)
              }}
              className={`w-full text-right p-4 rounded-lg border transition-all ${
                activeCapability === cap.id
                  ? 'bg-[#c9956c]/10 border-[#c9956c]/30'
                  : 'bg-transparent border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`text-sm font-medium mb-1 transition-colors ${
                activeCapability === cap.id ? 'text-white' : 'text-white/60'
              }`}>
                {cap.title}
              </div>
              <div className="text-white/30 text-xs">
                {cap.desc}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Demo area */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="p-5 bg-white/[0.02] border border-white/5 rounded-xl"
        >
          {/* Prompt */}
          <div className="text-white/40 text-xs mb-4 text-right">
            "{currentCapability?.prompt}"
          </div>

          {/* Run button */}
          {!result && (
            <button
              onClick={runDemo}
              disabled={isRunning}
              className="w-full py-3 bg-[#c9956c] text-white text-xs tracking-wider
                         hover:bg-[#b8855c] transition-all disabled:opacity-50 rounded-lg
                         flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  RUNNING
                </>
              ) : (
                'RUN DEMO'
              )}
            </button>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Chat result */}
                {activeCapability === 'chat' && typeof result === 'string' && (
                  <div className="text-white/70 text-sm leading-relaxed text-right">
                    {result}
                  </div>
                )}

                {/* Agent steps */}
                {activeCapability === 'agents' && Array.isArray(result) && (
                  <div className="space-y-2">
                    {(result as WorkflowStep[]).map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 justify-end"
                      >
                        <div className="text-right">
                          <div className="text-white/60 text-xs">{step.action}</div>
                          {step.result && (
                            <div className="text-[#c9956c] text-xs">{step.result}</div>
                          )}
                        </div>
                        <div className="w-5 h-5 bg-[#c9956c]/20 rounded flex items-center justify-center shrink-0">
                          <span className="text-[#c9956c] text-xs">{step.step}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Analytics result */}
                {activeCapability === 'analytics' && typeof result === 'object' && !Array.isArray(result) && (
                  <div className="space-y-3 text-right">
                    <div>
                      <div className="text-white/30 text-xs mb-1">INSIGHTS</div>
                      {(result as AnalyticsResult).insights?.map((insight, i) => (
                        <div key={i} className="text-white/60 text-xs">{insight}</div>
                      ))}
                    </div>
                    <div>
                      <div className="text-white/30 text-xs mb-1">FORECAST</div>
                      <div className="text-[#c9956c] text-xs">{(result as AnalyticsResult).forecast}</div>
                    </div>
                  </div>
                )}

                {/* Reset */}
                <button
                  onClick={() => setResult(null)}
                  className="w-full text-white/30 text-xs hover:text-white/50 transition-colors pt-2"
                >
                  Run again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Context indicator */}
        {companyData && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#c9956c]/50 text-xs mt-4 text-right"
          >
            Customized for {companyData.company}
          </motion.p>
        )}
      </div>
    </section>
  )
}
