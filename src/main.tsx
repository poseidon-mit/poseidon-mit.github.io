import React, { Suspense, Component, useEffect, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, useRouter } from './router';
import { routes, type RoutePath } from './router/lazyRoutes';
import { isAppRoute } from './router/app-shell-routes';
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';
import { DemoModeBanner } from './components/layout/DemoModeBanner';
import { ToastProvider } from './components/providers/ToastProvider';
import { runServiceWorkerCleanupOnBoot } from './bootstrap/sw-cleanup';
import { usePresentationMode } from './hooks/usePresentationMode';
import { DesignSystemProvider } from './design-system';
import { DemoStateProvider, useDemoState } from './lib/demo-state/provider';
import './styles/tailwind.css';
import './styles/app.css';

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
            background: '#F8F7F4',
            color: '#44403C',
            fontFamily: 'Geist, Inter, system-ui, sans-serif',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠</div>
            <p style={{ color: '#1A1A1A', fontWeight: 600, marginBottom: '4px' }}>Something went wrong</p>
            <pre style={{ textAlign: 'left', maxWidth: '600px', fontSize: '12px', background: '#F0EFEB', padding: '12px', borderRadius: '8px', overflow: 'auto', maxHeight: '200px', color: '#DC2626' }}>
              {this.state.error?.message}
              {'\n'}
              {this.state.error?.stack?.slice(0, 500)}
            </pre>
            <button
              onClick={() => window.location.replace('/')}
              style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', background: '#0A1628', color: '#FFFFFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}
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
      className="fixed inset-0 z-[100] grid place-items-center bg-[#F8F7F4]"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" style={{ animationDuration: '1s' }} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-stone-400">
            Loading...
          </span>
        </div>

        {timedOut ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Reload
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
