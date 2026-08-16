'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSession } from '../../lib/use-session';
import {
  LayoutDashboard,
  FolderOpen,
  Receipt,
  User,
  Calendar,
  LogOut,
  Menu,
  X,
  FileText,
} from 'lucide-react';

export function PortalNav(): JSX.Element {
  const pathname = usePathname();
  const { user, email } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    { label: 'My Cases', href: '/portal/cases', icon: FolderOpen },
    { label: 'Invoices & Billing', href: '/portal/invoices', icon: Receipt },
    { label: 'Company Profile', href: '/portal/profile', icon: User },
    { label: 'Compliance Calendar', href: '/compliance-calendar', icon: Calendar },
    { label: 'Law Library', href: '/resources', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Portal Label */}
        <div className="flex items-center gap-6">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B2A4A] text-white font-bold text-base shadow-sm">
              T
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight font-display block">
                THABREZ
              </span>
              <span className="text-[10px] font-bold text-[#8B3FA8] uppercase tracking-wider block -mt-1">
                Client Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/portal'
                  ? pathname === '/portal'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1B2A4A] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900">
              {user?.name || email?.split('@')[0] || 'Client User'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {email}
            </span>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/portal'
                ? pathname === '/portal'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1B2A4A] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
