import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer, Button } from '@thabrez/ui';
import { seedBlogPosts, companyInfo } from '@thabrez/config/company-content';
import {
  Calendar,
  Clock,
  User2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return seedBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = seedBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Article Not Found | Thabrez Tax Consulting',
    };
  }

  return {
    title: `${post.title} | Thabrez Tax Consulting`,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      url: `https://www.thabreztaxconsulting.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = seedBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = seedBlogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/blog" />

      <main className="flex-1">
        {/* Article Header */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-20">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Tax Insights
            </Link>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[#E8823A]/20 px-2.5 py-0.5 text-xs font-semibold text-[#E8823A]"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl font-display leading-[1.2]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-medium border-t border-slate-700/60">
              <span className="flex items-center gap-1.5">
                <User2 className="h-4 w-4 text-[#E8823A]" />
                {post.author.name} ({post.author.role})
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#E8823A]" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Clock className="h-4 w-4 text-[#E8823A]" />
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Main Content */}
              <article className="lg:col-span-8 space-y-6 text-slate-800 leading-relaxed text-sm sm:text-base">
                {/* Summary Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 italic text-slate-700 border-l-4 border-l-[#8B3FA8]">
                  {post.summary}
                </div>

                {/* Article Formatted Markdown Content */}
                <div className="space-y-4 pt-4 whitespace-pre-line font-sans text-slate-800 leading-relaxed">
                  {post.bodyMarkdown.trim()}
                </div>

                {/* Author Bio Box */}
                <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A] text-white font-bold text-lg shrink-0">
                    CA
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Authored by {post.author.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Practicing Fellow Chartered Accountant with {companyInfo.legalName}. Advises corporations, MSMEs, and high-net-worth clients across India.
                    </p>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Need Advice Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#8B3FA8]" /> Have a Specific Tax Query?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our partner CAs evaluate your exact business facts and structure defensible tax strategies.
                  </p>
                  <Link href="/contact" className="block">
                    <Button className="w-full bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 text-xs font-semibold">
                      Schedule CA Consultation
                    </Button>
                  </Link>
                </div>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Related Tax Updates
                    </h3>
                    <ul className="space-y-3 text-xs">
                      {relatedPosts.map((rel) => (
                        <li key={rel.slug} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <Link
                            href={`/blog/${rel.slug}`}
                            className="font-semibold text-slate-800 hover:text-[#8B3FA8] line-clamp-2 transition-colors"
                          >
                            {rel.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            {rel.readTime}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-16 bg-[#1B2A4A] text-white border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Ensure Full Compliance for Your Business
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Connect with our Chartered Accountants today to optimize your direct and indirect tax positions.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button size="xl" className="bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] text-white hover:opacity-95 font-semibold px-8 shadow-xl">
                  Book Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
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
