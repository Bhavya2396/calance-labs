'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Emergence } from './Emergence'

export default function Scene() {
  return (
    <Canvas
      camera={{ 
        position: [0, 0, 5], 
        fov: 50,
        near: 0.1,
        far: 100
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Environment preset="night" />
        <ambientLight intensity={0.1} />
        <Emergence />
      </Suspense>
    </Canvas>
  )
}
