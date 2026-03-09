import { render, type RenderOptions } from '@testing-library/react'
import { RouterProvider } from '../router'
import { DemoStateProvider } from '../lib/demo-state/provider'
import type { ReactElement } from 'react'

export function renderWithRouter(
  ui: ReactElement,
  options?: RenderOptions & { initialPath?: string }
) {
  const { initialPath = '/', ...renderOptions } = options ?? {}
  window.history.pushState({}, '', initialPath)
  return render(
    <DemoStateProvider>
      <RouterProvider>{ui}</RouterProvider>
    </DemoStateProvider>,
    renderOptions
  )
}
