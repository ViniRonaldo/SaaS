'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getDefaultRoute } from '@/lib/access-control';
import { useAuthStore } from '@/stores/auth-store';

interface RouteGuardProps {
  allow: (role?: string | null) => boolean;
  children: React.ReactNode;
}

export function RouteGuard({ allow, children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const canAccess = isAuthenticated && allow(user?.role);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!allow(user?.role)) {
      router.replace(getDefaultRoute(user?.role));
    }
  }, [allow, hasHydrated, isAuthenticated, pathname, router, user?.role]);

  if (!hasHydrated || !canAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
