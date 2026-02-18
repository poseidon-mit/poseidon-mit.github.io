import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider } from '../../router';

// Current active pages (v0 architecture — self-contained, no PageShell/entry-screen required)
import Dashboard from '../Dashboard';
import Execute from '../Execute';
import Govern from '../Govern';
import Grow from '../Grow';
import Landing from '../Landing';
import Login from '../Login';
import NotFound from '../NotFound';
import Onboarding from '../Onboarding';
import Protect from '../Protect';
import Settings from '../Settings';
import Signup from '../Signup';

const PAGE_CASES: Array<{ name: string; render: () => React.ReactElement }> = [
  { name: 'Landing', render: () => <Landing /> },
  { name: 'Signup', render: () => <Signup /> },
  { name: 'Login', render: () => <Login /> },
  { name: 'Onboarding', render: () => <Onboarding /> },
  { name: 'Dashboard', render: () => <Dashboard /> },
  { name: 'Protect', render: () => <Protect /> },
  { name: 'Grow', render: () => <Grow /> },
  { name: 'Execute', render: () => <Execute /> },
  { name: 'Govern', render: () => <Govern /> },
  { name: 'Settings', render: () => <Settings /> },
  { name: 'NotFound', render: () => <NotFound /> },
];

function renderPage(element: React.ReactElement) {
  return render(<RouterProvider>{element}</RouterProvider>);
}

describe('visual system coverage - all pages render without crash', () => {
  it.each(PAGE_CASES)('$name renders with non-empty DOM', ({ render: renderElement }) => {
    const { container } = renderPage(renderElement());
    expect(container.innerHTML).toBeTruthy();
    // All pages must have at least one heading (accessibility baseline)
    expect(container.querySelector('h1, h2, h3')).not.toBeNull();
  });
});
