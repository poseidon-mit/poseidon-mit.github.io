import React, { Suspense, Component, lazy, useEffect, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, useRouter } from './router';
import { getLoadedRouteComponent, routes, type RoutePath } from './router/lazyRoutes';
import { isAppRoute } from './router/app-shell-routes';
import { markPerformance, measurePerformance } from './lib/performance-marks';
import { ToastProvider } from './components/providers/ToastProvider';
import {
  DEV_BOOT_ROUTE_TIMEOUT_MS,
  getLocalDevBootSnapshot,
  installPreMountDevBootOverlay,
  LocalDevBootDiagnosticCard,
} from './bootstrap/dev-boot-diagnostics';
import { runServiceWorkerCleanupOnBoot } from './bootstrap/sw-cleanup';
import { usePresentationMode } from './hooks/usePresentationMode';
import { DesignSystemProvider } from './design-system';
import { DemoStateProvider, useDemoState } from './lib/demo-state/provider';
import './styles/tailwind.css';
import './styles/app.css';

const AuthenticatedLayout = lazy(async () => {
  const module = await import('./components/layout/AuthenticatedLayout');
  return { default: module.AuthenticatedLayout };
});

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#0A0A0F',
            color: '#A0A0B0',
            fontFamily: 'Geist, Inter, system-ui, sans-serif',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠</div>
            <p style={{ color: '#F2F2F2', fontWeight: 600, marginBottom: '4px' }}>Something went wrong</p>
            <pre style={{ textAlign: 'left', maxWidth: '600px', fontSize: '12px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', overflow: 'auto', maxHeight: '200px', color: '#F87171' }}>
              {this.state.error?.message}
              {'\n'}
              {this.state.error?.stack?.slice(0, 500)}
            </pre>
            <button
              onClick={() => window.location.replace('/')}
              style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#F2F2F2', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RouteLoadingFallback() {
  const localDevSnapshot = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getLocalDevBootSnapshot(window.location, import.meta.env.DEV);
  }, []);
  const [timedOut, setTimedOut] = React.useState(false);
  const timeoutMs = localDevSnapshot ? DEV_BOOT_ROUTE_TIMEOUT_MS : 8000;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTimedOut(true);
    }, timeoutMs);
    return () => window.clearTimeout(timer);
  }, [timeoutMs]);

  useEffect(() => {
    if (!timedOut) return;

    if (localDevSnapshot) {
      console.warn('[telemetry] dev_boot_route_resolution_timeout', {
        origin: localDevSnapshot.origin,
        route: localDevSnapshot.route,
        phase: 'route_resolution',
      });
      return;
    }

    console.warn('[telemetry] route_loading_timeout');
  }, [localDevSnapshot, timedOut]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#0A0A0F]"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      {timedOut && localDevSnapshot ? (
        <LocalDevBootDiagnosticCard
          snapshot={localDevSnapshot}
          phase="route_resolution"
          onReload={() => window.location.reload()}
        />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" style={{ animationDuration: '1s' }} />
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-white/40">
              Loading...
            </span>
          </div>

          {timedOut ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 rounded-lg border border-white/10 bg-white/[0.05] px-5 py-2 text-sm font-medium text-white/60 hover:bg-white/[0.08] transition-colors"
            >
              Reload
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function installRuntimeTelemetry() {
  const moduleMimePattern = /(failed to load module script|mime type)/i;

  const onWindowError = (event: ErrorEvent) => {
    const message = String(event.message ?? '');
    if (moduleMimePattern.test(message)) {
      console.error('[telemetry] module_mime_mismatch_detected', {
        message,
        file: event.filename ?? null,
      });
    }
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    const message = String((event.reason as Error | undefined)?.message ?? event.reason ?? '');
    if (moduleMimePattern.test(message)) {
      console.error('[telemetry] module_mime_mismatch_rejection', {
        message,
      });
    }
  };

  window.addEventListener('error', onWindowError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);

  return () => {
    window.removeEventListener('error', onWindowError);
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
  };
}

function RouterOutlet() {
  const { path, search, navigate } = useRouter();
  const { state, beginDemoSession } = useDemoState();
  const LoadedComponent = getLoadedRouteComponent(path);
  const LazyComponent = routes[path as RoutePath];
  const PageComponent = LoadedComponent || LazyComponent || routes['/404'] || routes['/'];
  const requiresSession = isAppRoute(path);
  const SELF_GUIDED_QR_MODE = true;
  const initialBootLoggedRef = React.useRef(false);
  const localDevSnapshot = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    return getLocalDevBootSnapshot(window.location, import.meta.env.DEV);
  }, []);

  useEffect(() => {
    if (!requiresSession || state.auth.sessionStarted) return;
    if (SELF_GUIDED_QR_MODE) {
      beginDemoSession({ method: 'skip', entryIntent: 'express' });
      return;
    }
    const next = encodeURIComponent(`${path}${search}`);
    navigate(`/login?next=${next}`);
  }, [requiresSession, state.auth.sessionStarted, path, search, navigate, beginDemoSession]);

  // Track previous path for drawer intent override (Landing back-nav edge case)
  useEffect(() => {
    return () => {
      try { sessionStorage.setItem('poseidon-prev-path', path); } catch { /* noop */ }
    };
  }, [path]);

  useEffect(() => {
    let frameA = 0;
    let frameB = 0;

    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(() => {
        markPerformance('route_paint');
        measurePerformance('route_commit_to_paint_ms', 'route_commit', 'route_paint');
      });
    });

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
    };
  }, [path]);

  useEffect(() => {
    if (!localDevSnapshot || initialBootLoggedRef.current) return;
    if (!PageComponent) return;
    if (requiresSession && !state.auth.sessionStarted) return;

    initialBootLoggedRef.current = true;
    console.info('[telemetry] dev_boot_first_route_ready', {
      origin: localDevSnapshot.origin,
      route: `${path}${search}`,
    });
  }, [PageComponent, localDevSnapshot, path, requiresSession, search, state.auth.sessionStarted]);

  if (!PageComponent) return <RouteLoadingFallback />;
  if (requiresSession && !state.auth.sessionStarted) return <RouteLoadingFallback />;

  if (isAppRoute(path)) {
    return (
      <AuthenticatedLayout path={path}>
        <PageComponent />
      </AuthenticatedLayout>
    );
  }

  return <PageComponent />;
}

