import { readFileSync } from 'fs'
import { resolve } from 'path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  createLocalDevBootSnapshot,
  isLocalDevHost,
  LocalDevBootDiagnosticCard,
} from '../bootstrap/dev-boot-diagnostics'

describe('local dev mobile reliability contract', () => {
  it('detects local and LAN hosts for diagnostics', () => {
    expect(isLocalDevHost('localhost')).toBe(true)
    expect(isLocalDevHost('127.0.0.1')).toBe(true)
    expect(isLocalDevHost('192.168.68.53')).toBe(true)
    expect(isLocalDevHost('10.0.0.12')).toBe(true)
    expect(isLocalDevHost('172.16.5.9')).toBe(true)
    expect(isLocalDevHost('poseidon.local')).toBe(true)
    expect(isLocalDevHost('poseidon-mit.com')).toBe(false)
  })

  it('renders the route-resolution diagnostic with mobile guidance', () => {
    const snapshot = createLocalDevBootSnapshot({
      origin: 'http://192.168.68.53:5173',
      hostname: '192.168.68.53',
      port: '5173',
      pathname: '/protect',
      search: '',
    })

    render(
      <LocalDevBootDiagnosticCard
        snapshot={snapshot}
        phase="route_resolution"
        onReload={() => {}}
      />,
    )

    expect(
      screen.getByText(/first route is still resolving/i),
    ).toBeInTheDocument()
    expect(screen.getByText('http://192.168.68.53:5173')).toBeInTheDocument()
    expect(
      screen.getByText(/use the lan ip on iphone, not localhost or 127.0.0.1/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/keep the mac and iphone on the same wi-fi network/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/if port 5173 is busy, stop the conflicting process and restart vite/i),
    ).toBeInTheDocument()
  })

  it('locks vite dev to a strict mobile-safe port and exposes dev:mobile', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'),
    ) as {
      scripts: Record<string, string>
    }
    const viteConfig = readFileSync(
      resolve(__dirname, '../../vite.config.ts'),
      'utf-8',
    )

    expect(packageJson.scripts.dev).toContain('--host 0.0.0.0')
    expect(packageJson.scripts.dev).toContain('--port 5173')
    expect(packageJson.scripts.dev).toContain('--strictPort')
    expect(packageJson.scripts['dev:mobile']).toBe(
      'vite --host 0.0.0.0 --port 5173 --strictPort',
    )

    expect(viteConfig).toContain('port: 5173')
    expect(viteConfig).toContain('host: true')
    expect(viteConfig).toContain('strictPort: true')
  })
})
