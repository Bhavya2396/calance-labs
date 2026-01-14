'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { useState } from 'react'

const PROJECTS = [
  {
    id: 1,
    client: 'Ujjain Smart City',
    year: '2024',
    title: 'AI-Powered Traffic Management',
    description: 'Computer vision system deployed across city intersections for real-time traffic optimization and automated signal control.',
    impact: 'Reduced Urban Congestion',
  },
  {
    id: 2,
    client: 'Indian Railways',
    year: '2023',
    title: 'Predictive Maintenance Platform',
    description: 'Machine learning system for equipment monitoring that predicts failures before they occur.',
    impact: 'Improved Efficiency',
  },
  {
    id: 3,
    client: 'Healthcare Network',
    year: '2024',
    title: 'Clinical Decision Support AI',
    description: 'AI assistant providing evidence-based diagnosis recommendations by analyzing patient data.',
    impact: 'Enhanced Diagnostics',
  },
  {
    id: 4,
    client: 'E-commerce Platform',
    year: '2023',
    title: 'Intelligent Customer Service',
    description: 'Conversational AI handling inquiries, tracking, and recommendations across channels.',
    impact: 'Better Support',
  },
]

const cardStyle = "p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-[#c9956c]/20 transition-all"

export function Work() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { setActiveWorkIndex } = useStore()

  const handleProjectClick = (index: number) => {
    setActiveIndex(index)
    setActiveWorkIndex(index)
  }

  return (
    <section id="work" className="relative min-h-screen px-6 md:px-12 lg:px-20 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/40 tracking-widest uppercase mb-6"
          >
            Our Work
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light tracking-tight mb-6"
          >
            Real solutions.
            <br />
            <span className="text-white/50">Real impact.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-white/50 max-w-xl"
          >
            We've helped organizations across industries transform their operations with AI-powered solutions.
          </motion.p>
        </div>

        {/* Featured Project */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className={`${cardStyle} p-8 md:p-12`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-[#c9956c]">{PROJECTS[activeIndex].client}</span>
                  <span className="text-sm text-white/30">{PROJECTS[activeIndex].year}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                  {PROJECTS[activeIndex].title}
                </h3>
                <p className="text-base text-white/50 mb-6 max-w-lg">
                  {PROJECTS[activeIndex].description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9956c]/10 border border-[#c9956c]/20 rounded-full">
                  <div className="w-2 h-2 bg-[#c9956c] rounded-full" />
                  <span className="text-sm text-[#c9956c]">{PROJECTS[activeIndex].impact}</span>
                </div>
              </div>
              
              {/* Visual placeholder */}
              <div className="w-full lg:w-80 h-48 bg-gradient-to-br from-[#c9956c]/10 to-transparent rounded-xl border border-[#c9956c]/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-light text-[#c9956c]/30 mb-2">0{activeIndex + 1}</div>
                  <div className="text-xs text-white/30 tracking-widest">PROJECT</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROJECTS.map((project, i) => (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleProjectClick(i)}
              className={`p-4 text-left rounded-xl border transition-all
                ${activeIndex === i 
                  ? 'bg-[#c9956c]/10 border-[#c9956c]/30' 
                  : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10'
                }`}
            >
              <div className={`text-2xl font-light mb-2 ${activeIndex === i ? 'text-[#c9956c]' : 'text-white/20'}`}>
                0{i + 1}
              </div>
              <div className={`text-sm font-medium mb-1 ${activeIndex === i ? 'text-white' : 'text-white/60'}`}>
                {project.client}
              </div>
              <div className="text-xs text-white/40 truncate">
                {project.title}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
