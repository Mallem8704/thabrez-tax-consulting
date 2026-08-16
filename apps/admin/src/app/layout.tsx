import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthSessionProvider } from '../components/providers/session-provider';
import { InactivityTracker } from '../components/auth/inactivity-tracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Thabrez Staff Console',
    default: 'Thabrez Staff & CA Console',
  },
  description: 'Internal staff management console for Thabrez Tax Consulting.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950 text-zinc-100`}>
        <AuthSessionProvider>
          {children}
          <InactivityTracker />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
