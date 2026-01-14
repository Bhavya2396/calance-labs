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
        {/* Logo - Much larger */}
        <button onClick={() => scrollTo('hero')}>
          <Image
            src="/calance-logo.png"
            alt="Calance"
            width={400}
            height={120}
            className="h-24 md:h-32 lg:h-36 w-auto"
            priority
          />
        </button>

        {/* Navigation - Appears on scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          className="hidden md:flex items-center gap-1 px-3 py-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full"
          style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
        >
          {['about', 'discovery', 'sandbox', 'work'].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-4 py-2 text-xs text-white/60 hover:text-white uppercase tracking-wider transition-colors rounded-full hover:bg-white/5"
            >
              {id}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="px-5 py-2 text-xs text-white bg-orange-500 hover:bg-orange-400 uppercase tracking-wider rounded-full transition-colors ml-1"
          >
            Contact
          </button>
        </motion.div>
      </div>
    </nav>
  )
}
