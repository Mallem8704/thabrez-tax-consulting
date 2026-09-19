import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Statutory Circulars | Knowledge Bank',
};

interface CircularsPageProps {
  searchParams: Promise<{
    authority?: string;
    category?: string;
  }>;
}

export default async function CircularsPage({ searchParams }: CircularsPageProps): Promise<never> {
  const params = await searchParams;
  const authority = params.authority || 'ALL';
  const category = params.category || 'ALL';
  redirect(`/knowledge-bank/updates?documentType=CIRCULAR&authority=${authority}&category=${category}`);
}
