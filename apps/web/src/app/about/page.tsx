import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, Button } from '@thabrez/ui';
import { companyInfo, teamMembers, serviceCategories } from '@thabrez/config/company-content';
import {
  ShieldCheck,
  Scale,
  Award,
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  GraduationCap,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `About Us | ${companyInfo.legalName}`,
  description:
    'Learn about our leadership team of Fellow Chartered Accountants, corporate secretarial experts, and litigation specialists.',
  openGraph: {
    title: `About Our Firm | ${companyInfo.legalName}`,
    description: companyInfo.aboutShort,
    type: 'website',
  },
};

export default function AboutPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/about" />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <span className="inline-block rounded-md bg-[#E8823A]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
                About Our Firm
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
                {companyInfo.legalName}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-slate-300">
                {companyInfo.aboutShort}
              </p>
            </div>
          </div>
        </section>

        {/* Firm Overview & Capabilities */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Strategic Tax Advisory, Audit &amp; Legal Advocacy
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {companyInfo.aboutExtended}
                </p>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  Established with a commitment to integrity, precision, and proactive advisory, our firm assists startups, established enterprises, and high-net-worth individuals across South India with institutional-grade statutory governance.
                </p>

                {/* Core Strengths Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#8B3FA8]/10 text-[#8B3FA8]">
                      <Scale className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Appellate Representation</h3>
                    <p className="text-xs text-slate-600">
                      Handling high-stakes appeals before Appellate Authorities, ITAT, and High Court.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#C43D6B]/10 text-[#C43D6B]">
                      <Award className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Project Reports &amp; Capital</h3>
                    <p className="text-xs text-slate-600">
                      Bankable project reports, CMA modeling, and credit syndication with nationalized banks.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">GST &amp; Direct Tax Scrutiny</h3>
                    <p className="text-xs text-slate-600">
                      Comprehensive show-cause defense, 2A/2B reconciliations, and penalty prevention.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#E8823A]/10 text-[#E8823A]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Corporate Incorporation</h3>
                    <p className="text-xs text-slate-600">
                      Fast-track SPICe+ MCA incorporation with post-incorporation statutory registrations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Office & Contact Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#8B3FA8]" /> Practice Locations
                  </h3>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B3FA8] flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Registered Office
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {companyInfo.registeredOffice.line1}
                    </p>
                    <p className="text-xs text-slate-600">
                      {companyInfo.registeredOffice.city} — {companyInfo.registeredOffice.pincode}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C43D6B] flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Bengaluru Branch
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {companyInfo.branchOffice.line1}
                    </p>
                    <p className="text-xs text-slate-600">
                      {companyInfo.branchOffice.city} — {companyInfo.branchOffice.pincode}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#E8823A]" />
                      <span className="font-mono">{companyInfo.phone.join(' / ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#E8823A]" />
                      <a href={`mailto:${companyInfo.email}`} className="hover:underline">
                        {companyInfo.email}
                      </a>
                    </div>
                  </div>

                  <Link href="/contact" className="block">
                    <Button className="w-full bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90">
                      Book a Free Consultation <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Team Section (Rendered from config array) */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                Professional Leadership
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                Meet Our Partners &amp; Practice Leads
              </h2>
              <p className="text-sm text-slate-600">
                Qualified Chartered Accountants, Company Secretaries, and financial strategists dedicated to your enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    {/* Header profile info */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#8B3FA8] mt-0.5">
                          {member.title}
                        </p>
                      </div>

                      {member.registrationNumber && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-700">
                          <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                          {member.registrationNumber}
                        </span>
                      )}
                    </div>

                    {/* Qualifications */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <GraduationCap className="h-4 w-4 text-[#E8823A] shrink-0" />
                      <span>{member.qualifications}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                      {member.bio}
                    </p>

                    {/* Specializations pills */}
                    <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Core Competencies
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.specialization.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Pillars Grid */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Our Core Practice Pillars</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Built to support your journey from startup formation to institutional scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {serviceCategories.map((catGroup, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                    {catGroup.category}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {catGroup.services.map((srv, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{srv.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
