'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.95}
        radius={0.6}
      />
      <Vignette
        darkness={0.3}
        offset={0.4}
      />
    </EffectComposer>
  )
}
