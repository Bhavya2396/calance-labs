'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { chat, executeAgentWorkflow, analyzeData, type WorkflowStep, type AnalyticsResult } from '@/services/gemini'

// ========================================
// COMPANY-SPECIFIC PROMPTS GENERATOR
// ========================================

function getCompanyPrompts(company: string, industry: string) {
  const prompts: Record<string, Record<string, string[]>> = {
    chat: {
      retail: [
        `How can ${company} improve customer service response times?`,
        `What products does ${company} recommend for new customers?`,
        `Help me track my order from ${company}`,
      ],
      healthcare: [
        `Schedule an appointment at ${company}`,
        `What insurance plans does ${company} accept?`,
        `Get information about ${company}'s services`,
      ],
      finance: [
        `What investment options does ${company} offer?`,
        `Help me understand ${company}'s fee structure`,
        `How do I open an account with ${company}?`,
      ],
      technology: [
        `How do I integrate ${company}'s API?`,
        `What pricing plans does ${company} offer?`,
        `Get technical support for ${company} products`,
      ],
      default: [
        `Tell me about ${company}'s services`,
        `How can I contact ${company} support?`,
        `What makes ${company} different from competitors?`,
      ],
    },
    agents: {
      retail: [
        `Process a bulk order and update inventory for ${company}`,
        `Analyze customer returns and generate refund report`,
        `Create personalized marketing campaign based on purchase history`,
      ],
      healthcare: [
        `Verify patient insurance and schedule appointment`,
        `Process lab results and notify relevant physicians`,
        `Generate compliance report for regulatory submission`,
      ],
      finance: [
        `Process loan application and run credit assessment`,
        `Generate monthly portfolio performance report`,
        `Detect and flag suspicious transaction patterns`,
      ],
      technology: [
        `Deploy new feature and run automated testing`,
        `Analyze user feedback and prioritize bug fixes`,
        `Generate API usage report and billing summary`,
      ],
      default: [
        `Automate customer onboarding workflow`,
        `Process support tickets and route to agents`,
        `Generate weekly performance analytics report`,
      ],
    },
    vision: {
      retail: [
        `Inspect product packaging for quality defects`,
        `Count inventory items from shelf images`,
        `Verify product authenticity from packaging`,
      ],
      healthcare: [
        `Analyze medical scan for anomaly detection`,
        `Verify patient identity from ID documents`,
        `Assess wound healing progress from images`,
      ],
      manufacturing: [
        `Inspect assembly line products for defects`,
        `Monitor safety compliance from camera feeds`,
        `Analyze equipment condition from visual data`,
      ],
      default: [
        `Analyze uploaded image for object detection`,
        `Extract text and data from document scan`,
        `Classify and categorize visual content`,
      ],
    },
    documents: {
      retail: [
        `Extract data from purchase orders`,
        `Process supplier invoices automatically`,
        `Digitize customer feedback forms`,
      ],
      healthcare: [
        `Extract patient information from intake forms`,
        `Process insurance claim documents`,
        `Digitize handwritten medical notes`,
      ],
      finance: [
        `Extract data from loan applications`,
        `Process tax documents and forms`,
        `Verify identity documents automatically`,
      ],
      default: [
        `Extract key information from uploaded document`,
        `Process and classify business documents`,
        `Convert scanned documents to structured data`,
      ],
    },
    analytics: {
      retail: [
        `Forecast ${company}'s Q1 sales by product category`,
        `Predict customer churn risk for ${company}`,
        `Analyze seasonal demand patterns`,
      ],
      healthcare: [
        `Predict patient volume for next month`,
        `Analyze treatment outcome patterns`,
        `Forecast staffing requirements`,
      ],
      finance: [
        `Predict market trends for ${company}'s portfolio`,
        `Analyze transaction patterns for fraud risk`,
        `Forecast revenue growth trajectory`,
      ],
      default: [
        `Analyze growth trends for ${company}`,
        `Predict customer behavior patterns`,
        `Generate performance forecast report`,
      ],
    },
  }

  return {
    chat: prompts.chat[industry] || prompts.chat.default,
    agents: prompts.agents[industry] || prompts.agents.default,
    vision: prompts.vision[industry] || prompts.vision.default,
    documents: prompts.documents[industry] || prompts.documents.default,
    analytics: prompts.analytics[industry] || prompts.analytics.default,
  }
}

