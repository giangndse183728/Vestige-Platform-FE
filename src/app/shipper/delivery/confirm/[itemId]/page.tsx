import { use } from 'react';
import DeliveryPhotoConfirmPage from '@/features/shipper/pages/DeliveryPhotoConfirmPage';

export default function Page({ params }: { params: Promise<{ itemId: string }> }) {
  const resolvedParams = use(params);
  return <DeliveryPhotoConfirmPage itemId={Number(resolvedParams.itemId)} />;
} 