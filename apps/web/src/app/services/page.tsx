import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, Button } from '@thabrez/ui';
import { serviceCategories, detailedServices } from '@thabrez/config/company-content';
import {
  Building2,
  FileCheck2,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Practice Areas & Services | Thabrez Tax Consulting',
  description:
    'Comprehensive Chartered Accountant services in India: Private Limited Company Registration, GST Returns, Income Tax Returns, ROC Annual Filings, MSME, Trademark, and Banking Project Reports.',
  openGraph: {
    title: 'Chartered Accountant Services & Practice Areas | Thabrez Tax Consulting',
    description:
      'Expert corporate tax, incorporation, GST, and audit services across India.',
    type: 'website',
  },
};

export default function ServicesOverviewPage(): JSX.Element {
  const categoryIcons = [Building2, FileCheck2, TrendingUp, Award];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/services" />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-block rounded-md bg-[#E8823A]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
              Practice Areas
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Corporate, Tax &amp; Financial Services
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
              End-to-end statutory compliance, corporate law, direct/indirect taxation, and debt syndication delivered with precision.
            </p>
          </div>
        </section>

        {/* Categorized Services List */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
            {serviceCategories.map((group, gIdx) => {
              const Icon = categoryIcons[gIdx % categoryIcons.length] || Building2;

              return (
                <div key={gIdx} className="space-y-8" id={group.slug}>
                  {/* Category Header */}
                  <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                        <Icon className="h-4 w-4" /> Category 0{gIdx + 1}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        {group.category}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {/* Services Cards Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {group.services.map((srv, sIdx) => {
                      const details = detailedServices[srv.slug];

                      return (
                        <div
                          key={sIdx}
                          className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base font-bold text-slate-900">
                                {srv.name}
                              </h3>
                              {details?.estimatedDays && (
                                <span className="inline-flex items-center gap-1 rounded bg-slate-200/70 px-2 py-0.5 text-[10px] font-medium text-slate-700 shrink-0">
                                  <Clock className="h-2.5 w-2.5" />
                                  {details.estimatedDays}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {details?.shortDesc ||
                                `Professional execution and statutory advisory for ${srv.name}.`}
                            </p>

                            {details?.deliverables && (
                              <ul className="space-y-1.5 text-xs text-slate-700 pt-3 border-t border-slate-200/60">
                                {details.deliverables.slice(0, 3).map((deliv, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{deliv}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="pt-5 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                            <Link
                              href={`/services/${srv.slug}`}
                              className="text-xs font-bold text-[#8B3FA8] hover:text-[#1B2A4A] flex items-center gap-1 transition-colors"
                            >
                              Learn More &amp; Requirements <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Footer banner */}
        <section className="py-16 bg-[#1B2A4A] text-white border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Need a Custom Multi-Entity or Multi-State Retainer?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Our partners structure custom accounting, secretarial, and litigation retainers for enterprises operating across India.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button size="xl" className="bg-[#E8823A] text-white hover:bg-[#E8823A]/90 font-semibold shadow-lg">
                  Speak Directly with a Senior CA <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
