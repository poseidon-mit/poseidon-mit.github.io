import { Link, useRouter } from '../router';
import { cn } from '@/lib/utils';
import { getRouteUXMeta } from '../router/lazyRoutes';
import {
  Home,
  UserPlus,
  Compass,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Landing', icon: Home },
  { to: '/signup', label: 'Signup', icon: UserPlus },
  { to: '/onboarding', label: 'Onboarding', icon: Compass },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/protect', label: 'Protect', icon: Shield },
  { to: '/grow', label: 'Grow', icon: TrendingUp },
  { to: '/execute', label: 'Execute', icon: Zap },
  { to: '/govern', label: 'Govern', icon: Scale },
  { to: '/settings', label: 'Settings', icon: Settings },
];

type AppNavActionVariant = 'primary' | 'ghost' | 'minor';

interface AppNavAction {
  label: string;
  to: string;
  variant: AppNavActionVariant;
}

const defaultActions: AppNavAction[] = [
  { label: 'Setup', to: '/onboarding', variant: 'ghost' },
  { label: 'Invite team', to: '/signup', variant: 'primary' },
];

const actionClassMap: Record<AppNavActionVariant, string> = {
  primary: 'entry-btn entry-btn--primary',
  ghost: 'entry-btn entry-btn--ghost',
  minor: 'entry-link-minor',
};

/**
 * Shared navigation bar — used by Dashboard + all engine pages.
 * Replaces duplicate nav code in Dashboard.tsx and EngineWorkspace.tsx.
 */
export function AppNav({ actions }: { actions?: AppNavAction[] }) {
  const { path } = useRouter();
  const uxMeta = getRouteUXMeta(path);
  const navActions =
    actions ??
    (() => {
      if (!uxMeta) return defaultActions;
      if (uxMeta.navGroup === 'settings') {
        return [{ label: 'Help', to: '/help', variant: 'minor' }];
      }
      if (uxMeta.navGroup === 'engine' || uxMeta.navGroup === 'core') {
        return [{ label: 'Help', to: '/help', variant: 'minor' }];
      }
      const dynamic: AppNavAction[] = [];
      if (uxMeta.primaryActionPath !== path) {
        dynamic.push({
          label: uxMeta.primaryActionLabel,
          to: uxMeta.primaryActionPath,
          variant: 'primary',
        });
      }
      dynamic.push({
        label: uxMeta.navGroup === 'public' ? 'Setup' : 'Help',
        to: uxMeta.navGroup === 'public' ? '/onboarding' : '/help',
        variant: uxMeta.navGroup === 'public' ? 'ghost' : 'minor',
      });
      return dynamic;
    })();

  const isActiveRoute = (to: string): boolean => {
    if (to === '/') return path === '/';
    return path === to || path.startsWith(`${to}/`);
  };

  return (
    <header className="entry-nav entry-nav--grid">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Link className="entry-brand" to="/">
        <span className="entry-brand-mark">P</span>
        <span>Poseidon</span>
      </Link>
      <nav className="entry-nav-links" aria-label="Primary">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              prefetch="intent"
              className={cn(isActive && 'is-active')}
              aria-label={item.label}
            >
              <Icon className="app-nav-icon" size={18} aria-hidden="true" />
              <span className={cn('app-nav-label', isActive && 'app-nav-label--active')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      {navActions.length > 0 && (
        <div className="entry-nav-actions">
          {navActions.map((action) => (
            <Link
              key={`${action.to}-${action.label}`}
              className={actionClassMap[action.variant]}
              to={action.to}
              prefetch="intent"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
