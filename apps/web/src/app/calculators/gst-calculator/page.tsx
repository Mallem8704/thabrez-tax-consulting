import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { GstCalculator } from '../../../components/calculators/gst-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GST Calculator India — Inclusive & Exclusive Tax | Thabrez Tax Consulting',
  description:
    'Free online GST calculator for India. Calculate CGST, SGST, IGST across 5%, 12%, 18%, and 28% slabs with GST inclusive and exclusive calculations.',
  keywords: ['GST Calculator', 'CGST SGST IGST Calculator', 'GST Inclusive Calculator', 'GST Tax Slab India'],
  openGraph: {
    title: 'GST Calculator — Free Online Tax Calculator',
    description: 'Calculate Indian GST amounts with CGST, SGST, IGST breakdown.',
    type: 'website',
  },
};

export default function GstCalculatorPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/calculators" />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-12 text-white sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to All Calculators
            </Link>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">
              GST Calculator India
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Calculate Goods &amp; Services Tax (GST) for inclusive and exclusive amounts with CGST, SGST, and IGST division.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <GstCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
