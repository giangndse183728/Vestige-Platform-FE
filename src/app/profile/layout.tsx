'use client';

import SidebarLayout from '@/components/layouts/SidebarLayout';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout currentPage="profile">
      {children}
    </SidebarLayout>
  );
}