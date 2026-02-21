import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  ROUTE_META_CONTRACT,
  TARGET_SCOPE_READY_ROUTES,
  getRouteMetaContract,
} from '@/contracts/rebuild-contracts';

type RouteLoader = () => Promise<{ default: ComponentType<any> }>;

const CHUNK_RELOAD_KEY = 'poseidon:chunk-reload-attempted';
const ROUTE_IMPORT_TIMEOUT_MS = 12000;

function shouldForceReloadOnImportError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('importing a module script failed') ||
    message.includes('loading chunk') ||
    message.includes('chunkloaderror') ||
    message.includes('route import timeout')
  );
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, reason: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      globalThis.setTimeout(() => reject(new Error(reason)), timeoutMs);
    }),
  ]);
}

function getReloadAttempted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1';
  } catch {
    return false;
  }
}

function markReloadAttempted(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
  } catch {
    // Ignore storage failures (private mode / restricted storage).
  }
}

function clearReloadAttempted(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  } catch {
    // Ignore storage failures (private mode / restricted storage).
  }
}

function withRouteImportRecovery(routePath: string, loader: RouteLoader): RouteLoader {
  return async () => {
    try {
      const module = await withTimeout(loader(), ROUTE_IMPORT_TIMEOUT_MS, `Route import timeout: ${routePath}`);

      clearReloadAttempted();

      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/route import timeout/i.test(message)) {
        console.error('[telemetry] dynamic_import_timeout', {
          route: routePath,
          timeoutMs: ROUTE_IMPORT_TIMEOUT_MS,
          message,
        });
      }
      if (/(failed to fetch dynamically imported module|importing a module script failed|chunkloaderror)/i.test(message)) {
        console.error('[telemetry] dynamic_import_failure', {
          route: routePath,
          message,
        });
      }

      if (
        typeof window !== 'undefined' &&
        shouldForceReloadOnImportError(error) &&
        !getReloadAttempted()
      ) {
        console.warn('[telemetry] dynamic_import_retry_reload', {
          route: routePath,
          message,
        });
        markReloadAttempted();
        const url = new URL(window.location.href);
        url.searchParams.set('__route_reload', String(Date.now()));
        window.location.replace(url.toString());
      }

      throw error;
    }
  };
}

// Lazy load page components for code splitting
export const routeLoaders = {
  // ─── Public ─────────────────────────────────────────────────────────────────
  '/': () => import('../pages/Landing'),

  // ─── Design System ──────────────────────────────────────────────────────────
  '/design-system': () => import('../pages/DesignSystemLanding'),
  '/design-system/tokens': () => import('../pages/DesignSystemTokens'),
  '/design-system/tokens/colors': () => import('../pages/DesignSystemTokensColors'),
  '/design-system/tokens/typography': () => import('../pages/DesignSystemTokensTypography'),
  '/design-system/tokens/spacing': () => import('../pages/DesignSystemTokensSpacing'),
  '/design-system/tokens/motion': () => import('../pages/DesignSystemTokensMotion'),
  '/design-system/components': () => import('../pages/DesignSystemComponents'),

  // ─── Activation ─────────────────────────────────────────────────────────────
  '/signup': () => import('../pages/Signup'),
  '/login': () => import('../pages/Login'),
  '/onboarding': () => import('../pages/Onboarding'),

  // ─── Core ───────────────────────────────────────────────────────────────────
  '/dashboard': () => import('../pages/Dashboard'),
  '/dashboard/notifications': () => import('../pages/Notifications'),

  // ─── Protect ────────────────────────────────────────────────────────────────
  '/protect': () => import('../pages/Protect'),
  '/protect/alert-detail': () => import('../pages/ProtectAlertDetail'),
  '/protect/dispute': () => import('../pages/ProtectDispute'),

  // ─── Grow ───────────────────────────────────────────────────────────────────
  '/grow': () => import('../pages/Grow'),
  '/grow/goal': () => import('../pages/GrowGoalDetail'),
  '/grow/scenarios': () => import('../pages/GrowScenarios'),
  '/grow/recommendations': () => import('../pages/GrowRecommendations'),

  // ─── Execute ────────────────────────────────────────────────────────────────
  '/execute': () => import('../pages/Execute'),
  '/execute/approval': () => import('../pages/ExecuteApproval'),

  // ─── Govern ─────────────────────────────────────────────────────────────────
  '/govern': () => import('../pages/Govern'),
  '/govern/audit': () => import('../pages/GovernAuditLedger'),
  '/govern/audit-detail': () => import('../pages/GovernAuditDetail'),

  // ─── Settings ───────────────────────────────────────────────────────────────
  '/settings': () => import('../pages/Settings'),

  // ─── System ─────────────────────────────────────────────────────────────────
  '/404': () => import('../pages/NotFound'),

  // --- Test / Showcase ---
  '/test/spectacular': () => import('../pages/TestSpectacular'),
} satisfies Record<string, RouteLoader>;

