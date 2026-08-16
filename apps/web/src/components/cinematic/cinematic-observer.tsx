'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function CinematicObserver(): null {
  const pathname = usePathname();

  useEffect(() => {
    // Select all elements marked with cinematic transition classes or data attributes
    const elements = document.querySelectorAll(
      '.cinematic-fade-up, .cinematic-fade-in, .cinematic-fade-left, .cinematic-fade-right, .cinematic-scale-up, [data-cinematic]',
    );

    if (elements.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Unobserve once revealed for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px', // Triggers slightly before element enters viewport
        threshold: 0.1,
      },
    );

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
