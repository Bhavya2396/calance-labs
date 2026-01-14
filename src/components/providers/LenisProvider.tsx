'use client'

import { useEffect } from 'react'
import { useStore, SectionName } from '@/store/useStore'

interface LenisProviderProps {
  children: React.ReactNode
}

const SECTIONS: SectionName[] = ['hero', 'about', 'discovery', 'sandbox', 'work', 'contact']

export function LenisProvider({ children }: LenisProviderProps) {
  const setScrollProgress = useStore((state) => state.setScrollProgress)
  const setCurrentSection = useStore((state) => state.setCurrentSection)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollY / docHeight : 0
      
      setScrollProgress(progress)
      
      // Detect current section
      const windowHeight = window.innerHeight
      SECTIONS.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.4) {
            setCurrentSection(sectionId)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollProgress, setCurrentSection])

  return <>{children}</>
}