export type RoutePath = keyof typeof routeLoaders;

/**
 * Routes in the current rebuild target scope.
 * Non-target routes intentionally render a Coming Soon placeholder.
 */
export const V0_READY_ROUTES = new Set<RoutePath>(
  TARGET_SCOPE_READY_ROUTES.filter((route) => route in routeLoaders) as RoutePath[],
);

export interface RouteUXMeta {
  intent: 'monitor' | 'investigate' | 'approve' | 'audit' | 'configure';
  primaryActionLabel: string;
  primaryActionPath: string;
  navGroup: 'public' | 'core' | 'engine' | 'settings';
  cognitiveLoad: 'low' | 'medium' | 'high';
  demoPriority?: 'P0' | 'P1' | 'P2';
  ctaBudget?: number;
  first5sMessage?: string;
}

export interface ResolvedRouteUXMeta extends Omit<RouteUXMeta, 'demoPriority' | 'ctaBudget'> {
  demoPriority: 'P0' | 'P1' | 'P2';
  ctaBudget: number;
}

function resolveRouteMetaPath(path: string): string {
  const normalized = path.split('?')[0];
  if (ROUTE_META_CONTRACT[normalized]) return normalized;
  if (normalized.startsWith('/onboarding/')) return '/onboarding';
  if (normalized.startsWith('/dashboard/')) return '/dashboard';
  if (normalized.startsWith('/protect/')) return '/protect';
  if (normalized.startsWith('/grow/')) return '/grow';
  if (normalized.startsWith('/execute/')) return '/execute';
  if (normalized.startsWith('/govern/')) return '/govern';
  if (normalized.startsWith('/settings/')) return '/settings';
  return normalized;
}

export function getRouteUXMeta(path: string): ResolvedRouteUXMeta | undefined {
  const resolvedPath = resolveRouteMetaPath(path);
  const meta = getRouteMetaContract(resolvedPath);
  if (!meta) return undefined;
  return {
    intent: meta.intent,
    primaryActionLabel: meta.primaryActionLabel,
    primaryActionPath: meta.primaryActionPath,
    navGroup: meta.navGroup,
    cognitiveLoad: meta.cognitiveLoad,
    demoPriority: meta.demoPriority,
    ctaBudget: meta.ctaBudget.primary,
    first5sMessage: meta.first5sMessage,
  };
}

const prefetchedRoutes = new Set<RoutePath>();

export async function prefetchRoute(path: RoutePath): Promise<void> {
  if (prefetchedRoutes.has(path)) return;

  const load = routeLoaders[path];
  if (!load) return;

  prefetchedRoutes.add(path);
  try {
    await load();
  } catch {
    prefetchedRoutes.delete(path);
  }
}

const comingSoonLoader = () => import('../pages/ComingSoon');
const notFoundLoader = () => import('../pages/NotFound');
const IS_PRODUCTION = import.meta.env.PROD;

function resolveRouteLoader(path: string, loader: RouteLoader): RouteLoader {
  const meta = getRouteMetaContract(path);
  const allowPublicDesignSystem = path.startsWith('/design-system');
  const forceHiddenTestRoute = path === '/test/spectacular';
  if (allowPublicDesignSystem) {
    return loader;
  }
  if (forceHiddenTestRoute) {
    return notFoundLoader;
  }
  const isInternalInProd =
    IS_PRODUCTION &&
    meta?.routeVisibility === 'internal' &&
    !allowPublicDesignSystem;
  if (isInternalInProd) {
    return notFoundLoader;
  }
  if (V0_READY_ROUTES.has(path as RoutePath)) {
    return loader;
  }
  return comingSoonLoader;
}

export const routes = Object.fromEntries(
  Object.entries(routeLoaders).map(([path, loader]) => {
    const resolvedLoader = resolveRouteLoader(path, loader);
    return [path, lazy(withRouteImportRecovery(path, resolvedLoader))];
  }),
) as unknown as Record<RoutePath, LazyExoticComponent<ComponentType<any>>>;