// ========================================
// INTERACTIVE SVG ICONS
// ========================================

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <motion.rect
        x="8" y="15" width="44" height="28" rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d="M16 25 L30 25 M16 32 L40 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.circle
        cx="50" cy="12" r="6"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: active ? [1, 1.2, 1] : 0.5 }}
        transition={{ duration: 1, repeat: active ? Infinity : 0 }}
      />
    </svg>
  )
}

function AgentsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <motion.circle
        cx="30" cy="20" r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M15 35 L15 50 L45 50 L45 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={22 + i * 8} cy={42}
          r="3"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: active ? [1, 1.3, 1] : 0.5 }}
          transition={{ duration: 1, repeat: active ? Infinity : 0, delay: i * 0.2 }}
        />
      ))}
    </svg>
  )
}

function VisionIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <motion.ellipse
        cx="30" cy="30" rx="22" ry="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.8 }}
      />
      <motion.circle
        cx="30" cy="30" r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0.5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.circle
        cx="30" cy="30" r="3"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: active ? [1, 1.4, 1] : 0.5 }}
        transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
      />
    </svg>
  )
}

function DocumentIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <motion.path
        d="M15 8 L15 52 L45 52 L45 18 L35 8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d="M35 8 L35 18 L45 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      {[28, 36, 44].map((y, i) => (
        <motion.line
          key={i}
          x1="22" y1={y}
          x2="38" y2={y}
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0.3 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
        />
      ))}
    </svg>
  )
}

function AnalyticsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <motion.line
        x1="10" y1="48" x2="50" y2="48"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.6 }}
      />
      <motion.line
        x1="10" y1="48" x2="10" y2="12"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: active ? 1 : 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      {[18, 26, 34, 42].map((x, i) => {
        const height = [12, 22, 16, 28][i]
        return (
          <motion.rect
            key={i}
            x={x - 3} y={48 - height}
            width="6" height={height}
            fill="currentColor"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: active ? 1 : 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            style={{ transformOrigin: 'bottom' }}
          />
        )
      })}
    </svg>
  )
}

// ========================================
// CAPABILITY DATA
// ========================================

const CAPABILITIES = [
  {
    id: 'chat',
    title: 'Conversational AI',
    subtitle: 'Natural language understanding',
    icon: ChatIcon,
    color: 'blue',
  },
  {
    id: 'agents',
    title: 'AI Agents',
    subtitle: 'Autonomous task execution',
    icon: AgentsIcon,
    color: 'purple',
  },
  {
    id: 'vision',
    title: 'Computer Vision',
    subtitle: 'Image and video analysis',
    icon: VisionIcon,
    color: 'teal',
  },
  {
    id: 'documents',
    title: 'Document AI',
    subtitle: 'Data extraction & processing',
    icon: DocumentIcon,
    color: 'orange',
  },
  {
    id: 'analytics',
    title: 'Predictive Analytics',
    subtitle: 'Forecasting & insights',
    icon: AnalyticsIcon,
    color: 'rose',
  },
]

// ========================================
// DEMO COMPONENTS
// ========================================

