import React, { useCallback, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Settings,
  HelpCircle,
  MoreHorizontal,
  ChevronRight,
  Bell,
  Search,
  WifiOff,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '../../router';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { usePresentationMode } from '../../hooks/usePresentationMode';
import { usePWA } from '../../hooks/usePWA';
import { CommandPalette } from './CommandPalette';
import { AuroraPulse } from '@/components/poseidon';
import { Button } from '@/design-system';
import { type EngineName } from '../../lib/engine-tokens';
import { useDemoState } from '@/lib/demo-state/provider';
import { getPendingExecuteCount } from '@/lib/demo-state/selectors';
import { cn } from '@/lib/utils';

type AccentTone = EngineName | 'system';

interface ToneClasses {
  activeLink: string;
  activeIcon: string;
  indicator: string;
  activeSubNav: string;
}

const TONE_CLASSES: Record<AccentTone, ToneClasses> = {
  dashboard: {
    activeLink: 'text-cyan-50 bg-cyan-500/10 ring-1 ring-cyan-500/30 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]',
    activeIcon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]',
    indicator: 'bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]',
    activeSubNav: 'text-cyan-100 bg-cyan-500/20 border-cyan-400/30 glow',
  },
  protect: {
    activeLink: 'text-emerald-50 bg-emerald-500/10 ring-1 ring-emerald-500/30 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]',
    activeIcon: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    indicator: 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]',
    activeSubNav: 'text-emerald-100 bg-emerald-500/20 border-emerald-400/30 glow',
  },
  grow: {
    activeLink: 'text-violet-50 bg-violet-500/10 ring-1 ring-violet-500/30 shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]',
    activeIcon: 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]',
    indicator: 'bg-violet-400 shadow-[0_0_5px_rgba(139,92,246,0.5)]',
    activeSubNav: 'text-violet-100 bg-violet-500/20 border-violet-400/30 glow',
  },
  execute: {
    activeLink: 'text-amber-50 bg-amber-500/10 ring-1 ring-amber-500/30 shadow-[inset_0_0_12px_rgba(245,158,11,0.15)]',
    activeIcon: 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    indicator: 'bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]',
    activeSubNav: 'text-amber-100 bg-amber-500/20 border-amber-400/30 glow',
  },
  govern: {
    activeLink: 'text-blue-50 bg-blue-500/10 ring-1 ring-blue-500/30 shadow-[inset_0_0_12px_rgba(59,130,246,0.15)]',
    activeIcon: 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    indicator: 'bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)]',
    activeSubNav: 'text-blue-100 bg-blue-500/20 border-blue-400/30 glow',
  },
  system: {
    activeLink: 'text-slate-50 bg-white/10 ring-1 ring-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]',
    activeIcon: 'text-slate-200',
    indicator: 'bg-slate-300 shadow-[0_0_5px_rgba(255,255,255,0.5)]',
    activeSubNav: 'text-slate-200 bg-white/10 border-white/20 glow',
  },
};

/* ─── Engine config ──────────────────────────────────────── */

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  engine?: EngineName;
  group: 'engine' | 'system';
  tone: AccentTone;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, engine: 'dashboard', group: 'engine', tone: 'dashboard' },
  { label: 'Protect', path: '/protect', icon: Shield, engine: 'protect', group: 'engine', tone: 'protect' },
  { label: 'Grow', path: '/grow', icon: TrendingUp, engine: 'grow', group: 'engine', tone: 'grow' },
  { label: 'Execute', path: '/execute', icon: Zap, engine: 'execute', group: 'engine', tone: 'execute' },
  { label: 'Govern', path: '/govern', icon: Scale, engine: 'govern', group: 'engine', tone: 'govern' },
  { label: 'Settings', path: '/settings', icon: Settings, group: 'system', tone: 'system' },
  { label: 'Help', path: '/help', icon: HelpCircle, group: 'system', tone: 'system' },
];

/* ─── Live status badges ───────────────────────────────────── */
function buildNavBadges(pendingExecuteCount: number): Record<string, { type: 'pulse' | 'count'; value?: number; tone: AccentTone }> {
  return {
    '/protect': { type: 'pulse', tone: 'protect' },
    '/execute': { type: 'count', value: pendingExecuteCount, tone: 'execute' },
  };
}

const ENGINE_ITEMS = NAV_ITEMS.filter((i) => i.group === 'engine');
const SYSTEM_ITEMS = NAV_ITEMS.filter((i) => i.group === 'system');

/* ─── Sub-navigation definitions ─────────────────────────── */

interface SubNavItem {
  label: string;
  path: string;
}

