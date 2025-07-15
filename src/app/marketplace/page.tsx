export const dynamic = 'force-dynamic';

import {  Suspense } from 'react';
import MarketplaceContent from '@/features/products/components/MarketplaceContent'; 

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
