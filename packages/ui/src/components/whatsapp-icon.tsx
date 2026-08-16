'use client';

import * as React from 'react';

export interface WhatsAppIconProps {
  className?: string;
  size?: number | string;
}

/**
 * Authentic Official WhatsApp Vector Icon
 */
export function WhatsAppIcon({
  className = '',
  size = 24,
}: WhatsAppIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.71 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.09 19.11L7.8 18.94L4.69 19.76L5.52 16.72L5.34 16.42C4.58 15.08 4.18 13.51 4.18 11.91C4.18 7.37 7.88 3.67 12.04 3.67ZM16.54 14.33C16.29 14.2 15.08 13.61 14.86 13.53C14.63 13.44 14.47 13.4 14.3 13.65C14.14 13.9 13.68 14.44 13.54 14.6C13.4 14.77 13.26 14.79 13.01 14.66C12.76 14.54 11.96 14.27 11.01 13.43C10.27 12.77 9.77 11.96 9.63 11.71C9.48 11.46 9.61 11.33 9.74 11.2C9.85 11.09 9.98 10.91 10.11 10.77C10.23 10.62 10.27 10.52 10.36 10.35C10.44 10.19 10.4 10.04 10.34 9.92C10.27 9.79 9.82 8.68 9.63 8.22C9.45 7.78 9.26 7.84 9.12 7.83C8.99 7.82 8.84 7.82 8.69 7.82C8.54 7.82 8.3 7.88 8.09 8.11C7.88 8.34 7.29 8.89 7.29 10.02C7.29 11.14 8.11 12.23 8.23 12.38C8.34 12.53 9.87 14.88 12.21 15.89C12.77 16.13 13.2 16.28 13.55 16.39C14.11 16.57 14.62 16.54 15.03 16.48C15.48 16.41 16.41 15.91 16.6 15.37C16.8 14.83 16.8 14.37 16.74 14.28C16.68 14.19 16.54 14.14 16.29 14.01L16.54 14.33Z"
      />
    </svg>
  );
}

/**
 * Authentic WhatsApp Full Color Floating Badge / Icon Lockup
 */
export function WhatsAppBadge({
  className = '',
  size = 24,
}: {
  className?: string;
  size?: number;
}): JSX.Element {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <WhatsAppIcon size={Math.round(size * 0.62)} className="fill-white" />
    </div>
  );
}
