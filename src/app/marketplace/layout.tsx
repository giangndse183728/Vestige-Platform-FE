'use client';

import { FilterProductLayout } from '@/components/layouts/FilterProductLayout';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProductLayout>
        {children}
    </FilterProductLayout>
  );
}