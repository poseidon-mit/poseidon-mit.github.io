import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Menu,
  Settings,
} from 'lucide-react';
import { Link, useRouter } from '@/router';
import { SideDrawer } from '@/components/ui/sheet';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { usePresentationMode } from '@/hooks/usePresentationMode';
import { usePWA } from '@/hooks/usePWA';
import { CommandPalette } from './CommandPalette';
import { Button } from '@/components/ui/button';
import { type EngineName } from '@/lib/engine-tokens';
import { cn } from '@/lib/utils';
import { BREADCRUMB_MAP } from '@/lib/breadcrumb-registry';
import { Sidebar, NAV_ITEMS, ENGINE_ITEMS, TONE_CLASSES } from '../navigation/Sidebar';
import { TopBar } from '../navigation/TopBar';
import { useDemoState } from '@/lib/demo-state/provider';
import { getPendingExecuteCount } from '@/lib/demo-state/selectors';
import { useDismissedAlerts } from '@/pages/protect/useDismissedAlerts';
import { CANONICAL_UNIVERSE } from '@/domain/poseidon-universe/canonical';

/* ─── Helpers ────────────────────────────────────────────── */
function getActiveSection(path: string) {
  return NAV_ITEMS.find((item) => path === item.path || path.startsWith(item.path + '/'));
}

function getActiveEngine(path: string): EngineName | undefined {
  const section = getActiveSection(path);
  if (!section || section.group === 'system') return undefined;
  return section.engine;
}

export function AppNavShell({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const activeSection = useMemo(() => getActiveSection(path), [path]);
  const activeEngine = useMemo(() => getActiveEngine(path), [path]);
  const breadcrumbs = useMemo(() => BREADCRUMB_MAP[path] ?? ['Unknown'], [path]);
  const { navigate } = useRouter();
  const { isOpen: isPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();
  const { isPresentation } = usePresentationMode();
  const { isOffline } = usePWA();
  const { state } = useDemoState();
  const activeTone = activeSection?.tone;
  const activeToneClasses = activeTone ? TONE_CLASSES[activeTone] : undefined;

  const pendingExecuteCount = useMemo(() => getPendingExecuteCount(state), [state]);
  const { dismissed } = useDismissedAlerts();
  const activeProtectCount = useMemo(
    () => CANONICAL_UNIVERSE.entities.protectThreats.filter(
      t => (t.severity === 'Critical' || t.severity === 'High') && !dismissed.has(t.id)
    ).length,
    [dismissed]
  );
  const mobileBadges: Record<string, number> = useMemo(() => ({
    '/protect': activeProtectCount,
    '/execute': pendingExecuteCount,
  }), [activeProtectCount, pendingExecuteCount]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    closePalette();
    setDrawerOpen(false);
  }, [path, closePalette]);

  const handleBottomNavTap = useCallback(
    (itemPath: string) => {
      if (path.startsWith(itemPath)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [path]
  );

  return (
    <div className="app-bg-oled flex min-h-screen selection:bg-cyan-500/20 theme-precision">
      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} />

      {/* ── Mobile Drawer ── */}
      <SideDrawer open={drawerOpen} onDismiss={() => setDrawerOpen(false)}>
        <div className="px-6 pt-8 pb-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Poseidon home">
            <img src="/logo.png" alt="" width="48" height="48" className="h-12 w-12 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" aria-hidden="true" />
            <span className="text-lg font-semibold tracking-widest text-foreground">Poseidon</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-8" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = path === item.path || path.startsWith(item.path + '/');
            const Icon = item.icon;
            const tone = TONE_CLASSES[item.tone];
            const badge = mobileBadges[item.path] ?? 0;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-200',
                  isActive ? tone.activeLink : 'text-white/30 hover:bg-white/[0.03] hover:text-white/60'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-[18px] w-[18px]', isActive && tone.activeIcon)} aria-hidden="true" />
                <span className="flex-1 text-sm font-medium tracking-wide">{item.label}</span>
                {badge > 0 && (
                  <span className={cn('flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white', TONE_CLASSES[item.tone].indicator)}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </SideDrawer>

      {/* ── Desktop Sidebar ── */}
      <Sidebar path={path} />

      <div className="relative flex min-w-0 flex-1 flex-col lg:ml-[280px]">
        {/* ── Desktop TopBar ── */}
        <TopBar
          breadcrumbs={breadcrumbs}
          activeToneClasses={activeToneClasses}
          activeEngine={activeEngine}
          isOffline={isOffline}
          isPresentation={isPresentation}
          onOpenPalette={openPalette}
        />

        {/* ── Mobile top header ── */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#08080D]/90 px-3 backdrop-blur-xl lg:hidden">
          <div className="grid h-16 grid-cols-[auto,1fr,auto] items-center gap-2">
            <div className="flex items-center gap-1 min-w-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/" className="flex min-w-0 items-center gap-1.5" aria-label="Poseidon home">
                <img
                  src="/logo.png"
                  alt=""
                  width="40"
                  height="40"
                  className="h-10 w-10 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                  aria-hidden="true"
                />
                <span className="hidden min-[430px]:inline text-sm font-semibold tracking-widest text-foreground">
                  Poseidon
                </span>
              </Link>
            </div>
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center justify-center">
                <li className="truncate px-1 text-center text-sm font-medium text-foreground">
                  {activeSection?.label ?? ''}
                </li>
              </ol>
            </nav>
            <div className="flex items-center justify-end gap-1">
              <Link to="/settings" className={cn("relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors", path === '/settings' ? 'text-foreground' : 'text-muted-foreground')} aria-label="Settings">
                <Settings className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Button variant="ghost" size="icon" className="relative !h-11 !min-h-11 !w-11 rounded-lg !px-0 text-muted-foreground" onClick={() => navigate('/dashboard/notifications')} aria-label="Notifications">
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main id="main-content" className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Talk your money FAB disabled */}

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/5 bg-[#08080D]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        aria-label="Mobile navigation"
      >
        {ENGINE_ITEMS.map((item) => {
          const isActive = path === item.path || path.startsWith(item.path + '/');
          const Icon = item.icon;
          const tone = TONE_CLASSES[item.tone];
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex min-h-12 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors duration-150',
                isActive ? 'text-white' : 'text-white/25'
              )}
              onClick={() => handleBottomNavTap(item.path)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={cn('h-1 w-1 rounded-full transition-opacity duration-150', tone.indicator, isActive ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
              <div className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {(mobileBadges[item.path] ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white" aria-hidden="true">
                    {mobileBadges[item.path]}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
