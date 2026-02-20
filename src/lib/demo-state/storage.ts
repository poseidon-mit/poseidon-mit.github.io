import {
  DEMO_STATE_VERSION,
  createDefaultDemoState,
  type DemoState,
} from './types'

const SESSION_STORAGE_KEY = 'poseidon:demo-state:session'
const LOCAL_STORAGE_KEY = 'poseidon:demo-state:local'

interface Envelope<T> {
  version: number
  data: T
}

type SessionSlice = Pick<DemoState, 'auth' | 'onboarding' | 'execute'>
type LocalSlice = Pick<DemoState, 'settings' | 'support'>

function isBrowser() {
  return typeof window !== 'undefined'
}

function readEnvelope<T>(storage: Storage, key: string): Envelope<T> | null {
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Envelope<T>
    if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number') {
      return null
    }
    if (parsed.version !== DEMO_STATE_VERSION || !('data' in parsed)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeEnvelope<T>(storage: Storage, key: string, data: T): void {
  const payload: Envelope<T> = { version: DEMO_STATE_VERSION, data }
  try {
    storage.setItem(key, JSON.stringify(payload))
  } catch {
    // Ignore storage write failures (private mode, quota, etc.)
  }
}

export function loadDemoState(defaultState = createDefaultDemoState()): DemoState {
  if (!isBrowser()) return defaultState

  const next: DemoState = {
    ...defaultState,
    user: defaultState.user,
  }

  const sessionEnvelope = readEnvelope<SessionSlice>(window.sessionStorage, SESSION_STORAGE_KEY)
  if (sessionEnvelope?.data) {
    next.auth = sessionEnvelope.data.auth ?? next.auth
    next.onboarding = sessionEnvelope.data.onboarding ?? next.onboarding
    next.execute = sessionEnvelope.data.execute ?? next.execute
  }

  const localEnvelope = readEnvelope<LocalSlice>(window.localStorage, LOCAL_STORAGE_KEY)
  if (localEnvelope?.data) {
    next.settings = localEnvelope.data.settings ?? next.settings
    next.support = localEnvelope.data.support ?? next.support
  }

  return next
}

export function saveDemoState(state: DemoState): void {
  if (!isBrowser()) return

  const sessionSlice: SessionSlice = {
    auth: state.auth,
    onboarding: state.onboarding,
    execute: state.execute,
  }
  const localSlice: LocalSlice = {
    settings: state.settings,
    support: state.support,
  }

  writeEnvelope(window.sessionStorage, SESSION_STORAGE_KEY, sessionSlice)
  writeEnvelope(window.localStorage, LOCAL_STORAGE_KEY, localSlice)
}

export function resetDemoStateStorage(): void {
  if (!isBrowser()) return
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // noop
  }
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
  } catch {
    // noop
  }
}
