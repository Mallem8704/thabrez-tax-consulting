import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import {
  knowledgeResourcesLibrary,
} from '@thabrez/config';
import {
  ArrowLeft,
  Scale,
  BookOpen,
  FileCheck,
  Bell,
  FileText,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface ResourcePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return knowledgeResourcesLibrary.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = knowledgeResourcesLibrary.find((r) => r.slug === slug);

  if (!resource) {
    return {
      title: 'Resource Not Found | Thabrez Tax Consulting',
    };
  }

  return {
    title: `${resource.title} | Thabrez Tax Consulting Library`,
    description: resource.summary,
    keywords: [
      resource.category,
      resource.typeLabel,
      resource.statutoryReference,
      'Indian Tax Laws',
    ],
    openGraph: {
      title: resource.title,
      description: resource.summary,
      type: 'article',
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: ResourcePageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const resource = knowledgeResourcesLibrary.find((r) => r.slug === slug);

  if (!resource) {
    notFound();
  }

  const relatedResources = knowledgeResourcesLibrary
    .filter((r) => r.slug !== resource.slug && (r.category === resource.category || r.type === resource.type))
    .slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ACT':
        return Scale;
      case 'RULE':
        return BookOpen;
      case 'FORM':
        return FileCheck;
      case 'BULLETIN':
        return Bell;
      default:
        return FileText;
    }
  };

  const IconComponent = getTypeIcon(resource.type);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/resources" />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-12 text-white sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Knowledge Bank
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-[#E8823A]/20 px-2.5 py-0.5 text-xs font-bold text-[#E8823A]">
                <IconComponent className="h-3.5 w-3.5" /> {resource.typeLabel}
              </span>
              <span className="rounded bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-200">
                {resource.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ref: {resource.statutoryReference}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl font-display">
              {resource.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {resource.summary}
            </p>
          </div>
        </section>

        {/* Content & Metadata Layout */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Main Statute Reader */}
              <div className="lg:col-span-8 space-y-8">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-a:text-[#8B3FA8] prose-strong:text-slate-900">
                  <div
                    className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line"
                  >
                    {resource.bodyMarkdown.trim()}
                  </div>
                </article>

                {/* Related Resources */}
                {relatedResources.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Related Statutory References &amp; Guides
                    </h3>
                    <div className="divide-y divide-slate-100">
                      {relatedResources.map((rel) => (
                        <Link
                          key={rel.slug}
                          href={`/resources/${rel.slug}`}
                          className="py-3 flex items-center justify-between group block text-xs sm:text-sm"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-[#8B3FA8] transition-colors block">
                              {rel.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {rel.typeLabel} &middot; {rel.category}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#8B3FA8] transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Metadata & CA Consultation CTA */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-sm">
                    Statutory Particulars
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-500 font-medium block">Document Type:</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{resource.typeLabel}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Practice Domain:</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{resource.category}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Official Reference:</span>
                      <span className="font-mono font-semibold text-slate-900 mt-0.5 block">{resource.statutoryReference}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Last Amended / Verified:</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{resource.lastUpdated}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block">Format / Standard:</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{resource.fileSizeOrFormat}</span>
                    </div>
                  </div>
                </div>

                {/* CA Advisory Box */}
                <div className="rounded-2xl border border-slate-200 bg-[#1B2A4A] p-6 text-white shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-bold text-sm">Need Legal Interpretation?</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our team of senior Chartered Accountants and Company Secretaries provides legal tax opinions, assessment defense, and appellate representation.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      className="block text-center rounded-lg bg-gradient-to-r from-[#8B3FA8] to-[#E8823A] py-2.5 px-4 text-xs font-bold text-white shadow hover:opacity-95 transition-opacity"
                    >
                      Book Free Legal Opinion &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
