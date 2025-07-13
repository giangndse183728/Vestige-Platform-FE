"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/services';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function RouteGuard({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  allowedRoles = [],
  redirectTo = '/login'
}: RouteGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(true);
        setUserRole(user.roleName);
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle redirects in separate useEffect to avoid setState during render
  useEffect(() => {
    if (isLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check admin requirement
    if (requireAdmin && isAuthenticated && userRole !== 'ADMIN') {
      router.push('/');
      return;
    }

    // Check allowed roles
    if (allowedRoles.length > 0 && isAuthenticated && userRole && !allowedRoles.includes(userRole)) {
      router.push('/');
      return;
    }
  }, [isLoading, requireAuth, requireAdmin, allowedRoles, isAuthenticated, userRole, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render content while redirecting
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAdmin && userRole !== 'ADMIN') {
    return null;
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
