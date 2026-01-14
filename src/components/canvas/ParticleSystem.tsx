'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

const PARTICLE_COUNT = 5000

export function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollProgress = useStore((state) => state.scrollProgress)
  const currentSection = useStore((state) => state.currentSection)
  const colorPalette = useStore((state) => state.colorPalette)
  
  // Generate random initial positions
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return pos
  }, [])
  
  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = Math.random() * 2 + 0.5
    }
    return s
  }, [])
  
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Section-specific behaviors
    switch (currentSection) {
      case 'hero':
        // Gentle floating cloud
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3
          positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.001
        }
        pointsRef.current.rotation.y = time * 0.02
        break
        
      case 'discovery':
        // Organized grid with pulse
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3
          const pulse = Math.sin(time * 2 + i * 0.1) * 0.5
          positions[i3] += pulse * 0.001
        }
        pointsRef.current.rotation.y = time * 0.03
        break
        
      case 'sandbox':
        // Orbiting sphere
        pointsRef.current.rotation.y = time * 0.05
        pointsRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
        break
        
      case 'work':
        // Network connections
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3
          positions[i3 + 2] += Math.cos(time + i * 0.05) * 0.002
        }
        pointsRef.current.rotation.y = time * 0.04
        break
        
      case 'contact':
        // Flowing toward camera
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3
          positions[i3 + 2] += 0.05
          if (positions[i3 + 2] > 10) {
            positions[i3 + 2] = -50
          }
        }
        break
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update color
    const material = pointsRef.current.material as THREE.PointsMaterial
    const targetColor = new THREE.Color(colorPalette.particle)
    material.color.lerp(targetColor, 0.05)
  })
  
  return (
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
        size={0.05}
        color={colorPalette.particle}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
