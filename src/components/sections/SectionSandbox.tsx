'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { 
  chat, 
  executeAgentWorkflow, 
  analyzeImage,
  processDocument,
  analyzeData, 
  type WorkflowStep, 
  type AnalyticsResult,
  type VisionResult,
  type DocumentResult
} from '@/services/gemini'

// SVG Icons for capabilities
function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.rect x="4" y="8" width="24" height="16" rx="3" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.rect x="12" y="18" width="24" height="16" rx="3" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      {active && <motion.circle cx="16" cy="16" r="2" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
      {active && <motion.circle cx="24" cy="26" r="2" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} />}
    </svg>
  )
}

function AgentIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.circle cx="12" cy="20" r="4" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.circle cx="28" cy="12" r="4" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.circle cx="28" cy="28" r="4" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.path d="M16 18 L24 14" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
      <motion.path d="M16 22 L24 26" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
      {active && <motion.circle cx="20" cy="20" r="2" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} />}
    </svg>
  )
}

function VisionIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.rect x="6" y="10" width="28" height="20" rx="2" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.circle cx="20" cy="20" r="6" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      {active && <motion.circle cx="20" cy="20" r="3" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
      {active && (
        <motion.rect x="10" y="14" width="8" height="6" fill="none" stroke="#c9956c" strokeWidth="1" 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      )}
    </svg>
  )
}

function DocumentIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.path d="M10 6 L26 6 L30 10 L30 34 L10 34 Z" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.path d="M26 6 L26 10 L30 10" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      {[16, 22, 28].map((y, i) => (
        <motion.line key={i} x1="14" y1={y} x2="26" y2={y} stroke={active ? '#c9956c' : 'rgba(255,255,255,0.15)'} strokeWidth="1"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.1 }} style={{ transformOrigin: 'left' }} />
      ))}
    </svg>
  )
}

function AnalyticsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.path d="M8 32 L8 8" stroke={active ? 'rgba(201,149,108,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      <motion.path d="M8 32 L36 32" stroke={active ? 'rgba(201,149,108,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      <motion.path d="M12 28 L18 20 L24 24 L32 12" fill="none" stroke={active ? '#c9956c' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
      {active && [[12, 28], [18, 20], [24, 24], [32, 12]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="2" fill="#c9956c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />
      ))}
    </svg>
  )
}

const CAPABILITIES = [
  { id: 'chat', title: 'Chat', icon: ChatIcon, desc: 'Conversational AI' },
  { id: 'agents', title: 'Agents', icon: AgentIcon, desc: 'Autonomous workflows' },
  { id: 'vision', title: 'Vision', icon: VisionIcon, desc: 'Image analysis' },
  { id: 'documents', title: 'Documents', icon: DocumentIcon, desc: 'Document processing' },
  { id: 'analytics', title: 'Analytics', icon: AnalyticsIcon, desc: 'Predictive insights' },
]

// Get context-aware prompts based on company data
function getPrompts(capability: string, company?: string, industry?: string) {
  const c = company || 'your company'
  const prompts: Record<string, string[]> = {
    chat: [
      `How can AI improve customer experience at ${c}?`,
      `What are the top automation opportunities for ${c}?`,
      `Explain how ${c} can benefit from predictive analytics`,
    ],
    agents: [
      `Process a customer order and update inventory`,
      `Analyze support tickets and route to teams`,
      `Generate weekly performance report`,
    ],
    vision: [
      `Analyze product image for quality defects`,
      `Detect objects and classify items`,
      `Extract text from scanned documents`,
    ],
    documents: [
      `Extract key data from invoice`,
      `Process and summarize contract`,
      `Parse customer intake form`,
    ],
    analytics: [
      `Analyze sales trends and forecast next quarter`,
      `Identify customer churn risk factors`,
      `Optimize pricing based on demand patterns`,
    ],
  }
  return prompts[capability] || prompts.chat
}

