import { create } from 'zustand'

// Types
export type SectionName = 'hero' | 'problem' | 'approach' | 'blueprint' | 'sandbox' | 'work' | 'contact'

export interface SandboxPrompt {
  capability: 'chat' | 'agents' | 'vision' | 'documents' | 'analytics'
  prompt: string
  context: string
  expectedOutcome: string
}

export interface UseCase {
  title: string
  scenario: string
  capability: 'chat' | 'agents' | 'vision' | 'documents' | 'analytics'
  samplePrompt: string
  businessValue: string
}

export interface Solution {
  name: string
  type: 'agentic' | 'vision' | 'nlp' | 'analytics' | 'automation'
  description: string
  impact: string
  useCases?: UseCase[]
}

export interface CompanyData {
  company: string
  industry: string
  summary: string
  businessModel: string
  keyProcesses: string[]
  solutions: Solution[]
  mermaidDiagram: string
  sandboxPrompts: SandboxPrompt[]
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
  
  // Sandbox state
  activeSandboxCapability: 'chat' | 'agents' | 'vision' | 'documents' | 'analytics'
  sandboxHistory: { prompt: string; result: unknown; timestamp: number }[]
  
  // Actions
  setScrollProgress: (progress: number) => void
  setCurrentSection: (section: SectionName) => void
  setCompanyData: (data: CompanyData | null) => void
  setIsGenerating: (isGenerating: boolean) => void
  triggerPulse: () => void
  setActiveSandboxCapability: (cap: 'chat' | 'agents' | 'vision' | 'documents' | 'analytics') => void
  addToSandboxHistory: (entry: { prompt: string; result: unknown; timestamp: number }) => void
  clearSandboxHistory: () => void
  
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
  activeSandboxCapability: 'chat',
  sandboxHistory: [],
  activeWorkIndex: 0,
  
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  setCurrentSection: (section) => set({ currentSection: section }),
  
  setCompanyData: (data) => set({ companyData: data }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setActiveWorkIndex: (index) => set({ activeWorkIndex: index }),
  setActiveSandboxCapability: (cap) => set({ activeSandboxCapability: cap }),
  
  addToSandboxHistory: (entry) => set((state) => ({ 
    sandboxHistory: [...state.sandboxHistory.slice(-9), entry] 
  })),
  
  clearSandboxHistory: () => set({ sandboxHistory: [] }),
  
  triggerPulse: () => {
    set({ pulseEffect: true })
    setTimeout(() => set({ pulseEffect: false }), 800)
  },
}))
