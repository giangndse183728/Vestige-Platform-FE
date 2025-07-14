import { use } from 'react';
import DeliveryPhotoConfirmPage from '@/features/shipper/pages/DeliveryPhotoConfirmPage';

export default function Page({ params }) {
  const actualParams = use(params);
  return <DeliveryPhotoConfirmPage itemId={Number(actualParams.itemId)} />;
} 