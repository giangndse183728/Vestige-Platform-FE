'use client';

import RouteGuard from '@/components/auth/RouteGuard';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAuth={true}>
      {children}
    </RouteGuard>
  );
} 