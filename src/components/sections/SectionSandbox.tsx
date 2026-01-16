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

// Get context-aware prompts based on company data and solutions
function getPrompts(capability: string, company?: string, industry?: string, solutions?: { name: string; type: string }[]) {
  const c = company || 'your company'
  const ind = industry || 'business'
  
  // Find relevant solutions for each capability
  const hasNLP = solutions?.some(s => s.type === 'nlp')
  const hasVision = solutions?.some(s => s.type === 'vision')
  const hasAnalytics = solutions?.some(s => s.type === 'analytics')
  const hasAgentic = solutions?.some(s => s.type === 'agentic')
  
  // Industry-specific prompt templates
  const industryPrompts: Record<string, Record<string, string[]>> = {
    retail: {
      chat: [
        `How can AI chatbots handle product inquiries for ${c}?`,
        `What customer support automation would benefit ${c}?`,
        `Design an AI assistant for ${c}'s online shopping experience`,
      ],
      agents: [
        `Automate order processing and inventory updates for ${c}`,
        `Create a workflow to handle customer returns at ${c}`,
        `Build an agent to manage ${c}'s supplier communications`,
      ],
      vision: [
        `Analyze product images for quality control at ${c}`,
        `Detect shelf inventory levels in ${c}'s stores`,
        `Inspect returned items for damage assessment`,
      ],
      documents: [
        `Extract data from ${c}'s purchase orders`,
        `Process supplier invoices for ${c}`,
        `Parse customer feedback forms from ${c}`,
      ],
      analytics: [
        `Analyze ${c}'s sales trends and forecast demand`,
        `Identify customer churn risk factors for ${c}`,
        `Optimize ${c}'s pricing based on market data`,
      ],
    },
    healthcare: {
      chat: [
        `How can ${c} use AI for patient appointment scheduling?`,
        `Design a symptom triage chatbot for ${c}`,
        `What AI support would benefit ${c}'s patients?`,
      ],
      agents: [
        `Automate insurance verification workflow for ${c}`,
        `Create a patient follow-up automation for ${c}`,
        `Build an agent to handle ${c}'s prescription refills`,
      ],
      vision: [
        `Analyze medical equipment status at ${c}`,
        `Verify prescription labels for ${c}'s pharmacy`,
        `Check medication packaging integrity`,
      ],
      documents: [
        `Extract patient data from ${c}'s intake forms`,
        `Process insurance claims for ${c}`,
        `Parse lab results for ${c}'s EHR system`,
      ],
      analytics: [
        `Analyze ${c}'s patient wait times and optimize scheduling`,
        `Predict no-show appointments at ${c}`,
        `Identify resource utilization patterns for ${c}`,
      ],
    },
    finance: {
      chat: [
        `How can ${c} automate customer account inquiries?`,
        `Design an AI advisor for ${c}'s investment services`,
        `What loan-related questions should ${c}'s AI handle?`,
      ],
      agents: [
        `Automate loan application processing for ${c}`,
        `Create a compliance checking workflow for ${c}`,
        `Build an agent to handle ${c}'s KYC verification`,
      ],
      vision: [
        `Verify check authenticity for ${c}`,
        `Analyze ID documents for ${c}'s onboarding`,
        `Detect document tampering in submissions`,
      ],
      documents: [
        `Extract data from loan applications for ${c}`,
        `Process bank statements for ${c}'s credit analysis`,
        `Parse financial reports for ${c}'s due diligence`,
      ],
      analytics: [
        `Detect fraudulent patterns in ${c}'s transactions`,
        `Analyze ${c}'s loan portfolio risk`,
        `Forecast ${c}'s cash flow trends`,
      ],
    },
    manufacturing: {
      chat: [
        `How can ${c} use AI for equipment troubleshooting?`,
        `Design a shop floor assistant for ${c}'s workers`,
        `What maintenance queries should ${c}'s AI handle?`,
      ],
      agents: [
        `Automate production scheduling for ${c}`,
        `Create a quality control workflow for ${c}`,
        `Build an agent to manage ${c}'s maintenance tickets`,
      ],
      vision: [
        `Inspect products for manufacturing defects at ${c}`,
        `Analyze assembly line quality at ${c}`,
        `Detect equipment anomalies on ${c}'s production floor`,
      ],
      documents: [
        `Extract data from ${c}'s work orders`,
        `Process quality inspection reports for ${c}`,
        `Parse equipment maintenance logs for ${c}`,
      ],
      analytics: [
        `Predict equipment maintenance needs at ${c}`,
        `Analyze ${c}'s production efficiency`,
        `Optimize ${c}'s supply chain inventory`,
      ],
    },
    technology: {
      chat: [
        `How can ${c} use AI for technical support?`,
        `Design a developer assistant for ${c}'s team`,
        `What product questions should ${c}'s AI handle?`,
      ],
      agents: [
        `Automate ${c}'s deployment pipeline`,
        `Create an incident response workflow for ${c}`,
        `Build an agent to triage ${c}'s support tickets`,
      ],
      vision: [
        `Analyze UI screenshots for bugs at ${c}`,
        `Detect visual regressions in ${c}'s app`,
        `Process user-submitted error screenshots`,
      ],
      documents: [
        `Extract requirements from ${c}'s product specs`,
        `Process API documentation for ${c}`,
        `Parse customer integration requests for ${c}`,
      ],
      analytics: [
        `Analyze ${c}'s user engagement metrics`,
        `Predict customer churn for ${c}'s SaaS`,
        `Optimize ${c}'s infrastructure costs`,
      ],
    },
  }

  // Get industry-specific prompts or fall back to generic
  const industryKey = Object.keys(industryPrompts).find(k => ind.toLowerCase().includes(k)) || 'technology'
  const prompts = industryPrompts[industryKey]?.[capability]

  // If we have company data, use industry-specific prompts
  if (company && prompts) {
    return prompts
  }

  // Generic prompts if no company data
  const genericPrompts: Record<string, string[]> = {
    chat: [
      'How can AI improve customer experience?',
      'What automation opportunities exist for my business?',
      'Explain the benefits of conversational AI',
    ],
    agents: [
      'Process a customer order and update inventory',
      'Analyze support tickets and route to teams',
      'Generate a weekly performance report',
    ],
    vision: [
      'Analyze product image for quality defects',
      'Detect objects and classify items',
      'Extract text from scanned documents',
    ],
    documents: [
      'Extract key data from this invoice',
      'Process and summarize this contract',
      'Parse customer intake form data',
    ],
    analytics: [
      'Analyze sales trends and forecast next quarter',
      'Identify customer churn risk factors',
      'Optimize pricing based on demand patterns',
    ],
  }

  return genericPrompts[capability] || genericPrompts.chat
}

