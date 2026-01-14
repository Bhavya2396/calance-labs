'use client'

import { useRef, useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/store/useStore'
import { Emergence } from './Emergence'
import { Effects } from './Effects'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ========================================
// ORANGE & GREY SECTION COLORS
// ========================================

const VIBRANT_COLORS = {
  hero: {
    bg: '#1a1410',      // Dark warm grey
    accent: '#ff8800',   // Bright orange
  },
  about: {
    bg: '#18181a',      // Dark grey
    accent: '#b8b8b8',   // Light grey
  },
  discovery: {
    bg: '#1c1410',      // Warm dark
    accent: '#ff9933',   // Light orange
  },
  sandbox: {
    bg: '#1a1a1a',      // Neutral dark grey
    accent: '#909090',   // Medium grey
  },
  work: {
    bg: '#1d1612',      // Warm charcoal
    accent: '#ff7700',   // Vibrant orange
  },
  contact: {
    bg: '#181818',      // Cool dark grey
    accent: '#c0c0c0',   // Silver grey
  },
}

// ========================================
// CAMERA CONTROLLER
// ========================================

function CameraController() {
  const { camera } = useThree()
  const scrollProgress = useStore((state) => state.scrollProgress)
  const currentSection = useStore((state) => state.currentSection)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Section-based camera positions for cinematic movement
    const cameraJourney: Record<string, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
      hero: { pos: [0, 0, 6], lookAt: [0, 0, 0] },
      about: { pos: [2, 1, 5], lookAt: [0, 0, 0] },
      discovery: { pos: [0, 0.5, 4], lookAt: [0, 0, 0] },
      sandbox: { pos: [-1, 0, 5], lookAt: [0, 0, 0] },
      work: { pos: [1.5, 0.5, 5], lookAt: [0, 0, 0] },
      contact: { pos: [0, 0, 3], lookAt: [0, 0, 0] },
    }
    
    const journey = cameraJourney[currentSection] || cameraJourney.hero
    
    // Smooth camera movement
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, journey.pos[0], 0.02)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, journey.pos[1], 0.02)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, journey.pos[2], 0.02)
    
    // Add subtle breathing motion
    camera.position.x += Math.sin(time * 0.3) * 0.05
    camera.position.y += Math.cos(time * 0.2) * 0.03
    
    // Look at center
    camera.lookAt(new THREE.Vector3(...journey.lookAt))
  })
  
  return null
}

// ========================================
// DYNAMIC LIGHTING (No flickering)
// ========================================

function DynamicLighting() {
  const spotRef = useRef<THREE.SpotLight>(null)
  const pointRef = useRef<THREE.PointLight>(null)
  const currentSection = useStore((state) => state.currentSection)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const colors = VIBRANT_COLORS[currentSection as keyof typeof VIBRANT_COLORS] || VIBRANT_COLORS.hero
    const targetColor = new THREE.Color(colors.accent)
    
    if (spotRef.current) {
      // Very smooth color transition (0.01 lerp factor)
      spotRef.current.color.lerp(targetColor, 0.01)
      // Gentle spotlight movement
      spotRef.current.position.x = Math.cos(time * 0.1) * 5
      spotRef.current.position.z = Math.sin(time * 0.1) * 5
    }
    
    if (pointRef.current) {
      // Very smooth color transition
      pointRef.current.color.lerp(targetColor, 0.01)
      // Stable intensity - no pulsing to avoid flicker
      pointRef.current.intensity = 0.4
    }
  })
  
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight
        ref={spotRef}
        position={[5, 8, 5]}
        angle={0.5}
        penumbra={1}
        intensity={0.6}
        color="#ff8800"
      />
      <pointLight
        ref={pointRef}
        position={[0, 0, 2]}
        intensity={0.4}
        color="#ff8800"
        distance={15}
      />
    </>
  )
}

// ========================================
// SMOOTH DYNAMIC BACKGROUND
// ========================================

function DynamicBackground() {
  const { scene } = useThree()
  const currentSection = useStore((state) => state.currentSection)
  const targetColorRef = useRef(new THREE.Color(VIBRANT_COLORS.hero.bg))
  
  useFrame(() => {
    const colors = VIBRANT_COLORS[currentSection as keyof typeof VIBRANT_COLORS] || VIBRANT_COLORS.hero
    const newTarget = new THREE.Color(colors.bg)
    
    // Update target color smoothly
    targetColorRef.current.lerp(newTarget, 0.008)
    
    // Initialize background if needed
    if (!(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color(VIBRANT_COLORS.hero.bg)
    }
    
    // Very smooth background transition (0.008 = ~2-3 seconds transition)
    ;(scene.background as THREE.Color).lerp(targetColorRef.current, 0.015)
    
    // Update fog to match
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2(colors.bg, 0.06)
    } else if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.lerp(targetColorRef.current, 0.015)
    }
  })
  
  return null
}

// ========================================
// SCROLL TRIGGER SETUP
// ========================================

function ScrollManager() {
  const setScrollProgress = useStore((state) => state.setScrollProgress)
  
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'main',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        },
      })
    })
    
    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [setScrollProgress])
  
  return null
}

// ========================================
// MAIN EXPERIENCE
// ========================================

export function Experience() {
  return (
    <group>
      <ScrollManager />
      <DynamicBackground />
      <CameraController />
      <DynamicLighting />
      <Environment preset="night" />
      <Emergence />
      <Effects />
    </group>
  )
}
