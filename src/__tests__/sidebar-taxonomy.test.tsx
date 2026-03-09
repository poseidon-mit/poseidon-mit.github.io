import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/render-with-router';
import { Sidebar } from '../components/navigation/Sidebar';

describe('Sidebar Component Policy Obligations', () => {
    test('Sidebar displays consumer-goal nav labels: Dashboard, Protect, Grow, Execute, Govern, Settings', () => {
        renderWithRouter(<Sidebar path="/dashboard" />);

        const expectedLabels = ['Dashboard', 'Protect', 'Grow', 'Execute', 'Govern', 'Settings'];
        for (const label of expectedLabels) {
            expect(screen.getByText(label, { exact: true })).toBeInTheDocument();
        }
    });

    test('"Engines" does not appear as a nav group label or anywhere in sidebar', () => {
        renderWithRouter(<Sidebar path="/dashboard" />);

        expect(screen.queryByText('Engines')).not.toBeInTheDocument();
    });

    test('No nav label contains the word "Engine"', () => {
        renderWithRouter(<Sidebar path="/dashboard" />);

        const nav = screen.getByRole('navigation', { name: /main navigation/i });
        const links = nav.querySelectorAll('a');
        for (const link of links) {
            expect(link.textContent).not.toMatch(/engine/i);
        }
    });
});
