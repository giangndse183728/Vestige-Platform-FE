'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, RefreshCw, AlertCircle, User, Package, MapPin, Camera } from 'lucide-react';
import Image from 'next/image';
import { getLogisticsListByStatus } from '@/features/order/services';
import { PickupItem } from '@/features/order/schema';
import { useRouter } from 'next/navigation';

function OutForDeliveryPage() {
  const [outForDeliveryItems, setOutForDeliveryItems] = useState<PickupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLogisticsListByStatus('OUT_FOR_DELIVERY');
      setOutForDeliveryItems(response.data || []);
    } catch (err) {
      setError('Failed to load delivery items');
      console.error('Error fetching delivery items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-purple-600" />
            <CardTitle className="font-metal text-xl">Out for Delivery</CardTitle>
            <Badge className="bg-purple-100 text-purple-800 border-2 border-purple-200 font-metal text-xs">
              {outForDeliveryItems.length} items
            </Badge>
            <Button
              onClick={fetchItems}
              variant="outline"
              size="sm"
              className="border-2 border-black hover:bg-black hover:text-white ml-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>
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
      {outForDeliveryItems.length === 0 ? (
        <div className="text-center p-8">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="font-gothic text-gray-600">No items out for delivery</p>
        </div>
      ) : (
        <div className="grid gap-10 justify-center" style={{ gridTemplateColumns: '1fr' }}>
          {outForDeliveryItems.map((item) => (
            <Card key={item.orderItemId} className="hover:border-gray-400 transition-colors w-full max-w-4xl mx-auto p-4 text-base">
              <CardContent className="p-3">
                {/* Product Info */}
                <div className="flex gap-4 mb-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Package className="w-7 h-7 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-metal text-base font-bold truncate mb-1">
                      {item.productName || 'Unknown Product'}
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800 border-2 border-purple-200 font-metal text-xs">
                      {item.status}
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
                      <span className="font-gothic text-base font-semibold uppercase tracking-wide">{item.sellerInfo?.sellerFirstName} {item.sellerInfo?.sellerLastName}</span>
                      <span className="font-gothic text-xs text-gray-600">@{item.sellerInfo?.sellerUsername}</span>
                    </div>
                    <div className="font-gothic text-xs text-gray-700 mt-0.5 whitespace-pre-line pl-1 leading-tight">
                      {item.sellerInfo?.sellerAddressLine1}
                      {item.sellerInfo?.sellerAddressLine2 && `, ${item.sellerInfo.sellerAddressLine2}`},
                      {item.sellerInfo?.sellerCity && ` ${item.sellerInfo.sellerCity}`},
                      {item.sellerInfo?.sellerState && ` ${item.sellerInfo.sellerState}`},
                      {item.sellerInfo?.sellerCountry && ` ${item.sellerInfo.sellerCountry}`}
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
                      <span className="font-gothic text-base font-semibold uppercase tracking-wide">{item.buyerInfo?.buyerFirstName} {item.buyerInfo?.buyerLastName}</span>
                      <span className="font-gothic text-xs text-gray-600">@{item.buyerInfo?.buyerUsername}</span>
                    </div>
                    <div className="font-gothic text-xs text-gray-700 mt-0.5 whitespace-pre-line pl-1 leading-tight">
                      {item.buyerInfo?.buyerAddressLine1}
                      {item.buyerInfo?.buyerAddressLine2 && `, ${item.buyerInfo.buyerAddressLine2}`},
                      {item.buyerInfo?.buyerCity && ` ${item.buyerInfo.buyerCity}`},
                      {item.buyerInfo?.buyerState && ` ${item.buyerInfo.buyerState}`},
                      {item.buyerInfo?.buyerCountry && ` ${item.buyerInfo.buyerCountry}`}
                    </div>
                  </div>
                </div>
                {/* Pickup Address */}
                {item.sellerAddressLine1 && (
                  <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 rounded">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-gothic text-sm font-medium text-blue-800 mb-1">
                        Pickup Address
                      </p>
                      <p className="font-gothic text-xs text-blue-700">
                        {item.sellerAddressLine1}
                        {item.sellerAddressLine2 && `, ${item.sellerAddressLine2}`},
                        {item.sellerCity && ` ${item.sellerCity}`},
                        {item.sellerState && ` ${item.sellerState}`},
                        {item.sellerCountry && ` ${item.sellerCountry}`}
                      </p>
                    </div>
                  </div>
                )}
                {/* --- Order Info Section --- */}
                <div className="mt-4 grid grid-cols-1 gap-2 text-xs font-gothic text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Order Code:</span>
                    <span>{item.orderCode || 'N/A'}</span>
                    <span className="ml-2 text-gray-400">(Order ID: {item.orderId || item.orderItemId})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">Price:</span>
                    <span className="text-green-700 font-bold">{item.price?.toLocaleString() || 'N/A'} VND</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black font-metal text-lg py-3 mt-4 flex items-center justify-center gap-2"
                  onClick={() => router.push(`/shipper/delivery/confirm/${item.orderItemId}`)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Confirm Delivery
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OutForDeliveryPage;  