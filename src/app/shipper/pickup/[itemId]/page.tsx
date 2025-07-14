'use client';

import { use } from 'react';
import PickupConfirmPage from '@/features/shipper/pages/PickupConfirmPage';

export default function Page({ params }) {
  const actualParams = use(params);
  return <PickupConfirmPage itemId={Number(actualParams.itemId)} />;
} 