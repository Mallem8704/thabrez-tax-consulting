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
  showSubtitle = true,
}: BrandLogoProps): JSX.Element {
  const isDark = variant === 'dark';

  // Size scalers
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subtitleSize = size === 'sm' ? 'text-[8px]' : 'text-[9.5px]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Hexagonal Brand Shield */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="thabrezGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B3FA8" />
            <stop offset="50%" stopColor="#A83279" />
            <stop offset="100%" stopColor="#E8823A" />
          </linearGradient>
          <linearGradient id="innerShine" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon Shield */}
        <path
          d="M50 4L92 26V74L50 96L8 74V26L50 4Z"
          stroke="url(#thabrezGradient)"
          strokeWidth="8"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Inner Stylized CA 'T' Monogram */}
        <path
          d="M26 32H74M50 32V76"
          stroke="url(#thabrezGradient)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center node accent */}
        <circle cx="50" cy="54" r="4.5" fill="#E8823A" />
      </svg>

      {/* Brand Typography Lockup */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-[0.16em] uppercase font-display ${titleSize} ${
            isDark ? 'text-white' : 'text-[#1B2A4A]'
          }`}
          style={{ letterSpacing: '0.14em' }}
        >
          THABREZ
        </span>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex gap-0.5 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B3FA8]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#A83279]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8823A]" />
            </span>
            <span
              className={`font-semibold tracking-[0.2em] uppercase font-sans ${subtitleSize} ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              TAX CONSULTING
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
