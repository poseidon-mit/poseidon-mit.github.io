import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from './router';
import { routes, type RoutePath } from './router/lazyRoutes';
import './styles/tailwind.css';
import './styles/app.css';

function RouteLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#070d1a',
        color: '#94a3b8',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      Loading...
    </div>
  );
}

function MinimalApp() {
  const [currentPath, setPath] = React.useState(() => {
    const p = window.location.pathname;
    return p.length > 1 && p.endsWith('/') ? p.replace(/\/+$/, '') : p || '/';
  });

  React.useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname;
      setPath(p.length > 1 && p.endsWith('/') ? p.replace(/\/+$/, '') : p || '/');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const LazyComponent = routes[currentPath as RoutePath];

  // Fallback: if path is unknown, show landing as default
  const FallbackComponent = routes['/'];
  const PageComponent = LazyComponent || FallbackComponent;

  return (
    <RouterProvider>
      <Suspense fallback={<RouteLoadingFallback />}>
        {PageComponent ? <PageComponent /> : <RouteLoadingFallback />}
      </Suspense>
    </RouterProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);
