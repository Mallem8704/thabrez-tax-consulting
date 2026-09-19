import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Statutory Tax Calculators | Knowledge Bank',
};

export default function CalculatorsRedirectPage(): never {
  redirect('/calculators');
}
