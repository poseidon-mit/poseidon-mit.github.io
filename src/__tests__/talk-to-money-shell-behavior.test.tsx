import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/render-with-router';
import { TalkToMoneyFab } from '../components/ui/TalkToMoneyFab';

describe('Talk To Money Shell Behavior Tests', () => {
    test('FAB on /dashboard is present, not fake-disabled, no coming-soon text', () => {
        renderWithRouter(<TalkToMoneyFab />, { initialPath: '/dashboard' });

        const fab = screen.getByRole('button', { name: /talk your money/i });
        expect(fab).toBeInTheDocument();
        expect(fab).not.toHaveAttribute('disabled');
        expect(fab.className).not.toContain('cursor-not-allowed');
        expect(fab.textContent?.toLowerCase()).not.toContain('coming soon');
    });

    test('FAB on /govern/audit-detail?decision=GOV-003 is present, not fake-disabled, no coming-soon text', () => {
        renderWithRouter(<TalkToMoneyFab />, {
            initialPath: '/govern/audit-detail?decision=GOV-003',
        });

        const fab = screen.getByRole('button', { name: /talk your money/i });
        expect(fab).toBeInTheDocument();
        expect(fab).not.toHaveAttribute('disabled');
        expect(fab.className).not.toContain('cursor-not-allowed');
        expect(fab.textContent?.toLowerCase()).not.toContain('coming soon');
    });

    test('FAB has z-30 and does not use z-[9999] which would obscure navigation', () => {
        renderWithRouter(<TalkToMoneyFab />, { initialPath: '/dashboard' });

        const fab = screen.getByRole('button', { name: /talk your money/i });
        expect(fab.className).toContain('z-30');
        expect(fab.className).not.toContain('z-[9999]');
    });
});
