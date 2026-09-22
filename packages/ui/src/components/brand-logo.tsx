'use client';

import * as React from 'react';

export interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function BrandLogo({
  className = '',
  variant = 'light',
  size = 'md',
}: BrandLogoProps): JSX.Element {
  const isDark = variant === 'dark';
  const logoSrc = isDark ? '/logo-lockup-dark.png' : '/logo-lockup.png';

  const heightClass =
    size === 'sm'
      ? 'h-8 sm:h-9'
      : size === 'lg'
        ? 'h-12 sm:h-14'
        : 'h-10 sm:h-11';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Thabrez Tax Consulting Pvt Ltd"
        className={`${heightClass} w-auto object-contain shrink-0`}
        loading="eager"
      />
    </div>
  );
}
