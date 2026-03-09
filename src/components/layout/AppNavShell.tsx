import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Bell,
  Settings,
} from 'lucide-react';
import { Link, useRouter } from '@/router';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { usePresentationMode } from '@/hooks/usePresentationMode';
import { usePWA } from '@/hooks/usePWA';
import { CommandPalette } from './CommandPalette';
import { Button } from '@/components/ui/button';
import { TalkToMoneyFab } from '@/components/ui/TalkToMoneyFab';
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

  useEffect(() => {
    closePalette();
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
    <div className="app-bg-oled flex min-h-screen selection:bg-cyan-500/30 theme-precision">
      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} />

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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-5 bg-[rgba(8,12,20,0.95)] border-b border-white/[0.04] lg:hidden">
          <Link to="/" className="flex items-center gap-1.5" aria-label="Poseidon home">
            <img
              src="/logo.png"
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 object-contain"
              aria-hidden="true"
            />
            <span className="text-sm font-light tracking-widest text-slate-50">Poseidon</span>
          </Link>
          <div className="pointer-events-none absolute left-1/2 flex max-w-[56vw] -translate-x-1/2 items-center gap-2">
            <span className="truncate text-sm font-medium text-slate-50">{activeSection?.label ?? ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/settings" className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors", path === '/settings' ? 'text-slate-50' : 'text-slate-400')} aria-label="Settings">
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Button variant="ghost" size="icon" className="relative !h-9 !min-h-9 !w-9 rounded-lg !px-0 text-slate-400" onClick={() => navigate('/dashboard/notifications')} aria-label="Notifications">
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
            </Button>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1">{children}</main>

        <div className="h-16 lg:hidden" aria-hidden="true" />
      </div>

      {/* ── Talk to Money FAB (all routes) ── */}
      <TalkToMoneyFab />

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/[0.04] bg-[rgba(8,12,20,0.95)] pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
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
                isActive ? tone.activeIcon : 'text-slate-500'
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
