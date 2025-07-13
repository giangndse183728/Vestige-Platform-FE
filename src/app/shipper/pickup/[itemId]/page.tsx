'use client';

import PickupConfirmPage from '@/features/shipper/pages/PickupConfirmPage';
export default function Page({ params }) {
  return <PickupConfirmPage itemId={Number(params.itemId)} />;
} 