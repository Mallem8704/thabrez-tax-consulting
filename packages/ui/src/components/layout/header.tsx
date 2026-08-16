'use client';

import * as React from 'react';
import { Button } from '../button';
import { Phone, ArrowRight, Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top micro-bar */}
      <div className="border-b border-slate-100 bg-[#1B2A4A] py-1.5 text-slate-200 text-xs hidden sm:block">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span>Official Chartered Accountants &amp; Legal Tax Advisory</span>
            <span className="text-slate-500">•</span>
            <span>Bengaluru &amp; Kadiri</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-[#E8823A]" />
              <a href="tel:8802222422" className="hover:text-white transition-colors">880-2222-422</a>
              <span>/</span>
              <a href="tel:7972222422" className="hover:text-white transition-colors">797-2222-422</a>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          {/* Official Logo Lockup (Raster reference asset) */}
          <div className="relative h-10 w-44 sm:w-52">
            <img
              src="/logo-lockup.png"
              alt="Thabrez Tax Consulting Private Limited"
              className="h-full w-full object-contain object-left"
            />
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#1B2A4A] ${
                  isActive
                    ? 'font-semibold text-[#1B2A4A] border-b-2 border-[#1B2A4A] pb-0.5'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <a href="/login">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Client Portal
            </Button>
          </a>
          <a href="/contact">
            <Button
              size="sm"
              className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 shadow-sm"
            >
              Free Consultation <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-700 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 lg:hidden shadow-lg space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <a href="/login" className="w-full">
              <Button variant="outline" className="w-full justify-center">
                Client Portal Login
              </Button>
            </a>
            <a href="/contact" className="w-full">
              <Button className="w-full justify-center bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90">
                Book a Free Consultation
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
