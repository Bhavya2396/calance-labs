'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// ========================================
// INTERACTIVE PARTICLE SPHERE
// A cohesive, responsive 3D element
// ========================================

const PARTICLE_COUNT = 3000

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
  const { viewport } = useThree()
  
  // Track mouse for interactivity
  const handlePointerMove = useCallback((e: THREE.Event) => {
    const event = e as unknown as { clientX: number; clientY: number }
    setMousePos({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    })
  }, [])
  
  // Generate particles in a sphere
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 2 + Math.random() * 0.5
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)
      
      // Random velocities for organic movement
      vel[i3] = (Math.random() - 0.5) * 0.02
      vel[i3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02
    }
    
    return { positions: pos, velocities: vel }
  }, [])
  
  // Section-based parameters
  const getSectionParams = useCallback((section: string) => {
    switch (section) {
      case 'hero':
        return { spread: 1, speed: 1, color: '#c9956c', coreScale: 0.3, ringScale: 0.4 }
      case 'about':
        return { spread: 1.2, speed: 0.8, color: '#9ca3af', coreScale: 0.4, ringScale: 0.5 }
      case 'discovery':
        return { spread: 0.8, speed: 1.5, color: '#d4a574', coreScale: 0.6, ringScale: 0.8 }
      case 'sandbox':
        return { spread: 1.1, speed: 2, color: '#c9956c', coreScale: 0.5, ringScale: 0.7 }
      case 'work':
        return { spread: 1.3, speed: 1, color: '#a3a3a3', coreScale: 0.35, ringScale: 0.5 }
      case 'contact':
        return { spread: 0.6, speed: 0.5, color: '#d4a574', coreScale: 0.8, ringScale: 1 }
      default:
        return { spread: 1, speed: 1, color: '#c9956c', coreScale: 0.3, ringScale: 0.4 }
    }
  }, [])
  
  // Refs for smooth transitions
  const currentSpread = useRef(1)
  const currentSpeed = useRef(1)
  const currentColor = useRef(new THREE.Color('#c9956c'))
  const currentCoreScale = useRef(0.3)
  const pulseIntensity = useRef(0)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const params = getSectionParams(currentSection)
    
    // Smooth transitions
    currentSpread.current = THREE.MathUtils.lerp(currentSpread.current, params.spread, 0.02)
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, params.speed, 0.02)
    currentColor.current.lerp(new THREE.Color(params.color), 0.02)
    currentCoreScale.current = THREE.MathUtils.lerp(currentCoreScale.current, params.coreScale, 0.03)
    
    // Pulse effect
    if (pulseEffect || isGenerating) {
      pulseIntensity.current = THREE.MathUtils.lerp(pulseIntensity.current, 1, 0.1)
    } else {
      pulseIntensity.current = THREE.MathUtils.lerp(pulseIntensity.current, 0, 0.05)
    }
    
    // Update particles
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        
        // Get original sphere position
        const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
        const theta = Math.PI * (1 + Math.sqrt(5)) * i
        const baseR = 2 * currentSpread.current
        
        // Add time-based movement
        const timeOffset = time * currentSpeed.current * 0.3
        const breathe = Math.sin(time * 0.5 + i * 0.001) * 0.1
        const pulse = Math.sin(time * 3 + i * 0.01) * pulseIntensity.current * 0.3
        
        // Mouse influence
        const mouseInfluence = 0.3
        const dx = mousePos.x * mouseInfluence
        const dy = mousePos.y * mouseInfluence
        
        // Calculate position
        const r = baseR + breathe + pulse
        const thetaAnimated = theta + timeOffset * 0.1
        
        posArray[i3] = r * Math.sin(phi) * Math.cos(thetaAnimated) + dx * (1 - phi / Math.PI)
        posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(thetaAnimated) + dy * Math.sin(phi)
        posArray[i3 + 2] = r * Math.cos(phi)
        
        // Add velocity for organic feel
        posArray[i3] += velocities[i3] * Math.sin(time * 2 + i)
        posArray[i3 + 1] += velocities[i3 + 1] * Math.cos(time * 1.5 + i)
        posArray[i3 + 2] += velocities[i3 + 2] * Math.sin(time * 1.8 + i)
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      
      // Update material
      const material = pointsRef.current.material as THREE.PointsMaterial
      material.color.copy(currentColor.current)
      material.size = 0.015 + pulseIntensity.current * 0.01
      material.opacity = 0.6 + pulseIntensity.current * 0.2
    }
    
    // Update core
    if (coreRef.current) {
      const scale = currentCoreScale.current + pulseIntensity.current * 0.2 + Math.sin(time * 2) * 0.05
      coreRef.current.scale.setScalar(scale)
      coreRef.current.rotation.x = time * 0.1
      coreRef.current.rotation.y = time * 0.15
      
      const coreMat = coreRef.current.material as THREE.MeshStandardMaterial
      coreMat.emissiveIntensity = 0.3 + pulseIntensity.current * 0.4 + (isGenerating ? Math.sin(time * 8) * 0.2 : 0)
      coreMat.color.copy(currentColor.current)
      coreMat.emissive.copy(currentColor.current)
    }
    
    // Update rings
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        const ringScale = params.ringScale * (1 + i * 0.3) + pulseIntensity.current * 0.1
        ring.scale.setScalar(ringScale)
        ring.rotation.x = time * (0.1 + i * 0.05) + i * Math.PI * 0.3
        ring.rotation.y = time * (0.15 + i * 0.03)
        
        const ringMat = ring.material as THREE.MeshBasicMaterial
        ringMat.color.copy(currentColor.current)
        ringMat.opacity = 0.15 - i * 0.03 + pulseIntensity.current * 0.1
      }
    })
    
    // Rotate entire group based on scroll
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2 + time * 0.05
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.2
      
      // Position based on viewport
      groupRef.current.position.x = viewport.width * 0.15
    }
  })
  
  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {/* Particle cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#c9956c"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Central core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#c9956c"
          emissive="#c9956c"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      
      {/* Orbital rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el }}
        >
          <torusGeometry args={[2 + i * 0.8, 0.01, 16, 100]} />
          <meshBasicMaterial
            color="#c9956c"
            transparent
            opacity={0.15 - i * 0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
