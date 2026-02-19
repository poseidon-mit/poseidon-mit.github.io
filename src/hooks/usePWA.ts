import { useEffect, useState, useCallback, useRef } from 'react';

interface PWAHookState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
}

interface PWAHookReturn extends PWAHookState {
  promptInstall: () => Promise<void>;
  applyUpdate: () => void;
}

export function usePWA(): PWAHookReturn {
  const [state, setState] = useState<PWAHookState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: false,
    hasUpdate: false,
  });
  const swEnabled = import.meta.env.VITE_ENABLE_SW === '1';

  const deferredPromptRef = useRef<Event | null>(null);
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      // Check display-mode: standalone (installed)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setState((prev) => ({ ...prev, isInstalled: true }));
      }
    };

    checkInstalled();
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event;
      setState((prev) => ({ ...prev, isInstallable: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle app installed event
  useEffect(() => {
    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOffline: true }));
    };

    // Set initial state
    setState((prev) => ({ ...prev, isOffline: !navigator.onLine }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker and monitor updates
  useEffect(() => {
    if (!import.meta.env.PROD || !swEnabled || !('serviceWorker' in navigator)) {
      return;
    }

    let mounted = true;
    let registration: ServiceWorkerRegistration | null = null;
    let updateInterval: number | undefined;

    const checkForUpdates = (target: ServiceWorkerRegistration) => {
      target.update().catch(() => {
        // Silently fail if update check fails
      });
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && registration) {
        checkForUpdates(registration);
      }
    };

    const handleUpdateFound = () => {
      if (!registration) {
        return;
      }

      const newWorker = registration.installing;
      if (!newWorker) {
        return;
      }

      const handleStateChange = () => {
        if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
          setState((prev) => ({ ...prev, hasUpdate: true }));
        }
      };

      newWorker.addEventListener('statechange', handleStateChange);
    };

    const setup = async () => {
      try {
        const existingRegistration = await navigator.serviceWorker.getRegistration('/');
        const activeRegistration = existingRegistration ?? await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        if (!mounted) {
          return;
        }

        registration = activeRegistration;
        swRegistrationRef.current = activeRegistration;

        document.addEventListener('visibilitychange', handleVisibilityChange);
        activeRegistration.addEventListener('updatefound', handleUpdateFound);

        // Periodic update check (every 60 seconds)
        updateInterval = window.setInterval(() => checkForUpdates(activeRegistration), 60000);
      } catch (error) {
        console.error('[telemetry] sw_registration_failed', error);
      }
    };

    void setup();

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (registration) {
        registration.removeEventListener('updatefound', handleUpdateFound);
      }
      if (updateInterval !== undefined) {
        window.clearInterval(updateInterval);
      }
    };
  }, [swEnabled]);

  // Handle skip waiting message
  useEffect(() => {
    if (!import.meta.env.PROD || !swEnabled) {
      return;
    }

    const handleControllerChange = () => {
      // Optionally reload the page when a new service worker takes over
      window.location.reload();
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    return () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, [swEnabled]);

  // Prompt user to install app
  const promptInstall = useCallback(async () => {
    const deferredPrompt = deferredPromptRef.current as any;

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      deferredPromptRef.current = null;
    }
  }, []);

  // Apply pending update
  const applyUpdate = useCallback(() => {
    if (!swRegistrationRef.current?.waiting) {
      return;
    }

    // Tell the service worker to skip waiting
    swRegistrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, []);

  return {
    ...state,
    promptInstall,
    applyUpdate,
  };
}
