import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff CA Management Console | Thabrez Tax Consulting',
  description: 'Internal Chartered Accountant portal for case tracking, statutory compliance, and client workflows.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
}
