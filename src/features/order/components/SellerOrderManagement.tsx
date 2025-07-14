'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCode } from '@/components/ui/qr-code';
import { useSellerOrders } from '@/features/order/hooks/useSellerOrders';
import { requestPickup } from '@/features/order/services';
import { ActualOrder, OrderStatus, EscrowStatus } from '@/features/order/schema';
import { format } from 'date-fns';
import { 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  ArrowRight,
  QrCode,
  Camera,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="w-4 h-4" />;
    case 'CONFIRMED':
    case 'PROCESSING':
      return <Package className="w-4 h-4" />;
    case 'AWAITING_PICKUP':
      return <QrCode className="w-4 h-4" />;
    case 'IN_WAREHOUSE':
      return <Package className="w-4 h-4" />;
    case 'OUT_FOR_DELIVERY':
      return <Truck className="w-4 h-4" />;
    case 'SHIPPED':
      return <Truck className="w-4 h-4" />;
    case 'DELIVERED':
      return <CheckCircle className="w-4 h-4" />;
    case 'CANCELLED':
    case 'REFUNDED':
    case 'EXPIRED':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'CONFIRMED':
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'AWAITING_PICKUP':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'IN_WAREHOUSE':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'OUT_FOR_DELIVERY':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'CANCELLED':
    case 'REFUNDED':
    case 'EXPIRED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getEscrowStatusColor = (status: EscrowStatus) => {
  switch (status) {
    case 'HOLDING':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'RELEASED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'REFUNDED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function SellerOrderManagement() {
  const { data: orders, isLoading, error, refetch } = useSellerOrders();
  const [selectedOrder, setSelectedOrder] = useState<ActualOrder | null>(null);
  const [processingPickup, setProcessingPickup] = useState<number | null>(null);
  const [pickupError, setPickupError] = useState<string | null>(null);

  const handleRequestPickup = async (orderId: number, itemId: number) => {
    try {
      setProcessingPickup(itemId);
      setPickupError(null);
      await requestPickup(orderId, itemId);
      // Refresh the orders list
      await refetch();
    } catch (err) {
      setPickupError('Failed to request pickup. Please try again.');
      console.error('Error requesting pickup:', err);
    } finally {
      setProcessingPickup(null);
    }
  };

  const generateQRCode = (itemId: number) => {
    // In a real implementation, this would generate a QR code
    // For now, we'll just show the item ID
    return `https://vestige.com/pickup/${itemId}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load orders</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">You haven't received any orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-metal font-bold">My Sales</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {pickupError && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <p className="font-gothic text-sm">{pickupError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.orderId} className="border-2 rounded-none">
            <CardHeader className="border-b-2 border-black bg-black/90 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-metal text-lg font-normal">
                    Order #{order.orderId}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(order.createdAt), 'PPP')} at{' '}
                    {format(new Date(order.createdAt), 'p')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={`border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                  {order.overallEscrowStatus && (
                    <Badge className={`border ${getEscrowStatusColor(order.overallEscrowStatus)}`}>
                      {order.overallEscrowStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-white/80">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="font-metal text-lg border-b-2 border-black pb-2">Order Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Items:</span>
                      <p className="font-medium">{order.totalItems}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Unique Sellers:</span>
                      <p className="font-medium">{order.uniqueSellers}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Shipping Fee:</span>
                      <p className="font-medium">{formatVND(order.totalShippingFee)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Platform Fee:</span>
                      <p className="font-medium">{formatVND(order.totalPlatformFee)}</p>
                    </div>
                  </div>
                  <div className="border-t-2 border-black pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-metal">Total Amount:</span>
                      <span className="text-xl font-bold">{formatVND(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-metal text-lg border-b-2 border-black pb-2">Items</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {order.itemSummaries.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productTitle}
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
                          <h4 className="font-medium text-sm truncate">{item.productTitle}</h4>
                          <p className="text-sm text-gray-600">Seller: {item.sellerUsername}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={`text-xs ${getStatusColor(item.itemStatus)}`}>
                              {item.itemStatus}
                            </Badge>
                            <Badge className={`text-xs ${getEscrowStatusColor(item.escrowStatus)}`}>
                              {item.escrowStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatVND(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6 mt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex-1 border-2 border-black font-gothic">
                  <Package className="w-4 h-4 mr-2" />
                  Track Order
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-2 border-black font-gothic">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
                <Link href={`/my-orders/${order.orderId}`}>
                  <Button size="sm" className="flex-1 border-2 border-black bg-red-900 hover:bg-red-800 text-white font-gothic">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Pickup Actions */}
              {order.itemSummaries.some(item => item.itemStatus === 'PROCESSING') && (
                <div className="flex gap-3 mt-4 pt-4 border-t-2 border-black">
                  {order.itemSummaries.map((item, index) => (
                    item.itemStatus === 'PROCESSING' && (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-gothic text-sm">{item.productTitle}:</span>
                        <Button
                          onClick={() => handleRequestPickup(order.orderId, item.productId)}
                          disabled={processingPickup === item.productId}
                          size="sm"
                          className="bg-orange-600 text-white hover:bg-orange-700 border-2 border-orange-600"
                        >
                          {processingPickup === item.productId ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Requesting...
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3 mr-2" />
                              Request Pickup
                            </>
                          )}
                        </Button>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* QR Code Display for AWAITING_PICKUP items */}
              {order.itemSummaries.some(item => item.itemStatus === 'AWAITING_PICKUP') && (
                <div className="flex gap-3 mt-4 pt-4 border-t-2 border-black">
                  {order.itemSummaries.map((item, index) => (
                    item.itemStatus === 'AWAITING_PICKUP' && (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-gothic text-sm">{item.productTitle}:</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:bg-green-700 border-2 border-green-600"
                            >
                              <QrCode className="w-3 h-3 mr-2" />
                              Show Pickup QR Code
                            </Button>
                          </DialogTrigger>
                                                     <DialogContent>
                             <DialogHeader>
                               <DialogTitle className="font-metal">Pickup QR Code</DialogTitle>
                             </DialogHeader>
                             <div className="text-center p-6">
                               <QRCode 
                                 value={item.productId.toString()} 
                                 size={200} 
                                 className="mx-auto mb-4"
                               />
                               <p className="font-gothic text-sm text-gray-600 mb-2">
                                 Show this QR code to the Vestige shipper
                               </p>
                               <p className="font-gothic text-xs text-gray-500">
                                 Item ID: {item.productId}
                               </p>
                             </div>
                           </DialogContent>
                        </Dialog>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Status Timeline for other statuses */}
              {order.itemSummaries.some(item => 
                ['IN_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(item.itemStatus)
              ) && (
                <div className="mt-4 pt-4 border-t-2 border-black">
                  <h4 className="font-metal text-sm mb-2">Shipping Status:</h4>
                  <div className="space-y-2">
                    {order.itemSummaries.map((item, index) => (
                      ['IN_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(item.itemStatus) && (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="font-gothic">{item.productTitle}:</span>
                          <Badge className={`text-xs ${getStatusColor(item.itemStatus)}`}>
                            {item.itemStatus === 'IN_WAREHOUSE' && 'In Warehouse'}
                            {item.itemStatus === 'OUT_FOR_DELIVERY' && 'Out for Delivery'}
                            {item.itemStatus === 'DELIVERED' && 'Delivered'}
                          </Badge>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 