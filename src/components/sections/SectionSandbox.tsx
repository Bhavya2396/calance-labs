'use client'

import { useState, useRef, useEffect } from 'react'
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

// ========================================
// CAPABILITY ICONS
// ========================================

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.rect x="4" y="8" width="24" height="16" rx="3" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.rect x="12" y="18" width="24" height="16" rx="3" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      {active && <motion.circle cx="16" cy="16" r="2" fill="#f9a86c" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
      {active && <motion.circle cx="24" cy="26" r="2" fill="#f9a86c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} />}
    </svg>
  )
}

function AgentIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.circle cx="12" cy="20" r="4" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.circle cx="28" cy="12" r="4" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.circle cx="28" cy="28" r="4" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.path d="M16 18 L24 14" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
      <motion.path d="M16 22 L24 26" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
      {active && <motion.circle cx="20" cy="20" r="2" fill="#f9a86c" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} />}
    </svg>
  )
}

function VisionIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.rect x="6" y="10" width="28" height="20" rx="2" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.circle cx="20" cy="20" r="6" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      {active && <motion.circle cx="20" cy="20" r="3" fill="#f9a86c" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
    </svg>
  )
}

function DocumentIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.path d="M10 6 L26 6 L30 10 L30 34 L10 34 Z" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      <motion.path d="M26 6 L26 10 L30 10" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
      {[16, 22, 28].map((y, i) => (
        <motion.line key={i} x1="14" y1={y} x2="26" y2={y} stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
      ))}
    </svg>
  )
}

function AnalyticsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <motion.path d="M8 32 L8 8" stroke={active ? 'rgba(249,168,108,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      <motion.path d="M8 32 L36 32" stroke={active ? 'rgba(249,168,108,0.3)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      <motion.path d="M12 28 L18 20 L24 24 L32 12" fill="none" stroke={active ? '#f9a86c' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
      {active && [[12, 28], [18, 20], [24, 24], [32, 12]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="2" fill="#f9a86c" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />
      ))}
    </svg>
  )
}

// ========================================
// CAPABILITY DEFINITIONS
// ========================================

const CAPABILITIES = [
  { 
    id: 'chat' as const, 
    title: 'AI Chat', 
    icon: ChatIcon, 
    desc: 'Conversational intelligence',
    valueProps: ['24/7 customer support', 'Instant answers', 'Context-aware responses'],
    inputType: 'text' as const,
  },
  { 
    id: 'agents' as const, 
    title: 'AI Agents', 
    icon: AgentIcon, 
    desc: 'Autonomous workflows',
    valueProps: ['End-to-end automation', 'Multi-step processes', 'System integration'],
    inputType: 'text' as const,
  },
  { 
    id: 'vision' as const, 
    title: 'Vision AI', 
    icon: VisionIcon, 
    desc: 'Image analysis',
    valueProps: ['Quality inspection', 'Object detection', 'Visual insights'],
    inputType: 'image' as const,
  },
  { 
    id: 'documents' as const, 
    title: 'Document AI', 
    icon: DocumentIcon, 
    desc: 'Document processing',
    valueProps: ['Data extraction', 'Classification', 'Intelligent parsing'],
    inputType: 'document' as const,
  },
  { 
    id: 'analytics' as const, 
    title: 'Analytics AI', 
    icon: AnalyticsIcon, 
    desc: 'Predictive insights',
    valueProps: ['Trend analysis', 'Forecasting', 'Actionable metrics'],
    inputType: 'csv' as const,
  },
]

