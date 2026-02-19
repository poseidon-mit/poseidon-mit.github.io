import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { logger } from '../utils/logger';
import { prefetchRoute, type RoutePath } from './lazyRoutes';

interface RouterState {
  path: string;
  search: string;
  navigate: (to: string) => void;
  prefetch: (to: RoutePath) => Promise<void>;
}

const defaultRouter: RouterState = {
  path: '/',
  search: '',
  navigate: () => {
    logger.warn('Router not initialized');
  },
  prefetch: async () => {},
};

const RouterContext = createContext<RouterState>(defaultRouter);

const normalizePath = (value: string) => {
  if (!value) return '/';
  if (value.length > 1 && value.endsWith('/')) {
    return value.replace(/\/+$/, '') || '/';
  }
  return value;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
      setSearch(window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    const qIndex = to.indexOf('?');
    const rawPath = qIndex >= 0 ? to.slice(0, qIndex) : to;
    const rawSearch = qIndex >= 0 ? to.slice(qIndex) : '';
    const targetPath = normalizePath(rawPath);
    if (targetPath === path && rawSearch === search) return;

    const update = () => {
      window.history.pushState({}, '', targetPath + rawSearch);
      setPath(targetPath);
      setSearch(rawSearch);
      if (targetPath !== path) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    // Keep routing deterministic for demo stability.
    // View Transition API can leave transient overlays during lazy-route swaps.
    update();
  };

  const prefetch = async (to: RoutePath) => prefetchRoute(to);

  const value = useMemo(() => ({ path, search, navigate, prefetch }), [path, search]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  return ctx;
};

const isInternalLink = (to: string) => to.startsWith('/') && !to.startsWith('//');

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  prefetch?: 'none' | 'intent' | 'render';
}

export const Link: React.FC<LinkProps> = ({
  to,
  onClick,
  onMouseEnter,
  onFocus,
  onTouchStart,
  children,
  prefetch = 'none',
  ...props
}) => {
  const { navigate, prefetch: prefetchRoutePath } = useRouter();

  useEffect(() => {
    if (prefetch !== 'render' || !isInternalLink(to)) return;
    void prefetchRoutePath(to as RoutePath);
  }, [prefetch, prefetchRoutePath, to]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isInternalLink(to)) {
      onClick?.(event);
      return;
    }
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    onClick?.(event);
    navigate(to);
  };

  const handleIntentPrefetch = () => {
    if (prefetch !== 'intent' || !isInternalLink(to)) return;
    void prefetchRoutePath(to as RoutePath);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        handleIntentPrefetch();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        handleIntentPrefetch();
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        handleIntentPrefetch();
      }}
      {...props}
    >
      {children}
    </a>
  );
};
