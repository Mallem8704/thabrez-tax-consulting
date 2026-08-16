'use client';

import * as React from 'react';
import { BrandLogo } from '../brand-logo';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-[#1B2A4A] text-slate-200">
      {/* Top Value Banner */}
      <div className="border-b border-slate-700/60 bg-slate-900/60">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="h-5 w-5 text-[#E8823A]" />
              Need Reliable Chartered Accountant &amp; Tax Representation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Personalized direct advisory for GST scrutiny, High Court appeals, fundraising &amp; incorporation.
            </p>
          </div>
          <a href="/contact">
            <button className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#8B3FA8] via-[#C43D6B] to-[#E8823A] px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:opacity-95">
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </button>
          </a>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1 & 2: Firm identity */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="dark" size="md" />

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              A specialized consultancy firm delivering excellence in Income Tax, GST, Statutory Audit, Corporate Law, Accounting Services, and Institutional Debt Advisory.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                <span>Monday - Saturday: 10am to 7pm, Sunday: Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                <a
                  href="mailto:ca.thabrez@thabreztaxconsulting.com"
                  className="hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  ca.thabrez@thabreztaxconsulting.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#E8823A] shrink-0" />
                <span className="font-mono">
                  <a href="tel:8802222422" className="hover:text-white">880-2222-422</a> • <a href="tel:7972222422" className="hover:text-white">797-2222-422</a>
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Key Practices */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Startups &amp; Corporate
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="/services/private-limited-company" className="hover:text-white transition-colors">
                  Private Limited Company
                </a>
              </li>
              <li>
                <a href="/services/limited-liability-partnership" className="hover:text-white transition-colors">
                  Limited Liability Partnership
                </a>
              </li>
              <li>
                <a href="/services/one-person-company" className="hover:text-white transition-colors">
                  One Person Company (OPC)
                </a>
              </li>
              <li>
                <a href="/services/msme-registration" className="hover:text-white transition-colors">
                  MSME / Udyam Registration
                </a>
              </li>
              <li>
                <a href="/services/trade-mark" className="hover:text-white transition-colors">
                  Trademark &amp; IP Protection
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Tax & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Tax &amp; Compliances
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="/services/income-tax-filing" className="hover:text-white transition-colors">
                  Income Tax Return (ITR)
                </a>
              </li>
              <li>
                <a href="/services/gst-registration" className="hover:text-white transition-colors">
                  GST Registration &amp; Filings
                </a>
              </li>
              <li>
                <a href="/services/company-annual-compliances" className="hover:text-white transition-colors">
                  Company Annual Compliances
                </a>
              </li>
              <li>
                <a href="/services/tds-returns-compliance" className="hover:text-white transition-colors">
                  TDS Payments &amp; Returns
                </a>
              </li>
              <li>
                <a href="/services/business-loan" className="hover:text-white transition-colors">
                  Project Reports &amp; Loans
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Our Locations
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#E8823A]" /> Registered Office
                </p>
                <p className="mt-0.5">No.1-618-3A, 1st Floor, Opp. Sangam Theatre</p>
                <p>Kadiri, Sri Satya Sai Dist - 515591</p>
              </div>
              <div>
                <p className="font-semibold text-white flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#E8823A]" /> Bengaluru Branch
                </p>
                <p className="mt-0.5">No.56, Ground Floor, 4th Cross, Sun Rise Colony, C N Halli</p>
                <p>Bengaluru - 560002</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-slate-700/60 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p>
            &copy; {currentYear} Thabrez Tax Consulting Private Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="/services" className="hover:text-slate-200">
              All Services
            </a>
            <a href="/calculators" className="hover:text-slate-200">
              Calculators
            </a>
            <a href="/compliance-calendar" className="hover:text-slate-200">
              Compliance Calendar
            </a>
            <a href="/resources" className="hover:text-slate-200">
              Law Library
            </a>
            <a href="/about" className="hover:text-slate-200">
              About Us
            </a>
            <a href="/careers" className="hover:text-slate-200">
              Careers
            </a>
            <a href="/blog" className="hover:text-slate-200">
              Tax Insights
            </a>
            <a href="/contact" className="hover:text-slate-200">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
