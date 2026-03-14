import React, { createContext, startTransition, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { logger } from '../utils/logger';
import { markPerformance, measurePerformance } from '@/lib/performance-marks';
import { isAppRoute } from './app-shell-routes';
import { getLoadedRouteComponent, isKnownRoutePath, prefetchRoute, type RoutePath } from './lazyRoutes';

export type NavigationStrategy = 'blocking' | 'optimistic' | 'seamless';

export interface NavigateOptions {
  strategy?: NavigationStrategy;
  replace?: boolean;
}

interface RouterState {
  path: string;
  search: string;
  pendingPath: string | null;
  isPending: boolean;
  showPendingIndicator: boolean;
  navigate: (to: string, options?: NavigateOptions) => void;
  prefetch: (to: RoutePath) => Promise<void>;
}

const defaultRouter: RouterState = {
  path: '/',
  search: '',
  pendingPath: null,
  isPending: false,
  showPendingIndicator: false,
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
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [showPendingIndicator, setShowPendingIndicator] = useState(false);
  const navigationRequestRef = useRef(0);

  useEffect(() => {
    if (!pendingPath) {
      setShowPendingIndicator(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowPendingIndicator(true);
      markPerformance('route_busy_indicator_visible');
      measurePerformance(
        'shell_busy_indicator_ms',
        'route_intent',
        'route_busy_indicator_visible',
      );
    }, 800);

    return () => window.clearTimeout(timer);
  }, [pendingPath]);

  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveInitialLocation(window.location);
      const requestId = ++navigationRequestRef.current;
      const previousPath = path;
      setPendingPath(resolved.path);
      markPerformance('route_intent');

      const syncNavigation = async () => {
        try {
          if (
            isKnownRoutePath(resolved.path) &&
            !getLoadedRouteComponent(resolved.path)
          ) {
            await prefetchRoute(resolved.path);
          }
        } catch (error) {
          logger.warn('Route prefetch failed during popstate sync', {
            path: resolved.path,
            error,
          });
        }

        if (requestId !== navigationRequestRef.current) return;
        markPerformance('route_module_ready');
        measurePerformance('module_load_ms', 'route_intent', 'route_module_ready');
        startTransition(() => {
          setPath(resolved.path);
          setSearch(resolved.search);
          setPendingPath(null);
        });
        markPerformance('route_commit');
        measurePerformance('app_shell_route_switch_ms', 'route_intent', 'route_commit');
        if (resolved.path !== previousPath) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      };

      void syncNavigation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [path]);

  const navigate = (to: string, options?: NavigateOptions) => {
    const qIndex = to.indexOf('?');
    const rawPath = qIndex >= 0 ? to.slice(0, qIndex) : to;
    const rawSearch = qIndex >= 0 ? to.slice(qIndex) : '';
    const targetPath = normalizePath(rawPath);
    if (targetPath === path && rawSearch === search) return;

    const requestId = ++navigationRequestRef.current;
    const previousPath = path;
    const strategy =
      options?.strategy ??
      (isAppRoute(previousPath) && isAppRoute(targetPath) ? 'seamless' : 'blocking');

    const update = () => {
      const historyMethod = options?.replace ? 'replaceState' : 'pushState';
      window.history[historyMethod]({}, '', targetPath + rawSearch);
      startTransition(() => {
        setPath(targetPath);
        setSearch(rawSearch);
        setPendingPath(null);
      });
      markPerformance('route_commit');
      measurePerformance('app_shell_route_switch_ms', 'route_intent', 'route_commit');
      if (targetPath !== previousPath) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    if (strategy === 'optimistic') {
      markPerformance('route_intent');
      update();

      if (targetPath !== previousPath && isKnownRoutePath(targetPath) && !getLoadedRouteComponent(targetPath)) {
        void prefetchRoute(targetPath).catch((error) => {
          logger.warn('Route prefetch failed during optimistic navigation', {
            path: targetPath,
            error,
          });
        });
      }

      return;
    }

    const loadAndNavigate = async () => {
      setPendingPath(targetPath);
      markPerformance('route_intent');
      try {
        if (
          targetPath !== previousPath &&
          isKnownRoutePath(targetPath) &&
          !getLoadedRouteComponent(targetPath)
        ) {
          await prefetchRoute(targetPath);
        }
      } catch (error) {
        logger.warn('Route prefetch failed during navigation', {
          path: targetPath,
          error,
        });
      }

      if (requestId !== navigationRequestRef.current) return;
      markPerformance('route_module_ready');
      measurePerformance('module_load_ms', 'route_intent', 'route_module_ready');

      // Keep routing deterministic for demo stability.
      // View Transition API can leave transient overlays during lazy-route swaps.
      update();
    };

    void loadAndNavigate();
  };

  const prefetch = async (to: RoutePath) => prefetchRoute(to);

  const value = useMemo(
    () => ({
      path,
      search,
      pendingPath,
      isPending: pendingPath !== null,
      showPendingIndicator,
      navigate,
      prefetch,
    }),
    [path, pendingPath, search, showPendingIndicator],
  );

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
  navigationStrategy?: NavigationStrategy;
}

export const Link: React.FC<LinkProps> = ({
  to,
  onClick,
  onMouseEnter,
  onFocus,
  onTouchStart,
  children,
  prefetch = 'none',
  navigationStrategy,
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
    navigate(to, navigationStrategy ? { strategy: navigationStrategy } : undefined);
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
