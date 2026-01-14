'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'

export default function Scene() {
  return (
    <Canvas
      camera={{ 
        position: [0, 0, 6], 
        fov: 50,
        near: 0.1,
        far: 100
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      style={{ background: '#050505' }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  )
}
