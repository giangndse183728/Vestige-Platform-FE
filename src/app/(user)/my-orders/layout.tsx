'use client';

import SidebarLayout from '@/components/layouts/SidebarLayout';

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout currentPage="my-orders">
      {children}
    </SidebarLayout>
  );
} 