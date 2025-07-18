export const dynamic = 'force-dynamic';

import {  Suspense } from 'react';
import MarketplaceContent from '@/features/products/components/MarketplaceContent'; 
import { generateSEOMetadata } from "@/libs/seo";

export const metadata = generateSEOMetadata({
  title: "Vestige | Marketplace",
  description: "Explore our marketplace for digital fashion, virtual runway shows, and meta fashion concepts.",
  keywords: ["vestige", "fashion platform", "meta fashion", "marketplace"],
  image: {
    url: "/banner1.jpg",
    width: 1200,
    height: 630,
    alt: "Marketplace"
  }
});

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
