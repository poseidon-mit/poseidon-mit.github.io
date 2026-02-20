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

interface ResolvedInitialLocation {
  path: string;
  search: string;
}

function decodeGithubPagesSegment(value: string): string {
  try {
    return decodeURIComponent(value.replace(/~and~/g, '&'));
  } catch {
    return value.replace(/~and~/g, '&');
  }
}

function parseGithubPagesQueryRouting(search: string): ResolvedInitialLocation | null {
  if (!search.startsWith('?/')) return null;
  const encodedPayload = search.slice(2);
  if (!encodedPayload) {
    return { path: '/', search: '' };
  }

  const [rawPath = '', ...rawQueryParts] = encodedPayload.split('&');
  const decodedPath = decodeGithubPagesSegment(rawPath).replace(/^\/+/, '');
  const resolvedPath = normalizePath(`/${decodedPath}`);
  const resolvedSearch = rawQueryParts.length > 0
    ? `?${rawQueryParts.map((part) => decodeGithubPagesSegment(part)).join('&')}`
    : '';

  return {
    path: resolvedPath,
    search: resolvedSearch,
  };
}

export function resolveInitialLocation(
  locationLike: Pick<Location, 'pathname' | 'search'>,
): ResolvedInitialLocation {
  const pathname = normalizePath(locationLike.pathname);
  if (pathname !== '/') {
    return { path: pathname, search: locationLike.search };
  }

  const parsedFromSearch = parseGithubPagesQueryRouting(locationLike.search);
  if (parsedFromSearch) return parsedFromSearch;

  return { path: pathname, search: locationLike.search };
}

export function resolveInitialPath(locationLike: Pick<Location, 'pathname' | 'search'>): string {
  return resolveInitialLocation(locationLike).path;
}

export function resolveInitialSearch(locationLike: Pick<Location, 'pathname' | 'search'>): string {
  return resolveInitialLocation(locationLike).search;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(() => resolveInitialPath(window.location));
  const [search, setSearch] = useState(() => resolveInitialSearch(window.location));

  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveInitialLocation(window.location);
      setPath(resolved.path);
      setSearch(resolved.search);
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
