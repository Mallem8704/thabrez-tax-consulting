'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Badge,
} from '@thabrez/ui';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

function LoginContent(): JSX.Element {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';
  const urlError = searchParams.get('error');

  const [email, setEmail] = React.useState('client@example.com');
  const [password, setPassword] = React.useState('Client@1234');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(() => {
    if (urlError === 'StaffPortalRedirect') {
      return 'Staff and CA accounts must log in via the Staff Management Console (port 3001).';
    }
    if (urlError === 'CredentialsSignin') {
      return 'Invalid email or password.';
    }
    return null;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setIsLoading(false);
      } else if (res?.ok) {
        window.location.href = callbackUrl;
      } else {
        setErrorMessage('Unable to complete login. Please try again.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('An unexpected connection error occurred.');
      setIsLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 font-sans selection:bg-[#8B3FA8] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-2 focus:outline-none">
          <span className="text-2xl font-extrabold tracking-wider text-[#1B2A4A] font-display">
            THABREZ
          </span>
          <Badge variant="accent" className="text-xs font-bold uppercase tracking-wider">Client Vault</Badge>
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
          Client Account Sign In
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Access your tax filings, verified documents, and statutory compliance status
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Quick Demo Credentials Helper Card */}
        <div className="rounded-2xl border border-purple-200 bg-purple-50/80 p-4 shadow-sm space-y-2.5 text-xs text-purple-950">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-[#8B3FA8]">
              <Sparkles className="h-4 w-4" /> Quick Demo Credentials:
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-purple-700">Pre-Configured</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('client@example.com', 'Client@1234')}
              className="rounded-xl border border-purple-200 bg-white p-2 text-left hover:border-[#8B3FA8] hover:bg-purple-100/50 transition-all text-[11px]"
            >
              <span className="font-bold text-slate-900 block truncate">Nexus Tech Pvt Ltd</span>
              <span className="font-mono text-[10px] text-slate-500 block truncate">client@example.com</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoAccount('rajan.mehta@example.com', 'Client@1234')}
              className="rounded-xl border border-purple-200 bg-white p-2 text-left hover:border-[#8B3FA8] hover:bg-purple-100/50 transition-all text-[11px]"
            >
              <span className="font-bold text-slate-900 block truncate">Rajan Mehta (ITR)</span>
              <span className="font-mono text-[10px] text-slate-500 block truncate">rajan.mehta@...</span>
            </button>
          </div>
        </div>

        {/* Main Sign In Form */}
        <Card className="shadow-sm border-slate-200 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">Sign In</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Enter your registered email and password to access the client portal.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div
                  className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
                  <span className="leading-tight font-medium">{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-9 h-11 text-xs sm:text-sm rounded-xl border-slate-300"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-9 h-11 text-xs sm:text-sm rounded-xl border-slate-300 font-mono"
                  />
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 font-bold text-xs sm:text-sm rounded-xl shadow-sm gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Sign In to Portal Vault'}
                  {!isLoading && <ArrowRight className="h-4 w-4 text-[#E8823A]" />}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-3 pb-6 border-t border-slate-100 text-xs text-center text-slate-500">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-Bit TLS Encryption &amp; Strict Multi-Tenant Data Isolation</span>
              </div>

              <div className="pt-1">
                New client or need an account?{' '}
                <Link
                  href="/signup"
                  className="font-bold text-[#1B2A4A] hover:underline"
                >
                  Create Client Account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage(): JSX.Element {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Opening secure sign-in...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
