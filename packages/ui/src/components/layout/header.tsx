'use client';

import * as React from 'react';
import { Button } from '../button';
import { BrandLogo } from '../brand-logo';
import {
  Phone,
  ArrowRight,
  Menu,
  X,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export interface HeaderProps {
  currentPath?: string;
}

export function Header({ currentPath = '/' }: HeaderProps): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Compliance Calendar', href: '/compliance-calendar' },
    { label: 'Resources', href: '/resources' },
    { label: 'About Us', href: '/about' },
    { label: 'Tax Insights', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all">
      {/* Top Authority Micro-Bar */}
      <div className="border-b border-slate-800/20 bg-[#1B2A4A] py-1.5 text-slate-200 text-xs hidden lg:block">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-[#E8823A]" />
              Official Chartered Accountants &amp; Legal Tax Advisory
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Offices in Bengaluru &amp; Kadiri</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#E8823A] font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Partner Desk
            </span>
          </div>

          <div className="flex items-center gap-5 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="h-3 w-3 text-[#E8823A]" />
              <span className="text-slate-400">CA Helpline:</span>
              <a href="tel:8802222422" className="font-bold text-white hover:text-[#E8823A] transition-colors">
                +91 880-2222-422
              </a>
              <span className="text-slate-500">/</span>
              <a href="tel:7972222422" className="font-bold text-white hover:text-[#E8823A] transition-colors">
                +91 797-2222-422
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a href="/" className="flex items-center group transition-transform hover:scale-[0.99] focus:outline-none">
          <BrandLogo size="md" variant="light" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-[13px] font-semibold transition-all rounded-lg whitespace-nowrap ${
                  isActive
                    ? 'text-[#1B2A4A] bg-slate-100 font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#1B2A4A] hover:bg-slate-50'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#8B3FA8] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden items-center gap-3 sm:flex shrink-0">
          <a href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 font-bold text-xs h-9.5 px-3.5 shadow-2xs gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-[#8B3FA8]" />
              <span>Client Portal</span>
            </Button>
          </a>

          <a href="/contact">
            <Button
              size="sm"
              className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 font-bold text-xs h-9.5 px-4 shadow-sm hover:shadow-md transition-all gap-1.5 group"
            >
              <span>Free Consultation</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 text-[#E8823A]" />
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/98 backdrop-blur-lg px-5 pt-3 pb-8 lg:hidden shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1 divide-y divide-slate-100">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 text-sm font-semibold transition-colors ${
                    isActive ? 'text-[#8B3FA8] font-bold' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#8B3FA8]" />}
                </a>
              );
            })}
          </div>

          <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
            <a href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" className="w-full justify-center text-xs font-bold h-11 border-slate-300 gap-2">
                <Lock className="h-4 w-4 text-[#8B3FA8]" /> Client Portal Vault
              </Button>
            </a>

            <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button className="w-full justify-center text-xs font-bold h-11 bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-2 shadow-md">
                <span>Book Free CA Consultation</span>
                <ArrowRight className="h-4 w-4 text-[#E8823A]" />
              </Button>
            </a>

            <div className="pt-2 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-1.5">
              <Phone className="h-3 w-3 text-[#E8823A]" />
              <span>Helpline: +91 880-2222-422</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
