import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Calculator,
  Percent,
  Receipt,
  Building,
  TrendingUp,
  Wallet,
  Coins,
  DollarSign,
  ArrowRight,
  Tag,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Financial & Tax Calculators | Thabrez Tax Consulting',
  description:
    'Free online Indian tax & financial calculators: GST Calculator, GST Rate Finder, TDS Calculator, Income Tax (New vs Old Regime), Loan EMI, HRA Exemption, Net Worth, SIP, and Lumpsum Calculators.',
  keywords: [
    'GST Calculator India',
    'TDS Calculator 194J 194C',
    'Income Tax Calculator New Regime',
    'Loan EMI Calculator',
    'HRA Calculator Section 10 13A',
    'SIP Calculator India',
    'Net Worth Calculator CA',
  ],
  openGraph: {
    title: 'Financial & Tax Calculators | Thabrez Tax Consulting',
    description:
      'Accurate, free, and updated Indian statutory tax & financial calculators by certified Chartered Accountants.',
    type: 'website',
  },
};

export default function CalculatorsHubPage(): JSX.Element {
  const calculatorTools = [
    {
      slug: 'gst-calculator',
      title: 'GST Calculator',
      description: 'Calculate GST inclusive and exclusive amounts with CGST, SGST, and IGST breakdown across 5%, 12%, 18%, and 28% slabs.',
      icon: Calculator,
      badge: 'GST Act 2017',
      color: '#8B3FA8',
    },
    {
      slug: 'gst-rate-calculator',
      title: 'GST Rate & HSN/SAC Finder',
      description: 'Look up official GST rates, HSN codes for goods, and SAC codes for services with statutory classification notes.',
      icon: Tag,
      badge: 'HSN / SAC',
      color: '#C43D6B',
    },
    {
      slug: 'tds-calculator',
      title: 'TDS Calculator',
      description: 'Compute Tax Deducted at Source under Sections 194C, 194J, 194I, 194H, 194Q with PAN vs Non-PAN Section 206AA rules.',
      icon: Receipt,
      badge: 'Income Tax Act',
      color: '#E8823A',
    },
    {
      slug: 'income-tax-calculator',
      title: 'Income Tax Calculator',
      description: 'Side-by-side comparison of New Tax Regime (Section 115BAC) vs Old Tax Regime with Standard Deduction ₹75,000 and 87A rebate.',
      icon: Percent,
      badge: 'New vs Old Slabs',
      color: '#3C8C4A',
    },
    {
      slug: 'emi-calculator',
      title: 'Loan EMI Calculator',
      description: 'Calculate monthly loan installments for Home, Business, or Personal loans with total interest and yearly amortization schedule.',
      icon: Building,
      badge: 'Banking & Loans',
      color: '#1B2A4A',
    },
    {
      slug: 'hra-calculator',
      title: 'HRA Exemption Calculator',
      description: 'Determine exact House Rent Allowance tax exemption under Section 10(13A) and Rule 2A for Metro vs Non-Metro cities.',
      icon: DollarSign,
      badge: 'Section 10(13A)',
      color: '#8B3FA8',
    },
    {
      slug: 'net-worth-calculator',
      title: 'Net Worth Calculator',
      description: 'Evaluate your personal balance sheet: aggregate real estate, equities, gold, and deposits against outstanding liabilities.',
      icon: Wallet,
      badge: 'CA Balance Sheet',
      color: '#C43D6B',
    },
    {
      slug: 'sip-calculator',
      title: 'SIP Calculator',
      description: 'Forecast the future maturity corpus of your monthly mutual fund Systematic Investment Plan with compound growth curves.',
      icon: TrendingUp,
      badge: 'Wealth Creation',
      color: '#E8823A',
    },
    {
      slug: 'lumpsum-calculator',
      title: 'Lumpsum Investment Calculator',
      description: 'Calculate the compound growth and returns on a one-time lump sum deposit over 1 to 30 years.',
      icon: Coins,
      badge: 'Compound Growth',
      color: '#3C8C4A',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/calculators" />

      <main className="flex-1">
        {/* Hub Hero */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-block rounded-md bg-[#E8823A]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
              Free Financial Tools
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Indian Tax &amp; Financial Calculators
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
              Compliant, instantaneous, and updated to the latest Union Budget &amp; Income Tax rules. Zero backend lag.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {calculatorTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/calculators/${tool.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200"
                          style={{ color: tool.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {tool.badge}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#1B2A4A] transition-colors">
                          {tool.title}
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8B3FA8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Launch Calculator <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Consultation Banner */}
        <section className="py-16 bg-[#1B2A4A] text-white border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Need Professional Chartered Accountant Verification?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Our partners prepare statutory computations, file verified ITR returns, and issue certified CA net worth certificates with UDIN.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] px-6 py-3 text-sm font-semibold text-white shadow hover:opacity-95 transition-opacity"
              >
                Schedule Free CA Consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
