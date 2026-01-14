import { create } from 'zustand'

// Types
export type ParticleState = 'chaos' | 'grid' | 'sphere' | 'network' | 'flow'

export interface Solution {
  name: string
  type: 'agentic' | 'vision' | 'nlp' | 'analytics' | 'automation'
  description: string
  impact: string
}

export interface CompanyData {
  company: string
  industry: string
  summary: string
  solutions: Solution[]
  mermaidDiagram: string
}

export interface ColorPalette {
  background: string
  accent: string
  particle: string
}

// Section configurations
export const SECTION_CONFIGS = {
  hero: {
    index: 0,
    palette: { background: '#0a0a0a', accent: '#ff8800', particle: '#ff8800' },
    particleState: 'chaos' as ParticleState,
    cameraPosition: [0, 0, 5] as [number, number, number],
    cameraLookAt: [0, 0, 0] as [number, number, number],
  },
  about: {
    index: 1,
    palette: { background: '#0a0a10', accent: '#b8b8b8', particle: '#b8b8b8' },
    particleState: 'grid' as ParticleState,
    cameraPosition: [1.5, 0.5, 4] as [number, number, number],
    cameraLookAt: [0, 0, 0] as [number, number, number],
  },
  discovery: {
    index: 2,
    palette: { background: '#0a0f1a', accent: '#ff9933', particle: '#ff9933' },
    particleState: 'grid' as ParticleState,
    cameraPosition: [2, 0.5, 3] as [number, number, number],
    cameraLookAt: [0, 0, 0] as [number, number, number],
  },
  sandbox: {
    index: 3,
    palette: { background: '#0f0a1a', accent: '#808080', particle: '#808080' },
    particleState: 'sphere' as ParticleState,
    cameraPosition: [0, 0, 2] as [number, number, number],
    cameraLookAt: [0, 0, 0] as [number, number, number],
  },
  work: {
    index: 4,
    palette: { background: '#0a1010', accent: '#ff7700', particle: '#ff7700' },
    particleState: 'network' as ParticleState,
    cameraPosition: [-1.5, 0.5, 3.5] as [number, number, number],
    cameraLookAt: [0, 0, 0] as [number, number, number],
  },
  contact: {
    index: 5,
    palette: { background: '#0a0a0a', accent: '#c0c0c0', particle: '#c0c0c0' },
    particleState: 'flow' as ParticleState,
    cameraPosition: [0, 0, 1.5] as [number, number, number],
    cameraLookAt: [0, 0, -5] as [number, number, number],
  },
}

export type SectionName = keyof typeof SECTION_CONFIGS

// Store interface
interface StoreState {
  // Scroll state
  scrollProgress: number
  currentSection: SectionName
  currentSectionIndex: number
  
  // Visual state
  particleState: ParticleState
  colorPalette: ColorPalette
  
  // Company data (from Gemini)
  companyData: CompanyData | null
  isGenerating: boolean
  
  // Interaction state - NEW
  isInteracting: boolean
  interactionIntensity: number
  pulseEffect: boolean
  
  // Actions
  setScrollProgress: (progress: number) => void
  setCurrentSection: (section: SectionName) => void
  setCompanyData: (data: CompanyData | null) => void
  setIsGenerating: (isGenerating: boolean) => void
  
  // Interaction actions - NEW
  setIsInteracting: (interacting: boolean) => void
  setInteractionIntensity: (intensity: number) => void
  triggerPulse: () => void
  
  // Work section specific
  activeWorkIndex: number
  setActiveWorkIndex: (index: number) => void
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  scrollProgress: 0,
  currentSection: 'hero',
  currentSectionIndex: 0,
  particleState: 'chaos',
  colorPalette: SECTION_CONFIGS.hero.palette,
  companyData: null,
  isGenerating: false,
  activeWorkIndex: 0,
  
  // Interaction state
  isInteracting: false,
  interactionIntensity: 0,
  pulseEffect: false,
  
  // Actions
  setScrollProgress: (progress) => {
    // Determine current section based on progress
    const sectionProgress = progress * 6 // 6 sections now
    let sectionName: SectionName = 'hero'
    let sectionIndex = 0
    
    if (sectionProgress < 1) {
      sectionName = 'hero'
      sectionIndex = 0
    } else if (sectionProgress < 2) {
      sectionName = 'about'
      sectionIndex = 1
    } else if (sectionProgress < 3) {
      sectionName = 'discovery'
      sectionIndex = 2
    } else if (sectionProgress < 4) {
      sectionName = 'sandbox'
      sectionIndex = 3
    } else if (sectionProgress < 5) {
      sectionName = 'work'
      sectionIndex = 4
    } else {
      sectionName = 'contact'
      sectionIndex = 5
    }
    
    const config = SECTION_CONFIGS[sectionName]
    
    set({
      scrollProgress: progress,
      currentSection: sectionName,
      currentSectionIndex: sectionIndex,
      particleState: config.particleState,
      colorPalette: config.palette,
    })
  },
  
  setCurrentSection: (section) => {
    const config = SECTION_CONFIGS[section]
    set({
      currentSection: section,
      currentSectionIndex: config.index,
      particleState: config.particleState,
      colorPalette: config.palette,
    })
  },
  
  setCompanyData: (data) => set({ companyData: data }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setActiveWorkIndex: (index) => set({ activeWorkIndex: index }),
  
  // Interaction actions
  setIsInteracting: (interacting) => set({ isInteracting: interacting }),
  setInteractionIntensity: (intensity) => set({ interactionIntensity: Math.min(1, Math.max(0, intensity)) }),
  triggerPulse: () => {
    set({ pulseEffect: true })
    setTimeout(() => set({ pulseEffect: false }), 800)
  },
}))
