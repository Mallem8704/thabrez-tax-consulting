import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@thabrez/ui';
import { Header, Footer } from '@thabrez/ui';
import { companyInfo, serviceCategories } from '@thabrez/config/company-content';
import {
  ShieldCheck,
  Scale,
  Award,
  ArrowRight,
  FileText,
  Clock,
  Lock,
  Building,
  TrendingUp,
  FileCheck2,
  Users2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thabrez Tax Consulting — Expert Chartered Accountants in India',
  description:
    'Premier Chartered Accountancy and tax consulting firm. Specialized in Income Tax litigation, GST advisory, company incorporation, and banking project reports.',
  keywords: [
    'Chartered Accountant India',
    'GST Registration Kadiri',
    'Tax Consultant Bengaluru',
    'Private Limited Company Registration',
    'ITR Filing Services',
    'Income Tax Appellate Tribunal Representation',
    'Bank Project Report CA',
  ],
  openGraph: {
    title: 'Thabrez Tax Consulting — Expert CA Services in India',
    description:
      'Professional GST, ITR, corporate incorporation, and appellate litigation services by certified Chartered Accountants.',
    type: 'website',
    url: 'https://www.thabreztaxconsulting.com',
  },
};

export default function HomePage(): JSX.Element {
  const stats = [
    { value: '15+', label: 'Years Combined Practice' },
    { value: '1,000+', label: 'Corporate & ITR Filings' },
    { value: '100%', label: 'Paperless Digital Execution' },
    { value: '99.8%', label: 'On-Time Compliance Record' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Consult & Share Documents',
      desc: 'Connect with a certified CA to assess your tax or incorporation needs. Upload documents through our encrypted client portal.',
    },
    {
      step: '02',
      title: 'CA Review & Drafting',
      desc: 'Our partners review statutory calculations, reconcile GST/AIS, and draft legal filings in full compliance with current laws.',
    },
    {
      step: '03',
      title: 'Filing & Statutory Ack',
      desc: 'We file directly with MCA, GSTN, or Income Tax portals and deliver verified government acknowledgments and challans.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Thabrez Tax Consulting handled our Private Limited incorporation and initial GST setup within 6 days. Outstanding clarity and zero hassles.',
      author: 'Rajesh Varma',
      title: 'Founder & CEO, Apex Logistics Tech',
      tag: 'Startup Incorporation',
    },
    {
      quote:
        'When we received an unexpected GST scrutiny notice for FY 2023-24, their CA team drafted a rock-solid reply that resolved the matter without penalty.',
      author: 'Kavitha Sundaram',
      title: 'Director of Finance, SunBio Health',
      tag: 'GST Dispute Defense',
    },
    {
      quote:
        'Their project reports and CMA data enabled us to secure ₹2.5 Crore working capital loan from SBI seamlessly. True financial professionals.',
      author: 'Mohammed Imran',
      title: 'Managing Partner, Deccan Polymers',
      tag: 'Banking & Debt Syndication',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#1B2A4A] py-20 text-white sm:py-28 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-200 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Chartered Accountants &amp; Legal Tax Advisory
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display leading-[1.15]">
                Strategic Tax, Compliance &amp; Legal Advisory for High-Growth Enterprises
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto">
                From company incorporation and monthly GST/ITR filings to complex tribunal appeals and bankable project reports — our team of Chartered Accountants delivers dependable financial governance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-semibold shadow-lg"
                  >
                    Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services" className="w-full sm:w-auto">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto border-slate-500 text-white hover:bg-white/10"
                  >
                    Explore Practice Areas
                  </Button>
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#E8823A]" /> 100% ICAI Certified Partners
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-[#E8823A]" /> Bank-Grade 256-bit Portal Security
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#E8823A]" /> 24-Hour Notice Turnaround
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="border-b border-slate-200 bg-slate-50 py-10">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-mono text-3xl font-extrabold text-[#1B2A4A] sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Areas / Services Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Practice Areas
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Comprehensive Corporate, Tax &amp; Advisory Solutions
              </h2>
              <p className="text-sm text-slate-600">
                End-to-end statutory services designed for founders, MSMEs, partnership firms, and growing private limited companies.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {serviceCategories.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[#1B2A4A]">
                      {idx === 0 && <Building className="h-5 w-5" />}
                      {idx === 1 && <FileText className="h-5 w-5" />}
                      {idx === 2 && <TrendingUp className="h-5 w-5" />}
                      {idx === 3 && <Award className="h-5 w-5" />}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {group.category}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                      {group.services.map((srv, sIdx) => (
                        <li key={sIdx}>
                          <Link
                            href={`/services/${srv.slug}`}
                            className="flex items-center justify-between text-slate-600 hover:text-[#1B2A4A] hover:font-medium py-1 transition-colors"
                          >
                            <span>{srv.name}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/services"
                      className="text-xs font-bold text-[#8B3FA8] hover:underline flex items-center gap-1"
                    >
                      View All in {group.category} &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Appellate Tribunal & High Court Capability Highlight */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block rounded-md bg-[#E8823A]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
                  Specialized Legal Practice
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl font-display">
                  Litigation Defense &amp; Appeals Before Appellate Authorities
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                  {companyInfo.aboutExtended}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-300">
                  <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700">
                    <Scale className="h-5 w-5 text-[#8B3FA8] mb-2" />
                    <p className="font-bold text-white">ITAT &amp; High Court</p>
                    <p className="text-slate-400 mt-1">Direct tax appeal preparation and senior tribunal hearings.</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700">
                    <FileCheck2 className="h-5 w-5 text-[#C43D6B] mb-2" />
                    <p className="font-bold text-white">GST Appellate Authority</p>
                    <p className="text-slate-400 mt-1">Show-cause notices, demand order appeals, and refund appeals.</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700">
                    <Users2 className="h-5 w-5 text-[#E8823A] mb-2" />
                    <p className="font-bold text-white">Advisory Council</p>
                    <p className="text-slate-400 mt-1">Senior advocate consultation for high-stakes commercial disputes.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-2xl bg-white/5 p-6 border border-white/10 text-center space-y-4">
                <h3 className="text-lg font-bold text-white">Have a Department Notice?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Time is critical. Department notices under Section 148, 143(2), or GST DRC-01 have strict 30-day statutory response windows.
                </p>
                <Link href="/contact" className="block">
                  <Button className="w-full bg-[#E8823A] text-white hover:bg-[#E8823A]/90 font-semibold">
                    Submit Notice for Urgent Review
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Client Workflow */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Streamlined Execution
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How We Work With You
              </h2>
              <p className="text-sm text-slate-600">
                Transparent, deadline-driven process with real-time tracking from onboarding to acknowledgment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((st, i) => (
                <div key={i} className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                  <span className="font-mono text-3xl font-extrabold text-[#8B3FA8]/30">
                    {st.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{st.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Proven Client Satisfaction
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Trusted by Founders, CFOs &amp; Enterprises
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="inline-block rounded bg-[#8B3FA8]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#8B3FA8]">
                      {t.tag}
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-500">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Box */}
        <section className="py-16 bg-[#1B2A4A] text-white">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">
              Ready to Simplify Your Tax &amp; Corporate Compliances?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Schedule a one-on-one consultation with our Chartered Accountants today.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/contact">
                <Button size="xl" className="bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-semibold px-8 shadow-xl">
                  Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
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
