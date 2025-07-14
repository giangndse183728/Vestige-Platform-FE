'use client';

import { use } from 'react';
import DeliveryConfirmPage from '@/features/shipper/pages/DeliveryConfirmPage';

export default function Page({ params }) {
  const actualParams = use(params);
  return <DeliveryConfirmPage itemId={Number(actualParams.itemId)} />;
} 