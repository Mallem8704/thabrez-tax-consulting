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
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';
  const urlError = searchParams.get('error');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage('Unable to complete login. Please try again.');
        setIsLoading(false);
      }
    } catch {
      setErrorMessage('An unexpected connection error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold tracking-tight text-foreground font-display">
            THABREZ
          </span>
          <Badge variant="accent" className="text-xs">Client Portal</Badge>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Client Account Sign In
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access your tax filings, uploaded documents, and compliance deadlines
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>
              Enter the credentials associated with your client account.
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
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
                    className="pl-9"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In to Portal'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2 pb-6 border-t border-border/50 text-xs text-center text-muted-foreground">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>Protected by 256-bit SSL encryption & client data isolation</span>
              </div>

              <div>
                Converting from an inquiry or received an invite link?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-foreground hover:underline"
                >
                  Set up your account
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
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading login...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
