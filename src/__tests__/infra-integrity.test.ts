/**
 * Infrastructure integrity tests.
 *
 * Guards against v0 merges accidentally overwriting the router,
 * CSS entry point, or route registry.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { routeLoaders, V0_READY_ROUTES } from '../router/lazyRoutes';
import { getRouteMetaContract } from '@/contracts/rebuild-contracts';

const root = resolve(__dirname, '../..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf-8');

describe('Infrastructure integrity', () => {
  const mainSrc = read('src/main.tsx');

  it('main.tsx imports the router system', () => {
    expect(mainSrc).toContain("from './router'");
    expect(mainSrc).toContain("from './router/lazyRoutes'");
    expect(mainSrc).toMatch(/RouterProvider/);
  });

  it('main.tsx imports tailwind.css', () => {
    expect(mainSrc).toContain("'./styles/tailwind.css'");
  });

  it('tailwind.css contains Tailwind v4 import', () => {
    const css = read('src/styles/tailwind.css');
    expect(css).toContain("@import 'tailwindcss'");
  });

  it('app.css does not duplicate Tailwind import', () => {
    const css = read('src/styles/app.css');
    expect(css).not.toContain("@import 'tailwindcss'");
  });

  it('app.css does not contain unlayered body/html selectors', () => {
    const css = read('src/styles/app.css');
    // Match bare "body {" or "html {" outside @layer blocks.
    // These global selectors override tailwind.css @layer base and bleed into all pages.
    const unlayered = css
      .replace(/@layer\s+\w+\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '')
      .replace(/@media[^{]*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');
    expect(unlayered).not.toMatch(/^body\s*\{/m);
    expect(unlayered).not.toMatch(/^html\s*\{/m);
  });

  it('all Tier 1 Golden Path routes are registered', () => {
    const tier1 = ['/', '/dashboard', '/protect', '/execute', '/govern'] as const;
    for (const route of tier1) {
      expect(routeLoaders).toHaveProperty(route);
    }
  });

  it('all Tier 2 Explorer routes are registered', () => {
    const tier2 = [
      '/grow',
      '/protect/alert-detail',
      '/execute/history',
      '/govern/audit',
      '/settings',
    ] as const;
    for (const route of tier2) {
      expect(routeLoaders).toHaveProperty(route);
    }
  });

  it('V0_READY_ROUTES contains only valid route paths', () => {
    for (const route of V0_READY_ROUTES) {
      expect(routeLoaders).toHaveProperty(route);
    }
  });

  it('V0_READY_ROUTES includes the landing page', () => {
    expect(V0_READY_ROUTES.has('/')).toBe(true);
  });

  it('keeps design-system routes publicly resolvable', () => {
    expect(routeLoaders).toHaveProperty('/design-system');
    const lazyRoutesSource = read('src/router/lazyRoutes.ts');
    expect(lazyRoutesSource).toContain("const allowPublicDesignSystem = path.startsWith('/design-system');");
  });

  it('keeps test/spectacular internal-only', () => {
    const meta = getRouteMetaContract('/test/spectacular');
    expect(meta?.routeVisibility).toBe('internal');
    const lazyRoutesSource = read('src/router/lazyRoutes.ts');
    expect(lazyRoutesSource).toContain("const forceHiddenTestRoute = path === '/test/spectacular';");
  });

  it('self-guided QR mode bootstraps demo session', () => {
    expect(mainSrc).toContain('const SELF_GUIDED_QR_MODE = true;');
    expect(mainSrc).toContain("beginDemoSession({ method: 'skip' });");
  });

  it('govern audit ledger links to audit detail route with decision query', () => {
    const source = read('src/pages/GovernAuditLedger.tsx');
    expect(source).toContain('/govern/audit-detail?decision=');
  });
});
