'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// ========================================
// FLOWING 3D PRESENCE - RESPONSIVE & DIMMED FOR MOBILE
// ========================================

const PARTICLE_COUNT = 2500

export function Emergence() {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const ringRefs = useRef<THREE.Mesh[]>([])
  
  const scrollProgress = useStore((state) => state.scrollProgress)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const pulseEffect = useStore((state) => state.pulseEffect)
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { viewport, size } = useThree()
  
  // Detect mobile based on actual pixel width
  const isMobile = size.width < 768
  const isTablet = size.width >= 768 && size.width < 1024
  
  // Responsive scale: bigger on mobile now, but dimmer
  const responsiveScale = isMobile ? 0.85 : isTablet ? 0.7 : 1
  
  // Mobile dimming factor for opacity
  const mobileDimFactor = isMobile ? 0.4 : 1
  
  const handlePointerMove = useCallback((e: THREE.Event) => {
    const event = e as unknown as { clientX: number; clientY: number }
    setMousePos({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    })
  }, [])
  
  // Generate particles with more variety
  const { positions, velocities, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const siz = new Float32Array(PARTICLE_COUNT)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 1.5 + Math.random() * 0.8
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)
      
      vel[i3] = (Math.random() - 0.5) * 0.02
      vel[i3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02
      
      siz[i] = Math.random() * 0.5 + 0.5
    }
    
    return { positions: pos, velocities: vel, sizes: siz }
  }, [])
  
  // Section-based parameters - BIGGER but DIMMER on mobile
  const getSectionParams = useCallback((section: string) => {
    if (isMobile) {
      // Mobile: bigger size but positioned to avoid text, with smooth scroll response
      const mobileParams = {
        hero: { 
          x: viewport.width * 0.32, 
          y: viewport.height * 0.25, 
          scale: 0.9,
          brightness: 0.5,
        },
        problem: { 
          x: -viewport.width * 0.32, 
          y: viewport.height * 0.28, 
          scale: 0.85,
          brightness: 0.45,
        },
        approach: { 
          x: viewport.width * 0.3, 
          y: viewport.height * 0.3, 
          scale: 0.8,
          brightness: 0.5,
        },
        blueprint: { 
          x: viewport.width * 0.35, 
          y: -viewport.height * 0.15, 
          scale: 0.75,
          brightness: 0.45,
        },
        sandbox: { 
          x: -viewport.width * 0.38, 
          y: viewport.height * 0.32, 
          scale: 0.7,
          brightness: 0.4,
        },
        work: { 
          x: viewport.width * 0.38, 
          y: viewport.height * 0.3, 
          scale: 0.7,
          brightness: 0.4,
        },
        contact: { 
          x: 0, 
          y: viewport.height * 0.35, 
          scale: 1,
          brightness: 0.5,
        },
      }
      
      const params = mobileParams[section as keyof typeof mobileParams] || mobileParams.hero
      
      return {
        x: params.x,
        y: params.y,
        scale: params.scale * responsiveScale,
        spread: 0.9,
        speed: 0.8,
        color: '#f9a86c',
        brightness: params.brightness,
      }
    }
    
    // Tablet adjustments
    const tabletMultiplier = isTablet ? 0.85 : 1
    
    switch (section) {
      case 'hero':
        return { 
          x: viewport.width * 0.28 * tabletMultiplier, 
          y: 0,
          scale: 1.2 * responsiveScale,
          spread: 1,
          speed: 1,
          color: '#f9a86c',
          brightness: 1.2,
        }
      case 'problem':
        return { 
          x: -viewport.width * 0.28 * tabletMultiplier,
          y: 0,
          scale: 1 * responsiveScale,
          spread: 1.3,
          speed: 0.6,
          color: '#9a9a9a',
          brightness: 1,
        }
      case 'approach':
        return { 
          x: viewport.width * 0.28 * tabletMultiplier,
          y: 0,
          scale: 0.9 * responsiveScale,
          spread: 0.8,
          speed: 0.8,
          color: '#d4a574',
          brightness: 1.3,
        }
      case 'blueprint':
        return { 
          x: viewport.width * 0.42 * tabletMultiplier,
          y: -viewport.height * 0.12,
          scale: 0.7 * responsiveScale,
          spread: 0.6,
          speed: 1.5,
          color: '#ffc085',
          brightness: 1.5,
        }
      case 'sandbox':
        return { 
          x: -viewport.width * 0.45 * tabletMultiplier,
          y: viewport.height * 0.2,
          scale: 0.5 * responsiveScale,
          spread: 0.7,
          speed: 1.2,
          color: '#f9a86c',
          brightness: 1.4,
        }
      case 'work':
        return { 
          x: viewport.width * 0.45 * tabletMultiplier,
          y: viewport.height * 0.15,
          scale: 0.5 * responsiveScale,
          spread: 0.8,
          speed: 0.9,
          color: '#d8b090',
          brightness: 1.2,
        }
      case 'contact':
        return { 
          x: 0,
          y: viewport.height * 0.25,
          scale: 1.4 * responsiveScale,
          spread: 0.5,
          speed: 0.5,
          color: '#ffc085',
          brightness: 1.6,
        }
      default:
        return { 
          x: viewport.width * 0.2,
          y: 0,
          scale: 1 * responsiveScale,
          spread: 1,
          speed: 1,
          color: '#f9a86c',
          brightness: 1.2,
        }
    }
  }, [viewport, isMobile, isTablet, responsiveScale])
  
  // Smooth transition refs
  const currentX = useRef(0)
  const currentY = useRef(0)
  const currentScale = useRef(1)
  const currentSpread = useRef(1)
  const currentSpeed = useRef(1)
  const currentColor = useRef(new THREE.Color('#f9a86c'))
  const currentBrightness = useRef(1.2)
  const pulseIntensity = useRef(0)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const params = getSectionParams(currentSection)
    
    // Smooth transitions - faster on mobile for better scroll responsiveness
    const lerpSpeed = isMobile ? 0.05 : 0.03
    currentX.current = THREE.MathUtils.lerp(currentX.current, params.x, lerpSpeed)
    currentY.current = THREE.MathUtils.lerp(currentY.current, params.y, lerpSpeed)
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, params.scale, lerpSpeed)
    currentSpread.current = THREE.MathUtils.lerp(currentSpread.current, params.spread, 0.02)
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, params.speed, 0.02)
    currentColor.current.lerp(new THREE.Color(params.color), 0.02)
    currentBrightness.current = THREE.MathUtils.lerp(currentBrightness.current, params.brightness, 0.02)
    
    // Enhanced pulse effect
    if (pulseEffect || isGenerating) {
      pulseIntensity.current = THREE.MathUtils.lerp(pulseIntensity.current, 1, 0.15)
    } else {
      pulseIntensity.current = THREE.MathUtils.lerp(pulseIntensity.current, 0, 0.05)
    }
    
    // Update group
    if (groupRef.current) {
      groupRef.current.position.x = currentX.current
      groupRef.current.position.y = currentY.current
      groupRef.current.scale.setScalar(currentScale.current)
      
      // Enhanced rotation with wave motion
      groupRef.current.rotation.y = time * 0.12 + scrollProgress * Math.PI * 1.5
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.15 + Math.sin(time * 0.3) * 0.05
      groupRef.current.rotation.z = Math.cos(time * 0.2) * 0.05
    }
    
    // Update particles with enhanced motion
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array
      const sizeArray = pointsRef.current.geometry.attributes.size.array as Float32Array
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        
        const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
        const theta = Math.PI * (1 + Math.sqrt(5)) * i
        const baseR = 1.5 * currentSpread.current
        
        // Enhanced animations
        const timeOffset = time * currentSpeed.current * 0.25
        const breathe = Math.sin(time * 0.5 + i * 0.001) * 0.12
        const pulse = Math.sin(time * 5 + i * 0.01) * pulseIntensity.current * 0.3
        const wave = Math.sin(time * 0.8 + phi * 3) * 0.08
        
        // Mouse influence (reduced on mobile for performance)
        const mouseInfluence = isMobile ? 0.1 : 0.25
        const dx = mousePos.x * mouseInfluence
        const dy = mousePos.y * mouseInfluence
        
        const r = baseR + breathe + pulse + wave
        const thetaAnimated = theta + timeOffset * 0.1
        
        posArray[i3] = r * Math.sin(phi) * Math.cos(thetaAnimated) + dx * (1 - phi / Math.PI)
        posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(thetaAnimated) + dy * Math.sin(phi)
        posArray[i3 + 2] = r * Math.cos(phi)
        
        // Add swirl motion
        posArray[i3] += velocities[i3] * Math.sin(time * 2 + i) + Math.cos(time * 0.5 + i) * 0.01
        posArray[i3 + 1] += velocities[i3 + 1] * Math.cos(time * 1.5 + i) + Math.sin(time * 0.7 + i) * 0.01
        posArray[i3 + 2] += velocities[i3 + 2] * Math.sin(time * 1.8 + i)
        
        // Animate particle sizes
        sizeArray[i] = sizes[i] * (1 + Math.sin(time * 2 + i * 0.1) * 0.3 + pulseIntensity.current * 0.5)
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.size.needsUpdate = true
      
      const material = pointsRef.current.material as THREE.PointsMaterial
      material.color.copy(currentColor.current)
      material.size = (isMobile ? 0.012 : 0.015) * currentBrightness.current + pulseIntensity.current * 0.01
      // Apply mobile dimming to opacity
      material.opacity = (0.7 * currentBrightness.current + pulseIntensity.current * 0.2) * mobileDimFactor
    }
    
    // Update core with enhanced glow - dimmed on mobile
    if (coreRef.current) {
      const coreScale = 0.3 + pulseIntensity.current * 0.2 + Math.sin(time * 2) * 0.05
      coreRef.current.scale.setScalar(coreScale)
      coreRef.current.rotation.x = time * 0.12 + Math.sin(time * 0.5) * 0.1
      coreRef.current.rotation.y = time * 0.18 + Math.cos(time * 0.3) * 0.1
      coreRef.current.rotation.z = time * 0.08
      
      const coreMat = coreRef.current.material as THREE.MeshStandardMaterial
      const coreEmissive = (0.4 * currentBrightness.current + pulseIntensity.current * 0.4 + (isGenerating ? Math.sin(time * 8) * 0.2 : 0) + Math.sin(time * 3) * 0.1) * mobileDimFactor
      coreMat.emissiveIntensity = coreEmissive
      coreMat.color.copy(currentColor.current)
      coreMat.emissive.copy(currentColor.current)
      coreMat.metalness = 0.95
      coreMat.roughness = 0.05
      // Apply mobile dimming to core opacity
      coreMat.opacity = 0.7 * mobileDimFactor
    }
    
    // Update rings with wave motion - dimmed on mobile
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        const ringScale = 0.5 * (1 + i * 0.4) + pulseIntensity.current * 0.12 + Math.sin(time * 1.5 + i) * 0.05
        ring.scale.setScalar(ringScale)
        ring.rotation.x = time * (0.1 + i * 0.04) + i * Math.PI * 0.33 + Math.sin(time * 0.7) * 0.1
        ring.rotation.y = time * (0.15 + i * 0.03) + Math.cos(time * 0.5) * 0.1
        ring.rotation.z = Math.sin(time * 0.3 + i) * 0.15
        
        const ringMat = ring.material as THREE.MeshBasicMaterial
        ringMat.color.copy(currentColor.current)
        // Apply mobile dimming to ring opacity
        ringMat.opacity = ((0.15 - i * 0.03) * currentBrightness.current + pulseIntensity.current * 0.08) * mobileDimFactor
      }
    })
  })
  
  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={PARTICLE_COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#f9a86c"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors={false}
        />
      </points>
      
      {/* Core with enhanced glow */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#f9a86c"
          emissive="#f9a86c"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      
      {/* Rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el }}
        >
          <torusGeometry args={[2 + i * 0.7, 0.01, 16, 100]} />
          <meshBasicMaterial
            color="#f9a86c"
            transparent
            opacity={0.15 - i * 0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
