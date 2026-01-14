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
      themeVariables: {
        primaryColor: '#1a1a1a',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#ff8800',
        lineColor: '#ff8800',
        secondaryColor: '#262626',
        tertiaryColor: '#1a1a1a',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        nodeBorder: '#ff8800',
        clusterBkg: '#1a1a1a',
        edgeLabelBackground: '#1a1a1a',
        background: '#0a0a0a',
      },
      flowchart: {
        curve: 'basis',
        padding: 20,
      },
    })
    mermaidInitialized = true
  }
}

// Clean mermaid diagram string
function cleanMermaidChart(chart: string): string {
  // Remove any markdown code blocks
  let cleaned = chart.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '')
  
  // Replace escaped newlines with actual newlines
  cleaned = cleaned.replace(/\\n/g, '\n')
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()
  
  // Ensure it starts with a valid diagram type
  if (!cleaned.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap)/)) {
    cleaned = 'graph TD\n' + cleaned
  }
  
  return cleaned
}

interface MermaidRendererProps {
  chart: string
  onError?: (error: string) => void
}

export function MermaidRenderer({ chart, onError }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || typeof window === 'undefined') return

      try {
        setError(null)
        initializeMermaid()
        
        const cleanedChart = cleanMermaidChart(chart)
        console.log('Rendering mermaid:', cleanedChart) // Debug log
        
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, cleanedChart)
        setSvg(svg)
      } catch (err) {
        console.error('Mermaid render error:', err)
        const errorMsg = err instanceof Error ? err.message : 'Failed to render diagram'
        setError(errorMsg)
        onError?.(errorMsg)
        
        // Auto-retry once with simplified diagram
        if (retryCount === 0) {
          setRetryCount(1)
          try {
            const simpleDiagram = `graph TD
              A[${chart.includes('[') ? chart.match(/\[([^\]]+)\]/)?.[1] || 'Company' : 'Company'}]
              A --> B[AI Integration]
              A --> C[Automation]
              A --> D[Analytics]
              B --> E[Improved Efficiency]
              C --> F[Cost Savings]
              D --> G[Better Decisions]`
            const id = `mermaid-retry-${Date.now()}`
            const { svg } = await mermaid.render(id, simpleDiagram)
            setSvg(svg)
            setError(null)
          } catch {
            // Keep original error
          }
        }
      }
    }

    renderChart()
  }, [chart, onError, retryCount])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <svg className="w-12 h-12 text-orange-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-white/60 text-sm mb-2">Diagram rendering issue</p>
        <p className="text-white/40 text-xs">{error}</p>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/40 text-sm">Generating architecture diagram...</p>
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto [&_.node_rect]:fill-[#1a1a1a] [&_.node_rect]:stroke-[#ff8800] [&_.edgeLabel]:fill-white [&_.label]:fill-white [&_path]:stroke-[#ff8800]"
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
              {company && <p className="text-sm text-white/50">{company}</p>}
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
                <MermaidRenderer chart={chart} />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs flex items-center gap-4">
            <span>🖱️ Drag to pan</span>
            <span>⚙️ Scroll to zoom</span>
            <span>⌨️ ESC to close</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
