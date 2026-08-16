'use client';

import * as React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@thabrez/ui';
import { Clock, ShieldAlert } from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_THRESHOLD_MS = 28 * 60 * 1000;  // 28 minutes (2 min warning)

export function InactivityTracker(): JSX.Element | null {
  const { status } = useSession();
  const [showWarning, setShowWarning] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(120);

  const lastActivityRef = React.useRef<number>(Date.now());
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const resetActivity = React.useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
    }
  }, [showWarning]);

  // Set up event listeners for user activity
  React.useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

    const handleUserActivity = () => {
      // Throttle activity updates to at most once every 5 seconds
      if (Date.now() - lastActivityRef.current > 5000) {
        resetActivity();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Check inactivity every 5 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        clearInterval(interval);
        signOut({ callbackUrl: '/login?error=SessionExpired' });
      } else if (elapsed >= WARNING_THRESHOLD_MS) {
        setShowWarning(true);
        const remaining = Math.max(0, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
        setSecondsLeft(remaining);
      } else {
        setShowWarning(false);
      }
    }, 2000);

    timerRef.current = interval;

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, resetActivity]);

  if (!showWarning || status !== 'authenticated') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5">
      <div className="rounded-lg border border-amber-500/40 bg-zinc-900 text-zinc-100 p-4 shadow-xl flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
              <span>Inactivity Warning</span>
            </h4>
            <p className="text-xs text-zinc-300">
              For security compliance, your session will automatically terminate in{' '}
              <span className="font-mono font-bold text-amber-400">{secondsLeft}s</span> due to inactivity.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-800">
          <Button
            size="sm"
            variant="outline"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-xs h-7 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            Sign Out Now
          </Button>
          <Button
            size="sm"
            onClick={resetActivity}
            className="text-xs h-7 bg-amber-600 hover:bg-amber-500 text-white font-medium"
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            Stay Signed In
          </Button>
        </div>
      </div>
    </div>
  );
}
