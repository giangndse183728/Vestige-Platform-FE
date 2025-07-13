'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBuyerOrders } from '@/features/order/hooks/useBuyerOrders';
import { ActualOrder, OrderStatus } from '@/features/order/schema';
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowRight, Calendar, DollarSign, AlertCircle, QrCode } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  REFUNDED: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
  },
  PAID: {
    label: 'Paid',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  AWAITING_PICKUP: {
    label: 'Awaiting Pickup',
    color: 'bg-orange-100 text-orange-800',
    icon: QrCode,
  },
  IN_WAREHOUSE: {
    label: 'In Warehouse',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Package,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
  },
};

const formatVNDPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export function BuyerOrdersTab() {
  const { data: orders, isLoading, error } = useBuyerOrders();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const filteredOrders = (orders || []).filter(order => 
    statusFilter === 'ALL' || order.status === statusFilter
  );

  const getStatusIcon = (status: OrderStatus) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80">
        <div className="max-w-6xl mx-auto p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} variant="double" className="border-2 border-black">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80">
        <div className="max-w-6xl mx-auto p-6">
          <Card variant="double" className="border-2 border-black">
            <CardContent className="p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-metal text-lg mb-2">Error loading orders</h3>
              <p className="font-gothic text-gray-600 mb-4">Something went wrong while loading your orders.</p>
              <Button onClick={() => window.location.reload()} className="border-2 border-black">Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80">
      {/* Herald Header */}
      <div className="border-t-4 border-b-4 border-black py-4 mb-6">
        <div className="text-center">
          <h1 className="font-metal text-4xl font-bold text-black tracking-wider">
            THE ORDERS HERALD
          </h1>
          <p className="font-gothic text-sm text-gray-600 mt-1 tracking-widest">
            ESTABLISHED 2025 • PURCHASE TRACKING EDITION
          </p>
          <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-500">
            <span>VOL. 1, NO. 1</span>
            <span>•</span>
            <span>{format(new Date(), 'MMM dd, yyyy')}</span>
            <span>•</span>
            <span>{filteredOrders.length} ORDERS</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Filter Tabs */}
        <Card variant="decorated" className="mb-6">
          <CardContent className="p-10">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-metal text-2xl font-bold text-black tracking-wider">
                ORDER FILTERS
              </h3>
              <div className="h-6 w-[1px] bg-black"></div>
              <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
            </div>
            
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 border-2 border-black">
                <TabsTrigger value="ALL" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">All</TabsTrigger>
                <TabsTrigger value="PENDING" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Pending</TabsTrigger>
                <TabsTrigger value="CONFIRMED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Confirmed</TabsTrigger>
                <TabsTrigger value="SHIPPED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Shipped</TabsTrigger>
                <TabsTrigger value="DELIVERED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Delivered</TabsTrigger>
                <TabsTrigger value="PAID" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Paid</TabsTrigger>
                <TabsTrigger value="PROCESSING" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Processing</TabsTrigger>
                <TabsTrigger value="CANCELLED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Cancelled</TabsTrigger>
                <TabsTrigger value="REFUNDED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Refunded</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Orders Content */}
        <Tabs value={statusFilter} className="w-full">
          <TabsContent value={statusFilter} className="mt-0">
            {filteredOrders.length === 0 ? (
              <Card variant="double" className="border-2 border-black">
                <CardContent className="p-10 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-metal text-xl mb-2">
                    {statusFilter === 'ALL' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders`}
                  </h3>
                  <p className="font-gothic text-gray-600 mb-6">
                    {statusFilter === 'ALL' 
                      ? "You haven't placed any orders yet. Start shopping to see your orders here."
                      : `You don't have any ${statusFilter.toLowerCase()} orders.`
                    }
                  </p>
                  {statusFilter === 'ALL' && (
                    <Link href="/marketplace">
                      <Button className="border-2 border-black bg-red-900 hover:bg-red-800 text-white">
                        Start Shopping
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.orderId} variant="double" className="border-2 border-black">
                    <CardHeader className="border-b-2 border-black bg-black/90 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={`${statusConfig[order.status].color} border-white`}>
                              {statusConfig[order.status].label}
                            </Badge>
                          </div>
                          <span className="font-gothic text-sm text-white">
                            Order #{order.orderId}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300 font-gothic">Total</div>
                          <div className="text-lg text-white font-metal">
                            {formatVNDPrice(order.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 bg-white/80">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div className="space-y-4">
                          <h3 className="font-metal text-lg border-b-2 border-black pb-2">Items</h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {order.itemSummaries.map((item) => (
                              <div key={item.productId} className="flex gap-3 p-3 border border-gray-200 ">
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
                                  <p className="text-sm text-gray-600">
                                    Seller: {item.sellerUsername}
                                    {item.sellerIsLegitProfile && (
                                      <span className="ml-2 text-green-600">✓ Verified</span>
                                    )}
                                  </p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge className={`text-xs ${
                                      item.itemStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                      item.itemStatus === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                      item.itemStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                      item.itemStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {item.itemStatus}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatVNDPrice(item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-4">
                          <h3 className="font-metal text-lg border-b-2 border-black pb-2">Order Summary</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total Items:</span>
                              <p className="font-medium">{order.totalItems}</p>
                            </div>
    
                            <div>
                              <span className="text-gray-600">Shipping Fee:</span>
                              <p className="font-medium">{formatVNDPrice(order.totalShippingFee)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Order Date:</span>
                              <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Paid At:</span>
                              <p className="font-medium">{order.paidAt ? formatDate(order.paidAt) : 'N/A'}</p>
                            </div>
                          </div>
                          
                     

                          <div className="border-t-2 border-black pt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-metal">Total Amount:</span>
                              <span className="text-xl font-bold">{formatVNDPrice(order.totalAmount)}</span>
                            </div>
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
                        <Link href={`/order-details/${order.orderId}`}>
                          <Button size="sm" className="flex-1 border-2 border-black bg-red-900 hover:bg-red-800 text-white font-gothic">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 border-t-2 border-black pt-4 text-center">
          <p className="font-gothic text-xs text-gray-500">
            THE ORDERS HERALD • Published by Community Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
} 