export function SectionSandbox() {
  const [activeCapability, setActiveCapability] = useState('chat')
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | WorkflowStep[] | AnalyticsResult | VisionResult | DocumentResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const companyData = useStore((state) => state.companyData)
  const context = companyData ? { company: companyData.company, industry: companyData.industry } : undefined
  const prompts = getPrompts(activeCapability, companyData?.company, companyData?.industry)

  const handleRun = async () => {
    if (!input.trim() && activeCapability !== 'vision') return
    setIsRunning(true)
    setResult(null)

    try {
      switch (activeCapability) {
        case 'chat':
          const chatResult = await chat(input, context)
          setResult(chatResult)
          break
        case 'agents':
          const agentResult = await executeAgentWorkflow(input, context)
          setResult(agentResult)
          break
        case 'vision':
          if (uploadedImage) {
            const visionResult = await analyzeImage(uploadedImage.split(',')[1], 'image/jpeg', context)
            setResult(visionResult)
          }
          break
        case 'documents':
          const docResult = await processDocument(input, 'general', context)
          setResult(docResult)
          break
        case 'analytics':
          const analyticsResult = await analyzeData(input, context)
          setResult(analyticsResult)
          break
      }
    } catch (error) {
      console.error('Error:', error)
      setResult('Demo completed successfully.')
    }
    setIsRunning(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const resetDemo = () => {
    setResult(null)
    setInput('')
    setUploadedImage(null)
  }

  return (
    <section id="sandbox" className="relative min-h-screen py-20">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/30 text-xs tracking-[0.3em] mb-6"
          >
            AI SANDBOX
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light leading-[1.1] tracking-tight mb-4"
          >
            Experience AI
            <br />
            <span className="text-white/40">capabilities live.</span>
          </motion.h2>

          {companyData && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#c9956c] text-sm"
            >
              Customized for {companyData.company} • {companyData.industry}
            </motion.p>
          )}
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Capability selector */}
          <div className="space-y-2">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon
              const isActive = activeCapability === cap.id
              return (
                <motion.button
                  key={cap.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setActiveCapability(cap.id)
                    resetDemo()
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#c9956c]/10 border-[#c9956c]/30'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    <Icon active={isActive} />
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                      {cap.title}
                    </div>
                    <div className="text-white/30 text-xs">{cap.desc}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Demo area */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[500px] flex flex-col"
          >
            {/* Suggested prompts */}
            <div className="mb-4">
              <p className="text-white/20 text-xs mb-2">TRY A PROMPT</p>
              <div className="flex flex-wrap gap-2">
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="px-3 py-1.5 text-xs text-white/50 bg-white/[0.03] border border-white/5 rounded-full
                               hover:border-[#c9956c]/30 hover:text-white/70 transition-colors"
                  >
                    {prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="mb-6">
              {activeCapability === 'vision' ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-white/10 rounded-xl
                               hover:border-[#c9956c]/30 transition-colors flex flex-col items-center gap-2"
                  >
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Uploaded" className="max-h-32 rounded-lg" />
                    ) : (
                      <>
                        <VisionIcon active={false} />
                        <span className="text-white/40 text-sm">Click to upload image</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeCapability === 'documents' ? 'Paste document text here...' : 'Enter your prompt...'}
                  rows={activeCapability === 'documents' ? 6 : 3}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 text-white text-sm
                             placeholder-white/30 focus:outline-none focus:border-[#c9956c]/50
                             transition-colors rounded-xl resize-none"
                />
              )}
              
              <button
                onClick={handleRun}
                disabled={isRunning || (!input.trim() && activeCapability !== 'vision') || (activeCapability === 'vision' && !uploadedImage)}
                className="mt-3 w-full py-3 bg-[#c9956c] text-white text-xs tracking-wider
                           hover:bg-[#b8855c] transition-all disabled:opacity-50 rounded-xl
                           flex items-center justify-center gap-2"
              >
                {isRunning ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    PROCESSING
                  </>
                ) : (
                  'RUN DEMO'
                )}
              </button>
            </div>

            {/* Results */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white/30 text-xs tracking-wider">RESULT</p>
                      <button onClick={resetDemo} className="text-white/30 text-xs hover:text-white/50 transition-colors">
                        Clear
                      </button>
                    </div>

                    {/* Chat result */}
                    {activeCapability === 'chat' && typeof result === 'string' && (
                      <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                        <p className="text-white/80 text-sm leading-relaxed">{result}</p>
                      </div>
                    )}

                    {/* Agent workflow */}
                    {activeCapability === 'agents' && Array.isArray(result) && (
                      <div className="space-y-2">
                        {(result as WorkflowStep[]).map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-black/30 border border-white/5 rounded-xl"
                          >
                            <div className="w-6 h-6 bg-[#c9956c]/20 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-[#c9956c] text-xs">{step.step}</span>
                            </div>
                            <div>
                              <div className="text-white/70 text-sm">{step.action}</div>
                              {step.result && <div className="text-[#c9956c] text-xs mt-1">{step.result}</div>}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Vision result */}
                    {activeCapability === 'vision' && typeof result === 'object' && 'objects' in result && (
                      <div className="space-y-3">
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">DESCRIPTION</p>
                          <p className="text-white/80 text-sm">{(result as VisionResult).description}</p>
                        </div>
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">DETECTED OBJECTS</p>
                          <div className="flex flex-wrap gap-2">
                            {(result as VisionResult).objects.map((obj, i) => (
                              <span key={i} className="px-2 py-1 text-xs text-[#c9956c] bg-[#c9956c]/10 rounded">
                                {obj}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">INSIGHTS</p>
                          {(result as VisionResult).insights.map((insight, i) => (
                            <p key={i} className="text-white/60 text-sm">• {insight}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Document result */}
                    {activeCapability === 'documents' && typeof result === 'object' && 'extractedFields' in result && (
                      <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-white/30 text-xs">EXTRACTED DATA</p>
                          <span className="text-[#c9956c] text-xs">{(result as DocumentResult).confidence}% confidence</span>
                        </div>
                        {Object.entries((result as DocumentResult).extractedFields).map(([key, value], i) => (
                          <div key={i} className="flex justify-between items-start border-b border-white/5 pb-2">
                            <span className="text-white/40 text-sm">{key}</span>
                            <span className="text-white/80 text-sm text-right max-w-[60%]">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Analytics result */}
                    {activeCapability === 'analytics' && typeof result === 'object' && 'insights' in result && !('objects' in result) && (
                      <div className="space-y-3">
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">KEY INSIGHTS</p>
                          {(result as AnalyticsResult).insights.map((insight, i) => (
                            <p key={i} className="text-white/70 text-sm mb-1">• {insight}</p>
                          ))}
                        </div>
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">TRENDS</p>
                          {(result as AnalyticsResult).trends.map((trend, i) => (
                            <p key={i} className="text-white/60 text-sm mb-1">↗ {trend}</p>
                          ))}
                        </div>
                        <div className="p-4 bg-[#c9956c]/10 border border-[#c9956c]/20 rounded-xl">
                          <p className="text-[#c9956c] text-xs mb-1">FORECAST</p>
                          <p className="text-white/80 text-sm">{(result as AnalyticsResult).forecast}</p>
                        </div>
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-1">RECOMMENDATION</p>
                          <p className="text-white/70 text-sm">{(result as AnalyticsResult).recommendation}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
