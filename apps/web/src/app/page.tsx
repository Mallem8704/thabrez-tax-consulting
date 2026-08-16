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
  MessageCircle,
  Sparkles,
  Calculator,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thabrez Tax Consulting — Premier Chartered Accountants in India',
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
      title: 'Consult & Upload Documents',
      desc: 'Connect with a certified CA to evaluate your tax liability or statutory notice. Upload documents directly into your bank-grade encrypted client vault.',
    },
    {
      step: '02',
      title: 'Senior CA Audit & Tax Optimization',
      desc: 'Our partners review statutory calculations, reconcile GSTN/AIS/TIS data, and structure legal deductions to minimize your liability.',
    },
    {
      step: '03',
      title: 'Filing & Instant Government Ack',
      desc: 'We file directly with MCA, GSTN, or Income Tax portals and deliver verified government acknowledgments and challans.',
    },
  ];

  const industryVerticals = [
    {
      title: 'Tech Startups & SaaS',
      badge: 'Section 80-IAC & Angel Tax',
      desc: 'DPIIT tax holiday exemptions, ESOP valuation, cross-border remittance, and transfer pricing.',
    },
    {
      title: 'Manufacturing & MSMEs',
      badge: 'Section 43B(h) & GST ITC',
      desc: 'MSME 45-day payment compliance, inverted duty structure refunds, and CMA banking reports.',
    },
    {
      title: 'Doctors, Lawyers & Consultants',
      badge: 'Section 44ADA 50% Scheme',
      desc: 'Presumptive taxation, advance tax scheduling, and asset protection planning.',
    },
    {
      title: 'NRIs & Global Expats',
      badge: 'Form 15CA/CB & DTAA',
      desc: 'Repatriation certification, capital gains on Indian real estate, and foreign tax credits.',
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

  const whatsappUrl = `https://wa.me/918802222422?text=${encodeURIComponent(
    'Hi Thabrez & Co. Chartered Accountants, I would like to schedule a consultation regarding tax optimization / GST / corporate filing.',
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/" />

      <main className="flex-1">
        {/* High-Converting Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24 lg:py-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Hero Column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  ICAI Certified Chartered Accountants • Peer-Reviewed Firm
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-display leading-[1.12]">
                  Strategic Tax Optimization &amp; Corporate Advisory for High-Growth Enterprises
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto lg:mx-0">
                  From statutory audits and monthly GST/ITR filings to complex appellate tribunal representation — our Chartered Accountants deliver impenetrable compliance and maximum tax savings.
                </p>

                {/* Primary Dual CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button
                      size="xl"
                      className="w-full sm:w-auto bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-bold shadow-xl px-8"
                    >
                      Schedule Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#20bd5a] transition-all hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" /> WhatsApp a CA Partner
                  </a>
                </div>

                {/* Hard Trust Pillars */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2.5 border border-white/10">
                    <ShieldCheck className="h-4 w-4 text-[#E8823A] shrink-0" />
                    <span>100% ICAI Certified Partners</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2.5 border border-white/10">
                    <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Bank-Grade 256-Bit Encrypted Vault</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2.5 border border-white/10">
                    <Clock className="h-4 w-4 text-[#C43D6B] shrink-0" />
                    <span>15-Min Response SLA Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Column: Interactive Tax Calculator Teaser Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-300" /> Free Tax Estimator
                    </span>
                    <span className="text-[11px] text-slate-300">Budget 2024 / 2025 Slabs</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white font-display">
                      Old vs New Regime Savings Calculator
                    </h3>
                    <p className="text-xs text-slate-300">
                      Find out which regime saves you more taxes under Section 115BAC.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-4 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">Average Salary Tax Savings:</span>
                      <span className="font-mono text-emerald-400 font-extrabold text-sm">₹48,500</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">MSME Presumptive Tax Benefit:</span>
                      <span className="font-mono text-emerald-400 font-extrabold text-sm">Up to 50% Flat</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link href="/calculators/income-tax-calculator" className="block">
                      <Button className="w-full bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white hover:opacity-95 font-bold text-xs py-3 shadow-md">
                        <Calculator className="h-4 w-4 mr-2" /> Launch Full Tax Calculator &rarr;
                      </Button>
                    </Link>
                    <Link href="/compliance-calendar" className="block">
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 text-xs">
                        View August 2026 Compliance Calendar
                      </Button>
                    </Link>
                  </div>
                </div>
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

        {/* Industry Vertical Solutions */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Tailored Industry Expertise
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                Specialized Advisory for Every Growth Stage
              </h2>
              <p className="text-sm text-slate-600">
                Whether you are a startup founder raising venture capital, an MSME managing working capital, or an NRI repatriating funds.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {industryVerticals.map((ind, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-3 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="inline-block rounded bg-[#8B3FA8]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#8B3FA8]">
                      {ind.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{ind.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{ind.desc}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="text-xs font-bold text-[#1B2A4A] hover:text-[#8B3FA8] flex items-center gap-1 pt-2"
                  >
                    Consult on this Sector &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Areas / Services Grid */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Core Practice Areas
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                Comprehensive Corporate, Tax &amp; Audit Solutions
              </h2>
              <p className="text-sm text-slate-600">
                End-to-end statutory services designed for founders, MSMEs, partnership firms, and growing private limited companies.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {serviceCategories.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1B2A4A]">
                      {idx === 0 && <Building className="h-5 w-5" />}
                      {idx === 1 && <FileText className="h-5 w-5" />}
                      {idx === 2 && <TrendingUp className="h-5 w-5" />}
                      {idx === 3 && <Award className="h-5 w-5" />}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">
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
        <section className="py-20 bg-slate-900 text-white">
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
                  <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                    <Scale className="h-5 w-5 text-[#8B3FA8] mb-2" />
                    <p className="font-bold text-white">ITAT &amp; High Court</p>
                    <p className="text-slate-400 mt-1">Direct tax appeal preparation and senior tribunal hearings.</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                    <FileCheck2 className="h-5 w-5 text-[#C43D6B] mb-2" />
                    <p className="font-bold text-white">GST Appellate Authority</p>
                    <p className="text-slate-400 mt-1">Show-cause notices, demand order appeals, and refund appeals.</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
                    <Users2 className="h-5 w-5 text-[#E8823A] mb-2" />
                    <p className="font-bold text-white">Senior Advisory Council</p>
                    <p className="text-slate-400 mt-1">Advocate consultation for high-stakes commercial disputes.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-3xl bg-white/5 p-8 border border-white/10 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">Received a Tax or GST Notice?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Section 148, 143(2), or GST DRC-01 notices have strict 30-day statutory response windows. Do not delay.
                </p>
                <Link href="/contact" className="block">
                  <Button className="w-full bg-[#E8823A] text-white hover:bg-[#E8823A]/90 font-bold text-xs py-3">
                    Submit Notice for Urgent CA Review
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Client Workflow */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Streamlined Execution
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                How We Work With You
              </h2>
              <p className="text-sm text-slate-600">
                Transparent, deadline-driven process with real-time tracking from onboarding to acknowledgment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((st, i) => (
                <div key={i} className="relative rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm space-y-4">
                  <span className="font-mono text-3xl font-extrabold text-[#8B3FA8]/30">
                    {st.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-display">{st.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Client Endorsements
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                Trusted by Founders, CFOs &amp; Enterprises
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm flex flex-col justify-between space-y-4">
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

        {/* Bottom High-Impact Conversion CTA Box */}
        <section className="py-20 bg-[#1B2A4A] text-white relative overflow-hidden">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6 relative z-10">
            <span className="inline-block rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
              Immediate CA Consultation Available
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Ready to Lower Your Tax Burden &amp; Stay 100% Compliant?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Schedule a one-on-one session with our Chartered Accountants. We assess your financial position and provide tailored tax solutions.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="xl" className="w-full sm:w-auto bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-bold px-8 shadow-xl">
                  Schedule Free CA Consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#20bd5a] transition-all"
              >
                <MessageCircle className="h-5 w-5 fill-white" /> Chat Directly on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
