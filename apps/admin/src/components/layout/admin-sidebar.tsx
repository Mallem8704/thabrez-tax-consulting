'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useStaffSession } from '../../lib/use-staff-session';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderLock,
  CalendarClock,
  ReceiptText,
  UserPlus,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function AdminSidebar(): JSX.Element {
  const pathname = usePathname();
  const { email, role, isAdmin, isSeniorCa, isAssociate, isFrontDesk } = useStaffSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Cases', href: '/cases', icon: Briefcase },
    { name: 'Documents', href: '/documents', icon: FolderLock },
    { name: 'Deadlines', href: '/deadlines', icon: CalendarClock },
    { name: 'Invoices', href: '/invoices', icon: ReceiptText },
    { name: 'Leads', href: '/leads', icon: UserPlus },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'ADMIN', color: 'border-red-500/40 bg-red-950/40 text-red-400' };
    if (isSeniorCa) return { label: 'SENIOR CA', color: 'border-amber-500/40 bg-amber-950/40 text-amber-400' };
    if (isAssociate) return { label: 'ASSOCIATE', color: 'border-blue-500/40 bg-blue-950/40 text-blue-400' };
    if (isFrontDesk) return { label: 'FRONT DESK', color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400' };
    return { label: role || 'STAFF', color: 'border-zinc-700 bg-zinc-800 text-zinc-300' };
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded overflow-hidden bg-white/95 p-0.5 shadow-sm">
            <img src="/logo-icon.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wide text-white">
            THABREZ <span className="text-[#E8823A]">ADMIN</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="h-8 w-8 rounded-lg overflow-hidden bg-white p-1 shadow">
              <img src="/logo-icon.png" alt="Thabrez Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="font-mono text-sm font-bold tracking-wider text-white flex items-center gap-1.5">
                THABREZ
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                Staff Console
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1B2A4A] text-white shadow-sm border border-[#3C8C4A]/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? 'text-[#E8823A]' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#E8823A]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Pro / Compliance Status Banner */}
        <div className="p-3 mx-3 mb-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#E8823A]" /> FY 2025-26 Active
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Q3 LIVE</span>
          </div>
          <p className="text-[10px] text-zinc-500 leading-tight">
            GST &amp; TDS compliance batch synchronization is active.
          </p>
        </div>

        {/* User Profile & Session Controls */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#E8823A] shrink-0">
                {email ? email[0]?.toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate font-mono">
                  {email || 'staff@thabreztaxconsulting.com'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.2 rounded border text-[9px] font-mono font-bold ${roleBadge.color}`}
                  >
                    {roleBadge.label}
                  </span>
                  <span className="inline-flex items-center text-[9px] text-emerald-400 font-mono">
                    <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> 2FA
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign Out"
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-800/80 hover:bg-red-950/40 hover:border-red-500/40 hover:text-red-400 text-zinc-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
