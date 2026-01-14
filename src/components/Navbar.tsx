'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-4">
      <div className="flex items-center justify-between">
        {/* Logo - Much bigger */}
        <button onClick={() => scrollTo('hero')} className="relative">
          <Image
            src="/calance-logo.png"
            alt="Calance"
            width={320}
            height={90}
            className="h-20 md:h-28 lg:h-32 w-auto"
            priority
          />
        </button>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          className="hidden md:flex items-center gap-1 px-3 py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full"
          style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
        >
          {['about', 'discovery', 'sandbox', 'work'].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-4 py-2 text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors rounded-full hover:bg-white/5"
            >
              {id}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="ml-2 px-5 py-2 text-xs text-black bg-white uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
          >
            Contact
          </button>
        </motion.div>
      </div>
    </nav>
  )
}
