import React, { useState, useEffect, useCallback } from 'react';
import { Link, useRouter } from '../router';
import { Button } from './Button';

const navItems = [
  { label: 'Landing', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Protect', to: '/protect' },
  { label: 'Grow', to: '/grow' },
  { label: 'Execute', to: '/execute' },
  { label: 'Govern', to: '/govern' },
  { label: 'Settings', to: '/settings' },
  { label: 'V3 Hub', to: '/v3' },
];

export const TopNav: React.FC = () => {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMobile(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`top-nav${scrolled ? ' top-nav--scrolled' : ''}`}>
        <div className="brand">
          <div className="logo">P</div>
          <span>Poseidon</span>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`nav-link ${path === item.to ? 'active' : ''}`}
              {...(path === item.to ? { 'aria-current': 'page' as const } : {})}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Button variant="ghost" to="/login">Sign in</Button>
          <Button variant="primary" to="/signup">Start free</Button>
        </div>
        <button
          className="mobile-menu-btn"
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`hamburger${mobileOpen ? ' hamburger-open' : ''}`} aria-hidden="true" />
        </button>
      </header>

      {mobileOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={closeMobile} aria-hidden="true" />
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`mobile-nav-link ${path === item.to ? 'active' : ''}`}
                onClick={closeMobile}
                {...(path === item.to ? { 'aria-current': 'page' as const } : {})}
              >
                {item.label}
              </Link>
            ))}
            <div className="mobile-nav-actions">
              <Button variant="ghost" to="/login" onClick={closeMobile}>Sign in</Button>
              <Button variant="primary" to="/signup" onClick={closeMobile}>Start free</Button>
            </div>
          </nav>
        </>
      )}
    </>
  );
};