function ChatDemo({ prompts }: { prompts: string[] }) {
  const companyData = useStore(state => state.companyData)
  const { setIsInteracting, triggerPulse } = useStore()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const welcomeMsg = companyData
      ? `Hello! I'm the AI assistant for ${companyData.company}. I'm configured to help with ${companyData.industry} industry needs. How can I assist you today?`
      : "Hello! I'm a conversational AI assistant. Ask me anything!"
    setMessages([{ role: 'assistant', content: welcomeMsg }])
  }, [companyData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (msg?: string) => {
    const messageToSend = msg || input
    if (!messageToSend.trim() || loading) return
    
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }])
    setLoading(true)
    setIsInteracting(true)
    triggerPulse()

    const response = await chat(
      messageToSend,
      companyData ? { company: companyData.company, industry: companyData.industry } : undefined
    )
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
    setIsInteracting(false)
    triggerPulse()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-800 text-white/90 border border-white/10 rounded-xl'
              }`}
            >
              <p className="text-base leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Try asking:</div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-xl 
                           text-white/70 hover:text-white transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-white/10 bg-neutral-900">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white placeholder-white/40
                       focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-orange-500 text-white text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-400 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function AgentsDemo({ prompts }: { prompts: string[] }) {
  const companyData = useStore(state => state.companyData)
  const [task, setTask] = useState('')
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [running, setRunning] = useState(false)

  const runAgent = async (taskInput?: string) => {
    const taskToRun = taskInput || task.trim() || prompts[0]
    if (running) return
    
    setRunning(true)
    setSteps([])

    const workflowSteps = await executeAgentWorkflow(
      taskToRun,
      companyData ? { company: companyData.company, industry: companyData.industry } : undefined
    )

    for (let i = 0; i < workflowSteps.length; i++) {
      setSteps(prev => [...prev, { ...workflowSteps[i], status: 'running' }])
      await new Promise(r => setTimeout(r, 800))
      setSteps(prev => prev.map((s, idx) => (idx === i ? { ...s, status: 'complete' } : s)))
    }

    setRunning(false)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex gap-2 mb-4">
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder={prompts[0]}
          disabled={running}
          className="flex-1 px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white placeholder-white/40
                     focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
        />
        <button
          onClick={() => runAgent()}
          disabled={running}
          className="px-6 py-3 bg-purple-500 text-white text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-400 transition-all"
        >
          {running ? 'Running...' : 'Execute'}
        </button>
      </div>
      
      {/* Suggested Tasks */}
      {steps.length === 0 && !running && (
        <div className="mb-4">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Try these workflows:</div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => runAgent(prompt)}
                className="px-3 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-xl 
                           text-white/70 hover:text-white transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-4 border ${
              step.status === 'complete'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-purple-500/10 border-purple-500/30'
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center font-mono text-sm ${
              step.status === 'complete' ? 'bg-green-500/30 text-green-400' : 'bg-purple-500/30 text-purple-400'
            }`}>
              {step.status === 'complete' ? '✓' : step.step}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white font-medium">{step.action}</div>
              {step.result && <div className="text-xs text-white/50 mt-1">{step.result}</div>}
            </div>
            {step.status === 'running' && (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function VisionDemo({ prompts }: { prompts: string[] }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{ objects: string[]; confidence: number } | null>(null)

  const analyze = async () => {
    setAnalyzing(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 2500))
    setResult({
      objects: ['Object A', 'Object B', 'Label', 'Pattern'],
      confidence: 97.8,
    })
    setAnalyzing(false)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-md aspect-video bg-neutral-800 border border-white/10 rounded-xl mb-4 flex items-center justify-center">
          {analyzing && (
            <motion.div
              className="absolute left-0 w-full h-0.5 bg-teal-400"
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, ease: 'linear' }}
            />
          )}
          <span className="text-sm text-white/40">{analyzing ? 'Analyzing...' : 'Sample Image'}</span>
          
          {result && !analyzing && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[10%] left-[5%] w-[25%] h-[30%] border-2 border-teal-400" />
              <div className="absolute top-[15%] right-[10%] w-[20%] h-[25%] border-2 border-green-500" />
            </div>
          )}
        </div>

        <button
          onClick={analyze}
          disabled={analyzing}
          className="px-8 py-3 bg-teal-500 text-white text-sm font-medium mb-4
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-400 transition-all"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Image'}
        </button>

        {result && (
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-800 border border-white/10 rounded-xl">
              <div className="text-xs text-white/40 uppercase mb-2">Detected</div>
              <div className="flex flex-wrap gap-1">
                {result.objects.map((obj, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400">{obj}</span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-neutral-800 border border-white/10 rounded-xl">
              <div className="text-xs text-white/40 uppercase mb-2">Confidence</div>
              <div className="text-2xl text-green-400 font-light">{result.confidence}%</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-white/10 pt-4">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Use cases:</div>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, i) => (
            <span key={i} className="px-3 py-1 text-xs bg-neutral-800 border border-white/10 rounded-xl text-white/50">{prompt}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DocumentsDemo({ prompts }: { prompts: string[] }) {
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Record<string, string> | null>(null)

  const process = async () => {
    setProcessing(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 2000))
    setResult({
      'Document Type': 'Invoice',
      'Number': 'INV-2024-001234',
      'Date': 'January 15, 2024',
      'Amount': '$2,450.00',
    })
    setProcessing(false)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-800 border border-white/10 rounded-xl">
          <div className="text-xs text-white/40 uppercase mb-4">Document Preview</div>
          <div className="space-y-3">
            {['Type', 'Number', 'Date', 'Amount'].map((field, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-white/50 w-20">{field}:</span>
                <div className={`flex-1 h-4 ${processing ? 'bg-orange-500/30 animate-pulse' : 'bg-white/10'}`} />
              </div>
            ))}
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-orange-500/10 border border-orange-500/20"
          >
            <div className="text-xs text-orange-400 uppercase mb-4">Extracted Data</div>
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-white/50">{key}</span>
                <span className="text-sm text-white font-medium">{value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <button
          onClick={process}
          disabled={processing}
          className="w-full py-3 bg-orange-500 text-white text-sm font-medium mb-4
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-400 transition-all"
        >
          {processing ? 'Processing...' : 'Process Document'}
        </button>
        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Capabilities:</div>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, i) => (
            <span key={i} className="px-3 py-1 text-xs bg-neutral-800 border border-white/10 rounded-xl text-white/50">{prompt}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsDemo({ prompts }: { prompts: string[] }) {
  const companyData = useStore(state => state.companyData)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyticsResult | null>(null)

  const sampleData = [42, 48, 45, 62, 58, 71]

  const runAnalysis = async (queryInput?: string) => {
    const queryToRun = queryInput || query.trim() || prompts[0]
    setLoading(true)
    setResult(null)

    const analysisResult = await analyzeData(
      queryToRun,
      companyData ? { company: companyData.company, industry: companyData.industry } : undefined
    )

    setResult(analysisResult)
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={prompts[0]}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white placeholder-white/40
                     focus:outline-none focus:border-rose-500/50 transition-colors text-sm"
        />
        <button
          onClick={() => runAnalysis()}
          disabled={loading}
          className="px-6 py-3 bg-rose-500 text-white text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-400 transition-all"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Suggested Queries */}
      {!result && !loading && (
        <div className="mb-4">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Try these analyses:</div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => runAnalysis(prompt)}
                className="px-3 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-xl 
                           text-white/70 hover:text-white transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="bg-neutral-800 border border-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-end justify-between gap-2 h-32">
            {sampleData.map((val, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-rose-500 to-pink-400"
                initial={{ height: 0 }}
                animate={{ height: `${(val / Math.max(...sampleData)) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
          </div>
        </div>
        
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-4 bg-neutral-800 border border-white/10 rounded-xl">
              <div className="text-xs text-white/40 uppercase mb-2">Key Insights</div>
              <ul className="space-y-1">
                {result.insights.map((insight, i) => (
                  <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20">
              <div className="text-xs text-rose-400 uppercase mb-2">Forecast</div>
              <p className="text-sm text-white/80">{result.forecast}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ========================================
// MAIN COMPONENT
// ========================================

export function Sandbox() {
  const [activeCapability, setActiveCapability] = useState('chat')
  const companyData = useStore(state => state.companyData)

  // Get company-specific prompts or defaults
  const prompts = companyData 
    ? getCompanyPrompts(companyData.company, companyData.industry)
    : getCompanyPrompts('Your Company', 'default')

  const activeData = CAPABILITIES.find(c => c.id === activeCapability) || CAPABILITIES[0]

  return (
    <section
      id="sandbox"
      className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-24 py-24"
    >
      <div className="w-full max-w-[1600px] mx-auto flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-sm text-orange-400 font-medium tracking-wider">
              // AI SANDBOX
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mt-2 tracking-tight">
              <span className="text-white">
                {companyData ? `AI capabilities for ${companyData.company}` : 'Experience our AI capabilities.'}
              </span>
            </h2>
          </div>
          
          {companyData && (
            <div className="text-sm text-white/50">
              Prompts customized for <span className="text-orange-400">{companyData.industry}</span> industry
            </div>
          )}
        </div>

        {/* Capability Tabs - LARGER TEXT */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon
            return (
              <button
                key={cap.id}
                onClick={() => setActiveCapability(cap.id)}
                className={`flex items-center gap-4 px-6 py-4 border transition-all whitespace-nowrap ${
                  activeCapability === cap.id
                    ? 'bg-neutral-800 border-orange-500/50 text-white'
                    : 'bg-neutral-900 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 ${activeCapability === cap.id ? 'text-orange-400' : 'text-white/30'}`}>
                  <Icon active={activeCapability === cap.id} />
                </div>
                <div className="text-left">
                  <div className="text-base font-medium">{cap.title}</div>
                  <div className="text-sm text-white/40">{cap.subtitle}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Demo Area */}
        <div className="flex-1 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCapability}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeCapability === 'chat' && <ChatDemo prompts={prompts.chat} />}
              {activeCapability === 'agents' && <AgentsDemo prompts={prompts.agents} />}
              {activeCapability === 'vision' && <VisionDemo prompts={prompts.vision} />}
              {activeCapability === 'documents' && <DocumentsDemo prompts={prompts.documents} />}
              {activeCapability === 'analytics' && <AnalyticsDemo prompts={prompts.analytics} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-white/40 uppercase tracking-wider">
            {companyData 
              ? `Showing ${companyData.industry} industry prompts` 
              : 'Generate a blueprint to see company-specific prompts'}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium 
                       tracking-wider hover:bg-white/90 transition-all"
          >
            LET'S TALK
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
