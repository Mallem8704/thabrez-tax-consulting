import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Official Downloads & Utilities | Knowledge Bank',
};

export default function DownloadsPage(): never {
  redirect('/knowledge-bank/utilities');
}
