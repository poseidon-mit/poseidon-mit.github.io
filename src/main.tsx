import React, { Suspense, Component, useEffect, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, useRouter } from './router';
import { routes, type RoutePath } from './router/lazyRoutes';
import { isAppRoute } from './router/app-shell-routes';
import { AppNavShell } from './components/layout/AppNavShell';
import { DemoModeBanner } from './components/layout/DemoModeBanner';
import { ToastProvider } from './components/providers/ToastProvider';
import { runServiceWorkerCleanupOnBoot } from './bootstrap/sw-cleanup';
import { usePresentationMode } from './hooks/usePresentationMode';
import { DesignSystemProvider } from './design-system';
import { DemoStateProvider, useDemoState } from './lib/demo-state/provider';
import './styles/tailwind.css';
import './styles/app.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
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
            background: 'var(--bg-oled)',
            color: 'rgba(241,245,249,0.72)',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠</div>
            <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}>Something went wrong</p>
            <button
              onClick={() => window.location.replace('/')}
              style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', background: 'var(--accent-cyan)', color: 'var(--bg-oled)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
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
  const [timedOut, setTimedOut] = React.useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTimedOut(true);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timedOut) {
      console.warn('[telemetry] route_loading_timeout');
    }
  }, [timedOut]);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-transparent backdrop-blur-2xl"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none opacity-50 animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Rings */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 border-t-transparent animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border border-emerald-400/20 border-b-transparent animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse" />
        </div>

        {/* Typography */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400/80 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            Loading Interface
          </span>
          <span className="text-sm font-medium tracking-wide text-white/50">
            Secure Connection Established
          </span>
        </div>

        {timedOut ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold tracking-wide text-white/80 hover:bg-white/10 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md"
          >
            Force Reload
          </button>
        ) : null}
      </div>
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
  const LazyComponent = routes[path as RoutePath];
  const PageComponent = LazyComponent || routes['/404'] || routes['/'];
  const requiresSession = isAppRoute(path);
  const SELF_GUIDED_QR_MODE = true;

  useEffect(() => {
    if (!requiresSession || state.auth.sessionStarted) return;
    if (SELF_GUIDED_QR_MODE) {
      beginDemoSession({ method: 'skip' });
      return;
    }
    const next = encodeURIComponent(`${path}${search}`);
    navigate(`/login?next=${next}`);
  }, [requiresSession, state.auth.sessionStarted, path, search, navigate, beginDemoSession]);

  if (!PageComponent) return <RouteLoadingFallback />;
  if (requiresSession && !state.auth.sessionStarted) return <RouteLoadingFallback />;

  if (isAppRoute(path)) {
    return (
      <AppNavShell path={path}>
        <PageComponent />
      </AppNavShell>
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

function MinimalApp() {
  useEffect(() => {
    return installRuntimeTelemetry();
  }, []);

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
  await runServiceWorkerCleanupOnBoot();

  ReactDOM.createRoot(document.getElementById('root')!).render(<MinimalApp />);
}

void bootstrap();
