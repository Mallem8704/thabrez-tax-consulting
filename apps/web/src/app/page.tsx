import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Header, Footer, WhatsAppIcon } from '@thabrez/ui';
import { serviceCategories } from '@thabrez/config/company-content';
import {
  ShieldCheck,
  ArrowRight,
  Clock,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import { MasterHeroCommandCenter } from '../components/home/master-hero-command-center';

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
    'Hi Thabrez & Co. Chartered Accountants, I would like to schedule an urgent consultation regarding tax optimization / GST notice / corporate filing.',
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/" />

      <main className="flex-1">
        {/* Master Institutional Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#16233E] to-[#1B2A4A] pt-12 pb-20 text-white sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 border-b border-slate-800/60">
          {/* Multi-layered Atmospheric Spotlights */}
          <div className="absolute top-[-10%] left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#8B3FA8]/25 blur-[120px] pointer-events-none animate-atmosphere-1" />
          <div className="absolute bottom-[-10%] right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#E8823A]/20 blur-[140px] pointer-events-none animate-atmosphere-2" />

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Magnetic High-Prestige Copy & Value Props */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left cinematic-fade-left">
                {/* Punchy Master Headline */}
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display leading-[1.12] text-white">
                  Precision Tax Law.<br />
                  <span className="bg-gradient-to-r from-emerald-300 via-amber-200 to-[#E8823A] bg-clip-text text-transparent">
                    Zero-Penalty Peace of Mind.
                  </span>
                </h1>

                {/* Subtitle statement */}
                <p className="text-sm sm:text-base leading-relaxed text-slate-200 max-w-xl mx-auto lg:mx-0 font-normal">
                  We protect high-growth enterprises, founders, and global NRIs with aggressive legal tax optimization, airtight compliance, and relentless statutory dispute defense.
                </p>

                {/* Interactive Practice Quick-Pills */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
                  {[
                    'Corporate Audits & ITR',
                    'GST Notice Defense',
                    'Pvt Ltd & LLP Setup',
                    'Section 115BAC Savings',
                    '15CA/CB NRI Advisory',
                  ].map((pill, pIdx) => (
                    <span
                      key={pIdx}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 rounded-full text-slate-200 transition-colors"
                    >
                      <Sparkles className="h-2.5 w-2.5 text-[#E8823A]" />
                      <span>{pill}</span>
                    </span>
                  ))}
                </div>

                {/* High-Converting Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button
                      size="xl"
                      className="w-full sm:w-auto bg-gradient-to-r from-[#8B3FA8] via-[#A83279] to-[#E8823A] text-white hover:opacity-95 font-bold shadow-2xl px-8 h-12 rounded-xl text-xs sm:text-sm shimmer-sweep"
                    >
                      <span>Book Free Partner Consultation</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 h-12 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-[#20bd5a] transition-all hover:scale-[1.02]"
                  >
                    <WhatsAppIcon size={18} className="fill-white" />
                    <span>WhatsApp a CA</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-normal">
                      &lt;5m SLA
                    </span>
                  </a>
                </div>

                {/* Institutional Proof Badges */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] text-slate-200 font-semibold">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5 border border-white/10 backdrop-blur-sm cinematic-card">
                    <ShieldCheck className="h-4 w-4 text-[#E8823A] shrink-0" />
                    <span>₹24.8 Cr+ Tax Saved</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5 border border-white/10 backdrop-blur-sm cinematic-card">
                    <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>15-Min Response SLA</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5 border border-white/10 backdrop-blur-sm cinematic-card">
                    <CheckCircle2 className="h-4 w-4 text-[#E8823A] shrink-0" />
                    <span>100% ICAI Certified</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5 border border-white/10 backdrop-blur-sm cinematic-card">
                    <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>256-Bit Vault Security</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Command Center */}
              <div className="lg:col-span-6 cinematic-fade-right">
                <MasterHeroCommandCenter />
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
