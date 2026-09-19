import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  Wrench,
  Download,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { KnowledgeBankEngine } from '../../../lib/knowledge/engine';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';

export const metadata: Metadata = {
  title: 'Offline Return Filing Utilities & JSON Schemas 2026–2027 | Knowledge Bank',
  description:
    'Official government return utilities, JSON validators, DSC signers, EmBridge, and TDS/TCS File Validation Utilities (FVU).',
  openGraph: {
    title: 'Offline E-Filing Utilities & Schemas | Thabrez Tax Consulting',
    description:
      'Official offline return preparation tools and digital signature utilities for Income Tax, GST, MCA V3, and TRACES.',
    type: 'website',
  },
};

export default function UtilitiesHubPage(): JSX.Element {
  const utilities = KnowledgeBankEngine.getUtilities();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/utilities" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">E-Filing Utilities &amp; Software</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <Wrench className="h-3.5 w-3.5 text-blue-300" />
              <span>Official Desktop Tools &amp; JSON Schemas</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Tax Utilities &amp; Signer Hub 2026–2027
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Download verified offline return preparation software, Class-3 USB Token DSC bridge drivers, and NSDL File Validation Utilities (FVU).
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {utilities.map((util) => (
              <div
                key={util.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs">
                      {util.category}
                    </span>
                    <VerifiedSourceBadge authority={util.sourceAuthority} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#8B3FA8] transition-colors">
                    {util.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-semibold">{util.version}</span>
                    <span>{util.platform}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {util.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">Installation / Execution Notes:</span>
                    <span>{util.instructions}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Official Government Release
                  </span>
                  <a
                    href={util.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B2A4A] hover:bg-[#8B3FA8] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Utility</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Tile */}
          <div className="rounded-3xl bg-blue-50 border border-blue-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-blue-950 text-sm">Facing Java JRE / DSC Token Driver Compatibility Issues?</h4>
              <p className="text-xs text-blue-800 max-w-2xl">
                Our IT and systems compliance desk assists corporate clients with token driver registration, EmBridge certificate bindings, and automated JSON schema batch processing.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs shrink-0 shadow hover:bg-blue-900"
            >
              Contact IT Support Desk
            </Link>
          </div>
        </div>

        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
