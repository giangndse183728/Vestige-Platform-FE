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
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const role = (user as any).roleName || (user as any).role;
      if (role === 'SHIPPER') {
        setIsLoading(false);
      } else {
        router.replace('/'); // Không đủ quyền, về trang chủ
      }
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <Card className="w-96 border-2 border-black">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="font-gothic">Loading shipper dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 border-2 border-green-200 font-metal">
                {user.firstName} {user.lastName}
              </Badge>
              <Button
                onClick={() => logout()}
                variant="outline"
                size="sm"
                className="border-2 border-black hover:bg-black hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
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
            <Link href="/shipper/delivery">
              <Button
                variant="ghost"
                className="font-gothic text-sm border-b-2 border-transparent hover:border-black hover:bg-transparent"
              >
                <Route className="w-4 h-4 mr-2" />
                Delivery Route
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