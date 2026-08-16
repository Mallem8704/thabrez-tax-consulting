import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@thabrez/ui';
import { Header, Footer } from '@thabrez/ui';
import { serviceCategories } from '@thabrez/config/company-content';
import {
  ShieldCheck,
  ArrowRight,
  Clock,
  Lock,
  MessageCircle,
  Sparkles,
  Calculator,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thabrez Tax Consulting — Premier Chartered Accountants in India',
  description:
    'Premier Chartered Accountancy and corporate advisory firm. Specialized in Income Tax litigation, GST advisory, company incorporation, and banking project reports.',
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
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/" />

      <main className="flex-1">
        {/* High-Converting Hero Section with Cinematic Depth */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#16233E] via-[#1B2A4A] to-[#121B30] pt-16 pb-20 text-white sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 border-b border-slate-800/60">
          {/* Atmospheric Cinematic Floating Lighting */}
          <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-[#8B3FA8]/20 blur-3xl pointer-events-none animate-atmosphere-1" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-[#E8823A]/15 blur-3xl pointer-events-none animate-atmosphere-2" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Hero Column */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left cinematic-fade-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  ICAI Certified Chartered Accountants &bull; Peer-Reviewed Firm
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display leading-[1.14] text-white">
                  Strategic Tax Optimization &amp; Corporate Advisory for High-Growth Enterprises
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-slate-200 max-w-2xl mx-auto lg:mx-0 font-normal">
                  From statutory audits and monthly GST/ITR filings to complex appellate tribunal representation — our Chartered Accountants deliver impenetrable compliance and maximum tax savings.
                </p>

                {/* Primary Dual CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button
                      size="xl"
                      className="w-full sm:w-auto bg-gradient-to-r from-[#8B3FA8] via-[#A83279] to-[#E8823A] text-white hover:opacity-95 font-bold shadow-xl px-8 h-12 rounded-xl text-sm shimmer-sweep"
                    >
                      Schedule Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 h-12 text-sm font-bold text-white shadow-lg hover:bg-[#20bd5a] transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" /> WhatsApp a CA Partner
                  </a>
                </div>

                {/* Hard Trust Pillars */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200 font-semibold">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 p-3 border border-white/15 backdrop-blur-sm shadow-sm cinematic-card">
                    <ShieldCheck className="h-4 w-4 text-[#E8823A] shrink-0" />
                    <span>100% ICAI Certified Partners</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 p-3 border border-white/15 backdrop-blur-sm shadow-sm cinematic-card">
                    <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Bank-Grade 256-Bit Encrypted Vault</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 p-3 border border-white/15 backdrop-blur-sm shadow-sm cinematic-card">
                    <Clock className="h-4 w-4 text-[#E8823A] shrink-0" />
                    <span>15-Min Response SLA Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Column: Interactive Tax Calculator Teaser Card */}
              <div className="lg:col-span-5 cinematic-fade-right">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 cinematic-card">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-300" /> Free Tax Estimator
                    </span>
                    <span className="text-[11px] font-mono text-slate-300">Budget 2024 / 2025 Slabs</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white font-display">
                      Old vs New Regime Savings Calculator
                    </h3>
                    <p className="text-xs text-slate-300">
                      Find out which regime saves you more taxes under Section 115BAC.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-black/40 p-4 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Average Salary Tax Savings:</span>
                      <span className="font-mono text-emerald-400 font-extrabold text-base">₹48,500</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">MSME Presumptive Tax Benefit:</span>
                      <span className="font-mono text-emerald-400 font-extrabold text-base">Up to 50% Flat</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Link href="/calculators/income-tax-calculator" className="block">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] text-white hover:opacity-95 font-bold text-xs shadow-md transition-all shimmer-sweep"
                      >
                        <Calculator className="h-4 w-4" />
                        <span>Launch Full Tax Calculator &rarr;</span>
                      </button>
                    </Link>

                    <Link href="/compliance-calendar" className="block">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all"
                      >
                        <Calendar className="h-3.5 w-3.5 text-[#E8823A]" />
                        <span>View 2025-26 Compliance Calendar</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid with Cinematic Fade */}
        <section className="border-b border-slate-200 bg-white py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {stats.map((stat, i) => (
                <div key={i} className={`space-y-1 py-2 cinematic-fade-up delay-${(i + 1) * 75}`}>
                  <p className="font-mono text-3xl font-extrabold text-[#1B2A4A] sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Vertical Solutions with Staggered Cascades */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3 cinematic-fade-up">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Tailored Industry Expertise
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                Specialized Solutions for Every Growth Stage
              </h2>
              <p className="text-sm text-slate-600">
                Industry-specific tax structuring and regulatory defense designed by experienced partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryVerticals.map((vert, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 cinematic-card cinematic-fade-up delay-${(idx + 1) * 75}`}
                >
                  <span className="inline-block rounded-md bg-[#8B3FA8]/10 text-[#8B3FA8] text-[11px] font-bold px-2.5 py-1">
                    {vert.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{vert.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{vert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Areas / Services Showcase */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4 cinematic-fade-up">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E8823A]">
                  Core Practice Areas
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display mt-1">
                  Full-Service CA Advisory &amp; Filing
                </h2>
              </div>
              <Link
                href="/services"
                className="text-xs font-bold text-[#1B2A4A] hover:text-[#8B3FA8] flex items-center gap-1 transition-colors"
              >
                View All Practice Areas &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceCategories.slice(0, 3).map((cat, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:border-[#8B3FA8]/40 transition-all space-y-4 flex flex-col justify-between cinematic-card cinematic-fade-up delay-${(idx + 1) * 150}`}
                >
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {cat.category}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                    <ul className="space-y-2 pt-2">
                      {cat.services.slice(0, 4).map((s, sIdx) => (
                        <li key={sIdx} className="text-xs text-slate-700 flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{s.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/services#${cat.slug}`}
                    className="inline-flex items-center text-xs font-bold text-[#1B2A4A] hover:text-[#8B3FA8] pt-3 border-t border-slate-200 transition-colors"
                  >
                    Explore {cat.category} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-Step Simple Process */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3 cinematic-fade-up">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Streamlined Execution
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                How We Deliver 100% On-Time Compliance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-4 cinematic-card cinematic-fade-up delay-${(i + 1) * 150}`}
                >
                  <span className="font-mono text-3xl font-extrabold text-[#8B3FA8]/30 block">
                    {st.step}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonials with Smooth Reveal */}
        <section className="py-20 bg-white border-b border-slate-100">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3 cinematic-fade-up">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8823A]">
                Proven Client Trust
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                Trusted by 1,000+ Indian Businesses &amp; Founders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm space-y-4 flex flex-col justify-between cinematic-card cinematic-fade-in delay-${(idx + 1) * 150}`}
                >
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="border-t border-slate-200 pt-3 space-y-0.5">
                    <span className="font-bold text-slate-900 text-xs block">{t.author}</span>
                    <span className="text-[11px] text-slate-500 block">{t.title}</span>
                    <span className="inline-block text-[10px] font-bold text-[#8B3FA8] uppercase font-mono mt-1">
                      {t.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* High-Impact Bottom CTA Strip */}
        <section className="bg-[#1B2A4A] py-16 text-white text-center cinematic-fade-up">
          <div className="container mx-auto max-w-4xl px-4 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold font-display">
              Ready to Minimize Taxes and Protect Your Enterprise?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Book a direct strategic review with our senior partners or upload your tax notices for immediate appraisal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-[#E8823A] hover:bg-[#E8823A]/90 text-white font-bold px-8 shadow-lg shimmer-sweep">
                  Book Free Strategic Review <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-400 bg-white/10 hover:bg-white/20 text-white font-bold px-6">
                  <Lock className="h-4 w-4 mr-2 text-emerald-400" /> Open Secure Client Vault
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
