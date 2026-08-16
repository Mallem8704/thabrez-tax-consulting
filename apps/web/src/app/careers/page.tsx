import type { Metadata } from 'next';
import { Header, Footer, Button } from '@thabrez/ui';
import { jobOpenings, companyInfo } from '@thabrez/config/company-content';
import {
  GraduationCap,
  Briefcase,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Mail,
  ShieldCheck,
  TrendingUp,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers & ICAI Articleship | Thabrez Tax Consulting',
  description:
    'Join our team of Chartered Accountants, Tax Associates, and Trainees. Comprehensive ICAI articleship training and high-growth taxation careers in Bengaluru and Kadiri.',
  openGraph: {
    title: 'Careers & Articleship | Thabrez Tax Consulting',
    description:
      'Explore professional careers and ICAI articleship opportunities in Direct Tax, Indirect Tax, and Audit.',
    type: 'website',
  },
};

export default function CareersPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/careers" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-block rounded-md bg-[#E8823A]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
              Join Our Firm
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Build Your Career in Tax, Audit &amp; Advisory
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
              We cultivate excellence. From rigorous ICAI articleship exposure to senior corporate tax litigation, grow your career alongside seasoned Chartered Accountants.
            </p>
          </div>
        </section>

        {/* Culture & Articleship Values */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Why Practice at Thabrez Tax Consulting?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                A learning environment that emphasizes hands-on litigation advocacy, corporate governance, and digital execution.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B3FA8]/10 text-[#8B3FA8]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Diverse Exposure</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct tax assessments, GST departmental audit, bank audits, and MCA incorporation workflows.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C43D6B]/10 text-[#C43D6B]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Direct Partner Mentorship</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Work directly with Fellow Chartered Accountants on complex client files and appellate hearings.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Modern Tech Stack</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated compliance workflows, cloud bookkeeping tools, and proprietary legal tax databases.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8823A]/10 text-[#E8823A]">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Study Leave &amp; Growth</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Structured exam leave policies for CA Final aspirants and performance-driven advancement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Open Positions */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                  Open Opportunities
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Current Vacancies
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                To apply, email your CV and ICAI registration details directly to{' '}
                <a href={`mailto:${companyInfo.email}`} className="font-semibold text-slate-900 underline">
                  {companyInfo.email}
                </a>
              </p>
            </div>

            <div className="space-y-8">
              {jobOpenings.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-5">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-[#8B3FA8]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#8B3FA8]">
                          {job.department}
                        </span>
                        <span className="rounded bg-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#E8823A]" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-[#E8823A]" /> Experience: {job.experience}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`mailto:${companyInfo.email}?subject=Application for ${encodeURIComponent(job.title)}`}
                    >
                      <Button className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 shrink-0">
                        Apply for Role <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {job.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Required Qualifications &amp; Skills
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {job.requirements.map((req, qIdx) => (
                          <li key={qIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#8B3FA8] shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Application Contact Box */}
        <section className="py-16 bg-[#1B2A4A] text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Don't See the Exact Role You're Looking For?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              We are constantly seeking brilliant tax minds and litigation advocates. Send your resume for future consideration.
            </p>
            <div className="pt-2">
              <a href={`mailto:${companyInfo.email}?subject=General%20Career%20Application`}>
                <Button size="xl" className="bg-[#E8823A] text-white hover:bg-[#E8823A]/90 font-semibold shadow-lg">
                  <Mail className="mr-2 h-4 w-4" /> Send Resume to {companyInfo.email}
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
