'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useStore } from '@/store/useStore'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const setScrollProgress = useStore((state) => state.setScrollProgress)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Update scroll progress
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(progress)
    })

    return () => {
      lenis.destroy()
    }
  }, [setScrollProgress])

  return <>{children}</>
}
