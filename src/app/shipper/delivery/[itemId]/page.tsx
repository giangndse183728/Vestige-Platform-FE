'use client';

import { use } from 'react';
import DeliveryConfirmPage from '@/features/shipper/pages/DeliveryConfirmPage';

export default function Page({ params }: { params: Promise<{ itemId: string }> }) {
  const resolvedParams = use(params);
  return <DeliveryConfirmPage itemId={Number(resolvedParams.itemId)} />;
} 