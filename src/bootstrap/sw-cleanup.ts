const SW_CLEANUP_MARKER_KEY = 'poseidon:sw-cleanup-v2';

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

function shouldInspectCleanupTargets(): boolean {
  if (typeof window === 'undefined') return false;
  if (!import.meta.env.PROD) return false;
  if (import.meta.env.VITE_ENABLE_SW === '1') return false;
  return true;
}

async function getCleanupTargets() {
  const registrations = 'serviceWorker' in navigator
    ? await navigator.serviceWorker.getRegistrations().catch(() => [])
    : [];
  const cacheKeys = 'caches' in window
    ? await caches.keys().catch(() => [])
    : [];

  return { registrations, cacheKeys };
}

/**
 * Clears legacy Service Worker registrations + stale caches after SW is disabled.
 * The cleanup re-runs if stale registrations or caches still exist, even if an
 * older cleanup marker was already written.
 */
export async function runServiceWorkerCleanupOnBoot(): Promise<void> {
  if (!shouldInspectCleanupTargets()) {
    return;
  }

  try {
    const { registrations, cacheKeys } = await getCleanupTargets();
    const hasTargets = registrations.length > 0 || cacheKeys.length > 0;

    if (!hasTargets && getCleanupMarker()) {
      return;
    }

    console.info('[telemetry] sw_cleanup_started', {
      registrations: registrations.length,
      caches: cacheKeys.length,
    });

    await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));
    await Promise.all(cacheKeys.map((key) => caches.delete(key).catch(() => false)));

    console.info('[telemetry] sw_cleanup_executed');
  } catch (error) {
    console.warn('[telemetry] sw_cleanup_failed', error);
  } finally {
    setCleanupMarker();
  }
}