export function SectionSandbox() {
  const [activeCapability, setActiveCapability] = useState<typeof CAPABILITIES[number]['id']>('chat')
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | WorkflowStep[] | AnalyticsResult | VisionResult | DocumentResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedDocument, setUploadedDocument] = useState<{ name: string; content: string } | null>(null)
  const [uploadedCSV, setUploadedCSV] = useState<{ name: string; content: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showValueProposition, setShowValueProposition] = useState(true)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  
  const companyData = useStore((state) => state.companyData)
  const triggerPulse = useStore((state) => state.triggerPulse)
  const addToSandboxHistory = useStore((state) => state.addToSandboxHistory)

  // Get business-specific context
  const context = companyData ? {
    company: companyData.company,
    industry: companyData.industry,
    businessModel: companyData.businessModel,
    keyProcesses: companyData.keyProcesses,
  } : undefined

  // Get prompts specific to this capability from the blueprint
  const getBusinessPrompts = () => {
    if (!companyData?.sandboxPrompts) return []
    return companyData.sandboxPrompts
      .filter(p => p.capability === activeCapability)
      .slice(0, 3)
  }

  const businessPrompts = getBusinessPrompts()
  const currentCapability = CAPABILITIES.find(c => c.id === activeCapability)!

  // Auto-select first business prompt when capability changes
  useEffect(() => {
    if (businessPrompts.length > 0 && !input) {
      setInput(businessPrompts[0].prompt)
    }
    setShowValueProposition(true)
    setResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCapability, companyData?.company])

  const handleRun = async () => {
    // Validation
    if (activeCapability === 'vision' && !uploadedImage) {
      setError('Please upload an image first')
      return
    }
    if (activeCapability === 'documents' && !uploadedDocument) {
      setError('Please upload a document first')
      return
    }
    if (activeCapability === 'analytics' && !uploadedCSV && !input.trim()) {
      setError('Please upload a CSV file or enter a query')
      return
    }
    if ((activeCapability === 'chat' || activeCapability === 'agents') && !input.trim()) {
      return
    }
    
    setIsRunning(true)
    setResult(null)
    setError(null)
    setShowValueProposition(false)
    triggerPulse()

    try {
      let resultData: typeof result = null

      switch (activeCapability) {
        case 'chat':
          resultData = await chat(input, context)
          break
        case 'agents':
          resultData = await executeAgentWorkflow(input, context)
          break
        case 'vision':
          if (uploadedImage) {
            const base64Data = uploadedImage.split(',')[1]
            const mimeType = uploadedImage.split(';')[0].split(':')[1] || 'image/jpeg'
            resultData = await analyzeImage(base64Data, mimeType, context)
          }
          break
        case 'documents':
          if (uploadedDocument) {
            resultData = await processDocument(uploadedDocument.content, uploadedDocument.name, context)
          }
          break
        case 'analytics':
          resultData = await analyzeData(
            input || `Analyze the uploaded data for ${companyData?.company || 'the business'}`,
            context,
            uploadedCSV?.content
          )
          break
      }

      setResult(resultData)
      addToSandboxHistory({ 
        prompt: input || uploadedDocument?.name || uploadedCSV?.name || 'File analysis', 
        result: resultData, 
        timestamp: Date.now() 
      })
      triggerPulse()
    } catch (err) {
      console.error('Sandbox error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
    setIsRunning(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image too large. Please use an image under 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Document too large. Please use a file under 10MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setUploadedDocument({ name: file.name, content })
        setError(null)
      }
      reader.readAsText(file)
    }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('CSV too large. Please use a file under 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setUploadedCSV({ name: file.name, content })
        setError(null)
      }
      reader.readAsText(file)
    }
  }

  const resetDemo = () => {
    setResult(null)
    setInput('')
    setUploadedImage(null)
    setUploadedDocument(null)
    setUploadedCSV(null)
    setError(null)
    setShowValueProposition(true)
  }

  return (
    <section id="sandbox" className="relative min-h-screen py-20 bg-black">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 text-xs tracking-[0.3em] mb-6"
          >
            AI SANDBOX
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light leading-[1.1] tracking-tight mb-4"
          >
            <span className="text-[#f9a86c]">Experience</span> AI
            <br />
            <span className="text-white/50">tailored to your business.</span>
          </motion.h2>

          {companyData ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 p-3 bg-[#f9a86c]/5 border border-[#f9a86c]/20 rounded-lg inline-flex"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-white/70 text-sm">
                Customized for <span className="text-[#f9a86c] font-medium">{companyData.company}</span>
              </p>
              <span className="text-white/30 text-xs">•</span>
              <p className="text-white/40 text-sm">{companyData.industry}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-4 border border-white/10 rounded-lg bg-white/[0.02]"
            >
              <p className="text-white/50 text-sm mb-2">Want prompts specific to your business?</p>
              <button 
                onClick={() => document.getElementById('blueprint')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[#f9a86c] text-sm hover:underline flex items-center gap-2"
              >
                Generate your AI Blueprint first
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Capability selector */}
          <div className="space-y-3">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon
              const isActive = activeCapability === cap.id
              const hasBusinessPrompt = companyData?.sandboxPrompts?.some(p => p.capability === cap.id)
              
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
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#f9a86c]/10 border-[#f9a86c]/30'
                      : hasBusinessPrompt
                        ? 'bg-white/[0.02] border-[#f9a86c]/10 hover:border-[#f9a86c]/30'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                      <Icon active={isActive} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                          {cap.title}
                        </span>
                        {hasBusinessPrompt && (
                          <span className="text-[9px] text-[#f9a86c] bg-[#f9a86c]/10 px-1.5 py-0.5 rounded">
                            READY
                          </span>
                        )}
                      </div>
                      <div className="text-white/30 text-xs">{cap.desc}</div>
                    </div>
                  </div>
                  
                  {/* Value props on hover/active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/5"
                      >
                        <div className="space-y-1">
                          {cap.valueProps.map((prop, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs">
                              <div className="w-1 h-1 bg-[#f9a86c] rounded-full" />
                              <span className="text-white/40">{prop}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>

          {/* Demo area */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
          >
            {/* Business prompts bar */}
            {businessPrompts.length > 0 && activeCapability !== 'documents' && activeCapability !== 'analytics' && (
              <div className="p-4 bg-black/20 border-b border-white/5">
                <p className="text-white/30 text-xs mb-3">
                  PROMPTS FOR {companyData?.company?.toUpperCase()}
                </p>
                <div className="space-y-2">
                  {businessPrompts.map((bp, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(bp.prompt)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        input === bp.prompt 
                          ? 'bg-[#f9a86c]/10 border border-[#f9a86c]/30' 
                          : 'bg-white/[0.02] border border-transparent hover:border-white/10'
                      }`}
                    >
                      <p className={`text-sm ${input === bp.prompt ? 'text-white' : 'text-white/60'}`}>
                        {bp.prompt}
                      </p>
                      <p className="text-white/30 text-xs mt-1">{bp.context}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Value proposition when no result */}
              {showValueProposition && !result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-gradient-to-r from-[#f9a86c]/5 to-transparent border-l-2 border-[#f9a86c]"
                >
                  <p className="text-white/60 text-sm">
                    <span className="text-[#f9a86c] font-medium">{currentCapability.title}</span> can help {companyData?.company || 'your business'} with:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {currentCapability.valueProps.map((vp, i) => (
                      <li key={i} className="text-white/40 text-sm flex items-center gap-2">
                        <svg className="w-3 h-3 text-[#f9a86c]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {vp}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Error display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Input area */}
              <div className="mb-6">
                {activeCapability === 'vision' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full py-10 border-2 border-dashed border-white/10 rounded-xl
                                 hover:border-[#f9a86c]/30 transition-colors flex flex-col items-center gap-3"
                    >
                      {uploadedImage ? (
                        <>
                          <img src={uploadedImage} alt="Uploaded" className="max-h-40 rounded-lg" />
                          <span className="text-white/40 text-xs">Click to change image</span>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 opacity-30">
                            <VisionIcon active={false} />
                          </div>
                          <span className="text-white/50 text-sm">Upload an image for analysis</span>
                          <span className="text-white/30 text-xs">PNG, JPG up to 5MB</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeCapability === 'documents' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={documentInputRef}
                      onChange={handleDocumentUpload}
                      accept=".txt,.pdf,.doc,.docx,.json,.xml"
                      className="hidden"
                    />
                    <button
                      onClick={() => documentInputRef.current?.click()}
                      className="w-full py-10 border-2 border-dashed border-white/10 rounded-xl
                                 hover:border-[#f9a86c]/30 transition-colors flex flex-col items-center gap-3"
                    >
                      {uploadedDocument ? (
                        <>
                          <div className="w-16 h-16 opacity-70">
                            <DocumentIcon active={true} />
                          </div>
                          <div className="text-center">
                            <span className="text-white text-sm block">{uploadedDocument.name}</span>
                            <span className="text-white/40 text-xs">
                              {(uploadedDocument.content.length / 1024).toFixed(1)} KB • Click to change
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 opacity-30">
                            <DocumentIcon active={false} />
                          </div>
                          <span className="text-white/50 text-sm">Upload a document for processing</span>
                          <span className="text-white/30 text-xs">TXT, PDF, DOC, DOCX, JSON up to 10MB</span>
                        </>
                      )}
                    </button>
                    {uploadedDocument && (
                      <div className="p-3 bg-[#f9a86c]/5 border border-[#f9a86c]/20 rounded-lg">
                        <p className="text-[#f9a86c] text-xs">
                          Document loaded! AI will extract key data, classify content, and provide next actions.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeCapability === 'analytics' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={csvInputRef}
                      onChange={handleCSVUpload}
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                    />
                    <button
                      onClick={() => csvInputRef.current?.click()}
                      className="w-full py-10 border-2 border-dashed border-white/10 rounded-xl
                                 hover:border-[#f9a86c]/30 transition-colors flex flex-col items-center gap-3"
                    >
                      {uploadedCSV ? (
                        <>
                          <div className="w-16 h-16 opacity-70">
                            <AnalyticsIcon active={true} />
                          </div>
                          <div className="text-center">
                            <span className="text-white text-sm block">{uploadedCSV.name}</span>
                            <span className="text-white/40 text-xs">
                              {uploadedCSV.content.split('\n').length} rows • Click to change
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 opacity-30">
                            <AnalyticsIcon active={false} />
                          </div>
                          <span className="text-white/50 text-sm">Upload data for analysis</span>
                          <span className="text-white/30 text-xs">CSV, XLSX up to 5MB</span>
                        </>
                      )}
                    </button>
                    <div className="relative">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={uploadedCSV ? "What insights do you want? (optional)" : "Or describe the data analysis you need..."}
                        rows={3}
                        className="w-full px-4 py-3 bg-black/30 border border-white/10 text-white text-sm
                                   placeholder-white/30 focus:outline-none focus:border-[#f9a86c]/50
                                   transition-colors rounded-xl resize-none"
                      />
                    </div>
                    {uploadedCSV && (
                      <div className="p-3 bg-[#f9a86c]/5 border border-[#f9a86c]/20 rounded-lg">
                        <p className="text-[#f9a86c] text-xs">
                          CSV loaded! AI will analyze trends, forecast outcomes, and provide actionable recommendations.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(activeCapability === 'chat' || activeCapability === 'agents') && (
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Describe what you want ${currentCapability.title} to do...`}
                        rows={4}
                        className="w-full px-4 py-3 bg-black/30 border border-white/10 text-white text-sm
                                   placeholder-white/30 focus:outline-none focus:border-[#f9a86c]/50
                                   transition-colors rounded-xl resize-none"
                      />
                      {input && (
                        <button 
                          onClick={() => setInput('')}
                          className="absolute top-3 right-3 text-white/30 hover:text-white/50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleRun}
                  disabled={isRunning || (
                    (activeCapability === 'chat' || activeCapability === 'agents') && !input.trim()) ||
                    (activeCapability === 'vision' && !uploadedImage) ||
                    (activeCapability === 'documents' && !uploadedDocument) ||
                    (activeCapability === 'analytics' && !uploadedCSV && !input.trim()
                  )}
                  className="mt-4 w-full py-4 bg-[#f9a86c] text-white text-sm font-medium tracking-wider
                             hover:bg-[#e89a5e] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl
                             flex items-center justify-center gap-3"
                >
                  {isRunning ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      RUN {currentCapability.title.toUpperCase()}
                    </>
                  )}
                </button>
              </div>

              {/* Results - keeping the existing result rendering code */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-white/40 text-xs tracking-wider">AI RESULT</p>
                      </div>
                      <button onClick={resetDemo} className="text-white/30 text-xs hover:text-white/50 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try another
                      </button>
                    </div>

                    {/* Chat result */}
                    {activeCapability === 'chat' && typeof result === 'string' && (
                      <div className="p-5 bg-black/30 border border-white/10 rounded-xl">
                        <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                          <span className="text-[#f9a86c] text-xs">💡</span>
                          <span className="text-white/40 text-xs">This AI can handle thousands of similar queries simultaneously</span>
                        </div>
                      </div>
                    )}

                    {/* Agent workflow */}
                    {activeCapability === 'agents' && Array.isArray(result) && (
                      <div className="space-y-3">
                        <div className="text-white/30 text-xs mb-2">AUTOMATED WORKFLOW EXECUTED</div>
                        {(result as WorkflowStep[]).map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-black/30 border border-white/5 rounded-xl"
                          >
                            <div className="w-8 h-8 bg-[#f9a86c]/20 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-[#f9a86c] text-sm font-medium">{step.step}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white/80 text-sm">{step.action}</div>
                              {step.result && (
                                <div className="text-[#f9a86c]/80 text-xs mt-1">✓ {step.result}</div>
                              )}
                            </div>
                            <div className="text-white/20 text-xs">{step.duration}</div>
                          </motion.div>
                        ))}
                        <div className="mt-4 p-3 bg-[#f9a86c]/10 border border-[#f9a86c]/20 rounded-lg">
                          <p className="text-[#f9a86c] text-xs">
                            ⚡ This workflow ran in {(result as WorkflowStep[]).reduce((acc, s) => acc + parseInt(s.duration || '1'), 0)}s — manually would take hours
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Vision result */}
                    {activeCapability === 'vision' && typeof result === 'object' && 'objects' in result && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                            <p className="text-white/30 text-xs mb-2">DESCRIPTION</p>
                            <p className="text-white/80 text-sm">{(result as VisionResult).description}</p>
                          </div>
                          <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                            <p className="text-white/30 text-xs mb-2">DETECTED ({(result as VisionResult).confidence}% confidence)</p>
                            <div className="flex flex-wrap gap-2">
                              {(result as VisionResult).objects.map((obj, i) => (
                                <span key={i} className="px-2 py-1 text-xs text-[#f9a86c] bg-[#f9a86c]/10 rounded">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">BUSINESS INSIGHTS</p>
                          {(result as VisionResult).insights.map((insight, i) => (
                            <p key={i} className="text-white/60 text-sm mb-1">• {insight}</p>
                          ))}
                        </div>
                        {(result as VisionResult).businessRelevance && (
                          <div className="p-3 bg-[#f9a86c]/10 border border-[#f9a86c]/20 rounded-lg">
                            <p className="text-[#f9a86c] text-xs">
                              📊 {(result as VisionResult).businessRelevance}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Document result */}
                    {activeCapability === 'documents' && typeof result === 'object' && 'extractedFields' in result && (
                      <div className="space-y-4">
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-white/30 text-xs">EXTRACTED DATA</p>
                            <span className="text-[#f9a86c] text-xs font-medium">{(result as DocumentResult).confidence}% confidence</span>
                          </div>
                          <div className="space-y-2">
                            {Object.entries((result as DocumentResult).extractedFields).map(([key, value], i) => (
                              <div key={i} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
                                <span className="text-white/50 text-sm">{key}</span>
                                <span className="text-white/90 text-sm text-right max-w-[60%] font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {(result as DocumentResult).nextActions && (
                          <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                            <p className="text-white/30 text-xs mb-2">RECOMMENDED NEXT ACTIONS</p>
                            {(result as DocumentResult).nextActions.map((action, i) => (
                              <div key={i} className="flex items-center gap-2 text-white/60 text-sm mb-1">
                                <span className="text-[#f9a86c]">→</span> {action}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="p-3 bg-[#f9a86c]/10 border border-[#f9a86c]/20 rounded-lg">
                          <p className="text-[#f9a86c] text-xs">
                            📄 Document "{uploadedDocument?.name}" processed successfully
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Analytics result */}
                    {activeCapability === 'analytics' && typeof result === 'object' && 'insights' in result && !('objects' in result) && (
                      <div className="space-y-4">
                        {/* Metrics */}
                        {(result as AnalyticsResult).metrics && (
                          <div className="grid grid-cols-3 gap-3">
                            {(result as AnalyticsResult).metrics.slice(0, 3).map((metric, i) => (
                              <div key={i} className="p-3 bg-black/30 border border-white/5 rounded-xl text-center">
                                <p className="text-white/30 text-xs mb-1">{metric.label}</p>
                                <p className="text-white font-medium">{metric.value}</p>
                                <p className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-400' : metric.change.startsWith('-') ? 'text-red-400' : 'text-white/40'}`}>
                                  {metric.change}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                          <p className="text-white/30 text-xs mb-2">KEY INSIGHTS</p>
                          {(result as AnalyticsResult).insights.map((insight, i) => (
                            <p key={i} className="text-white/70 text-sm mb-2">• {insight}</p>
                          ))}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                            <p className="text-white/30 text-xs mb-2">TRENDS</p>
                            {(result as AnalyticsResult).trends.map((trend, i) => (
                              <p key={i} className="text-white/60 text-sm mb-1">↗ {trend}</p>
                            ))}
                          </div>
                          <div className="p-4 bg-[#f9a86c]/10 border border-[#f9a86c]/20 rounded-xl">
                            <p className="text-[#f9a86c] text-xs mb-1">FORECAST</p>
                            <p className="text-white/80 text-sm">{(result as AnalyticsResult).forecast}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-black/30 border border-[#f9a86c]/20 rounded-xl">
                          <p className="text-[#f9a86c] text-xs mb-1">💡 RECOMMENDATION</p>
                          <p className="text-white/80 text-sm">{(result as AnalyticsResult).recommendation}</p>
                        </div>
                        
                        {uploadedCSV && (
                          <div className="p-3 bg-[#f9a86c]/10 border border-[#f9a86c]/20 rounded-lg">
                            <p className="text-[#f9a86c] text-xs">
                              📊 Analyzed {uploadedCSV.content.split('\n').length} rows from "{uploadedCSV.name}"
                            </p>
                          </div>
                        )}
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
