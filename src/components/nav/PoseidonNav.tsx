import React from 'react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/router';
import { usePoseidonStore } from '@/store/poseidonStore';

export function PoseidonNav() {
  const { path } = useRouter();
  const { protect, grow, execute, govern } = usePoseidonStore();

  const protectCritical = protect.threats.filter((t) => t.type === 'critical').length;
  const protectWarning = protect.threats.filter((t) => t.type === 'warning').length;
  const protectBadge = protectCritical > 0 || protectWarning > 0
    ? (protectCritical + protectWarning) : 0;

  const growBadge = grow.opportunities.length;
  const executeBadge = execute.pendingActions.length;
  const governScore = govern.auditScore;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    {
      label: 'Protect',
      path: '/protect',
      badge: protectBadge > 0 ? `⚠${protectBadge}` : null,
      badgeColor: protectCritical > 0 ? 'text-[var(--poseidon-red)]' : 'text-[var(--poseidon-gold)]',
    },
    {
      label: 'Grow',
      path: '/grow',
      badge: growBadge > 0 ? `✦${growBadge}` : null,
      badgeColor: 'text-[var(--poseidon-cyan)]',
    },
    {
      label: 'Execute',
      path: '/execute',
      badge: executeBadge > 0 ? `●${executeBadge}` : null,
      badgeColor: 'text-[var(--poseidon-cyan)]',
    },
    {
      label: `Govern ${governScore}`,
      path: '/govern',
      badgeColor: 'text-[var(--poseidon-green)]',
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-[var(--poseidon-border)] bg-[var(--poseidon-bg)]/80 backdrop-blur-md z-50 flex items-center px-6">
      <div className="flex items-center gap-2 mr-12 text-[var(--poseidon-cyan)] font-bold tracking-widest text-lg">
        ◆ POSEIDON.AI
      </div>

      <div className="flex items-center gap-8 h-full">
        {navItems.map((item) => {
          const isActive = path === item.path || (path.startsWith(item.path) && item.path !== '/');
          return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative h-full flex items-center font-medium transition-colors ${
                isActive ? 'text-[var(--poseidon-text)]' : 'text-[var(--poseidon-muted)] hover:text-[var(--poseidon-text)]'
              }`}
          >
              <>
                <div className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <motion.span
                      key={item.badge}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-sm ${item.badgeColor}`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--poseidon-cyan)]"
                    style={{
                      boxShadow: '0 0 10px var(--poseidon-cyan)',
                    }}
                  />
                )}
              </>
          </Link>
          );
        })}
      </div>
    </nav>
  );
}
