'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import {
  analyzeImage,
  processDocument as processDoc,
  analyzeData,
  getContextualPrompts,
  getUploadSuggestion,
  type VisionResult,
  type DocumentResult,
  type AnalyticsResult,
} from '@/services/gemini'

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Helper to read text file
const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// ========================================
// COMPUTER VISION WITH UPLOAD
// ========================================

export function VisionDemoWithUpload() {
  const companyData = useStore((state) => state.companyData)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<VisionResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const industry = companyData?.industry || 'retail'
  const prompts = getContextualPrompts(industry, 'vision', companyData?.company)
  const suggestion = getUploadSuggestion(industry, companyData?.company)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Analyze
    setAnalyzing(true)
    try {
      const base64 = await fileToBase64(file)
      const visionResult = await analyzeImage(
        base64,
        file.type,
        companyData ? { company: companyData.company, industry: companyData.industry } : undefined
      )
      setResult(visionResult)
    } catch (error) {
      console.error('Vision analysis error:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with context */}
      <div className="space-y-3">
        <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white/90">Computer Vision AI</h4>
            <p className="text-xs text-white/50 mt-1">{suggestion}</p>
          </div>
        </div>

        {/* Contextual prompts */}
        {companyData && (
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-xs font-mono text-blue-300 mb-2">TRY THESE FOR {companyData.company.toUpperCase()}:</div>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-200 rounded">
                  {prompt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border-2 border-dashed border-white/20 hover:border-blue-500/50 cursor-pointer transition-all overflow-hidden group"
        >
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 group-hover:text-white/60 transition-colors">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs mt-1">Product photos, documents, equipment, etc.</p>
            </div>
          )}
          
          {analyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-white">Analyzing image...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="text-xs font-mono text-white/40 mb-2">DESCRIPTION</div>
            <p className="text-sm text-white/80">{result.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-2">DETECTED</div>
              <div className="flex flex-wrap gap-2">
                {result.objects.map((obj, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-2">CONFIDENCE</div>
              <div className="text-3xl font-light text-green-400">{result.confidence}%</div>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="text-xs font-mono text-white/40 mb-2">INSIGHTS</div>
            <ul className="space-y-2">
              {result.insights.map((insight, i) => (
                <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ========================================
// DOCUMENT AI WITH UPLOAD
// ========================================

export function DocumentDemoWithUpload() {
  const companyData = useStore((state) => state.companyData)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<DocumentResult | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const industry = companyData?.industry || 'retail'
  const prompts = getContextualPrompts(industry, 'document', companyData?.company)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setProcessing(true)

    try {
      const text = await readTextFile(file)
      const docResult = await processDoc(
        text,
        file.name.split('.').pop() || 'document',
        companyData ? { company: companyData.company, industry: companyData.industry } : undefined
      )
      setResult(docResult)
    } catch (error) {
      console.error('Document processing error:', error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white/90">Document Intelligence</h4>
            <p className="text-xs text-white/50 mt-1">Upload invoices, forms, receipts, or any document</p>
          </div>
        </div>

        {/* Contextual prompts */}
        {companyData && (
          <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
            <div className="text-xs font-mono text-teal-300 mb-2">EXAMPLE DOCUMENTS FOR {companyData.company.toUpperCase()}:</div>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-teal-500/20 text-teal-200 rounded">
                  {prompt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload area */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative p-12 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-lg border-2 border-dashed border-white/20 hover:border-teal-500/50 cursor-pointer transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <svg className="w-16 h-16 text-white/40 group-hover:text-white/60 transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-white/80 mb-2">
            {fileName || 'Click to upload document'}
          </p>
          <p className="text-xs text-white/50">
            TXT, CSV, PDF, DOC, DOCX up to 10MB
          </p>
        </div>
        
        {processing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-white">Processing document...</p>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
            <span className="text-sm text-teal-300 font-mono">{result.documentType}</span>
            <span className="text-xs text-green-400">{result.confidence}% confidence</span>
          </div>

          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="text-xs font-mono text-white/40 mb-4">EXTRACTED FIELDS</div>
            <div className="space-y-3">
              {Object.entries(result.extractedFields).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/50">{key}</span>
                  <span className="text-sm text-white/90 font-medium text-right ml-4">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ========================================
// ANALYTICS WITH CSV UPLOAD
// ========================================

export function AnalyticsDemoWithUpload() {
  const companyData = useStore((state) => state.companyData)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyticsResult | null>(null)
  const [csvData, setCsvData] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const industry = companyData?.industry || 'retail'
  const prompts = getContextualPrompts(industry, 'analytics', companyData?.company)

  // Auto-fill first prompt
  useEffect(() => {
    if (companyData && prompts[0]) {
      setQuery(prompts[0])
    }
  }, [companyData, prompts])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const text = await readTextFile(file)
    setCsvData(text)
  }

  const runAnalysis = async () => {
    setLoading(true)
    try {
      const analysisResult = await analyzeData(
        query || prompts[0],
        companyData ? { company: companyData.company, industry: companyData.industry } : undefined,
        csvData
      )
      setResult(analysisResult)
    } catch (error) {
      console.error('Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-4 p-4 bg-white/[0.02] rounded-lg border border-white/5">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white/90">Predictive Analytics</h4>
            <p className="text-xs text-white/50 mt-1">
              {csvData ? `Analyzing ${fileName}` : 'Upload CSV or ask a question'}
            </p>
          </div>
        </div>

        {/* Upload CSV */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-300 font-medium mb-1">
                  {fileName || 'Upload CSV Data (Optional)'}
                </div>
                <div className="text-xs text-white/50">
                  e.g., sales_data.csv, customer_orders.csv
                </div>
              </div>
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </button>
        </div>

        {/* Contextual prompts */}
        {companyData && (
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <div className="text-xs font-mono text-orange-300 mb-2">SUGGESTED ANALYSES:</div>
            <div className="space-y-2">
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(prompt)}
                  className="w-full text-left px-3 py-2 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-100 rounded transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Query input */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your data..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-sm rounded-lg
                     focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-mono rounded-lg
                     disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
            <div className="text-xs font-mono text-white/40 mb-3">KEY INSIGHTS</div>
            <ul className="space-y-2">
              {result.insights.map((insight, i) => (
                <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-3">TRENDS</div>
              <ul className="space-y-2">
                {result.trends.map((trend, i) => (
                  <li key={i} className="text-sm text-white/70">• {trend}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs font-mono text-white/40 mb-3">FORECAST</div>
              <p className="text-sm text-white/80">{result.forecast}</p>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-xs font-mono text-green-300 mb-2">RECOMMENDATION</div>
            <p className="text-sm text-white/90">{result.recommendation}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
