'use client';

import SidebarLayout from '@/components/layouts/SidebarLayout';

export default function SellerCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout currentPage="order-details">
      {children}
    </SidebarLayout>
  );
} 