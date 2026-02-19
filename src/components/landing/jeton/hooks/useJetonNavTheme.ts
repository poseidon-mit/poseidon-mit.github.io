import { useEffect, useState, type RefObject } from 'react';
import { JETON_SCROLL_ROOT_MARGIN } from '../jeton-config';

export type JetonNavTheme = 'dark' | 'light';

export function useJetonNavTheme(
  lightSectionRefs: ReadonlyArray<RefObject<HTMLElement | null>>,
): JetonNavTheme {
  const [theme, setTheme] = useState<JetonNavTheme>('dark');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const visibleLightSections = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleLightSections.add(entry.target);
          } else {
            visibleLightSections.delete(entry.target);
          }
        }
        setTheme(visibleLightSections.size > 0 ? 'light' : 'dark');
      },
      {
        threshold: 0.01,
        rootMargin: JETON_SCROLL_ROOT_MARGIN,
      },
    );

    for (const ref of lightSectionRefs) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      observer.disconnect();
      visibleLightSections.clear();
    };
  }, [lightSectionRefs]);

  return theme;
}
