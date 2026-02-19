import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DIST_DIR = resolve(process.cwd(), 'dist');
const INDEX_HTML = resolve(DIST_DIR, 'index.html');

const ROUTES = [
  '/pricing',
  '/trust',
  '/deck',
  '/signup',
  '/login',
  '/recovery',
  '/onboarding',
  '/onboarding/connect',
  '/onboarding/goals',
  '/onboarding/consent',
  '/onboarding/complete',
  '/dashboard',
  '/dashboard/alerts',
  '/dashboard/insights',
  '/dashboard/timeline',
  '/dashboard/notifications',
  '/protect',
  '/protect/alert-detail',
  '/protect/dispute',
  '/grow',
  '/grow/goal',
  '/grow/scenarios',
  '/grow/recommendations',
  '/execute',
  '/execute/approval',
  '/execute/history',
  '/govern',
  '/govern/audit',
  '/govern/audit-detail',
  '/govern/trust',
  '/govern/registry',
  '/govern/oversight',
  '/govern/policy',
  '/settings',
  '/settings/ai',
  '/settings/integrations',
  '/settings/rights',
  '/help',
  '/404',
];

async function main() {
  const indexContent = await readFile(INDEX_HTML, 'utf8');
  let emitted = 0;

  for (const route of ROUTES) {
    const normalized = route.replace(/^\/+/, '');
    if (!normalized) continue;
    const routeDir = resolve(DIST_DIR, normalized);
    const routeIndex = resolve(routeDir, 'index.html');
    await mkdir(routeDir, { recursive: true });
    await writeFile(routeIndex, indexContent, 'utf8');
    emitted += 1;
  }

  console.log(`emit-route-html: emitted ${emitted} route index files`);
}

main().catch((error) => {
  console.error('emit-route-html: failed', error);
  process.exit(1);
});
