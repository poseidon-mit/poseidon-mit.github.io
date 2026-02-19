const SW_CLEANUP_MARKER_KEY = 'poseidon:sw-cleanup-v1';

function getCleanupMarker(): boolean {
  try {
    return localStorage.getItem(SW_CLEANUP_MARKER_KEY) === '1';
  } catch {
    return false;
  }
}

function setCleanupMarker(): void {
  try {
    localStorage.setItem(SW_CLEANUP_MARKER_KEY, '1');
  } catch {
    // Ignore storage failures and continue best-effort.
  }
}

function shouldRunCleanup(): boolean {
  if (typeof window === 'undefined') return false;
  if (!import.meta.env.PROD) return false;
  if (import.meta.env.VITE_ENABLE_SW === '1') return false;
  if (getCleanupMarker()) return false;
  return true;
}

/**
 * Clears legacy Service Worker registrations + stale caches once
 * after SW is disabled in production.
 */
export async function runServiceWorkerCleanupOnBoot(): Promise<void> {
  if (!shouldRunCleanup()) {
    return;
  }

  console.info('[telemetry] sw_cleanup_started');

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));
    }

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key).catch(() => false)));
    }

    console.info('[telemetry] sw_cleanup_executed');
  } catch (error) {
    console.warn('[telemetry] sw_cleanup_failed', error);
  } finally {
    setCleanupMarker();
  }
}

