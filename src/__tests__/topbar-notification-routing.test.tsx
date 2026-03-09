import { describe, test, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../test/render-with-router';
import { TopBar } from '../components/navigation/TopBar';

describe('TopBar Component Route Obligations', () => {
    test('Bell icon routes to /dashboard/notifications on click', () => {
        renderWithRouter(
            <TopBar
                breadcrumbs={['Dashboard']}
                isOffline={false}
                isPresentation={false}
                onOpenPalette={vi.fn()}
            />,
            { initialPath: '/dashboard' },
        );

        const bell = screen.getByRole('button', { name: /notifications/i });
        expect(bell).toBeInTheDocument();

        fireEvent.click(bell);
        expect(window.location.pathname).toBe('/dashboard/notifications');
    });
});
