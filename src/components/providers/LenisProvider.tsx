'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useStore, SectionName } from '@/store/useStore'

interface LenisProviderProps {
  children: React.ReactNode
}

const SECTIONS: SectionName[] = ['hero', 'about', 'discovery', 'sandbox', 'work', 'contact']

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const setScrollProgress = useStore((state) => state.setScrollProgress)
  const setCurrentSection = useStore((state) => state.setCurrentSection)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Update scroll progress and detect current section
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(progress)
      
      const windowHeight = window.innerHeight
      
      SECTIONS.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3) {
            setCurrentSection(sectionId)
          }
        }
      })
    })

    return () => {
      lenis.destroy()
    }
  }, [setScrollProgress, setCurrentSection])

  return <>{children}</>
}
