'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-24 py-4 md:py-6"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => scrollToSection('hero')}
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src="/calance-logo.png"
            alt="Calance"
            width={360}
            height={100}
            className="h-20 md:h-28 w-auto object-contain"
            priority
          />
        </motion.button>

        {/* Navigation - Appears on scroll */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: scrolled ? 1 : 0, 
            y: scrolled ? 0 : -20,
            pointerEvents: scrolled ? 'auto' : 'none'
          }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10"
        >
          {[
            { label: 'ABOUT', id: 'about' },
            { label: 'DISCOVER', id: 'discovery' },
            { label: 'SANDBOX', id: 'sandbox' },
            { label: 'WORK', id: 'work' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-4 py-2 text-xs font-medium tracking-wider text-white/60 
                         hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
            >
              {item.label}
            </button>
          ))}
          
          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('contact')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs font-medium 
                       tracking-wider rounded-full hover:bg-white/20 transition-all duration-300 ml-1"
          >
            CONTACT
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </motion.div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-white/60 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.nav>
  )
}
