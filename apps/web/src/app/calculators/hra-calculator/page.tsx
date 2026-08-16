import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { HraCalculator } from '../../../components/calculators/hra-calculator';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HRA Exemption Calculator — Section 10(13A) Rule 2A | Thabrez Tax Consulting',
  description:
    'Calculate House Rent Allowance (HRA) tax exemption under Section 10(13A) and Rule 2A of Indian Income Tax Rules. Metro vs Non-Metro calculation.',
  keywords: ['HRA Calculator', 'Section 10(13A) Calculator', 'HRA Exemption Rule 2A', 'House Rent Allowance Tax Deduction'],
  openGraph: {
    title: 'HRA Calculator — Section 10(13A) Tax Exemption',
    description: 'Calculate your exact tax-free HRA amount according to Income Tax rules.',
    type: 'website',
  },
};

export default function HraCalculatorPage(): JSX.Element {
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
              HRA Exemption Calculator (Section 10(13A))
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Compute your eligible House Rent Allowance (HRA) tax exemption under Rule 2A of Income Tax Rules.
            </p>
          </div>
        </section>

        {/* Interactive Component */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <HraCalculator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
