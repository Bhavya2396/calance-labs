'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// ========================================
// CONSTANTS - Refined for subtlety
// ========================================

const PARTICLE_COUNT = 1800
const MAX_CONNECTIONS = 80

// Muted, elegant color palette - less saturated, more grey
const COLORS = {
  hero: { primary: '#d4a574', secondary: '#8b7355' },      // Warm taupe
  about: { primary: '#9ca3af', secondary: '#6b7280' },     // Cool grey
  discovery: { primary: '#c9956c', secondary: '#a67c52' }, // Warm bronze
  sandbox: { primary: '#b8977a', secondary: '#967a5d' },   // Muted tan
  work: { primary: '#a3a3a3', secondary: '#737373' },      // Neutral grey
  contact: { primary: '#c9b896', secondary: '#a69a7c' },   // Soft cream
}

// ========================================
// PARTICLE FIELD - Elegant, Minimal
// ========================================

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollProgress = useStore((state) => state.scrollProgress)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const pulseEffect = useStore((state) => state.pulseEffect)
  const currentColorRef = useRef(new THREE.Color(COLORS.hero.primary))
  const pulseRef = useRef(0)
  
  // Generate initial positions - positioned to the right to not interfere with text
  const { positions, originalPositions, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const orig = new Float32Array(PARTICLE_COUNT * 3)
    const s = new Float32Array(PARTICLE_COUNT)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 3
      
      // Offset to the right side of viewport
      pos[i3] = r * Math.sin(phi) * Math.cos(theta) + 2
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi) - 1
      
      orig[i3] = pos[i3]
      orig[i3 + 1] = pos[i3 + 1]
      orig[i3 + 2] = pos[i3 + 2]
      
      s[i] = 0.008 + Math.random() * 0.015 // Smaller particles
    }
    
    return { positions: pos, originalPositions: orig, sizes: s }
  }, [])
  
  // Elegant, minimal formations
  const getTargetFormation = useMemo(() => {
    return (section: string) => {
      const targets = new Float32Array(PARTICLE_COUNT * 3)
      const centerX = 2.5 // Keep to the right
      const centerZ = 0
      
      switch (section) {
        case 'hero':
          // Soft nebula - breathing cloud
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const theta = (i / PARTICLE_COUNT) * Math.PI * 2 * 3 + i * 0.05
            const phi = Math.acos(2 * (i / PARTICLE_COUNT) - 1)
            const r = 2 + Math.sin(i * 0.01) * 1
            targets[i3] = r * Math.sin(phi) * Math.cos(theta) + centerX
            targets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
            targets[i3 + 2] = r * Math.cos(phi) * 0.8 + centerZ
          }
          break
          
        case 'about':
          // Vertical flowing stream
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const t = i / PARTICLE_COUNT
            const wave = Math.sin(t * Math.PI * 6) * 0.8
            const depth = Math.cos(t * Math.PI * 4) * 0.5
            targets[i3] = wave + centerX
            targets[i3 + 1] = (t - 0.5) * 5
            targets[i3 + 2] = depth + centerZ
          }
          break
          
        case 'discovery':
          // Sphere transforming into data visualization
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const t = i / PARTICLE_COUNT
            const y = 1 - 2 * t
            const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
            const theta = (Math.sqrt(5) - 1) / 2 * i * Math.PI * 2
            targets[i3] = radiusAtY * Math.cos(theta) * 1.8 + centerX
            targets[i3 + 1] = y * 1.5
            targets[i3 + 2] = radiusAtY * Math.sin(theta) * 1.8 + centerZ
          }
          break
          
        case 'sandbox':
          // Orbital rings
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const ring = Math.floor(i / (PARTICLE_COUNT / 4))
            const posInRing = (i % (PARTICLE_COUNT / 4)) / (PARTICLE_COUNT / 4)
            const angle = posInRing * Math.PI * 2
            const r = 1 + ring * 0.5
            const tilt = ring * 0.3
            targets[i3] = Math.cos(angle) * r + centerX
            targets[i3 + 1] = Math.sin(angle + tilt) * 0.3 * (ring + 1)
            targets[i3 + 2] = Math.sin(angle) * r + centerZ
          }
          break
          
        case 'work':
          // Grid formation
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const gridSize = Math.ceil(Math.sqrt(PARTICLE_COUNT))
            const x = (i % gridSize) / gridSize
            const y = Math.floor(i / gridSize) / gridSize
            const wave = Math.sin(x * Math.PI * 2) * Math.cos(y * Math.PI * 2) * 0.3
            targets[i3] = (x - 0.5) * 4 + centerX
            targets[i3 + 1] = (y - 0.5) * 3
            targets[i3 + 2] = wave + centerZ
          }
          break
          
        case 'contact':
          // Converging spiral
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const t = i / PARTICLE_COUNT
            const spiralAngle = t * Math.PI * 8
            const r = (1 - t) * 2.5
            targets[i3] = Math.cos(spiralAngle) * r + centerX
            targets[i3 + 1] = (t - 0.5) * 3
            targets[i3 + 2] = Math.sin(spiralAngle) * r + centerZ
          }
          break
          
        default:
          for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            targets[i] = originalPositions[i]
          }
      }
      
      return targets
    }
  }, [originalPositions])
  
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const time = state.clock.elapsedTime
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array
    const targets = getTargetFormation(currentSection)
    
    // Pulse effect handling
    if (pulseEffect) {
      pulseRef.current = Math.min(pulseRef.current + 0.1, 1)
    } else {
      pulseRef.current = Math.max(pulseRef.current - 0.02, 0)
    }
    
    // Smooth, slow lerp
    const baseLerp = isGenerating ? 0.02 : 0.008
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      
      posArray[i3] = THREE.MathUtils.lerp(posArray[i3], targets[i3], baseLerp)
      posArray[i3 + 1] = THREE.MathUtils.lerp(posArray[i3 + 1], targets[i3 + 1], baseLerp)
      posArray[i3 + 2] = THREE.MathUtils.lerp(posArray[i3 + 2], targets[i3 + 2], baseLerp)
      
      // Very subtle floating motion
      const floatIntensity = 0.003
      posArray[i3] += Math.sin(time * 0.3 + i * 0.005) * floatIntensity
      posArray[i3 + 1] += Math.cos(time * 0.2 + i * 0.008) * floatIntensity
      posArray[i3 + 2] += Math.sin(time * 0.25 + i * 0.006) * floatIntensity
      
      // Pulse expansion
      if (pulseRef.current > 0) {
        const pulseExpand = Math.sin(i * 0.01 + time * 4) * pulseRef.current * 0.15
        const dir = new THREE.Vector3(
          posArray[i3] - 2.5, 
          posArray[i3 + 1], 
          posArray[i3 + 2]
        ).normalize()
        posArray[i3] += dir.x * pulseExpand
        posArray[i3 + 1] += dir.y * pulseExpand
        posArray[i3 + 2] += dir.z * pulseExpand
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Color transition
    const sectionColors = COLORS[currentSection as keyof typeof COLORS] || COLORS.hero
    const targetColor = new THREE.Color(sectionColors.primary)
    currentColorRef.current.lerp(targetColor, 0.005)
    
    const material = pointsRef.current.material as THREE.PointsMaterial
    material.color.copy(currentColorRef.current)
    
    // Subtle size variation
    material.size = 0.02 + (isGenerating ? Math.sin(time * 6) * 0.005 : 0)
    
    // Very slow rotation
    pointsRef.current.rotation.y = time * 0.02 + scrollProgress * Math.PI * 0.3
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
        size={0.02}
        color="#d4a574"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ========================================
// CONNECTION WEB - Subtle Neural Pathways
// ========================================

function ConnectionWeb() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const currentColorRef = useRef(new THREE.Color(COLORS.hero.secondary))
  const currentOpacityRef = useRef(0.05)
  
  const positions = useMemo(() => {
    return new Float32Array(MAX_CONNECTIONS * 6)
  }, [])
  
  useFrame((state) => {
    if (!linesRef.current) return
    
    const time = state.clock.elapsedTime
    const posArray = linesRef.current.geometry.attributes.position.array as Float32Array
    
    // Much more subtle connections
    let targetStrength = 
      currentSection === 'hero' ? 0.1 :
      currentSection === 'about' ? 0.3 :
      currentSection === 'discovery' ? 0.5 :
      currentSection === 'sandbox' ? 0.4 :
      currentSection === 'work' ? 0.5 :
      currentSection === 'contact' ? 0.3 : 0.1
    
    if (isGenerating) targetStrength = 0.7
    
    currentOpacityRef.current = THREE.MathUtils.lerp(currentOpacityRef.current, targetStrength * 0.12, 0.01)
    
    const numActiveConnections = Math.floor(MAX_CONNECTIONS * targetStrength)
    const centerX = 2.5
    
    for (let i = 0; i < MAX_CONNECTIONS; i++) {
      const i6 = i * 6
      
      if (i < numActiveConnections) {
        const angle1 = (i / numActiveConnections) * Math.PI * 2 + time * 0.08
        const angle2 = angle1 + Math.PI * 0.15
        const r1 = 0.3 + Math.sin(time * 0.3 + i * 0.1) * 0.2
        const r2 = 1.2 + Math.cos(time * 0.2 + i * 0.08) * 0.4
        
        posArray[i6] = Math.cos(angle1) * r1 + centerX
        posArray[i6 + 1] = Math.sin(time * 0.15 + i * 0.08) * 0.3
        posArray[i6 + 2] = Math.sin(angle1) * r1
        
        posArray[i6 + 3] = Math.cos(angle2) * r2 + centerX
        posArray[i6 + 4] = Math.sin(time * 0.12 + i * 0.1) * 0.5
        posArray[i6 + 5] = Math.sin(angle2) * r2
      } else {
        for (let j = 0; j < 6; j++) {
          posArray[i6 + j] = 0
        }
      }
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true
    
    const sectionColors = COLORS[currentSection as keyof typeof COLORS] || COLORS.hero
    const targetColor = new THREE.Color(sectionColors.secondary)
    currentColorRef.current.lerp(targetColor, 0.005)
    
    const material = linesRef.current.material as THREE.LineBasicMaterial
    material.color.copy(currentColorRef.current)
    material.opacity = currentOpacityRef.current
  })
  
  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_CONNECTIONS * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#8b7355"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}

// ========================================
// AMBIENT ORB - Subtle central presence
// ========================================

function AmbientOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const pulseEffect = useStore((state) => state.pulseEffect)
  const currentScaleRef = useRef(0)
  const pulseRef = useRef(0)
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Subtle presence
    let targetPresence = 
      currentSection === 'hero' ? 0.15 :
      currentSection === 'about' ? 0.2 :
      currentSection === 'discovery' ? 0.4 :
      currentSection === 'sandbox' ? 0.35 :
      currentSection === 'work' ? 0.3 :
      currentSection === 'contact' ? 0.5 : 0
    
    if (pulseEffect) {
      pulseRef.current = Math.min(pulseRef.current + 0.08, 1)
    } else {
      pulseRef.current = Math.max(pulseRef.current - 0.015, 0)
    }
    
    if (isGenerating) targetPresence *= 1.2
    
    currentScaleRef.current = THREE.MathUtils.lerp(currentScaleRef.current, targetPresence, 0.015)
    const scale = currentScaleRef.current + pulseRef.current * 0.15
    
    meshRef.current.scale.set(scale, scale, scale)
    glowRef.current.scale.set(scale * 2, scale * 2, scale * 2)
    
    // Positioned to the right
    meshRef.current.position.set(2.5, 0, 0)
    glowRef.current.position.set(2.5, 0, 0)
    
    // Gentle rotation
    meshRef.current.rotation.x = time * 0.05
    meshRef.current.rotation.y = time * 0.08
    
    glowRef.current.rotation.x = -time * 0.02
    glowRef.current.rotation.y = -time * 0.05
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    material.emissiveIntensity = 0.3 + pulseRef.current * 0.2
  })
  
  return (
    <group>
      <mesh ref={meshRef} scale={0}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#c9a882"
          emissive="#a08060"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <mesh ref={glowRef} scale={0}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#b89b78"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// ========================================
// FLOATING RINGS - Elegant orbital elements
// ========================================

function FloatingRings() {
  const ringsRef = useRef<THREE.Group>(null)
  const currentSection = useStore((state) => state.currentSection)
  const scalesRef = useRef([0, 0, 0])
  const currentColorRef = useRef(new THREE.Color(COLORS.hero.secondary))
  
  useFrame((state) => {
    if (!ringsRef.current) return
    
    const time = state.clock.elapsedTime
    
    let targetPresence = 
      currentSection === 'hero' ? 0.1 :
      currentSection === 'about' ? 0.2 :
      currentSection === 'discovery' ? 0.3 :
      currentSection === 'sandbox' ? 0.5 :
      currentSection === 'work' ? 0.4 :
      currentSection === 'contact' ? 0.3 : 0
    
    const sectionColors = COLORS[currentSection as keyof typeof COLORS] || COLORS.hero
    const targetColor = new THREE.Color(sectionColors.secondary)
    currentColorRef.current.lerp(targetColor, 0.005)
    
    ringsRef.current.children.forEach((ring, i) => {
      const mesh = ring as THREE.Mesh
      
      scalesRef.current[i] = THREE.MathUtils.lerp(scalesRef.current[i], targetPresence, 0.01)
      const scale = scalesRef.current[i]
      mesh.scale.set(scale, scale, scale)
      
      mesh.position.set(2.5, 0, 0)
      
      // Slow, elegant rotation
      mesh.rotation.x = time * (0.06 + i * 0.03)
      mesh.rotation.y = time * (0.09 + i * 0.02)
      mesh.rotation.z = time * (0.03 + i * 0.01)
      
      const material = mesh.material as THREE.MeshBasicMaterial
      material.color.copy(currentColorRef.current)
    })
  })
  
  return (
    <group ref={ringsRef}>
      {[1, 1.4, 1.8].map((radius, i) => (
        <mesh key={i} scale={0}>
          <torusGeometry args={[radius, 0.008, 16, 64]} />
          <meshBasicMaterial
            color="#8b7355"
            transparent
            opacity={0.2 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ========================================
// MAIN EMERGENCE COMPONENT
// ========================================

export function Emergence() {
  const groupRef = useRef<THREE.Group>(null)
  
  return (
    <group ref={groupRef}>
      <ParticleField />
      <ConnectionWeb />
      <AmbientOrb />
      <FloatingRings />
    </group>
  )
}
