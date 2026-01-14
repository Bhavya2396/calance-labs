'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Discovery } from '@/components/sections/Discovery'
import { Sandbox } from '@/components/sections/Sandbox'
import { Work } from '@/components/sections/Work'
import { Contact } from '@/components/sections/Contact'
import { useStore } from '@/store/useStore'

// Dynamically import the Canvas component with no SSR
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const setCurrentSection = useStore((state) => state.setCurrentSection)

  useEffect(() => {
    // Force scroll to absolute top immediately
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    
    // Set initial section
    setCurrentSection('hero')
    
    // Short delay then reveal
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [setCurrentSection])

  // Also force scroll on history navigation
  useEffect(() => {
    const handleLoad = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    window.addEventListener('load', handleLoad)
    window.addEventListener('beforeunload', handleLoad)
    return () => {
      window.removeEventListener('load', handleLoad)
      window.removeEventListener('beforeunload', handleLoad)
    }
  }, [])

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black"
          />
        )}
      </AnimatePresence>

      {/* Fixed Canvas Layer */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Scrollable Content */}
      <main className="relative z-10">
        <Hero isLoaded={!isLoading} />
        <About />
        <Discovery />
        <Sandbox />
        <Work />
        <Contact />
      </main>
    </>
  )
}
