import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Globe2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';

export const metadata: Metadata = {
  title: 'Official Government Gateways & Portals Directory | Knowledge Bank',
  description:
    'Direct access to 15+ verified Government of India portals: Income Tax, GST Common Portal, MCA21 V3, TRACES, RBI FIRMS, ICEGATE, and EPFO.',
  openGraph: {
    title: 'Verified Government Portals Directory | Thabrez Tax Consulting',
    description:
      'Direct authentic web links to Central and State Government regulatory filing portals.',
    type: 'website',
  },
};

export default function GovernmentLinksPage(): JSX.Element {
  const links = KnowledgeBankEngine.getGovLinks();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/links" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Government Portals Directory</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <Globe2 className="h-3.5 w-3.5 text-emerald-300" />
              <span>Official Government Gateways (15+ Portals)</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Government Regulatory Gateways
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Direct authenticated access to verified government departments, e-filing systems, judicial tribunals, and statutory registration portals.
            </p>
          </div>
        </section>

        {/* Links Grid */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs">
                      {link.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                    <span>{link.name}</span>
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </h3>

                  <div className="text-xs text-[#8B3FA8] font-semibold">
                    {link.authority}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {link.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
                    {link.url.replace('https://', '')}
                  </span>
                  <span className="font-bold text-emerald-700 group-hover:underline">
                    Access Portal →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
