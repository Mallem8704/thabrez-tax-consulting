import type { Metadata } from 'next';
import { Header, Footer } from '@thabrez/ui';
import { ResourcesLibraryView } from '../../components/resources/resources-library-view';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tax & Corporate Law Library — Acts, Rules, Forms & Bulletins | Thabrez Tax Consulting',
  description:
    'Free digital library of Indian statutory laws: Income-tax Act, CGST Act, Companies Act 2013, Income Tax Rules, Tax Audit Forms, and technical bulletins curated by Chartered Accountants.',
  keywords: [
    'Indian Tax Laws Library',
    'Income Tax Act 1961 Bare Act',
    'CGST Act 2017 Rules',
    'Companies Act 2013 Reference',
    'Tax Audit Form 3CD Format',
    'Union Budget 2025 Bulletin',
  ],
  openGraph: {
    title: 'Tax & Corporate Law Library — Acts, Rules, Forms & Bulletins',
    description:
      'Searchable repository of Indian statutory bare acts, procedural rules, tax audit forms, and technical practice bulletins.',
    type: 'website',
  },
};

export default function ResourcesPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-[#8B3FA8] selection:text-white">
      <Header currentPath="/resources" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-[#1B2A4A] py-16 text-white sm:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E8823A]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#E8823A]">
              <BookOpen className="h-3.5 w-3.5" /> Statutory Knowledge Bank
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-display">
              Acts, Rules, Forms &amp; Bulletins Library
            </h1>
            <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300">
              Access curated Indian statutory bare acts, procedural rules, tax audit schemas, and CA technical bulletins with instant full-text search.
            </p>
          </div>
        </section>

        {/* Resources Library View */}
        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ResourcesLibraryView />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
