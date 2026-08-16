import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@thabrez/ui';
import { seedBlogPosts } from '@thabrez/config/company-content';
import {
  Clock,
  User2,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tax Insights & Regulatory Updates | Thabrez Tax Consulting',
  description:
    'Expert analysis, Union Budget interpretations, GST compliance advisories, and direct tax legal updates by certified Chartered Accountants.',
  openGraph: {
    title: 'Tax Insights & Articles | Thabrez Tax Consulting',
    description:
      'Expert Chartered Accountant analysis of Indian direct tax, GST, and corporate laws.',
    type: 'website',
  },
};

export default function BlogListPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/blog" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-block rounded-md bg-[#E8823A]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
              Tax Insights &amp; Knowledge Base
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Regulatory Updates &amp; CA Commentary
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300">
              Practical guides and legal analyses on GST, Income Tax Act, MCA notifications, and enterprise financial compliance.
            </p>
          </div>
        </section>

        {/* Blog Post Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {seedBlogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-[#8B3FA8]/10 px-2 py-0.5 text-[10px] font-bold text-[#8B3FA8]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 leading-snug hover:text-[#1B2A4A] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User2 className="h-3.5 w-3.5 text-[#E8823A]" />
                        {post.author.name}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#8B3FA8] hover:text-[#1B2A4A] transition-colors"
                    >
                      Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
