import { lazy } from 'react';

export const routeLoaders = {
  '/': () => import('../pages/Protect'),
  '/protect': () => import('../pages/Protect'),
} as const;

export type RoutePath = keyof typeof routeLoaders;

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

export const routes = Object.fromEntries(
  Object.entries(routeLoaders).map(([path, loader]) => [path, lazy(loader)]),
) as { [K in RoutePath]: ReturnType<typeof lazy> };
