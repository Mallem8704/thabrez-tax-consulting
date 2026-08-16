/**
 * @thabrez/ui — public component exports
 *
 * Import from this barrel in apps:
 *   import { Button, Card } from '@thabrez/ui';
 */

// Utility
export { cn } from './lib/utils';

// Components
export { Button, buttonVariants, type ButtonProps } from './components/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/card';
export { Input, type InputProps } from './components/input';
export { Label } from './components/label';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
export { Separator } from './components/separator';
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from './components/toast';

// Shared Layout Components
export { BrandLogo, type BrandLogoProps } from './components/brand-logo';
export { Header, type HeaderProps } from './components/layout/header';
export { Footer } from './components/layout/footer';
export { StickyConsultationCta } from './components/layout/sticky-cta';
export { WhatsAppIcon, WhatsAppBadge, type WhatsAppIconProps } from './components/whatsapp-icon';
