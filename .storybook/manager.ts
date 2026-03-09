import { addons } from '@storybook/manager-api'
import poseidonTheme from './poseidon-theme'

addons.setConfig({
  theme: poseidonTheme,
  sidebar: {
    showRoots: true,
  },
})