/** Syncs presentation mode (?mode=present) to document.documentElement for CSS selectors */
function PresentationModeSync() {
  const { isPresentation } = usePresentationMode();
  useEffect(() => {
    document.documentElement.setAttribute('data-presentation-mode', String(isPresentation));
    return () => document.documentElement.removeAttribute('data-presentation-mode');
  }, [isPresentation]);
  return null;
}

function MinimalApp({ onBootMounted }: { onBootMounted?: () => void }) {
  useEffect(() => {
    onBootMounted?.();
    return installRuntimeTelemetry();
  }, [onBootMounted]);

  return (
    <ErrorBoundary>
      <DesignSystemProvider effectPreset="creator-studio">
        <DemoStateProvider>
          <ToastProvider>
            <RouterProvider>
              <PresentationModeSync />
              <Suspense fallback={<RouteLoadingFallback />}>
                <RouterOutlet />
              </Suspense>
            </RouterProvider>
          </ToastProvider>
        </DemoStateProvider>
      </DesignSystemProvider>
      <div className="grain-overlay" aria-hidden="true" />
    </ErrorBoundary>
  );
}

async function bootstrap() {
  const localDevSnapshot =
    typeof window === 'undefined'
      ? null
      : getLocalDevBootSnapshot(window.location, import.meta.env.DEV);
  const preMountOverlay = localDevSnapshot
    ? installPreMountDevBootOverlay(localDevSnapshot)
    : null;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <MinimalApp onBootMounted={() => preMountOverlay?.dismiss()} />
  );

  const scheduleCleanup = () => {
    void runServiceWorkerCleanupOnBoot();
  };

  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };

  if (typeof idleWindow.requestIdleCallback === 'function') {
    idleWindow.requestIdleCallback(() => {
      scheduleCleanup();
    }, { timeout: 2000 });
    return;
  }

  window.setTimeout(scheduleCleanup, 0);
}

void bootstrap();
