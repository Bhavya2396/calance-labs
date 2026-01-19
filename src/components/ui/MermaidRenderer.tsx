'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import mermaid from 'mermaid'
import { motion, AnimatePresence } from 'framer-motion'

// Will be initialized on client side only
let mermaidInitialized = false

const initializeMermaid = () => {
  if (typeof window !== 'undefined' && !mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#1a1a1a',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#c9956c',
        lineColor: '#c9956c',
        secondaryColor: '#262626',
        tertiaryColor: '#1a1a1a',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        nodeBorder: '#c9956c',
        clusterBkg: '#1a1a1a',
        edgeLabelBackground: '#1a1a1a',
        background: '#0a0a0a',
      },
      flowchart: {
        curve: 'basis',
        padding: 15,
        nodeSpacing: 40,
        rankSpacing: 40,
        htmlLabels: true,
      },
    })
    mermaidInitialized = true
  }
}

// Improved mermaid chart cleaning function
function cleanMermaidChart(chart: string): string {
  // Remove any markdown code blocks
  let cleaned = chart.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '')
  
  // Replace escaped newlines with actual newlines
  cleaned = cleaned.replace(/\\n/g, '\n')
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()
  
  // Remove ALL special characters from labels
  cleaned = cleaned.replace(/\[([^\]]+)\]/g, (match, label) => {
    // Replace common problematic characters
    let safeLabel = label
      .replace(/[&]/g, 'and')
      .replace(/[<>]/g, '')
      .replace(/["'`]/g, '')
      .replace(/[()\[\]{}]/g, '')
      .replace(/[|\/\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return `[${safeLabel}]`
  })
  
  // Fix empty labels
  cleaned = cleaned.replace(/\[\s*\]/g, '[Node]')
  
  // Fix arrow spacing
  cleaned = cleaned.replace(/-->\s*-->/g, '-->')
  cleaned = cleaned.replace(/\s+-->/g, ' -->')
  cleaned = cleaned.replace(/-->\s+/g, '--> ')
  
  // Ensure diagram starts with valid type
  if (!cleaned.match(/^(graph|flowchart|sequenceDiagram)/i)) {
    cleaned = 'graph TD\n' + cleaned
  }
  
  // Clean up line breaks - keep only meaningful lines
  cleaned = cleaned.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.match(/^[;#]/)) // Remove comments
    .join('\n')
  
  return cleaned
}

// Create a fallback diagram for a company
function createFallbackDiagram(company?: string): string {
  // Clean company name - remove special characters
  const cleanName = (company || 'Business').replace(/[^A-Za-z0-9\s]/g, '').slice(0, 20)
  return `graph TD
A[${cleanName}] --> B[AI Solutions]
B --> C[Customer]
B --> D[Operations]
C --> E[Support]
C --> F[Experience]
D --> G[Automation]
D --> H[Efficiency]
E --> I[Outcomes]
G --> I
H --> I`
}

interface MermaidRendererProps {
  chart: string
  onError?: (error: string) => void
  company?: string
}

export function MermaidRenderer({ chart, onError, company }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const chartRef = useRef(chart)

  useEffect(() => {
    // Reset when chart changes
    if (chart !== chartRef.current) {
      chartRef.current = chart
      setRetryAttempt(0)
      setSvg('')
      setError(null)
    }
  }, [chart])

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || typeof window === 'undefined') return

      try {
        setError(null)
        initializeMermaid()
        
        const cleanedChart = cleanMermaidChart(chart)
        console.log('Mermaid rendering attempt:', retryAttempt, cleanedChart.slice(0, 200))
        
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Use mermaid.parse to validate first
        const isValid = await mermaid.parse(cleanedChart).catch(() => false)
        
        if (isValid) {
          const { svg } = await mermaid.render(id, cleanedChart)
          setSvg(svg)
        } else {
          throw new Error('Invalid diagram syntax')
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        
        // Try fallback on first error
        if (retryAttempt === 0) {
          console.log('Trying fallback diagram...')
          setRetryAttempt(1)
          
          try {
            const fallbackChart = createFallbackDiagram(company)
            const id = `mermaid-fallback-${Date.now()}`
            const { svg } = await mermaid.render(id, fallbackChart)
            setSvg(svg)
            setError(null)
            return
          } catch (fallbackErr) {
            console.error('Fallback also failed:', fallbackErr)
          }
        }
        
        const errorMsg = err instanceof Error ? err.message : 'Failed to render diagram'
        setError(errorMsg)
        onError?.(errorMsg)
      }
    }

    renderChart()
  }, [chart, onError, retryAttempt, company])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 min-h-[200px]">
        <svg className="w-10 h-10 text-[#c9956c]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        <p className="text-white/50 text-sm mb-1">Architecture Generated</p>
        <p className="text-white/30 text-xs">View fullscreen for best experience</p>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
        <div className="w-6 h-6 border-2 border-[#c9956c] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-white/40 text-xs">Rendering diagram...</p>
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex items-center justify-center overflow-hidden
                 [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:max-h-full
                 [&_.node_rect]:fill-[#1a1a1a] [&_.node_rect]:stroke-[#c9956c] 
                 [&_.edgeLabel]:fill-white [&_.label]:fill-white 
                 [&_path]:stroke-[#c9956c] [&_.flowchart-link]:stroke-[#c9956c]
                 [&_.marker]:fill-[#c9956c] [&_polygon]:fill-[#c9956c]
                 [&_text]:fill-white [&_text]:text-xs"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// ========================================
// FULLSCREEN DIAGRAM VIEWER WITH ZOOM
// ========================================

interface DiagramViewerProps {
  chart: string
  isOpen: boolean
  onClose: () => void
  company?: string
}

export function DiagramViewer({ chart, isOpen, onClose, company }: DiagramViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }, [])

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  // Handle ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKey)
      return () => window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black to-transparent z-10">
            <div>
              <h3 className="text-white font-medium">AI Architecture Blueprint</h3>
              {company && <p className="text-sm text-[#c9956c]">{company}</p>}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Zoom Out"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-white/70 text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Zoom In"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Reset View"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Diagram Container */}
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div
              className="w-full h-full flex items-center justify-center p-20"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <div className="bg-black/50 border border-white/10 rounded-2xl p-8 min-w-[600px] min-h-[400px]">
                <MermaidRenderer chart={chart} company={company} />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs flex items-center gap-4">
            <span>Drag to pan</span>
            <span>Scroll to zoom</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
