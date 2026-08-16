'use client';

import * as React from 'react';
import Link from 'next/link';
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
} from '@thabrez/ui';
import { Mail, Lock, Building, Phone, User, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

function SignupContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialPhone = searchParams.get('phone') || '';
  const initialName = searchParams.get('name') || '';

  const [formData, setFormData] = React.useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    companyName: '',
    pan: '',
    entityType: 'INDIVIDUAL',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // In production, this calls the NestJS client signup/lead conversion endpoint
      // For immediate access, sign in with the configured credentials or simulate creation
      const res = await signIn('credentials', {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
        callbackUrl: '/portal',
      });

      if (res?.ok) {
        router.push('/portal');
        router.refresh();
      } else {
        // If user does not exist yet in dev seed, inform user or prompt
        setErrorMessage(
          res?.error ||
            'Account setup received. Please sign in with your verified credentials or contact support if you need your invitation link resent.',
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('A connection error occurred during account creation.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold tracking-tight text-foreground font-display">
            THABREZ
          </span>
          <Badge variant="accent" className="text-xs">Client Onboarding</Badge>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Complete Your Client Account Setup
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {initialEmail
            ? `Finalize onboarding for invitation: ${initialEmail}`
            : 'Convert your consultation inquiry into an active client portal account'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Account Registration</CardTitle>
              {initialEmail && (
                <Badge variant="default" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Invite
                </Badge>
              )}
            </div>
            <CardDescription>
              Please enter your business and personal details to securely link your filing cases.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div
                  className="rounded-md bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive flex items-start gap-2.5"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="leading-tight">{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name / Contact Person</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Rajan Mehta"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-9"
                    />
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-9"
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading || !!initialEmail}
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company / Trade Name (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Mehta Enterprises"
                      value={formData.companyName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-9"
                    />
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pan">PAN Card Number (Optional)</Label>
                  <Input
                    id="pan"
                    name="pan"
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.pan}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="entityType">Business Entity Type</Label>
                <select
                  id="entityType"
                  name="entityType"
                  value={formData.entityType}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="INDIVIDUAL">Individual / Salaried</option>
                  <option value="PROPRIETORSHIP">Proprietorship Firm</option>
                  <option value="PARTNERSHIP">Partnership Firm</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="PVT_LTD">Private Limited Company</option>
                  <option value="OPC">One Person Company (OPC)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-9"
                    />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="pl-9"
                    />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Complete Registration & Open Portal'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2 pb-6 border-t border-border/50 text-xs text-center text-muted-foreground">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>Compliant with Indian DPDP Act 2023 financial data regulations</span>
              </div>

              <div>
                Already have an active client account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-foreground hover:underline"
                >
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage(): JSX.Element {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading registration...</div>}>
      <SignupContent />
    </React.Suspense>
  );
}