const SUB_NAV: Record<string, SubNavItem[]> = {
  '/dashboard': [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Notifications', path: '/dashboard/notifications' },
  ],
  '/protect': [
    { label: 'Alerts', path: '/protect' },
    { label: 'Dispute', path: '/protect/dispute' },
  ],
  '/grow': [
    { label: 'Goals', path: '/grow' },
    { label: 'Scenarios', path: '/grow/scenarios' },
    { label: 'Recommendations', path: '/grow/recommendations' },
  ],
  '/execute': [
    { label: 'Queue', path: '/execute' },
    { label: 'Approval', path: '/execute/approval' },
  ],
  '/govern': [
    { label: 'Overview', path: '/govern' },
    { label: 'Audit Ledger', path: '/govern/audit' },
  ],
};

/* ─── Breadcrumb definitions ─────────────────────────────── */

const BREADCRUMB_MAP: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/notifications': ['Dashboard', 'Notifications'],
  '/protect': ['Protect'],
  '/protect/alert-detail': ['Protect', 'Alert Detail'],
  '/protect/dispute': ['Protect', 'Dispute'],
  '/grow': ['Grow'],
  '/grow/goal': ['Grow', 'Goal Detail'],
  '/grow/scenarios': ['Grow', 'Scenarios'],
  '/grow/recommendations': ['Grow', 'Recommendations'],
  '/execute': ['Execute'],
  '/execute/approval': ['Execute', 'Approval Queue'],
  '/govern': ['Govern'],
  '/govern/audit': ['Govern', 'Audit Ledger'],
  '/govern/audit-detail': ['Govern', 'Audit Detail'],
  '/settings': ['Settings'],
};

/* ─── Helpers ────────────────────────────────────────────── */

function getActiveSection(path: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => path === item.path || path.startsWith(item.path + '/'));
}

function getActiveEngine(path: string): EngineName | undefined {
  const section = getActiveSection(path);
  if (!section || section.group === 'system') return undefined;
  return section.engine;
}

function getSubNav(path: string): SubNavItem[] | null {
  const sectionKey = Object.keys(SUB_NAV).find(
    (key) => path === key || path.startsWith(key + '/')
  );
  if (!sectionKey) return null;
  return SUB_NAV[sectionKey];
}

