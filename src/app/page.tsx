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
  loading: () => null, // No loading spinner, we handle this in the loader
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    
    // Give 3D scene time to initialize
    const timer = setTimeout(() => {
      setSceneReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // After scene is ready, start the content reveal
  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        document.body.style.overflow = ''
      }, 1500) // Let 3D animate in first
      return () => clearTimeout(timer)
    }
  }, [sceneReady])

  return (
    <LenisProvider>
      {/* Loading Screen - Shows 3D first */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-sm text-orange-400 tracking-[0.3em] uppercase"
              >
                Loading Experience
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Canvas Layer - Z-index 0 */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Navigation - Z-index 50 */}
      <Navbar />

      {/* Scrollable HTML Overlay - Z-index 10 */}
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
