'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/features/order/hooks/useOrders';
import { ActualOrder, OrderStatus } from '@/features/order/schema';
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowRight, Calendar, DollarSign, AlertCircle } from 'lucide-react';

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
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Debug logging
  console.log('Orders data:', orders);
  console.log('Orders type:', typeof orders);
  console.log('Is array:', Array.isArray(orders));

  // Ensure orders is always an array with multiple fallbacks
  let ordersArray: ActualOrder[] = [];
  
  if (Array.isArray(orders)) {
    ordersArray = orders;
  } else if (orders && typeof orders === 'object') {
    const ordersObj = orders as any;
    if ('data' in ordersObj && Array.isArray(ordersObj.data)) {
      // Handle case where API returns { data: Order[] }
      ordersArray = ordersObj.data;
    } else if ('orders' in ordersObj && Array.isArray(ordersObj.orders)) {
      // Handle case where API returns { orders: Order[] }
      ordersArray = ordersObj.orders;
    }
  }
  
  const filteredOrders = ordersArray.filter(order => 
    statusFilter === 'ALL' || order.status === statusFilter
  );

  const getStatusIcon = (status: OrderStatus) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border-2 border-black -mr-[2px] -mb-[2px]">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-2 border-black -mr-[2px] -mb-[2px]">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading orders</h3>
            <p className="text-gray-600 mb-4">Something went wrong while loading your orders.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">My Orders</h1>
        <p className="text-gray-600 font-gothic">Track and manage your purchases</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-2 border-black -mr-[2px] -mb-[2px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Orders</SelectItem>
            {Object.entries(statusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="border-2 border-black -mr-[2px] -mb-[2px]">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-metal">
              {statusFilter === 'ALL' ? 'No orders yet' : `No ${statusFilter.toLowerCase()} orders`}
            </h3>
            <p className="text-gray-600 mb-6 font-gothic">
              {statusFilter === 'ALL' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `You don't have any ${statusFilter.toLowerCase()} orders.`
              }
            </p>
            {statusFilter === 'ALL' && (
              <Link href="/marketplace">
                <Button className="border-2 border-black -mr-[2px] -mb-[2px]">Start Shopping</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.orderId} className="border-2 border-black -mr-[2px] -mb-[2px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 font-gothic">
                      Order #{order.orderId}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-gothic">Total</div>
                    <div className="text-lg font-semibold text-[var(--dark-red)] font-metal">
                      {formatVNDPrice(order.totalAmount)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.itemSummaries.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden border border-gray-300">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productTitle}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate font-metal">{item.productTitle}</h4>
                        <p className="text-xs text-gray-500 font-gothic">
                          Seller: {item.sellerUsername}
                          {item.sellerIsLegitProfile && (
                            <span className="ml-2 text-green-600">✓ Verified</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${
                            item.itemStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            item.itemStatus === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                            item.itemStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                            item.itemStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.itemStatus}
                          </Badge>
                          <Badge className={`text-xs ${
                            item.escrowStatus === 'HOLDING' ? 'bg-yellow-100 text-yellow-800' :
                            item.escrowStatus === 'RELEASED' ? 'bg-green-100 text-green-800' :
                            item.escrowStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.escrowStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium font-metal">{formatVNDPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-gothic">Items</div>
                    <div className="font-medium font-metal">{order.totalItems}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-gothic">Shipping Fee</div>
                    <div className="font-medium font-metal">{formatVNDPrice(order.totalShippingFee)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-gothic">Platform Fee</div>
                    <div className="font-medium font-metal">{formatVNDPrice(order.totalPlatformFee)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-gothic">Order Date</div>
                    <div className="font-medium text-sm font-metal">{formatDate(order.createdAt)}</div>
                  </div>
                </div>

                {/* Payment/Delivery Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {order.paidAt && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-gothic">Paid At</div>
                      <div className="font-medium text-sm font-metal">{formatDate(order.paidAt)}</div>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-gothic">Delivered At</div>
                      <div className="font-medium text-sm font-metal">{formatDate(order.deliveredAt)}</div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1 border-2 border-black -mr-[2px] -mb-[2px] font-gothic">
                    <Package className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-2 border-black -mr-[2px] -mb-[2px] font-gothic">
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Receipt
                  </Button>
                  <Button size="sm" className="flex-1 border-2 border-black -mr-[2px] -mb-[2px] font-gothic">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
