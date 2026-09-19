import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Government Schemes & Amnesty | Knowledge Bank',
};

export default function SchemesPage(): never {
  redirect('/knowledge-bank/updates?q=Scheme');
}