export function SectionSandbox() {
  const [activeCapability, setActiveCapability] = useState('chat')
  const [isRunning, setIsRunning] = useState(false)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | WorkflowStep[] | AnalyticsResult | VisionResult | DocumentResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const companyData = useStore((state) => state.companyData)
  const triggerPulse = useStore((state) => state.triggerPulse)
  const context = companyData ? { company: companyData.company, industry: companyData.industry } : undefined
  const prompts = getPrompts(
    activeCapability, 
    companyData?.company, 
    companyData?.industry,
    companyData?.solutions
  )

  // Pre-fill input when switching to a capability that matches a solution
  useEffect(() => {
    if (companyData && prompts.length > 0) {
      // Auto-select the first prompt for context
      setInput(prompts[0])
    }
  }, [activeCapability, companyData?.company]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRun = async () => {
    if (!input.trim() && activeCapability !== 'vision') return
    if (activeCapability === 'vision' && !uploadedImage) return
    
    setIsRunning(true)
    setResult(null)
    setError(null)
    triggerPulse()

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
            const base64Data = uploadedImage.split(',')[1]
            const mimeType = uploadedImage.split(';')[0].split(':')[1] || 'image/jpeg'
            const visionResult = await analyzeImage(base64Data, mimeType, context)
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
      triggerPulse()
    } catch (err) {
      console.error('Sandbox error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
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
      reader.onerror = () => setError('Failed to read image file.')
      reader.readAsDataURL(file)
    }
  }

  const resetDemo = () => {
    setResult(null)
    setInput('')
    setUploadedImage(null)
    setError(null)
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
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[#c9956c] text-sm">
                Customized for <span className="font-medium">{companyData.company}</span> • {companyData.industry}
              </p>
            </motion.div>
          )}
          
          {!companyData && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/40 text-sm"
            >
              <button 
                onClick={() => document.getElementById('blueprint')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[#c9956c] hover:underline"
              >
                Generate a Blueprint
              </button>
              {' '}first to see customized prompts for your business
            </motion.p>
          )}
        </div>

        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          {/* Capability selector */}
          <div className="space-y-2">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon
              const isActive = activeCapability === cap.id
              
              // Check if this capability matches a solution
              const hasSolution = companyData?.solutions.some(s => {
                if (cap.id === 'chat') return s.type === 'nlp'
                if (cap.id === 'agents') return s.type === 'agentic' || s.type === 'automation'
                if (cap.id === 'vision') return s.type === 'vision'
                if (cap.id === 'documents') return s.type === 'nlp'
                if (cap.id === 'analytics') return s.type === 'analytics'
                return false
              })
              
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
                      : hasSolution
                        ? 'bg-white/[0.02] border-[#c9956c]/20 hover:border-[#c9956c]/30'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    <Icon active={isActive} />
                  </div>
                  <div className="text-left flex-1">
                    <div className={`text-sm font-medium flex items-center gap-2 ${isActive ? 'text-white' : 'text-white/60'}`}>
                      {cap.title}
                      {hasSolution && !isActive && (
                        <span className="text-[10px] text-[#c9956c] bg-[#c9956c]/10 px-1.5 py-0.5 rounded">
                          Recommended
                        </span>
                      )}
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
                    className={`px-3 py-1.5 text-xs border rounded-full transition-colors ${
                      input === prompt 
                        ? 'text-[#c9956c] bg-[#c9956c]/10 border-[#c9956c]/30' 
                        : 'text-white/50 bg-white/[0.03] border-white/5 hover:border-[#c9956c]/30 hover:text-white/70'
                    }`}
                  >
                    {prompt.length > 45 ? prompt.slice(0, 45) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

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
                        <div className="w-12 h-12 opacity-40">
                          <VisionIcon active={false} />
                        </div>
                        <span className="text-white/40 text-sm">Click to upload image</span>
                        <span className="text-white/20 text-xs">PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </button>
                  {uploadedImage && (
                    <button 
                      onClick={() => setUploadedImage(null)}
                      className="text-white/30 text-xs hover:text-white/50"
                    >
                      Remove image
                    </button>
                  )}
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
                           hover:bg-[#b8855c] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl
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
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
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
