import React, { Suspense, Component, useEffect, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, useRouter } from './router';
import { routes, type RoutePath } from './router/lazyRoutes';
import { AppNavShell } from './components/layout/AppNavShell';
import { usePresentationMode } from './hooks/usePresentationMode';
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
            background: '#070d1a',
            color: '#94a3b8',
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
              style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', background: '#1ae3c7', color: '#070d1a', fontWeight: 600, border: 'none', cursor: 'pointer' }}
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
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070d1a',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '80px 16px 16px',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="shimmer" style={{ height: 24, width: 120, borderRadius: 999 }} />
        <div className="shimmer" style={{ height: 36, width: '70%', borderRadius: 8 }} />
        <div className="shimmer" style={{ height: 16, width: '50%', borderRadius: 8 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 8 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer" style={{ height: 80, borderRadius: 16 }} />
          ))}
        </div>
        <div className="shimmer" style={{ height: 200, borderRadius: 16, marginTop: 8 }} />
      </div>
    </div>
  );
}

/** Routes that use the AppNavShell wrapper (authenticated app pages) */
const APP_SHELL_PREFIXES = ['/dashboard', '/protect', '/grow', '/execute', '/govern', '/settings', '/help'];

function isAppRoute(path: string): boolean {
  return APP_SHELL_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
}

function RouterOutlet() {
  const { path } = useRouter();
  const LazyComponent = routes[path as RoutePath];
  const PageComponent = LazyComponent || routes['/404'] || routes['/'];

  if (!PageComponent) return <RouteLoadingFallback />;

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
  return (
    <ErrorBoundary>
      <RouterProvider>
        <PresentationModeSync />
        <Suspense fallback={<RouteLoadingFallback />}>
          <RouterOutlet />
        </Suspense>
      </RouterProvider>
      <div className="grain-overlay" aria-hidden="true" />
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);
