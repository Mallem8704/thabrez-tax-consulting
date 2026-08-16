'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  BrandLogo,
} from '@thabrez/ui';
import {
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';

const API_BASE_URL =
  process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000/api/v1';

type LoginStep = 'CREDENTIALS' | 'TOTP_VERIFY' | 'MFA_ENROLL';

function AdminLoginContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const urlError = searchParams.get('error');

  const [step, setStep] = React.useState<LoginStep>('CREDENTIALS');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [totpCode, setTotpCode] = React.useState('');

  // MFA Enrollment State
  const [enrollSecret, setEnrollSecret] = React.useState('');
  const [enrollQrCode, setEnrollQrCode] = React.useState('');
  const [enrollConfirmCode, setEnrollConfirmCode] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(() => {
    if (urlError === 'SessionExpired') {
      return 'Your session was terminated due to 30 minutes of inactivity. Please re-authenticate.';
    }
    if (urlError === 'StaffRoleRequired') {
      return 'Client accounts cannot access the Staff Management Console.';
    }
    if (urlError === 'InsufficientPermissions') {
      return 'You do not have the required staff privileges to access that section.';
    }
    return null;
  });

  // Step 1: Preflight check credentials with API or fallback demo
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const DEMO_STAFF: Record<string, string> = {
      'admin@thabrez.com': 'Admin@1234',
      'priya.ca@thabrez.com': 'CA@1234',
      'arun.associate@thabrez.com': 'Assoc@1234',
      'desk@thabrez.com': 'Desk@1234',
    };

    // If matching pre-configured demo staff, proceed to TOTP step directly
    if (DEMO_STAFF[cleanEmail] && DEMO_STAFF[cleanEmail] === password) {
      setStep('TOTP_VERIFY');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Rejects non-staff
      if (data.user?.role === 'CLIENT') {
        setErrorMessage('Access denied: Client accounts must log in via the Client Portal.');
        setIsLoading(false);
        return;
      }

      if (data.status === 'MFA_SETUP_REQUIRED') {
        await initiateMfaEnrollment(data.userId);
        setStep('MFA_ENROLL');
      } else if (data.status === 'MFA_REQUIRED') {
        setStep('TOTP_VERIFY');
      } else if (data.status === 'SUCCESS') {
        await performNextAuthSignIn(data.tokens?.accessToken);
      }
    } catch {
      // In offline/demo mode, proceed to TOTP verify if valid staff email format
      if (cleanEmail.includes('thabrez.com') || cleanEmail.includes('admin')) {
        setStep('TOTP_VERIFY');
      } else {
        setErrorMessage('Unable to connect to authentication server. Use demo: admin@thabrez.com / Admin@1234');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit 6-digit TOTP verification code to finalize staff authentication
  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        totpCode: totpCode.trim() || '123456',
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setIsLoading(false);
      } else if (res?.ok) {
        window.location.href = callbackUrl;
      } else {
        setErrorMessage('Authentication failed. Please verify your TOTP code.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during multi-factor authentication.');
      setIsLoading(false);
    }
  };

  // Step 3: MFA Enrollment generation
  const initiateMfaEnrollment = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/mfa/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        setEnrollSecret(data.secret);
        setEnrollQrCode(data.qrCode);
      } else {
        // Fallback demo TOTP secret if auth token required
        setEnrollSecret('JBSWY3DPEHPK3PXP');
      }
    } catch {
      setEnrollSecret('JBSWY3DPEHPK3PXP');
    }
  };

  // Step 3: Verify and complete MFA enrollment
  const handleEnrollVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const verifyRes = await fetch(`${API_BASE_URL}/auth/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: enrollConfirmCode.trim(),
          secret: enrollSecret,
        }),
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        setErrorMessage(errData.message || 'Invalid confirmation code. Ensure device clock is synced.');
        setIsLoading(false);
        return;
      }

      // MFA successfully enabled, now complete NextAuth sign-in
      const signInRes = await signIn('credentials', {
        email: email.trim(),
        password,
        totpCode: enrollConfirmCode.trim(),
        redirect: false,
        callbackUrl,
      });

      if (signInRes?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setStep('TOTP_VERIFY');
      }
    } catch {
      setErrorMessage('Failed to verify and activate MFA.');
    } finally {
      setIsLoading(false);
    }
  };

  const performNextAuthSignIn = async (_token?: string) => {
    const res = await signIn('credentials', {
      email: email.trim(),
      password,
      totpCode: totpCode || '123456',
      redirect: false,
      callbackUrl,
    });
    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-zinc-100 font-sans">
      {/* Dense Staff Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex justify-center mb-3">
          <BrandLogo variant="dark" size="md" />
        </div>
        <div className="inline-flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] font-mono border-zinc-700 bg-zinc-900 text-zinc-300">
            INTERNAL STAFF CONSOLE
          </Badge>
        </div>
        <p className="text-xs text-zinc-400 font-mono tracking-tight">
          STAFF ACCESS GATEWAY • STRICT ROLE RBAC • 2FA MANDATORY
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-zinc-800 bg-zinc-900 shadow-2xl text-zinc-100">
          <CardHeader className="pb-4 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-zinc-100 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-400" />
                <span>
                  {step === 'CREDENTIALS' && 'Step 1: Staff Identification'}
                  {step === 'TOTP_VERIFY' && 'Step 2: TOTP Multi-Factor Auth'}
                  {step === 'MFA_ENROLL' && 'MFA Device Enrollment'}
                </span>
              </CardTitle>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {step === 'CREDENTIALS' && '[1/2] AUTH'}
                {step === 'TOTP_VERIFY' && '[2/2] 2FA'}
                {step === 'MFA_ENROLL' && '[SETUP]'}
              </span>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              {step === 'CREDENTIALS' && 'Enter your internal staff account email and password.'}
              {step === 'TOTP_VERIFY' && `Enter the 6-digit code from your authenticator app for ${email}.`}
              {step === 'MFA_ENROLL' && 'First-time login: Scan the QR code with an authenticator app to enable mandatory 2FA.'}
            </CardDescription>
          </CardHeader>

          {/* Error Message Callout */}
          {errorMessage && (
            <div className="m-4 mb-0 rounded border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-red-400 shrink-0" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Email + Password */}
          {step === 'CREDENTIALS' && (
            <form onSubmit={handleCredentialsSubmit}>
              <CardContent className="space-y-3.5 pt-4">
                <div className="space-y-1">
                  <Label htmlFor="staff-email" className="text-xs text-zinc-300">Staff Email</Label>
                  <div className="relative">
                    <Input
                      id="staff-email"
                      type="email"
                      required
                      placeholder="ca@thabrez.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pl-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs h-9 focus:border-zinc-700"
                    />
                    <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="staff-password" className="text-xs text-zinc-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="staff-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs h-9 focus:border-zinc-700"
                    />
                    <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-9 text-xs bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium"
                  >
                    {isLoading ? 'Verifying Identity...' : 'Continue to Step 2'}
                    {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </form>
          )}

          {/* STEP 2: TOTP MFA Verification */}
          {step === 'TOTP_VERIFY' && (
            <form onSubmit={handleTotpSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
                  <span className="text-zinc-400">Target User:</span>
                  <span className="font-mono text-zinc-200">{email}</span>
                </div>

                <div className="space-y-1.5 text-center">
                  <Label htmlFor="totp-input" className="text-xs text-zinc-300">
                    6-Digit Authenticator Code
                  </Label>
                  <div className="flex justify-center">
                    <Input
                      id="totp-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                      className="w-48 text-center text-xl tracking-[0.4em] font-mono bg-zinc-950 border-zinc-700 text-zinc-100 h-11"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Generated by Google Authenticator, Microsoft Authenticator, or 1Password
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep('CREDENTIALS');
                      setTotpCode('');
                      setErrorMessage(null);
                    }}
                    disabled={isLoading}
                    className="w-1/3 h-9 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                  >
                    <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || totpCode.length !== 6}
                    className="w-2/3 h-9 text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold"
                  >
                    {isLoading ? 'Authenticating...' : 'Confirm & Enter Console'}
                    <Fingerprint className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </form>
          )}

          {/* STEP 3: MFA Enrollment Flow */}
          {step === 'MFA_ENROLL' && (
            <form onSubmit={handleEnrollVerify}>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="rounded bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-300">
                  First-time login detected. Staff security policy mandates Time-based One-Time Password (TOTP) configuration.
                </div>

                {enrollQrCode ? (
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={enrollQrCode} alt="TOTP QR Code" className="h-44 w-44" />
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-950 rounded text-center border border-zinc-800">
                    <QrCode className="h-10 w-10 text-zinc-500 mx-auto mb-2" />
                    <span className="text-zinc-400">Loading enrollment QR code...</span>
                  </div>
                )}

                {enrollSecret && (
                  <div className="space-y-1">
                    <Label className="text-[11px] text-zinc-400">Manual Entry Key (Base-32):</Label>
                    <div className="font-mono p-1.5 bg-zinc-950 border border-zinc-800 rounded text-center text-amber-300 text-xs select-all">
                      {enrollSecret}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-totp" className="text-zinc-300">
                    Enter Verification Code from App
                  </Label>
                  <Input
                    id="confirm-totp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    placeholder="000000"
                    value={enrollConfirmCode}
                    onChange={(e) => setEnrollConfirmCode(e.target.value.replace(/\D/g, ''))}
                    disabled={isLoading}
                    className="text-center font-mono tracking-widest text-base bg-zinc-950 border-zinc-700 text-zinc-100 h-9"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || enrollConfirmCode.length !== 6}
                    className="w-full h-9 text-xs bg-green-600 hover:bg-green-500 text-white font-medium"
                  >
                    {isLoading ? 'Verifying...' : 'Activate MFA & Open Console'}
                    <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </form>
          )}

          <CardFooter className="py-3 px-4 border-t border-zinc-800/80 bg-zinc-950/50 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              <span>30m Inactivity Timeout Enforced</span>
            </div>
            <span className="font-mono">PORT 3001</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLoginPage(): JSX.Element {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading staff console...</div>}>
      <AdminLoginContent />
    </React.Suspense>
  );
}
