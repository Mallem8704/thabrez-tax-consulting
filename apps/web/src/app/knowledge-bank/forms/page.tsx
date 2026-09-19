import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  FileText,
  ExternalLink,
  ChevronRight,
  Scale,
  Building2,
  Receipt,
} from 'lucide-react';
import { VerifiedSourceBadge } from '../../../components/knowledge/verified-source-badge';
import { LegalDisclaimerFooter } from '../../../components/knowledge/legal-disclaimer-footer';
import { AuthorityType } from '@thabrez/types';

export const metadata: Metadata = {
  title: 'Official Statutory Forms Library 2026–2027 | Income Tax, GST, MCA & Labour',
  description:
    'Comprehensive directory of official statutory forms and return utilities: ITR-1 to 7, Form 10-IEA, 15CA/CB, GSTR-1, GSTR-3B, GSTR-9, SPICe+, DIR-3 KYC, and AOC-4.',
  openGraph: {
    title: 'Statutory Forms Library 2026–2027 | Thabrez Tax Consulting',
    description:
      'Official statutory templates, download links, and e-filing instructions across CBDT, CBIC, MCA, and EPFO.',
    type: 'website',
  },
};

export default function FormsLibraryPage(): JSX.Element {
  const formCategories = [
    {
      id: 'incometax',
      name: 'Direct Tax & Income Tax Returns',
      authority: AuthorityType.CBDT,
      icon: Scale,
      color: 'text-[#8B3FA8]',
      forms: [
        {
          code: 'ITR-1 (SAHAJ)',
          name: 'Income Tax Return for Salaried Individuals',
          applicableTo: 'Resident individuals with total income up to ₹50 Lakhs from Salary, One House Property, and Other Sources.',
          frequency: 'Annual (Due 31st July)',
          portalUrl: 'https://www.incometax.gov.in',
        },
        {
          code: 'ITR-2',
          name: 'Return for Individuals & HUFs with Capital Gains / Foreign Assets',
          applicableTo: 'Assessees having income from Capital Gains, multiple house properties, or foreign assets/accounts.',
          frequency: 'Annual (Due 31st July)',
          portalUrl: 'https://www.incometax.gov.in',
        },
        {
          code: 'ITR-3 & ITR-4 (SUGAM)',
          name: 'Return for Business & Professional Assessees / Presumptive 44AD/ADA',
          applicableTo: 'Proprietorships, professionals, and small businesses opting for presumptive taxation under 44AD/44ADA.',
          frequency: 'Annual (Due 31st July / 31st Oct if audited)',
          portalUrl: 'https://www.incometax.gov.in',
        },
        {
          code: 'ITR-6',
          name: 'Return for Companies (Domestic & Foreign)',
          applicableTo: 'All registered companies under the Companies Act other than non-profit organizations claiming exemption under Section 11.',
          frequency: 'Annual (Due 31st October)',
          portalUrl: 'https://www.incometax.gov.in',
        },
        {
          code: 'Form 10-IEA',
          name: 'Exercise / Opt-out of Section 115BAC New Tax Regime',
          applicableTo: 'Mandatory for assessees having income from business or profession to opt in or out of Section 115BAC.',
          frequency: 'On or before statutory ITR due date',
          portalUrl: 'https://www.incometax.gov.in',
        },
        {
          code: 'Form 15CA & 15CB',
          name: 'Information / CA Certificate for Foreign Remittances (Section 195)',
          applicableTo: 'Mandatory for outbound foreign transfers to non-residents for tax determination.',
          frequency: 'Prior to each eligible remittance',
          portalUrl: 'https://www.incometax.gov.in',
        },
      ],
    },
    {
      id: 'gst',
      name: 'GST Returns & Statutory Registers',
      authority: AuthorityType.CBIC,
      icon: Receipt,
      color: 'text-emerald-600',
      forms: [
        {
          code: 'GSTR-1 / IFF',
          name: 'Details of Outward Supplies of Goods or Services',
          applicableTo: 'All regular registered taxpayers for reporting monthly/quarterly sales and e-invoices.',
          frequency: 'Monthly (11th) / QRMP (13th)',
          portalUrl: 'https://www.gst.gov.in',
        },
        {
          code: 'GSTR-3B',
          name: 'Monthly Self-Assessed Summary Return & Tax Payment',
          applicableTo: 'Mandatory monthly return for summarizing tax liability, eligible ITC, and cash ledger discharge.',
          frequency: 'Monthly (20th) / QRMP (22nd/24th)',
          portalUrl: 'https://www.gst.gov.in',
        },
        {
          code: 'GSTR-9 & GSTR-9C',
          name: 'GST Annual Return & Reconciliation Statement',
          applicableTo: 'Annual consolidation of outward supplies, inward ITC, and CA/CMA reconciliation for turnover > ₹2Cr/₹5Cr.',
          frequency: 'Annual (Due 31st December)',
          portalUrl: 'https://www.gst.gov.in',
        },
        {
          code: 'CMP-08',
          name: 'Special Statement for Composition Taxpayers (Section 10)',
          applicableTo: 'Composition dealers for quarterly tax payment at flat rate (1% / 5% / 6%).',
          frequency: 'Quarterly (18th of succeeding month)',
          portalUrl: 'https://www.gst.gov.in',
        },
      ],
    },
    {
      id: 'mca',
      name: 'Ministry of Corporate Affairs (ROC)',
      authority: AuthorityType.MCA,
      icon: Building2,
      color: 'text-blue-600',
      forms: [
        {
          code: 'SPICe+ (INC-32)',
          name: 'Integrated Company Incorporation Application (Part A & B)',
          applicableTo: 'Name reservation, incorporation, PAN, TAN, DIN, EPFO, ESIC, Professional Tax, and bank account opening.',
          frequency: 'Event-based (Incorporation)',
          portalUrl: 'https://www.mca.gov.in',
        },
        {
          code: 'DIR-3 KYC',
          name: 'Annual Director KYC Verification (Web & e-Form)',
          applicableTo: 'Every individual holding a Director Identification Number (DIN) as of 31st March.',
          frequency: 'Annual (Due 30th September)',
          portalUrl: 'https://www.mca.gov.in',
        },
        {
          code: 'AOC-4 & AOC-4 XBRL',
          name: 'Filing of Financial Statements & Board Report with ROC',
          applicableTo: 'All registered companies for annual balance sheet, P&L, auditor report, and CSR disclosure.',
          frequency: 'Annual (Within 30 days of AGM)',
          portalUrl: 'https://www.mca.gov.in',
        },
        {
          code: 'MGT-7 & MGT-7A',
          name: 'Annual Return of Company / Small Company',
          applicableTo: 'Detailed disclosure of shareholding pattern, promoter transfers, director meetings, and remuneration.',
          frequency: 'Annual (Within 60 days of AGM)',
          portalUrl: 'https://www.mca.gov.in',
        },
        {
          code: 'MSME-1',
          name: 'Half-Yearly Return for Outstanding Payments to Micro & Small Vendors',
          applicableTo: 'Companies whose payment to MSME suppliers exceeds 45 days under Section 43B(h) / MSMED Act.',
          frequency: 'Half-yearly (30th April & 31st Oct)',
          portalUrl: 'https://www.mca.gov.in',
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/knowledge-bank/forms" />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/knowledge-bank" className="hover:text-slate-800">Knowledge Bank</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-[#1B2A4A]">Official Forms Library</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B2A4A] via-[#152238] to-[#0F172A] py-14 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/90">
              <FileText className="h-3.5 w-3.5 text-amber-300" />
              <span>Prescribed Statutory Return Templates &amp; Guides</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
              Official Statutory Forms Library
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Access official Government filing forms, return formats, e-filing checklists, and direct portal triggers for Income Tax, GST, MCA ROC, and Labour Codes.
            </p>
          </div>
        </section>

        {/* Categories of Forms */}
        <section className="py-12 bg-slate-50 space-y-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            {formCategories.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.id} id={group.id} className="space-y-6 scroll-mt-20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1B2A4A]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-display text-[#1B2A4A]">
                          {group.name}
                        </h2>
                        <span className="text-xs text-slate-500 font-mono">
                          Prescribed by {group.authority}
                        </span>
                      </div>
                    </div>
                    <VerifiedSourceBadge authority={group.authority} isOfficial compact />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.forms.map((form, fIdx) => (
                      <div
                        key={fIdx}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#8B3FA8]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#8B3FA8] bg-purple-50 px-2.5 py-0.5 rounded">
                              {form.code}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {form.frequency}
                            </span>
                          </div>

                          <h3 className="font-bold text-[#1B2A4A] text-base leading-snug">
                            {form.name}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {form.applicableTo}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <a
                            href={form.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-[#8B3FA8] hover:text-[#7A2E97]"
                          >
                            Open e-Filing Portal <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Legal Disclaimer */}
        <LegalDisclaimerFooter />
      </main>

      <Footer />
    </div>
  );
}
