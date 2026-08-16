import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { StickyConsultationCta } from '@thabrez/ui';
import { AuthSessionProvider } from '../components/providers/session-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Thabrez Tax Consulting',
    default: 'Thabrez Tax Consulting — Expert CA Services in India',
  },
  description:
    'Thabrez Tax Consulting provides professional GST, ITR, TDS, ROC filing, and accounting services. Trusted by businesses across India.',
  keywords: [
    'CA services India',
    'GST filing',
    'income tax return',
    'TDS return',
    'ROC filing',
    'tax consultancy',
    'chartered accountant',
  ],
  authors: [{ name: 'Thabrez Tax Consulting' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Thabrez Tax Consulting',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthSessionProvider>
          {children}
          <StickyConsultationCta />
        </AuthSessionProvider>
      </body>
    </html>
  );
}

