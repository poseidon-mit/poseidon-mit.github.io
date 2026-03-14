import React from 'react'

export const DEV_BOOT_PRE_MOUNT_TIMEOUT_MS = 1800
export const DEV_BOOT_ROUTE_TIMEOUT_MS = 3500

const DEV_BOOT_OVERLAY_ID = 'poseidon-dev-boot-overlay'

export type DevBootPhase = 'pre_mount' | 'route_resolution'

export interface LocalDevLocationLike {
  origin: string
  hostname: string
  port?: string
  pathname: string
  search?: string
}

export interface LocalDevBootSnapshot {
  origin: string
  hostname: string
  port: string
  route: string
}

function isPrivateIpv4Host(hostname: string): boolean {
  const parts = hostname.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false
  }

  if (parts[0] === 10) return true
  if (parts[0] === 127) return true
  if (parts[0] === 192 && parts[1] === 168) return true
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true

  return false
}

export function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local') ||
    isPrivateIpv4Host(hostname)
  )
}

export function shouldEnableLocalDevBootDiagnostics(
  isDev: boolean,
  hostname: string,
): boolean {
  return isDev && isLocalDevHost(hostname)
}

export function createLocalDevBootSnapshot(
  locationLike: LocalDevLocationLike,
): LocalDevBootSnapshot {
  return {
    origin: locationLike.origin,
    hostname: locationLike.hostname,
    port: locationLike.port ?? '',
    route: `${locationLike.pathname}${locationLike.search ?? ''}`,
  }
}

export function getLocalDevBootSnapshot(
  locationLike: LocalDevLocationLike,
  isDev: boolean,
): LocalDevBootSnapshot | null {
  if (!shouldEnableLocalDevBootDiagnostics(isDev, locationLike.hostname)) {
    return null
  }

  return createLocalDevBootSnapshot(locationLike)
}

export function getLocalDevBootHints(): string[] {
  return [
    'Use the LAN IP on iPhone, not localhost or 127.0.0.1.',
    'Keep the Mac and iPhone on the same Wi-Fi network.',
    'If port 5173 is busy, stop the conflicting process and restart Vite.',
  ]
}

function getPhaseCopy(phase: DevBootPhase) {
  if (phase === 'pre_mount') {
    return {
      title: 'Local dev boot is still waiting on the first mount.',
      body: 'The dev server responded, but React has not finished mounting the app yet.',
    }
  }

  return {
    title: 'Local dev boot reached React, but the first route is still resolving.',
    body: 'If the screen stays blank on iPhone, check the origin below before digging into page code.',
  }
}

export function LocalDevBootDiagnosticCard({
  snapshot,
  phase,
  onReload,
}: {
  snapshot: LocalDevBootSnapshot
  phase: DevBootPhase
  onReload: () => void
}) {
  const copy = getPhaseCopy(phase)

  return (
    <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#050816]/92 p-6 text-left shadow-[0_20px_80px_-30px_rgba(34,211,238,0.45)] backdrop-blur-xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300/75">
        Local Dev Diagnostic
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
        {copy.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/65">{copy.body}</p>

      <dl className="mt-5 space-y-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/75">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Origin
          </dt>
          <dd className="mt-1 break-all font-mono text-cyan-100">
            {snapshot.origin}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Route
          </dt>
          <dd className="mt-1 break-all font-mono text-white/80">
            {snapshot.route}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            Port
          </dt>
          <dd className="mt-1 font-mono text-white/80">
            {snapshot.port || 'default'}
          </dd>
        </div>
      </dl>

      <ul className="mt-5 space-y-2 text-sm leading-6 text-white/72">
        {getLocalDevBootHints().map((hint) => (
          <li key={hint}>{hint}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onReload}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-400/16"
      >
        Reload local app
      </button>
    </div>
  )
}

function applyStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>,
): void {
  Object.assign(element.style, styles)
}

function buildOverlayCard(
  snapshot: LocalDevBootSnapshot,
  diagnostic: boolean,
): HTMLElement {
  const card = document.createElement('div')
  applyStyles(card, {
    width: 'min(92vw, 420px)',
    borderRadius: '24px',
    border: '1px solid rgba(34, 211, 238, 0.18)',
    background: diagnostic ? 'rgba(5, 8, 22, 0.94)' : 'rgba(5, 8, 22, 0.82)',
    color: '#E6F6FF',
    padding: '24px',
    boxShadow: '0 20px 80px -30px rgba(34, 211, 238, 0.45)',
    fontFamily: 'Geist, Inter, system-ui, sans-serif',
  })

  const eyebrow = document.createElement('p')
  eyebrow.textContent = 'Local Dev Boot'
  applyStyles(eyebrow, {
    margin: '0',
    color: 'rgba(165, 243, 252, 0.78)',
    fontSize: '11px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontFamily: 'Geist Mono, ui-monospace, monospace',
  })
  card.append(eyebrow)

  const title = document.createElement('h1')
  title.textContent = diagnostic
    ? 'The app is still booting on this local origin.'
    : 'Booting local dev app...'
  applyStyles(title, {
    margin: '12px 0 0',
    color: '#FFFFFF',
    fontSize: diagnostic ? '20px' : '18px',
    lineHeight: '1.2',
    fontWeight: '600',
  })
  card.append(title)

  const body = document.createElement('p')
  body.textContent = diagnostic
    ? 'If iPhone stays blank, validate the origin and port before changing page code.'
    : `Origin ${snapshot.origin}${snapshot.route}`
  applyStyles(body, {
    margin: '10px 0 0',
    color: diagnostic ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.62)',
    fontSize: '14px',
    lineHeight: '1.6',
  })
  card.append(body)

  if (!diagnostic) {
    return card
  }

  const list = document.createElement('ul')
  applyStyles(list, {
    margin: '18px 0 0',
    paddingLeft: '18px',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '14px',
    lineHeight: '1.6',
  })

  getLocalDevBootHints().forEach((hint) => {
    const item = document.createElement('li')
    item.textContent = hint
    list.append(item)
  })

  card.append(list)
  return card
}

export function installPreMountDevBootOverlay(
  snapshot: LocalDevBootSnapshot,
): { dismiss: () => void } {
  const existing = document.getElementById(DEV_BOOT_OVERLAY_ID)
  existing?.remove()

  const overlay = document.createElement('div')
  overlay.id = DEV_BOOT_OVERLAY_ID
  overlay.setAttribute('role', 'status')
  overlay.setAttribute('aria-live', 'polite')
  applyStyles(overlay, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483647',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background:
      'radial-gradient(circle at top, rgba(17, 24, 39, 0.92), rgba(4, 6, 12, 0.98))',
  })

  const startedAt = window.performance.now()

  overlay.append(buildOverlayCard(snapshot, false))
  document.body.prepend(overlay)

  console.info('[telemetry] dev_boot_overlay_installed', {
    origin: snapshot.origin,
    route: snapshot.route,
  })

  const timeout = window.setTimeout(() => {
    console.warn('[telemetry] dev_boot_pre_mount_timeout', {
      origin: snapshot.origin,
      route: snapshot.route,
      phase: 'pre_mount',
    })
    overlay.replaceChildren(buildOverlayCard(snapshot, true))
  }, DEV_BOOT_PRE_MOUNT_TIMEOUT_MS)

  return {
    dismiss: () => {
      window.clearTimeout(timeout)
      if (!overlay.isConnected) return
      console.info('[telemetry] dev_boot_pre_mount_resolved', {
        origin: snapshot.origin,
        route: snapshot.route,
        durationMs: Math.round(window.performance.now() - startedAt),
      })
      overlay.remove()
    },
  }
}
