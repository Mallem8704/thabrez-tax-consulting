import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Statutory Orders | Knowledge Bank',
};

interface OrdersPageProps {
  searchParams: Promise<{
    authority?: string;
    category?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps): Promise<never> {
  const params = await searchParams;
  const authority = params.authority || 'ALL';
  const category = params.category || 'ALL';
  redirect(`/knowledge-bank/updates?documentType=ORDER&authority=${authority}&category=${category}`);
}
