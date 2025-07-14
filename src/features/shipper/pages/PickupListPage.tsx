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
import { getLogisticsListByStatus } from '@/features/order/services';
import { PickupItem } from '@/features/order/schema';
import { useRouter } from 'next/navigation';

function ShipperDashboard() {
  const [pickups, setPickups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPickups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLogisticsListByStatus('AWAITING_PICKUP');
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
      <Card className="">
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
        <div className="p-12 text-center">
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
        </div>
      ) : (
        <div className="grid gap-10 justify-center" style={{ gridTemplateColumns: '1fr' }}>
          {pickups.map((pickup) => (
            <Card key={pickup.orderItemId} className="hover:border-gray-400 transition-colors w-full max-w-4xl mx-auto p-4 text-base">
              <CardContent className="p-3">
                {/* Product Info */}
                <div className="flex gap-4 mb-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Package className="w-7 h-7 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-metal text-base font-bold truncate mb-1">
                      {pickup.productName}
                    </h3>
                    <Badge className="bg-yellow-100 text-yellow-800 border-2 border-yellow-200 font-metal text-xs">
                      {pickup.status}
                    </Badge>
                  </div>
                </div>
                {/* Seller Info */}
                <div className="mb-2 p-2 rounded border border-blue-400 bg-blue-50">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-blue-800 text-sm">Seller</span>
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-gothic text-base font-semibold uppercase tracking-wide">{pickup.sellerInfo?.sellerFirstName} {pickup.sellerInfo?.sellerLastName}</span>
                      <span className="font-gothic text-xs text-gray-600">@{pickup.sellerInfo?.sellerUsername}</span>
                    </div>
                    <div className="font-gothic text-xs text-gray-700 mt-0.5 whitespace-pre-line pl-1 leading-tight">
                      {pickup.sellerInfo?.sellerAddressLine1}
                      {pickup.sellerInfo?.sellerAddressLine2 && `, ${pickup.sellerInfo.sellerAddressLine2}`},
                      {pickup.sellerInfo?.sellerCity && ` ${pickup.sellerInfo.sellerCity}`},
                      {pickup.sellerInfo?.sellerState && ` ${pickup.sellerInfo.sellerState}`},
                      {pickup.sellerInfo?.sellerCountry && ` ${pickup.sellerInfo.sellerCountry}`}
                    </div>
                  </div>
                </div>
                {/* Buyer Info */}
                <div className="mb-3 p-2 rounded border border-green-400 bg-green-50">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-800 text-sm">Buyer</span>
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-gothic text-base font-semibold uppercase tracking-wide">{pickup.buyerInfo?.buyerFirstName} {pickup.buyerInfo?.buyerLastName}</span>
                      <span className="font-gothic text-xs text-gray-600">@{pickup.buyerInfo?.buyerUsername}</span>
                    </div>
                    <div className="font-gothic text-xs text-gray-700 mt-0.5 whitespace-pre-line pl-1 leading-tight">
                      {pickup.buyerInfo?.buyerAddressLine1}
                      {pickup.buyerInfo?.buyerAddressLine2 && `, ${pickup.buyerInfo.buyerAddressLine2}`},
                      {pickup.buyerInfo?.buyerCity && ` ${pickup.buyerInfo.buyerCity}`},
                      {pickup.buyerInfo?.buyerState && ` ${pickup.buyerInfo.buyerState}`},
                      {pickup.buyerInfo?.buyerCountry && ` ${pickup.buyerInfo.buyerCountry}`}
                    </div>
                  </div>
                </div>
                {/* Pickup Address (ẩn nếu đã có buyer address) */}
                {/*
                <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 rounded">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-gothic text-sm font-medium text-blue-800 mb-1">
                      Pickup Address
                    </p>
                    <p className="font-gothic text-xs text-blue-700">
                      {pickup.sellerAddressLine1}
                      {pickup.sellerAddressLine2 && `, ${pickup.sellerAddressLine2}`},
                      {pickup.sellerCity && ` ${pickup.sellerCity}`},
                      {pickup.sellerState && ` ${pickup.sellerState}`},
                      {pickup.sellerCountry && ` ${pickup.sellerCountry}`}
                    </p>
                  </div>
                </div>
                */}
                {/* --- Order Info Section --- */}
                <div className="mt-4 grid grid-cols-1 gap-2 text-xs font-gothic text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Order Code:</span>
                    <span>{pickup.orderCode}</span>
                    <span className="ml-2 text-gray-400">(Order ID: {pickup.orderId})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Price:</span>
                    <span className="text-green-700 font-bold">{pickup.price?.toLocaleString()} VND</span>
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

export default ShipperDashboard; 