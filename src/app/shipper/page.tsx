'use client';

import PickupListPage from '@/features/shipper/pages/PickupListPage';
import RouteGuard from '@/components/auth/RouteGuard';
export default function ShipperDashboardPage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={['SHIPPER']}>
      <PickupListPage />
    </RouteGuard>
  );
} 