import type { Preview } from '@storybook/react'
import '../src/styles/index.css'
import '../src/design-system/css/effect-presets.css'

const preview: Preview = {
  globalTypes: {
    effectPreset: {
      description: 'Visual effect preset',
      toolbar: {
        title: 'Effect Preset',
        icon: 'paintbrush',
        items: [
          { value: 'minimal', title: 'Minimal — Clean professional' },
          { value: 'glass', title: 'Glass — iOS-inspired' },
          { value: 'neon', title: 'Neon — Poseidon signature' },
          { value: 'aurora', title: 'Aurora — Maximum impact' },
          { value: 'terminal', title: 'Terminal — Bloomberg-style' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    effectPreset: 'neon',
  },
  decorators: [
    (Story, context) => {
      const preset = context.globals.effectPreset || 'neon'
      document.documentElement.dataset.effectPreset = preset
      return (
        <div
          style={{
            background: 'var(--bg, #0B1221)',
            color: 'var(--text, #f8fafc)',
            padding: '2rem',
            minHeight: '100vh',
            fontFamily: "'Inter', 'Noto Sans JP', system-ui, sans-serif",
          }}
        >
          <Story />
        </div>
      )
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    layout: 'fullscreen',
  },
}

export default preview
