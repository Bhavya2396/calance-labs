'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-24 py-6"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo - 6x larger */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center"
        >
          <Image
            src="/calance-logo.png"
            alt="Calance"
            width={480}
            height={135}
            className="h-28 md:h-36 w-auto object-contain"
            priority
          />
        </button>

        {/* Centered Navigation - Glass Pill */}
        <div className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500 ${
          scrolled 
            ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
            : 'bg-white/5 backdrop-blur-md border border-white/10'
        }`}>
          {[
            { label: 'ABOUT', id: 'about' },
            { label: 'DISCOVER', id: 'discovery' },
            { label: 'SANDBOX', id: 'sandbox' },
            { label: 'WORK', id: 'work' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-5 py-2.5 text-xs font-medium tracking-wider text-white/70 
                         hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            >
              {item.label}
            </button>
          ))}
          
          {/* CTA Button inside nav */}
          <button
            onClick={() => scrollToSection('contact')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-medium 
                       tracking-wider rounded-full hover:bg-white/90 transition-all duration-300 ml-2"
          >
            GET STARTED
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.nav>
  )
}
