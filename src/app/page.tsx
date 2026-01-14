'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Discovery } from '@/components/sections/Discovery'
import { Sandbox } from '@/components/sections/Sandbox'
import { Work } from '@/components/sections/Work'
import { Contact } from '@/components/sections/Contact'

// Dynamically import the Canvas component with no SSR
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  // Force scroll to top and handle loading
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.style.overflow = 'hidden'
    
    // Short delay for 3D to initialize, then reveal content
    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = ''
    }, 1200)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <LenisProvider>
      {/* Elegant Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-xs text-white/40 tracking-[0.4em] uppercase font-light"
              >
                Calance Labs
              </motion.div>
            </motion.div>
          </motion.div>
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
    </LenisProvider>
  )
}
