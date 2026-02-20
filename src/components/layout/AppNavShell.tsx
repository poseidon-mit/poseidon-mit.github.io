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
    activeLink: 'text-cyan-50 bg-cyan-500/15 border-l-cyan-400',
    activeIcon: 'text-cyan-300',
    indicator: 'bg-cyan-400',
    activeSubNav: 'text-cyan-200 bg-cyan-500/15 border-cyan-400/30',
  },
  protect: {
    activeLink: 'text-green-50 bg-green-500/15 border-l-green-400',
    activeIcon: 'text-green-300',
    indicator: 'bg-green-400',
    activeSubNav: 'text-green-200 bg-green-500/15 border-green-400/30',
  },
  grow: {
    activeLink: 'text-violet-50 bg-violet-500/15 border-l-violet-400',
    activeIcon: 'text-violet-300',
    indicator: 'bg-violet-400',
    activeSubNav: 'text-violet-200 bg-violet-500/15 border-violet-400/30',
  },
  execute: {
    activeLink: 'text-amber-50 bg-amber-500/15 border-l-amber-400',
    activeIcon: 'text-amber-300',
    indicator: 'bg-amber-400',
    activeSubNav: 'text-amber-200 bg-amber-500/15 border-amber-400/30',
  },
  govern: {
    activeLink: 'text-blue-50 bg-blue-500/15 border-l-blue-400',
    activeIcon: 'text-blue-300',
    indicator: 'bg-blue-400',
    activeSubNav: 'text-blue-200 bg-blue-500/15 border-blue-400/30',
  },
  system: {
    activeLink: 'text-slate-50 bg-white/10 border-l-slate-300',
    activeIcon: 'text-slate-200',
    indicator: 'bg-slate-300',
    activeSubNav: 'text-slate-200 bg-white/10 border-slate-300/30',
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
    { label: 'Alerts Hub', path: '/dashboard/alerts' },
    { label: 'Insights', path: '/dashboard/insights' },
    { label: 'Timeline', path: '/dashboard/timeline' },
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
    { label: 'History', path: '/execute/history' },
  ],
  '/govern': [
    { label: 'Overview', path: '/govern' },
    { label: 'Audit Ledger', path: '/govern/audit' },
    { label: 'Trust', path: '/govern/trust' },
    { label: 'Registry', path: '/govern/registry' },
    { label: 'Oversight', path: '/govern/oversight' },
    { label: 'Policy', path: '/govern/policy' },
  ],
  '/settings': [
    { label: 'General', path: '/settings' },
    { label: 'AI', path: '/settings/ai' },
    { label: 'Integrations', path: '/settings/integrations' },
    { label: 'Rights', path: '/settings/rights' },
  ],
};

/* ─── Breadcrumb definitions ─────────────────────────────── */

const BREADCRUMB_MAP: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/alerts': ['Dashboard', 'Alerts'],
  '/dashboard/insights': ['Dashboard', 'Insights'],
  '/dashboard/timeline': ['Dashboard', 'Timeline'],
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
  '/execute/history': ['Execute', 'History'],
  '/govern': ['Govern'],
  '/govern/audit': ['Govern', 'Audit Ledger'],
  '/govern/audit-detail': ['Govern', 'Audit Detail'],
  '/govern/trust': ['Govern', 'Trust'],
  '/govern/registry': ['Govern', 'Registry'],
  '/govern/oversight': ['Govern', 'Oversight'],
  '/govern/policy': ['Govern', 'Policy'],
  '/settings': ['Settings'],
  '/settings/ai': ['Settings', 'AI'],
  '/settings/integrations': ['Settings', 'Integrations'],
  '/settings/rights': ['Settings', 'Rights'],
  '/help': ['Help'],
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
      <aside className="glass-sidebar fixed top-0 left-0 z-40 hidden h-screen w-[240px] flex-col lg:flex">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-5 py-5" aria-label="Poseidon home">
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
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Main navigation">
          <span className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
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
                  'flex items-center gap-3 rounded-xl border-l-[3px] px-4 py-3 transition-colors duration-150 hover:bg-white/5 hover:text-slate-50',
                  isActive ? tone.activeLink : 'border-l-transparent text-slate-400'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-[18px] w-[18px]', isActive && tone.activeIcon)} aria-hidden="true" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
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
          <span className="px-3 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
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
                  'flex items-center gap-3 rounded-xl border-l-[3px] px-4 py-3 transition-colors duration-150 hover:bg-white/5 hover:text-slate-50',
                  isActive ? tone.activeLink : 'border-l-transparent text-slate-400',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-[18px] w-[18px]', isActive && tone.activeIcon)} aria-hidden="true" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar bottom: user */}
        <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-slate-400"
            aria-hidden="true"
          >
            {state.user.initials}
          </div>
          <span className="text-sm text-slate-400">{state.user.name}</span>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="relative flex min-w-0 flex-1 flex-col lg:ml-[240px]">
        <AuroraPulse engine={activeEngine} intensity="subtle" />
        {/* ── Desktop top header ── */}
        <header className="glass-header sticky top-0 z-30 hidden h-14 items-center justify-between px-6 lg:flex">
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
        <header className="glass-header sticky top-0 z-30 flex h-14 items-center justify-between px-4 lg:hidden">
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
            className="glass-header flex items-center gap-2 overflow-x-auto border-b border-white/5 px-4 py-2.5 lg:px-6"
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
        <main className="flex-1">{children}</main>

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
        className="glass-header fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/5 pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
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
