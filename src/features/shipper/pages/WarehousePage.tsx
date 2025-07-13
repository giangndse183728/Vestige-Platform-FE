'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Warehouse, RefreshCw, AlertCircle, User, Package, MapPin } from 'lucide-react';
import Image from 'next/image';
import { getLogisticsListByStatus, dispatchItem } from '@/features/order/services';
import { PickupItem } from '@/features/order/schema';

function WarehousePage() {
  const [warehouseItems, setWarehouseItems] = useState<PickupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<number[]>([]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getLogisticsListByStatus('IN_WAREHOUSE');
      setWarehouseItems(response.data || []);
    } catch (err) {
      setError('Failed to load warehouse items');
      console.error('Error fetching warehouse items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDispatchItem = async (itemId: number) => {
    try {
      setProcessingItems(prev => [...prev, itemId]);
      await dispatchItem(itemId);
      await fetchItems();
    } catch (err) {
      setError('Failed to dispatch item');
      console.error('Error dispatching item:', err);
    } finally {
      setProcessingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Warehouse className="w-6 h-6 text-blue-600" />
            <CardTitle className="font-metal text-xl">In Warehouse</CardTitle>
            <Badge className="bg-blue-100 text-blue-800 border-2 border-blue-200 font-metal text-xs">
              {warehouseItems.length} items
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
      {warehouseItems.length === 0 ? (
        <div className="text-center p-8">
          <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="font-gothic text-gray-600">No items in warehouse</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouseItems.map((item) => (
            <Card key={item.orderItemId} className="hover:border-gray-400 transition-colors w-full mx-auto p-4 text-base">
              <CardContent className="p-4">
                {/* Product Info */}
                <div className="flex gap-4 mb-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-metal text-sm font-bold truncate mb-1">
                      {item.productName || 'Unknown Product'}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800 border-2 border-blue-200 font-metal text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded border">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-gothic text-sm font-medium truncate">
                      {(item.sellerFirstName || item.seller?.firstName || '') + ' ' + (item.sellerLastName || item.seller?.lastName || '') || item.sellerName || 'Unknown Seller'}
                    </p>
                    {item.sellerUsername && (
                      <p className="font-gothic text-xs text-gray-600">
                        @{item.sellerUsername}
                      </p>
                    )}
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
                {/* Action Button */}
                <Button
                  onClick={() => handleDispatchItem(item.orderItemId)}
                  disabled={processingItems.includes(item.orderItemId)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 font-metal mt-4"
                >
                  Dispatch
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default WarehousePage; 