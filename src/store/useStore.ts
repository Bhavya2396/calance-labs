import { create } from 'zustand'

// Types
export type SectionName = 'hero' | 'problem' | 'approach' | 'blueprint' | 'sandbox' | 'work' | 'contact'

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

// Store interface
interface StoreState {
  // Scroll state
  scrollProgress: number
  currentSection: SectionName
  
  // Company data (from Gemini)
  companyData: CompanyData | null
  isGenerating: boolean
  
  // Interaction state
  pulseEffect: boolean
  
  // Actions
  setScrollProgress: (progress: number) => void
  setCurrentSection: (section: SectionName) => void
  setCompanyData: (data: CompanyData | null) => void
  setIsGenerating: (isGenerating: boolean) => void
  triggerPulse: () => void
  
  // Work section specific
  activeWorkIndex: number
  setActiveWorkIndex: (index: number) => void
}

export const useStore = create<StoreState>((set) => ({
  scrollProgress: 0,
  currentSection: 'hero',
  companyData: null,
  isGenerating: false,
  pulseEffect: false,
  activeWorkIndex: 0,
  
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  setCurrentSection: (section) => set({ currentSection: section }),
  
  setCompanyData: (data) => set({ companyData: data }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setActiveWorkIndex: (index) => set({ activeWorkIndex: index }),
  
  triggerPulse: () => {
    set({ pulseEffect: true })
    setTimeout(() => set({ pulseEffect: false }), 800)
  },
}))
