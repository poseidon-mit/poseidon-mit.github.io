import { useEffect } from 'react';

/**
 * Sets the document title for the current page.
 * Automatically resets to 'Poseidon' when the component unmounts.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Poseidon` : 'Poseidon';
    return () => {
      document.title = 'Poseidon';
    };
  }, [title]);
}
