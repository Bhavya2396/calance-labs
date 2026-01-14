'use client'

import dynamic from 'next/dynamic'
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
  loading: () => (
    <div className="fixed inset-0 z-0 bg-void flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function Home() {
  return (
    <LenisProvider>
      {/* Fixed Canvas Layer - Z-index 0 */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Navigation - Z-index 50 */}
      <Navbar />

      {/* Scrollable HTML Overlay - Z-index 10 */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Discovery />
        <Sandbox />
        <Work />
        <Contact />
      </main>
    </LenisProvider>
  )
}
