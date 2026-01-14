'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useStore } from '@/store/useStore'

// Sections
import { SectionHero } from '@/components/sections/SectionHero'
import { SectionProblem } from '@/components/sections/SectionProblem'
import { SectionApproach } from '@/components/sections/SectionApproach'
import { SectionBlueprint } from '@/components/sections/SectionBlueprint'
import { SectionSandbox } from '@/components/sections/SectionSandbox'
import { SectionCapabilities } from '@/components/sections/SectionCapabilities'
import { SectionWork } from '@/components/sections/SectionWork'
import { SectionContact } from '@/components/sections/SectionContact'

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const setCurrentSection = useStore((state) => state.setCurrentSection)
  const setScrollProgress = useStore((state) => state.setScrollProgress)

  const { scrollYProgress } = useScroll()

  // Track scroll progress for 3D element positioning
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setScrollProgress(v)
      
      // Map scroll to sections
      const sections = ['hero', 'problem', 'approach', 'blueprint', 'sandbox', 'capabilities', 'work', 'contact'] as const
      const sectionIndex = Math.min(Math.floor(v * sections.length), sections.length - 1)
      setCurrentSection(sections[sectionIndex])
    })
  }, [scrollYProgress, setScrollProgress, setCurrentSection])

  // Initial scroll reset
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    setCurrentSection('hero')
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [setCurrentSection])

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-white/20 text-sm tracking-[0.3em]"
            >
              CALANCE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Minimal Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white/80 text-sm tracking-[0.2em] hover:text-white transition-colors"
          >
            CALANCE
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-white/50 text-xs tracking-widest hover:text-white transition-colors"
          >
            START DIALOGUE
          </button>
        </div>
      </nav>

      {/* Content sections */}
      <main className="relative z-10">
        <SectionHero />
        <SectionProblem />
        <SectionApproach />
        <SectionBlueprint />
        <SectionSandbox />
        <SectionCapabilities />
        <SectionWork />
        <SectionContact />
      </main>
    </>
  )
}
