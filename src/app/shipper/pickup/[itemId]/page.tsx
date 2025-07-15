'use client';

import { use } from 'react';
import PickupConfirmPage from '@/features/shipper/pages/PickupConfirmPage';

export default function Page({ params }: { params: Promise<{ itemId: string }> }) {
  const resolvedParams = use(params);
  return <PickupConfirmPage itemId={Number(resolvedParams.itemId)} />;
} 