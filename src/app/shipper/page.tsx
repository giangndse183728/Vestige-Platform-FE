'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  MapPin, 
  User, 
  Camera, 
  Truck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { getPickupList } from '@/features/order/services';
import { PickupItem } from '@/features/order/schema';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/auth/RouteGuard';

function ShipperDashboard() {
  const [pickups, setPickups] = useState<PickupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPickups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPickupList();
      setPickups(response.data || []);
    } catch (err) {
      setError('Failed to load pickup list');
      console.error('Error fetching pickups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleStartPickup = (itemId: number) => {
    router.push(`/shipper/pickup/${itemId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-black">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-black" />
              <CardTitle className="font-metal text-xl">Pickup List</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-2 border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-black" />
              <CardTitle className="font-metal text-xl">Pickup List</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 border-2 border-blue-200 font-metal">
                {pickups.length} items
              </Badge>
            </div>
            <Button
              onClick={fetchPickups}
              variant="outline"
              size="sm"
              className="border-2 border-black hover:bg-black hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-gothic">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pickup List */}
      {pickups.length === 0 && !error ? (
        <Card className="border-2 border-black">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-metal text-lg mb-2">No Pickups Available</h3>
            <p className="font-gothic text-gray-600 mb-4">
              No items are currently awaiting pickup. Check back later!
            </p>
            <Button
              onClick={fetchPickups}
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pickups.map((pickup) => (
            <Card key={pickup.orderItemId} className="border-2 border-black hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                {/* Product Info */}
                <div className="flex gap-4 mb-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {pickup.product.primaryImageUrl ? (
                      <Image
                        src={pickup.product.primaryImageUrl}
                        alt={pickup.product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-metal text-sm font-bold truncate mb-1">
                      {pickup.product.title}
                    </h3>
                    <p className="font-gothic text-xs text-gray-600 mb-2">
                      {pickup.product.brandName} • {pickup.product.condition}
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800 border-2 border-yellow-200 font-metal text-xs">
                      {pickup.status}
                    </Badge>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded border">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-gothic text-sm font-medium truncate">
                      {pickup.seller.firstName} {pickup.seller.lastName}
                    </p>
                    <p className="font-gothic text-xs text-gray-600">
                      @{pickup.seller.username}
                    </p>
                  </div>
                </div>

                {/* Pickup Address */}
                <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 rounded border">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-gothic text-sm font-medium text-blue-800">
                      Pickup Address
                    </p>
                    <p className="font-gothic text-xs text-blue-600">
                      {pickup.order.shippingAddress.streetAddress}
                    </p>
                    <p className="font-gothic text-xs text-blue-600">
                      {pickup.order.shippingAddress.city}, {pickup.order.shippingAddress.state}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleStartPickup(pickup.orderItemId)}
                  className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black font-metal"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Pickup
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShipperDashboardPage() {
  return (
    <RouteGuard requireAuth={true} allowedRoles={['SHIPPER']}>
      <ShipperDashboard />
    </RouteGuard>
  );
} 