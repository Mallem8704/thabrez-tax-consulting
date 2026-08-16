import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer, Button } from '@thabrez/ui';
import { detailedServices, serviceCategories } from '@thabrez/config/company-content';
import {
  CheckCircle2,
  Clock,
  FileCheck,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Collect all slugs from serviceCategories and detailedServices
  const slugs = new Set<string>();

  serviceCategories.forEach((cat) => {
    cat.services.forEach((s) => slugs.add(s.slug));
  });

  Object.keys(detailedServices).forEach((slug) => slugs.add(slug));

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = detailedServices[slug] || findServiceInCategories(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Thabrez Tax Consulting',
    };
  }

  const title = `${service.title} | Thabrez Tax Consulting`;
  const description = service.shortDesc || `Expert ${service.title} services by certified Chartered Accountants.`;

  return {
    title,
    description,
    keywords: [
      service.title,
      'Chartered Accountant',
      service.category,
      'CA Services India',
      'Tax Advisory',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.thabreztaxconsulting.com/services/${slug}`,
    },
  };
}

function findServiceInCategories(slug: string) {
  for (const cat of serviceCategories) {
    const match = cat.services.find((s) => s.slug === slug);
    if (match) {
      return {
        slug: match.slug,
        title: match.name,
        category: cat.category,
        shortDesc: `Statutory execution and advisory for ${match.name}.`,
        heroDesc: `Fast-track compliance, expert drafting, and dedicated CA support for ${match.name}.`,
        deliverables: [
          'Comprehensive documentation drafting',
          'Statutory government portal filing and fee management',
          'Verified Government Certificate & Acknowledgment',
          'Post-registration compliance roadmap',
        ],
        processSteps: [
          { step: 1, title: 'Document Collection', desc: 'Secure upload of required KYC and business proofs.' },
          { step: 2, title: 'CA Verification & Drafting', desc: 'Professional drafting by qualified Chartered Accountants.' },
          { step: 3, title: 'Portal Filing', desc: 'Submission on MCA / GST / Income Tax government portals.' },
          { step: 4, title: 'Acknowledgment Delivery', desc: 'Issuance of official government certificates and challans.' },
        ],
        requiredDocuments: [
          'Identity Proof (PAN Card / Aadhaar Card)',
          'Registered Office Address Proof (Utility Bill / Rent Agreement)',
          'Bank Details (Canceled Cheque / Statement)',
        ],
        faq: [
          { q: `How long does ${match.name} take?`, a: 'Standard processing typically takes between 3 to 7 business days depending on departmental clearance.' },
          { q: 'Can the entire process be done online?', a: 'Yes, 100% of the workflow is executed digitally without physical visits.' },
        ],
        estimatedDays: '3 to 7 Business Days',
      };
    }
  }
  return null;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = detailedServices[slug] || findServiceInCategories(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/services" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-[#E8823A]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
                    {service.category}
                  </span>
                  {service.estimatedDays && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs text-slate-300 font-mono">
                      <Clock className="h-3 w-3 text-[#E8823A]" />
                      {service.estimatedDays}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display">
                  {service.title}
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-slate-300">
                  {service.heroDesc}
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link href="/contact">
                    <Button
                      size="xl"
                      className="bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-semibold shadow-lg"
                    >
                      Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="tel:8802222422">
                    <Button
                      size="xl"
                      variant="outline"
                      className="border-slate-500 text-white hover:bg-white/10"
                    >
                      <PhoneCall className="mr-2 h-4 w-4 text-[#E8823A]" /> Call CA Partner
                    </Button>
                  </a>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="lg:col-span-4 rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur text-slate-200 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" /> Guaranteed Compliance
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                    <span>Dedicated Chartered Accountant Assigned</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                    <span>100% Digital Document Upload &amp; Tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                    <span>Transparent Statutory Government Fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                    <span>Lifetime Client Portal Vault for Documents</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables & Process Sections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            {/* 1. Deliverables Grid */}
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                  What You Receive
                </span>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Service Deliverables &amp; Outcomes
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {service.deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 flex items-start gap-3 shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-800">{deliv}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Process Workflow */}
            <div className="space-y-8 border-t border-slate-200 pt-14">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                  Step-by-Step
                </span>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  How We Execute Your Filing
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {service.processSteps.map((st, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
                  >
                    <span className="font-mono text-2xl font-extrabold text-[#8B3FA8]/30">
                      0{st.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Required Documents & FAQs */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 border-t border-slate-200 pt-14">
              {/* Documents Checklist */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-[#C43D6B]" /> Required Documents
                  </h3>
                  <p className="text-xs text-slate-600">
                    Prepare digital copies (PDF / JPEG) of the following proofs:
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {service.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C43D6B]/10 text-[#C43D6B] text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-slate-200">
                    <Link href="/contact" className="block">
                      <Button className="w-full bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 text-xs">
                        Upload Documents for Verification
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B3FA8]">
                    Questions &amp; Answers
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-4">
                  {service.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2"
                    >
                      <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 text-[#8B3FA8] shrink-0 mt-0.5" />
                        <span>{item.q}</span>
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-600 pl-6">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Consultation Banner */}
        <section className="py-16 bg-[#1B2A4A] text-white border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Get Started with {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Submit your inquiry and our team of Chartered Accountants will initiate your filing within 2 hours.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button size="xl" className="bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-semibold px-8 shadow-xl">
                  Initiate Filing Now <ArrowRight className="ml-2 h-4 w-4" />
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
