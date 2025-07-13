'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Package, 
  MapPin, 
  Camera, 
  CheckCircle, 
  LogOut,
  Home,
  Route
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ShipperLayoutProps {
  children: React.ReactNode;
}

export default function ShipperLayout({ children }: ShipperLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f7f3]/80">
      {/* Header */}
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-black" />
              <div>
                <h1 className="font-metal text-2xl font-bold text-black tracking-wider">
                  VESTIGE SHIPPING
                </h1>
                <p className="font-gothic text-sm text-gray-600 tracking-wider">
                  Shipper Dashboard
                </p>
              </div>
            </div>
            {/* Removed user info and logout button for consistency */}
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            <Link href="/shipper">
              <Button
                variant="ghost"
                className="font-gothic text-sm border-b-2 border-transparent hover:border-black hover:bg-transparent"
              >
                <Home className="w-4 h-4 mr-2" />
                Pickup List
              </Button>
            </Link>
            <Link href="/shipper/delivery/warehouse">
              <Button
                variant="ghost"
                className="font-gothic text-sm border-b-2 border-transparent hover:border-black hover:bg-transparent"
              >
                <Package className="w-4 h-4 mr-2" />
                In Warehouse
              </Button>
            </Link>
            <Link href="/shipper/delivery/out-for-delivery">
              <Button
                variant="ghost"
                className="font-gothic text-sm border-b-2 border-transparent hover:border-black hover:bg-transparent"
              >
                <Truck className="w-4 h-4 mr-2" />
                Out for Delivery
              </Button>
            </Link>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
} 