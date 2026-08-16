import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { GstRateCalculator } from '../../../components/calculators/gst-rate-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'GST Rate Finder & HSN/SAC Code Calculator | Thabrez Tax Consulting',
  description:
    'Find official GST rates, HSN codes for goods, and SAC codes for services in India with category classifications and notes.',
  keywords: ['GST Rate Finder', 'HSN Code List India', 'SAC Code Finder', 'GST Tax Slabs'],
  openGraph: {
    title: 'GST Rate Finder & HSN/SAC Code Calculator',
    description: 'Look up official GST rates and HSN/SAC codes.',
    type: 'website',
  },
};

export default function GstRateCalculatorPage(): JSX.Element {
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
              GST Rate &amp; HSN/SAC Code Finder
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Search official GST slabs across common goods, manufacturing products, and professional services.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <GstRateCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
