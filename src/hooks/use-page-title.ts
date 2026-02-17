import { useEffect } from 'react';

/**
 * Sets the document title for the current page.
 * Automatically resets to 'Poseidon.AI' when the component unmounts.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Poseidon.AI` : 'Poseidon.AI';
    return () => {
      document.title = 'Poseidon.AI';
    };
  }, [title]);
}