/* ─── Component ──────────────────────────────────────────── */

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
  const subNav = useMemo(() => getSubNav(path), [path]);
  const { state } = useDemoState();
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false);
  const { isOpen: isPaletteOpen, open: openPalette, close: closePalette } = useCommandPalette();
  const { isPresentation } = usePresentationMode();
  const { isOffline } = usePWA();
  const activeTone = activeSection?.tone;
  const activeToneClasses = activeTone ? TONE_CLASSES[activeTone] : undefined;
  const pendingExecuteCount = useMemo(() => getPendingExecuteCount(state), [state]);
  const navBadges = useMemo(() => buildNavBadges(pendingExecuteCount), [pendingExecuteCount]);
  const mobilePrimaryItems = useMemo(
    () => ENGINE_ITEMS.filter((item) => item.path !== '/govern'),
    [],
  );
  const mobileMoreItems = useMemo(
    () => [
      NAV_ITEMS.find((item) => item.path === '/govern'),
      ...SYSTEM_ITEMS,
    ].filter((item): item is NavItem => Boolean(item)),
    [],
  );

  useEffect(() => {
    closePalette();
    setMobileMoreOpen(false);
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
    <div className="app-bg-oled flex min-h-screen">
      <CommandPalette isOpen={isPaletteOpen} onClose={closePalette} />
      {/* ── Desktop Sidebar ── */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-[280px] flex-col bg-black/40 backdrop-blur-3xl border-r border-white/[0.04] lg:flex">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-8 py-8" aria-label="Poseidon home">
          <img
            src="/logo.png"
            alt=""
            width="64"
            height="64"
            className="h-16 w-16 object-contain drop-shadow-[0_0_3px_rgba(0,240,255,0.3)]"
            aria-hidden="true"
          />
          <span className="text-xl font-light tracking-widest text-slate-50">Poseidon</span>
        </Link>

        {/* Engines section */}
        <nav className="flex flex-1 flex-col gap-1.5 px-4" aria-label="Main navigation">
          <span className="px-4 pt-4 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            Engines
          </span>
          {ENGINE_ITEMS.map((item) => {
            const isActive = path === item.path || path.startsWith(item.path + '/');
            const Icon = item.icon;
            const tone = TONE_CLASSES[item.tone];
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 hover:bg-white/[0.06] hover:text-white',
                  isActive ? tone.activeLink : 'text-slate-400 border border-transparent hover:border-white/5'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-[18px] w-[18px]', isActive && tone.activeIcon)} aria-hidden="true" />
                <span className="flex-1 text-sm font-medium tracking-wide">{item.label}</span>
                {navBadges[item.path]?.type === 'pulse' && (
                  <span
                    className={cn('nav-badge-pulse h-2 w-2 flex-shrink-0 rounded-full', TONE_CLASSES[navBadges[item.path].tone].indicator)}
                    aria-hidden="true"
                  />
                )}
                {navBadges[item.path]?.type === 'count' && (
                  <span
                    className={cn(
                      'flex h-[18px] min-w-[18px] flex-shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-slate-950',
                      TONE_CLASSES[navBadges[item.path].tone].indicator,
                    )}
                    aria-hidden="true"
                  >
                    {navBadges[item.path].value}
                  </span>
                )}
              </Link>
            );
          })}

          {/* System section */}
          <span className="px-4 pt-8 pb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
            System
          </span>
          {SYSTEM_ITEMS.map((item) => {
            const isActive = path === item.path || path.startsWith(item.path + '/');
            const Icon = item.icon;
            const tone = TONE_CLASSES[item.tone];
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 hover:bg-white/[0.06] hover:text-white',
                  isActive ? tone.activeLink : 'text-slate-400 border border-transparent hover:border-white/5',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-[18px] w-[18px]', isActive && tone.activeIcon)} aria-hidden="true" />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar bottom: user */}
        <div className="flex items-center gap-4 border-t border-white/[0.06] px-8 py-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-300 shadow-inner border border-white/5"
            aria-hidden="true"
          >
            {state.user.initials}
          </div>
          <span className="text-sm font-medium tracking-wide text-slate-300">{state.user.name}</span>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col lg:ml-[280px]">
        {/* ── Desktop top header ── */}
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between px-8 lg:px-10 bg-transparent border-b border-white/[0.04] backdrop-blur-3xl lg:flex">
          {/* Breadcrumb — only show when 2+ segments; otherwise show page title */}
          {breadcrumbs.length > 1 ? (
            <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
              {breadcrumbs.map((segment, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <ChevronRight className="h-3 w-3 text-slate-600" aria-hidden="true" />
                    )}
                    <span
                      className={cn(
                        'text-sm',
                        isLast ? 'font-medium text-slate-50' : 'text-slate-400',
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {isLast && activeToneClasses && (
                        <span
                          className={cn('mr-1.5 inline-block h-2 w-2 align-middle rounded-full', activeToneClasses.indicator)}
                          aria-hidden="true"
                        />
                      )}
                      {segment}
                    </span>
                  </React.Fragment>
                );
              })}
            </nav>
          ) : (
            <span className="text-sm font-medium text-slate-50">
              {activeToneClasses && (
                <span
                  className={cn('mr-1.5 inline-block h-2 w-2 align-middle rounded-full', activeToneClasses.indicator)}
                  aria-hidden="true"
                />
              )}
              {breadcrumbs[0]}
            </span>
          )}

          {/* Right side: status + search + bell + avatar */}
          <div className="flex items-center gap-3">
            {/* Offline indicator */}
            {isOffline && (
              <span
                className="flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-300"
                aria-label="Offline"
              >
                <WifiOff className="h-3 w-3" aria-hidden="true" />
                Offline
              </span>
            )}
            {/* Presentation mode badge */}
            {isPresentation && (
              <span
                className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200"
                aria-label="Presentation mode active"
              >
                <Radio className="h-3 w-3" aria-hidden="true" />
                Presenting
              </span>
            )}
            {/* Cmd+K search trigger */}
            <Button
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-500 transition-colors duration-150 hover:bg-white/[0.08] hover:text-slate-300"
              onClick={openPalette}
              aria-label="Open command palette"
              variant="glass"
              size="sm"
              engine={activeToneClasses ? (activeSection?.tone as EngineName | undefined) : undefined}
              springPress={false}
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Search</span>
              <kbd className="ml-1 rounded bg-white/10 px-1 py-0.5 text-[10px] text-slate-600">
                ⌘K
              </kbd>
            </Button>
            <Button
              className="relative !h-9 !min-h-9 !w-9 rounded-lg !px-0 text-slate-400 transition-colors duration-150 hover:bg-white/5"
              aria-label="Notifications (new)"
              variant="ghost"
              size="sm"
              springPress={false}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"
                aria-hidden="true"
              />
            </Button>
            <Button
              className="!h-8 !min-h-8 !w-8 rounded-full border border-white/10 bg-white/10 !px-0 text-xs font-semibold text-slate-400 transition-colors duration-150"
              aria-label="User menu"
              variant="ghost"
              size="sm"
              springPress={false}
            >
              {state.user.initials}
            </Button>
          </div>
        </header>

        {/* ── Mobile top header ── */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-5 bg-black/40 backdrop-blur-2xl border-b border-white/[0.04] lg:hidden">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-1.5" aria-label="Poseidon home">
            <img
              src="/logo.png"
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 object-contain drop-shadow-[0_0_3px_rgba(0,240,255,0.3)]"
              aria-hidden="true"
            />
            <span className="text-sm font-light tracking-widest text-slate-50">Poseidon</span>
          </Link>

          {/* Center: current section + status (true center) */}
          <div className="pointer-events-none absolute left-1/2 flex max-w-[52vw] -translate-x-1/2 items-center gap-2">
            <span className="truncate text-sm font-medium text-slate-50">{activeSection?.label ?? ''}</span>
            {isPresentation && (
              <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-200">
                Live
              </span>
            )}
            {isOffline && <WifiOff className="h-3.5 w-3.5 text-red-400" aria-label="Offline" />}
          </div>

          {/* Right: bell */}
          <Button className="relative !h-9 !min-h-9 !w-9 rounded-lg !px-0 text-slate-400" aria-label="Notifications (new)" variant="ghost" size="sm" springPress={false}>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"
              aria-hidden="true"
            />
          </Button>
        </header>

        {/* ── Sub-navigation strip ── */}
        {subNav && (
          <div
            className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.04] bg-black/20 backdrop-blur-md px-4 py-2.5 lg:px-6"
            role="navigation"
            aria-label="Sub-navigation"
          >
            {subNav.map((item) => {
              const isActive = path === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-white/5 hover:text-slate-50',
                    isActive
                      ? activeToneClasses?.activeSubNav ?? 'border-slate-300/30 bg-white/10 text-slate-200'
                      : 'border-transparent text-slate-400',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Main content ── */}
        <div className="flex-1">{children}</div>

        {/* Spacer for mobile bottom nav */}
        <div className="h-16 lg:hidden" aria-hidden="true" />
      </div>

      {/* ── Mobile bottom navigation ── */}
      {mobileMoreOpen ? (
        <div className="fixed inset-x-0 bottom-16 z-40 rounded-t-2xl border-t border-white/10 bg-slate-950/96 px-4 py-3 backdrop-blur lg:hidden">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">More</p>
          <div className="grid grid-cols-3 gap-2">
            {mobileMoreItems.map((item) => {
              const isActive = path === item.path || path.startsWith(item.path + '/');
              const Icon = item.icon;
              const tone = TONE_CLASSES[item.tone];
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-medium',
                    isActive
                      ? `${tone.activeSubNav} border`
                      : 'border-white/10 text-slate-300',
                  )}
                  onClick={() => setMobileMoreOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/[0.04] bg-black/60 backdrop-blur-2xl pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
        aria-label="Mobile navigation"
      >
        {mobilePrimaryItems.map((item) => {
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
              aria-label={item.label}
            >
              {/* Active dot */}
              <span
                className={cn(
                  'h-1 w-1 rounded-full transition-opacity duration-150',
                  tone.indicator,
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden="true"
              />
              <div className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {navBadges[item.path]?.type === 'pulse' && (
                  <span
                    className={cn(
                      'nav-badge-pulse absolute -top-1 -right-1 h-2 w-2 rounded-full',
                      TONE_CLASSES[navBadges[item.path].tone].indicator,
                    )}
                    aria-hidden="true"
                  />
                )}
                {navBadges[item.path]?.type === 'count' && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full px-0.5 text-[9px] font-bold text-slate-950',
                      TONE_CLASSES[navBadges[item.path].tone].indicator,
                    )}
                    aria-hidden="true"
                  >
                    {navBadges[item.path].value}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'flex min-h-12 flex-1 flex-col items-center justify-center gap-1 py-2 !h-auto !w-auto !min-w-0 !px-0 text-[10px] font-medium',
            path.startsWith('/govern') || path.startsWith('/settings') || path.startsWith('/help')
              ? 'text-slate-100'
              : 'text-slate-500',
          )}
          onClick={() => setMobileMoreOpen((prev) => !prev)}
          aria-expanded={mobileMoreOpen}
          aria-label="Open more navigation"
          springPress={false}
        >
          <span
            className={cn(
              'h-1 w-1 rounded-full transition-opacity duration-150',
              mobileMoreOpen ? 'opacity-100 bg-slate-300' : 'opacity-0 bg-slate-300',
            )}
            aria-hidden="true"
          />
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          <span>More</span>
        </Button>
      </nav>
    </div>
  );
}
