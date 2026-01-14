'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// ========================================
// CONSTANTS
// ========================================

const PARTICLE_COUNT = 2500
const MAX_CONNECTIONS = 120

// Orange and Grey color palette
const COLORS = {
  hero: { primary: '#ff8800', secondary: '#cc6600' },
  about: { primary: '#b8b8b8', secondary: '#999999' },
  discovery: { primary: '#ff9933', secondary: '#ffaa55' },
  sandbox: { primary: '#ff8800', secondary: '#ff6600' },
  work: { primary: '#ff7700', secondary: '#ff9944' },
  contact: { primary: '#c0c0c0', secondary: '#d0d0d0' },
}

// ========================================
// PARTICLE FIELD - Enhanced with Interactions
// ========================================

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollProgress = useStore((state) => state.scrollProgress)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const isInteracting = useStore((state) => state.isInteracting)
  const pulseEffect = useStore((state) => state.pulseEffect)
  const activeWorkIndex = useStore((state) => state.activeWorkIndex)
  const currentColorRef = useRef(new THREE.Color(COLORS.hero.primary))
  const pulseRef = useRef(0)
  
  // Generate initial positions
  const { positions, originalPositions, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const orig = new Float32Array(PARTICLE_COUNT * 3)
    const s = new Float32Array(PARTICLE_COUNT)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 4
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)
      
      orig[i3] = pos[i3]
      orig[i3 + 1] = pos[i3 + 1]
      orig[i3 + 2] = pos[i3 + 2]
      
      s[i] = 0.015 + Math.random() * 0.025
    }
    
    return { positions: pos, originalPositions: orig, sizes: s }
  }, [])
  
  // Enhanced target formations with more personality
  const getTargetFormation = useMemo(() => {
    return (section: string, workIndex: number) => {
      const targets = new Float32Array(PARTICLE_COUNT * 3)
      
      switch (section) {
        case 'hero':
          // Dynamic expanding cloud - breathing effect
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const theta = (i / PARTICLE_COUNT) * Math.PI * 2 * 4 + i * 0.08
            const phi = Math.acos(2 * (i / PARTICLE_COUNT) - 1)
            const r = 2.5 + Math.sin(i * 0.015) * 1.5
            targets[i3] = r * Math.sin(phi) * Math.cos(theta)
            targets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5
            targets[i3 + 2] = r * Math.cos(phi) + 1
          }
          break
          
        case 'about':
          // DNA Helix - representing intelligence/code
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const t = i / PARTICLE_COUNT
            const angle = t * Math.PI * 10
            const strand = i % 2 === 0 ? 1 : -1
            const r = 1.2 + Math.sin(t * Math.PI * 4) * 0.3
            targets[i3] = Math.cos(angle) * r * strand
            targets[i3 + 1] = (t - 0.5) * 6
            targets[i3 + 2] = Math.sin(angle) * r + 1
          }
          break
          
        case 'discovery':
          // Brain/lightbulb shape - representing ideas
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const t = i / PARTICLE_COUNT
            
            if (t < 0.7) {
              // Brain/sphere top
              const localT = t / 0.7
              const y = 1 - 2 * localT
              const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
              const theta = (Math.sqrt(5) - 1) / 2 * i * Math.PI * 2
              targets[i3] = radiusAtY * Math.cos(theta) * 2
              targets[i3 + 1] = y * 1.5 + 1
              targets[i3 + 2] = radiusAtY * Math.sin(theta) * 2 + 1
            } else {
              // Stem/base
              const localT = (t - 0.7) / 0.3
              const angle = localT * Math.PI * 4 + i * 0.05
              const r = 0.3 * (1 - localT * 0.5)
              targets[i3] = Math.cos(angle) * r
              targets[i3 + 1] = -localT * 2 - 0.5
              targets[i3 + 2] = Math.sin(angle) * r + 1
            }
          }
          break
          
        case 'sandbox':
          // Interactive pulse sphere with orbital activity
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const isCore = i < PARTICLE_COUNT * 0.4
            const isOrbital = i >= PARTICLE_COUNT * 0.4 && i < PARTICLE_COUNT * 0.7
            
            if (isCore) {
              // Pulsing core
              const t = i / (PARTICLE_COUNT * 0.4)
              const y = 1 - 2 * t
              const radiusAtY = Math.sqrt(1 - y * y)
              const theta = (Math.sqrt(5) - 1) / 2 * i * Math.PI * 2
              targets[i3] = radiusAtY * Math.cos(theta) * 1.5
              targets[i3 + 1] = y * 1.5
              targets[i3 + 2] = radiusAtY * Math.sin(theta) * 1.5 + 1
            } else if (isOrbital) {
              // Fast orbital rings
              const ringIndex = i - PARTICLE_COUNT * 0.4
              const ring = Math.floor(ringIndex / 250)
              const angleInRing = (ringIndex % 250) / 250 * Math.PI * 2
              const r = 2.2 + ring * 0.5
              targets[i3] = Math.cos(angleInRing) * r
              targets[i3 + 1] = Math.sin(angleInRing + ring) * 0.4
              targets[i3 + 2] = Math.sin(angleInRing) * r + 1
            } else {
              // Scattered energy particles
              const angle = Math.random() * Math.PI * 2
              const r = 3 + Math.random() * 2
              targets[i3] = Math.cos(angle) * r
              targets[i3 + 1] = (Math.random() - 0.5) * 3
              targets[i3 + 2] = Math.sin(angle) * r + 1
            }
          }
          break
          
        case 'work':
          // Project-specific formations based on active index
          const formations = [
            // Traffic - flowing streams
            (i: number, i3: number) => {
              const stream = Math.floor(i / 500)
              const posInStream = (i % 500) / 500
              const lanes = [-2, -1, 0, 1, 2]
              const lane = lanes[stream % 5]
              targets[i3] = lane * 0.8 + Math.sin(posInStream * Math.PI * 2) * 0.2
              targets[i3 + 1] = (posInStream - 0.5) * 6
              targets[i3 + 2] = Math.cos(posInStream * Math.PI * 2) * 0.3 + 1
            },
            // Maintenance - train shape
            (i: number, i3: number) => {
              const t = i / PARTICLE_COUNT
              if (t < 0.6) {
                // Body
                const localT = t / 0.6
                targets[i3] = (localT - 0.5) * 5
                targets[i3 + 1] = Math.sin(localT * Math.PI) * 0.8 - 0.5
                targets[i3 + 2] = Math.cos(i * 0.02) * 0.5 + 1
              } else {
                // Wheels/sensors
                const localT = (t - 0.6) / 0.4
                const angle = localT * Math.PI * 8
                targets[i3] = Math.cos(angle) * 0.4 + (localT - 0.5) * 4
                targets[i3 + 1] = -1.2
                targets[i3 + 2] = Math.sin(angle) * 0.4 + 1
              }
            },
            // Healthcare - brain/heart
            (i: number, i3: number) => {
              const t = i / PARTICLE_COUNT
              const angle = t * Math.PI * 6
              const r = 1.5 + Math.sin(t * Math.PI * 8) * 0.5
              targets[i3] = Math.cos(angle) * r * Math.abs(Math.sin(t * Math.PI))
              targets[i3 + 1] = (t - 0.5) * 4
              targets[i3 + 2] = Math.sin(angle) * r + 1
            },
            // Commerce - chat bubbles/flow
            (i: number, i3: number) => {
              const bubble = Math.floor(i / 600)
              const inBubble = (i % 600) / 600
              const bubblePos = [[-1.5, 1], [1.5, 0], [-1, -1], [1, -1.5]]
              const [bx, by] = bubblePos[bubble % 4]
              const angle = inBubble * Math.PI * 2
              const r = 0.6 + inBubble * 0.2
              targets[i3] = bx + Math.cos(angle) * r
              targets[i3 + 1] = by + Math.sin(angle) * r * 0.6
              targets[i3 + 2] = 1 + inBubble * 0.3
            },
          ]
          
          const formationFn = formations[workIndex % formations.length]
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            formationFn(i, i * 3)
          }
          break
          
        case 'contact':
          // Convergent spiral - everything coming together
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const t = i / PARTICLE_COUNT
            const spiralAngle = t * Math.PI * 16
            const r = (1 - t) * 4
            const y = (t - 0.5) * 4
            targets[i3] = Math.cos(spiralAngle) * r * (1 - t * 0.5)
            targets[i3 + 1] = y
            targets[i3 + 2] = Math.sin(spiralAngle) * r * (1 - t * 0.5) + 1
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
    const targets = getTargetFormation(currentSection, activeWorkIndex)
    
    // Pulse effect handling
    if (pulseEffect) {
      pulseRef.current = Math.min(pulseRef.current + 0.15, 1)
    } else {
      pulseRef.current = Math.max(pulseRef.current - 0.03, 0)
    }
    
    // Enhanced lerp factor based on state
    const baseLerp = isGenerating ? 0.025 : 0.015
    const interactionBoost = isInteracting ? 0.01 : 0
    const lerpFactor = baseLerp + interactionBoost
    
    // Interpolate positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      
      // Smooth lerp toward target
      posArray[i3] = THREE.MathUtils.lerp(posArray[i3], targets[i3], lerpFactor)
      posArray[i3 + 1] = THREE.MathUtils.lerp(posArray[i3 + 1], targets[i3 + 1], lerpFactor)
      posArray[i3 + 2] = THREE.MathUtils.lerp(posArray[i3 + 2], targets[i3 + 2], lerpFactor)
      
      // Floating motion (enhanced during interaction)
      const floatIntensity = isInteracting ? 0.015 : 0.006
      const floatSpeed = isGenerating ? 2 : 1
      const floatX = Math.sin(time * 0.4 * floatSpeed + i * 0.008) * floatIntensity
      const floatY = Math.cos(time * 0.25 * floatSpeed + i * 0.012) * floatIntensity
      const floatZ = Math.sin(time * 0.3 * floatSpeed + i * 0.01) * floatIntensity
      
      posArray[i3] += floatX
      posArray[i3 + 1] += floatY
      posArray[i3 + 2] += floatZ
      
      // Pulse expansion
      if (pulseRef.current > 0) {
        const pulseExpand = Math.sin(i * 0.01 + time * 5) * pulseRef.current * 0.3
        const dir = new THREE.Vector3(posArray[i3], posArray[i3 + 1], posArray[i3 + 2]).normalize()
        posArray[i3] += dir.x * pulseExpand
        posArray[i3 + 1] += dir.y * pulseExpand
        posArray[i3 + 2] += dir.z * pulseExpand
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Color transition
    const sectionColors = COLORS[currentSection as keyof typeof COLORS] || COLORS.hero
    const targetColor = new THREE.Color(sectionColors.primary)
    currentColorRef.current.lerp(targetColor, 0.008)
    
    const material = pointsRef.current.material as THREE.PointsMaterial
    material.color.copy(currentColorRef.current)
    
    // Size pulsing during generation
    material.size = 0.035 + (isGenerating ? Math.sin(time * 8) * 0.015 : 0) + pulseRef.current * 0.02
    
    // Rotation
    const rotationSpeed = isGenerating ? 0.08 : 0.03
    pointsRef.current.rotation.y = time * rotationSpeed + scrollProgress * Math.PI * 0.5
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
        size={0.035}
        color="#ff8800"
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ========================================
// CONNECTION WEB - Enhanced Neural Pathways
// ========================================

function ConnectionWeb() {
  const linesRef = useRef<THREE.LineSegments>(null)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const currentColorRef = useRef(new THREE.Color(COLORS.hero.secondary))
  const currentOpacityRef = useRef(0.1)
  
  const positions = useMemo(() => {
    return new Float32Array(MAX_CONNECTIONS * 6)
  }, [])
  
  useFrame((state) => {
    if (!linesRef.current) return
    
    const time = state.clock.elapsedTime
    const posArray = linesRef.current.geometry.attributes.position.array as Float32Array
    
    // Connection visibility based on section
    let targetStrength = 
      currentSection === 'hero' ? 0.15 :
      currentSection === 'about' ? 0.6 :
      currentSection === 'discovery' ? 0.9 :
      currentSection === 'sandbox' ? 0.7 :
      currentSection === 'work' ? 1 :
      currentSection === 'contact' ? 0.5 : 0.2
    
    // Boost during generation
    if (isGenerating) targetStrength = 1
    
    currentOpacityRef.current = THREE.MathUtils.lerp(currentOpacityRef.current, targetStrength * 0.3, 0.015)
    
    const numActiveConnections = Math.floor(MAX_CONNECTIONS * targetStrength)
    const timeMultiplier = isGenerating ? 3 : 1
    
    for (let i = 0; i < MAX_CONNECTIONS; i++) {
      const i6 = i * 6
      
      if (i < numActiveConnections) {
        const angle1 = (i / numActiveConnections) * Math.PI * 2 + time * 0.15 * timeMultiplier
        const angle2 = angle1 + Math.PI * 0.2
        const r1 = 0.4 + Math.sin(time * 0.5 * timeMultiplier + i * 0.1) * 0.3
        const r2 = 1.8 + Math.cos(time * 0.3 * timeMultiplier + i * 0.08) * 0.6
        const yOffset = 1
        
        posArray[i6] = Math.cos(angle1) * r1
        posArray[i6 + 1] = Math.sin(time * 0.25 * timeMultiplier + i * 0.08) * 0.5 + yOffset
        posArray[i6 + 2] = Math.sin(angle1) * r1 + 1
        
        posArray[i6 + 3] = Math.cos(angle2) * r2
        posArray[i6 + 4] = Math.sin(time * 0.2 * timeMultiplier + i * 0.1) * 0.8 + yOffset
        posArray[i6 + 5] = Math.sin(angle2) * r2 + 1
      } else {
        for (let j = 0; j < 6; j++) {
          posArray[i6 + j] = 0
        }
      }
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true
    
    const sectionColors = COLORS[currentSection as keyof typeof COLORS] || COLORS.hero
    const targetColor = new THREE.Color(sectionColors.secondary)
    currentColorRef.current.lerp(targetColor, 0.008)
    
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
        color="#cc6600"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}

// ========================================
// CRYSTALLINE CORE - Interactive Core
// ========================================

function CrystallineCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const pulseEffect = useStore((state) => state.pulseEffect)
  const currentScaleRef = useRef(0)
  const currentColorRef = useRef(new THREE.Color('#ff8800'))
  const pulseRef = useRef(0)
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Core visibility
    let targetPresence = 
      currentSection === 'hero' ? 0.3 :
      currentSection === 'about' ? 0.5 :
      currentSection === 'discovery' ? 1.2 :
      currentSection === 'sandbox' ? 1 :
      currentSection === 'work' ? 0.8 :
      currentSection === 'contact' ? 1.5 : 0
    
    // Pulse effect
    if (pulseEffect) {
      pulseRef.current = Math.min(pulseRef.current + 0.1, 1)
    } else {
      pulseRef.current = Math.max(pulseRef.current - 0.02, 0)
    }
    
    // Generation boost
    if (isGenerating) targetPresence *= 1.3
    
    currentScaleRef.current = THREE.MathUtils.lerp(currentScaleRef.current, targetPresence, 0.02)
    const scale = currentScaleRef.current + pulseRef.current * 0.3
    
    meshRef.current.scale.set(scale, scale, scale)
    glowRef.current.scale.set(scale * 1.5, scale * 1.5, scale * 1.5)
    
    // Position offset to right
    meshRef.current.position.set(1, 0, 1)
    glowRef.current.position.set(1, 0, 1)
    
    // Rotation
    const rotSpeed = isGenerating ? 3 : 1
    meshRef.current.rotation.x = time * 0.1 * rotSpeed
    meshRef.current.rotation.y = time * 0.15 * rotSpeed
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.15
    
    glowRef.current.rotation.x = -time * 0.05
    glowRef.current.rotation.y = -time * 0.1
    
    // Update materials
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    material.emissiveIntensity = 0.5 + pulseRef.current * 0.5 + (isGenerating ? Math.sin(time * 6) * 0.3 : 0)
  })
  
  return (
    <group>
      <mesh ref={meshRef} scale={0}>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#ff8800"
          emissive="#ff8800"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <mesh ref={glowRef} scale={0}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// ========================================
// ENERGY RINGS - Orbital Energy
// ========================================

function EnergyRings() {
  const ringsRef = useRef<THREE.Group>(null)
  const currentSection = useStore((state) => state.currentSection)
  const isInteracting = useStore((state) => state.isInteracting)
  const scalesRef = useRef([0, 0, 0])
  const currentColorRef = useRef(new THREE.Color(COLORS.hero.secondary))
  
  useFrame((state) => {
    if (!ringsRef.current) return
    
    const time = state.clock.elapsedTime
    
    let targetPresence = 
      currentSection === 'hero' ? 0.2 :
      currentSection === 'about' ? 0.4 :
      currentSection === 'discovery' ? 0.6 :
      currentSection === 'sandbox' ? 1 :
      currentSection === 'work' ? 0.8 :
      currentSection === 'contact' ? 0.5 : 0
    
    // Boost during interaction
    if (isInteracting) targetPresence *= 1.2
    
    const sectionColors = COLORS[currentSection as keyof typeof COLORS] || COLORS.hero
    const targetColor = new THREE.Color(sectionColors.secondary)
    currentColorRef.current.lerp(targetColor, 0.008)
    
    ringsRef.current.children.forEach((ring, i) => {
      const mesh = ring as THREE.Mesh
      
      scalesRef.current[i] = THREE.MathUtils.lerp(scalesRef.current[i], targetPresence, 0.015)
      const scale = scalesRef.current[i]
      mesh.scale.set(scale, scale, scale)
      
      // Position offset
      mesh.position.set(1, 0, 1)
      
      // Rotation (faster during interaction)
      const speedMultiplier = isInteracting ? 2 : 1
      mesh.rotation.x = time * (0.12 + i * 0.06) * speedMultiplier
      mesh.rotation.y = time * (0.18 + i * 0.04) * speedMultiplier
      mesh.rotation.z = time * (0.06 + i * 0.02) * speedMultiplier
      
      const material = mesh.material as THREE.MeshBasicMaterial
      material.color.copy(currentColorRef.current)
    })
  })
  
  return (
    <group ref={ringsRef}>
      {[1.2, 1.6, 2].map((radius, i) => (
        <mesh key={i} scale={0}>
          <torusGeometry args={[radius, 0.012, 16, 80]} />
          <meshBasicMaterial
            color="#ff8800"
            transparent
            opacity={0.4 - i * 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ========================================
// DATA STREAMS - Flowing Particles
// ========================================

function DataStreams() {
  const streamsRef = useRef<THREE.Points>(null)
  const currentSection = useStore((state) => state.currentSection)
  const isGenerating = useStore((state) => state.isGenerating)
  const currentOpacityRef = useRef(0)
  
  const { positions, velocities } = useMemo(() => {
    const count = 600
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const r = 5 + Math.random() * 3
      
      pos[i3] = Math.cos(angle) * r
      pos[i3 + 1] = (Math.random() - 0.5) * 6
      pos[i3 + 2] = Math.sin(angle) * r + 1
      
      vel[i3] = -Math.cos(angle) * 0.02
      vel[i3 + 1] = 0
      vel[i3 + 2] = -Math.sin(angle) * 0.02
    }
    
    return { positions: pos, velocities: vel }
  }, [])
  
  useFrame(() => {
    if (!streamsRef.current) return
    
    const posArray = streamsRef.current.geometry.attributes.position.array as Float32Array
    
    // Active during generation or contact section
    let targetOpacity = 0
    if (isGenerating) targetOpacity = 0.8
    else if (currentSection === 'contact') targetOpacity = 0.5
    else if (currentSection === 'discovery') targetOpacity = 0.3
    
    currentOpacityRef.current = THREE.MathUtils.lerp(currentOpacityRef.current, targetOpacity, 0.02)
    
    const material = streamsRef.current.material as THREE.PointsMaterial
    material.opacity = currentOpacityRef.current
    
    if (currentOpacityRef.current > 0.05) {
      const speed = isGenerating ? 2 : 1
      for (let i = 0; i < 600; i++) {
        const i3 = i * 3
        
        posArray[i3] += velocities[i3] * speed
        posArray[i3 + 1] += velocities[i3 + 1]
        posArray[i3 + 2] += velocities[i3 + 2] * speed
        
        const dist = Math.sqrt(
          posArray[i3] ** 2 + 
          (posArray[i3 + 2] - 1) ** 2
        )
        
        if (dist < 0.8) {
          const angle = Math.random() * Math.PI * 2
          const r = 5 + Math.random() * 3
          posArray[i3] = Math.cos(angle) * r
          posArray[i3 + 1] = (Math.random() - 0.5) * 6
          posArray[i3 + 2] = Math.sin(angle) * r + 1
        }
      }
      
      streamsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={streamsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={600}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ff9944"
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
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
      <CrystallineCore />
      <EnergyRings />
      <DataStreams />
    </group>
  )
}
