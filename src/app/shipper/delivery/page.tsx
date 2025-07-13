'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  MapPin, 
  User, 
  Truck,
  Route,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Warehouse
} from 'lucide-react';
import Image from 'next/image';
import { getPickupList, dispatchItem } from '@/features/order/services';
import { PickupItem } from '@/features/order/schema';

export default function DeliveryRoutePage() {
  const [warehouseItems, setWarehouseItems] = useState<PickupItem[]>([]);
  const [outForDeliveryItems, setOutForDeliveryItems] = useState<PickupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<number[]>([]);
  const router = useRouter();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPickupList();
      const allItems = response.data || [];
      
      // Filter items by status
      const warehouse = allItems.filter((item: PickupItem) => item.status === 'IN_WAREHOUSE');
      const outForDelivery = allItems.filter((item: PickupItem) => item.status === 'OUT_FOR_DELIVERY');
      
      setWarehouseItems(warehouse);
      setOutForDeliveryItems(outForDelivery);
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

  const handleDispatchItem = async (itemId: number) => {
    try {
      setProcessingItems(prev => [...prev, itemId]);
      await dispatchItem(itemId);
      
      // Refresh the list
      await fetchItems();
    } catch (err) {
      setError('Failed to dispatch item');
      console.error('Error dispatching item:', err);
    } finally {
      setProcessingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleDispatchMultiple = async () => {
    const itemsToDispatch = warehouseItems.map(item => item.orderItemId);
    
    try {
      setProcessingItems(itemsToDispatch);
      
      // Dispatch all items sequentially
      for (const itemId of itemsToDispatch) {
        await dispatchItem(itemId);
      }
      
      // Refresh the list
      await fetchItems();
    } catch (err) {
      setError('Failed to dispatch some items');
      console.error('Error dispatching items:', err);
    } finally {
      setProcessingItems([]);
    }
  };

  const handleStartDelivery = (itemId: number) => {
    router.push(`/shipper/delivery/${itemId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-black">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Route className="w-6 h-6 text-black" />
              <CardTitle className="font-metal text-xl">Delivery Route</CardTitle>
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
              <Route className="w-6 h-6 text-black" />
              <CardTitle className="font-metal text-xl">Delivery Route</CardTitle>
            </div>
            <Button
              onClick={fetchItems}
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

      {/* Warehouse Items */}
      <Card className="border-2 border-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Warehouse className="w-5 h-5 text-blue-600" />
              <CardTitle className="font-metal text-lg">In Warehouse</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 border-2 border-blue-200 font-metal">
                {warehouseItems.length} items
              </Badge>
            </div>
            {warehouseItems.length > 0 && (
              <Button
                onClick={handleDispatchMultiple}
                disabled={processingItems.length > 0}
                className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600"
              >
                {processingItems.length > 0 ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 mr-2" />
                    Dispatch All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {warehouseItems.length === 0 ? (
            <div className="text-center p-8">
              <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="font-gothic text-gray-600">No items in warehouse</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {warehouseItems.map((item) => (
                <Card key={item.orderItemId} className="border-2 border-blue-200">
                  <CardContent className="p-4">
                    {/* Product Info */}
                    <div className="flex gap-3 mb-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.product.primaryImageUrl ? (
                          <Image
                            src={item.product.primaryImageUrl}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-metal text-sm font-bold truncate mb-1">
                          {item.product.title}
                        </h4>
                        <p className="font-gothic text-xs text-gray-600 mb-2">
                          {item.product.brandName}
                        </p>
                        <Badge className="bg-blue-100 text-blue-800 border-2 border-blue-200 font-metal text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded text-xs">
                      <User className="w-3 h-3 text-gray-600" />
                      <span className="font-gothic truncate">
                        {item.seller.firstName} {item.seller.lastName}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleDispatchItem(item.orderItemId)}
                      disabled={processingItems.includes(item.orderItemId)}
                      size="sm"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600"
                    >
                      {processingItems.includes(item.orderItemId) ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Dispatching...
                        </>
                      ) : (
                        <>
                          <Truck className="w-3 h-3 mr-2" />
                          Dispatch
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Out for Delivery Items */}
      <Card className="border-2 border-black">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-purple-600" />
            <CardTitle className="font-metal text-lg">Out for Delivery</CardTitle>
            <Badge className="bg-purple-100 text-purple-800 border-2 border-purple-200 font-metal">
              {outForDeliveryItems.length} items
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {outForDeliveryItems.length === 0 ? (
            <div className="text-center p-8">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="font-gothic text-gray-600">No items out for delivery</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {outForDeliveryItems.map((item) => (
                <Card key={item.orderItemId} className="border-2 border-purple-200">
                  <CardContent className="p-4">
                    {/* Product Info */}
                    <div className="flex gap-3 mb-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.product.primaryImageUrl ? (
                          <Image
                            src={item.product.primaryImageUrl}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-metal text-sm font-bold truncate mb-1">
                          {item.product.title}
                        </h4>
                        <p className="font-gothic text-xs text-gray-600 mb-2">
                          {item.product.brandName}
                        </p>
                        <Badge className="bg-purple-100 text-purple-800 border-2 border-purple-200 font-metal text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="flex items-start gap-2 mb-3 p-2 bg-purple-50 rounded text-xs">
                      <MapPin className="w-3 h-3 text-purple-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-gothic font-medium text-purple-800">Delivery Address</p>
                        <p className="font-gothic text-purple-600 truncate">
                          {item.order.shippingAddress.streetAddress}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleStartDelivery(item.orderItemId)}
                      size="sm"
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 border-2 border-purple-600"
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Confirm Delivery
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 