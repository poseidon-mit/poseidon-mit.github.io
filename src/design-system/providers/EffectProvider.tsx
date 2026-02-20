import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type EffectPreset = 'minimal' | 'glass' | 'neon' | 'aurora' | 'terminal' | 'creator-studio'

export const EFFECT_PRESETS: readonly EffectPreset[] = [
  'minimal',
  'glass',
  'neon',
  'aurora',
  'terminal',
  'creator-studio',
] as const

export const EFFECT_PRESET_META: Record<EffectPreset, { label: string; description: string }> = {
  minimal:  { label: 'Minimal',  description: 'Clean professional — no blur, no glow' },
  glass:    { label: 'Glass',    description: 'iOS-inspired frosted glass' },
  neon:     { label: 'Neon',     description: 'Poseidon signature glow style' },
  aurora:   { label: 'Aurora',   description: 'Maximum visual impact with stagger' },
  terminal: { label: 'Terminal', description: 'Bloomberg-style dense data' },
  'creator-studio': { label: 'Creator Studio', description: 'Apple-style deep OLED glass and cinematic motion' },
}

interface EffectContextValue {
  preset: EffectPreset
  setPreset: (p: EffectPreset) => void
}

const EffectContext = createContext<EffectContextValue>({
  preset: 'creator-studio',
  setPreset: () => {},
})

export function EffectProvider({
  preset: initialPreset = 'creator-studio',
  children,
}: {
  preset?: EffectPreset
  children: ReactNode
}) {
  const [preset, setPreset] = useState<EffectPreset>(initialPreset)

  useEffect(() => {
    document.documentElement.dataset.effectPreset = preset
  }, [preset])

  return (
    <EffectContext.Provider value={{ preset, setPreset }}>
      {children}
    </EffectContext.Provider>
  )
}

export const useEffectPreset = () => useContext(EffectContext)
