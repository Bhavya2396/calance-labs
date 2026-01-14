'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// ========================================
// FLOWING 3D PRESENCE
// Moves and transforms with scroll
// Never collides with text
// ========================================

const PARTICLE_COUNT = 2000

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
  
  const handlePointerMove = useCallback((e: THREE.Event) => {
    const event = e as unknown as { clientX: number; clientY: number }
    setMousePos({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    })
  }, [])
  
  // Generate particles
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 1.5 + Math.random() * 0.5
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)
      
      vel[i3] = (Math.random() - 0.5) * 0.015
      vel[i3 + 1] = (Math.random() - 0.5) * 0.015
      vel[i3 + 2] = (Math.random() - 0.5) * 0.015
    }
    
    return { positions: pos, velocities: vel }
  }, [])
  
  // Section-based positioning
  // Blueprint & Sandbox are full-width sections, so 3D moves to edges
  const getSectionParams = useCallback((section: string) => {
    switch (section) {
      case 'hero':
        return { 
          x: viewport.width * 0.25, 
          y: 0,
          scale: 1.2,
          spread: 1,
          speed: 0.8,
          color: '#c9956c',
        }
      case 'problem':
        return { 
          x: -viewport.width * 0.25,
          y: 0,
          scale: 1,
          spread: 1.3,
          speed: 0.5,
          color: '#7a7a7a',
        }
      case 'approach':
        return { 
          x: viewport.width * 0.25,
          y: 0,
          scale: 0.9,
          spread: 0.8,
          speed: 0.6,
          color: '#a89078',
        }
      case 'blueprint':
        return { 
          x: viewport.width * 0.35, // Far right for 2-column layout
          y: -viewport.height * 0.1,
          scale: 0.8,
          spread: 0.6,
          speed: 1.2,
          color: '#d4a574',
        }
      case 'sandbox':
        return { 
          x: -viewport.width * 0.35, // Far left for 2-column layout
          y: 0,
          scale: 0.9,
          spread: 0.9,
          speed: 1,
          color: '#c9956c',
        }
      case 'work':
        return { 
          x: viewport.width * 0.35,
          y: 0,
          scale: 0.8,
          spread: 1,
          speed: 0.7,
          color: '#b8a090',
        }
      case 'contact':
        return { 
          x: 0,
          y: viewport.height * 0.2,
          scale: 1.4,
          spread: 0.5,
          speed: 0.4,
          color: '#d4a574',
        }
      default:
        return { 
          x: viewport.width * 0.2,
          y: 0,
          scale: 1,
          spread: 1,
          speed: 0.8,
          color: '#c9956c',
        }
    }
  }, [viewport])
  
  // Smooth transition refs
  const currentX = useRef(0)
  const currentY = useRef(0)
  const currentScale = useRef(1)
  const currentSpread = useRef(1)
  const currentSpeed = useRef(1)
  const currentColor = useRef(new THREE.Color('#c9956c'))
  const pulseIntensity = useRef(0)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const params = getSectionParams(currentSection)
    
    // Smooth position transitions
    currentX.current = THREE.MathUtils.lerp(currentX.current, params.x, 0.03)
    currentY.current = THREE.MathUtils.lerp(currentY.current, params.y, 0.03)
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, params.scale, 0.03)
    currentSpread.current = THREE.MathUtils.lerp(currentSpread.current, params.spread, 0.02)
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, params.speed, 0.02)
    currentColor.current.lerp(new THREE.Color(params.color), 0.02)
    
    // Pulse effect
    if (pulseEffect || isGenerating) {
      pulseIntensity.current = THREE.MathUtils.lerp(pulseIntensity.current, 1, 0.1)
    } else {
      pulseIntensity.current = THREE.MathUtils.lerp(pulseIntensity.current, 0, 0.05)
    }
    
    // Update group position
    if (groupRef.current) {
      groupRef.current.position.x = currentX.current
      groupRef.current.position.y = currentY.current
      groupRef.current.scale.setScalar(currentScale.current)
      
      // Gentle rotation
      groupRef.current.rotation.y = time * 0.1 + scrollProgress * Math.PI
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.1
    }
    
    // Update particles
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        
        const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT)
        const theta = Math.PI * (1 + Math.sqrt(5)) * i
        const baseR = 1.5 * currentSpread.current
        
        const timeOffset = time * currentSpeed.current * 0.2
        const breathe = Math.sin(time * 0.4 + i * 0.001) * 0.08
        const pulse = Math.sin(time * 4 + i * 0.01) * pulseIntensity.current * 0.2
        
        // Mouse influence (subtle)
        const mouseInfluence = 0.15
        const dx = mousePos.x * mouseInfluence
        const dy = mousePos.y * mouseInfluence
        
        const r = baseR + breathe + pulse
        const thetaAnimated = theta + timeOffset * 0.08
        
        posArray[i3] = r * Math.sin(phi) * Math.cos(thetaAnimated) + dx * (1 - phi / Math.PI)
        posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(thetaAnimated) + dy * Math.sin(phi)
        posArray[i3 + 2] = r * Math.cos(phi)
        
        posArray[i3] += velocities[i3] * Math.sin(time * 1.5 + i)
        posArray[i3 + 1] += velocities[i3 + 1] * Math.cos(time + i)
        posArray[i3 + 2] += velocities[i3 + 2] * Math.sin(time * 1.2 + i)
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      
      const material = pointsRef.current.material as THREE.PointsMaterial
      material.color.copy(currentColor.current)
      material.size = 0.012 + pulseIntensity.current * 0.008
      material.opacity = 0.5 + pulseIntensity.current * 0.2
    }
    
    // Update core
    if (coreRef.current) {
      const coreScale = 0.25 + pulseIntensity.current * 0.15 + Math.sin(time * 1.5) * 0.03
      coreRef.current.scale.setScalar(coreScale)
      coreRef.current.rotation.x = time * 0.08
      coreRef.current.rotation.y = time * 0.12
      
      const coreMat = coreRef.current.material as THREE.MeshStandardMaterial
      coreMat.emissiveIntensity = 0.2 + pulseIntensity.current * 0.3 + (isGenerating ? Math.sin(time * 6) * 0.15 : 0)
      coreMat.color.copy(currentColor.current)
      coreMat.emissive.copy(currentColor.current)
    }
    
    // Update rings
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        const ringScale = 0.4 * (1 + i * 0.4) + pulseIntensity.current * 0.08
        ring.scale.setScalar(ringScale)
        ring.rotation.x = time * (0.08 + i * 0.03) + i * Math.PI * 0.33
        ring.rotation.y = time * (0.1 + i * 0.02)
        
        const ringMat = ring.material as THREE.MeshBasicMaterial
        ringMat.color.copy(currentColor.current)
        ringMat.opacity = 0.1 - i * 0.02 + pulseIntensity.current * 0.05
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
        </bufferGeometry>
        <pointsMaterial
          size={0.012}
          color="#c9956c"
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#c9956c"
          emissive="#c9956c"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
      
      {/* Rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el }}
        >
          <torusGeometry args={[2 + i * 0.6, 0.008, 16, 80]} />
          <meshBasicMaterial
            color="#c9956c"
            transparent
            opacity={0.1 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
