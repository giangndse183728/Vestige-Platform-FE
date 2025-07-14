'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSellerOrders } from '@/features/order/hooks/useSellerOrders';
import { useRequestPickup } from '@/features/order/hooks/useRequestPickup';
import { ActualOrder, OrderStatus, OrderItemStatus, EscrowStatus } from '@/features/order/schema';
import { format } from 'date-fns';
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, DollarSign, ArrowRight, AlertCircle, RotateCcw, Warehouse } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800',
    icon: Package,
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
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
    icon: RotateCcw,
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
  },
};

// OrderItemStatus stepper configuration
const orderItemSteps: { status: OrderItemStatus; label: string; icon: typeof Clock }[] = [
  { status: 'PENDING', label: 'Pending', icon: Clock },
  { status: 'PROCESSING', label: 'Processing', icon: Package },
  { status: 'AWAITING_PICKUP', label: 'Awaiting Pickup', icon: Package },
  { status: 'IN_WAREHOUSE', label: 'In Warehouse', icon: Warehouse },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

interface OrderItemStepperProps {
  currentStatus: OrderItemStatus;
  productTitle: string;
  productImage?: string | null;
  price: number;
  sellerUsername: string;
  sellerIsLegitProfile: boolean;
  orderId: number;
  itemId: number;
  hideProductInfo?: boolean;
}

const OrderItemStepper = ({ 
  currentStatus, 
  productTitle, 
  productImage, 
  price, 
  sellerUsername, 
  sellerIsLegitProfile,
  orderId,
  itemId,
  hideProductInfo = false,
}: OrderItemStepperProps) => {
  const { mutate: requestPickup, isPending: isRequestingPickup } = useRequestPickup();

  const handleRequestPickup = () => {
    requestPickup({ orderId, orderItemId: itemId });
  };

  // Handle cancelled/refunded items separately
  if (currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED') {
    return (
      <div className="bg-red-50 border-2 border-red-800 p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(153,27,27,0.5)]">
        <div className="flex gap-3">
          {!hideProductInfo && (
          <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            {productImage ? (
              <Image
                src={productImage}
                alt={productTitle}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-6 h-6" />
              </div>
            )}
          </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-800" />
              <span className="font-metal font-bold text-red-800 tracking-wider">
                {currentStatus === 'CANCELLED' ? 'ORDER CANCELLED' : 'ORDER REFUNDED'}
              </span>
            </div>
            {!hideProductInfo && (
              <>
            <h4 className="font-gothic font-bold text-sm text-red-900 mb-1">{productTitle}</h4>
            <p className="text-xs text-red-700 font-gothic">
              Seller: <span className="font-bold">{sellerUsername}</span>
              {sellerIsLegitProfile && <span className="ml-1 text-green-600 font-bold">✓</span>}
            </p>
              </>
            )}
          </div>
          {!hideProductInfo && (
          <div className="text-right">
            <p className="font-metal font-bold text-red-800">{formatVND(price)}</p>
          </div>
          )}
        </div>
      </div>
    );
  }

  const currentStepIndex = orderItemSteps.findIndex(step => step.status === currentStatus);
  
  return (
    <div className="bg-white border-2 border-black p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Item Header */}
      {!hideProductInfo && (
      <div className="flex gap-3 mb-4">
        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          {productImage ? (
            <Image
              src={productImage}
              alt={productTitle}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-gothic font-bold text-sm text-black mb-1">{productTitle}</h4>
          <p className="text-xs text-gray-600 font-gothic">
            Seller: <span className="font-bold">{sellerUsername}</span>
            {sellerIsLegitProfile && <span className="ml-1 text-green-600 font-bold">✓</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="font-metal font-bold text-black">{formatVND(price)}</p>
        </div>
      </div>
      )}
      
      {/* Stepper */}
      <div className="relative">
        {/* Connector line background */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-black/20 border border-black/30" />
        
        {/* Progress line */}
        <div 
          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-red-900 to-red-600 border border-black transition-all duration-500"
          style={{ width: `${(currentStepIndex / (orderItemSteps.length - 1)) * 100}%` }}
        />
        
        <div className="relative flex items-center justify-between">
          {orderItemSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const IconComponent = step.icon;
            
            return (
              <div key={step.status} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 flex items-center justify-center transition-all duration-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  ${isActive 
                    ? 'bg-red-900 text-white scale-110' 
                    : isCompleted 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-600'
                  }
                `}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className={`
                  text-xs mt-2 text-center transition-all duration-200 max-w-20 font-gothic font-bold tracking-wider h-8 flex items-center justify-center
                  ${isActive 
                    ? 'text-red-900 font-bold' 
                    : isCompleted 
                      ? 'text-black' 
                      : 'text-gray-500'
                  }
                `}>
                  {step.label.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 bg-gray-200 border-2 border-black h-3 relative overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div 
          className="bg-gradient-to-r from-red-900 to-red-600 h-full transition-all duration-500"
          style={{ width: `${((currentStepIndex + 1) / orderItemSteps.length) * 100}%` }}
        />
      </div>
      
      <div className="mt-3 flex justify-between items-center border-t border-black/20 pt-3">
        <span className="text-xs font-gothic font-bold tracking-wider text-black">
          STEP {currentStepIndex + 1} OF {orderItemSteps.length}
        </span>
        <Badge className={`text-xs font-metal tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
          currentStatus === 'DELIVERED' ? 'bg-black text-white' :
          currentStatus === 'OUT_FOR_DELIVERY' ? 'bg-red-900 text-white' :
          currentStatus === 'IN_WAREHOUSE' ? 'bg-red-700 text-white' :
          currentStatus === 'AWAITING_PICKUP' ? 'bg-red-600 text-white' :
          currentStatus === 'PROCESSING' ? 'bg-red-500 text-white' :
          currentStatus === 'PENDING' ? 'bg-gray-400 text-black' :
          'bg-gray-200 text-black'
        }`}>
          {currentStatus.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      
      {/* Request Pickup Button */}
      {currentStatus === 'PROCESSING' && (
        <div className="mt-4 pt-4 border-t-2 border-black">
          <Button
            onClick={handleRequestPickup}
            disabled={isRequestingPickup}
            size="sm"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white border-2 border-black font-gothic"
          >
            {isRequestingPickup ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                REQUESTING PICKUP...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 mr-2" />
                REQUEST PICKUP
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export { OrderItemStepper };

const getStatusIcon = (status: OrderStatus) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;
  return <IconComponent className="w-4 h-4" />;
};

const getStatusColor = (status: OrderStatus) => {
  return statusConfig[status].color;
};

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export function CustomerOrdersTab() {
  const { data: orders, isLoading, error, refetch } = useSellerOrders();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const filteredOrders = (orders || []).filter(order => 
    statusFilter === 'ALL' || order.status === statusFilter
  );

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
              <Button onClick={() => refetch()} className="border-2 border-black">Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">

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
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 border-2 border-black">
                <TabsTrigger value="ALL" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">All</TabsTrigger>
                <TabsTrigger value="PENDING" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Pending</TabsTrigger>
                <TabsTrigger value="PROCESSING" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Processing</TabsTrigger>
                <TabsTrigger value="OUT_FOR_DELIVERY" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Out for Delivery</TabsTrigger>
                <TabsTrigger value="DELIVERED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Delivered</TabsTrigger>
                <TabsTrigger value="CANCELLED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Cancelled</TabsTrigger>
                <TabsTrigger value="REFUNDED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Refunded</TabsTrigger>
                <TabsTrigger value="EXPIRED" className="font-gothic text-xs data-[state=active]:border-b-2 data-[state=active]:border-red-900">Expired</TabsTrigger>
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
                      ? "You haven't received any orders yet."
                      : `You don't have any ${statusFilter.toLowerCase()} orders.`
                    }
                  </p>
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
                            {formatVND(order.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 bg-white/80">
                      <div className="space-y-6">
                        {/* Order Items */}
                        <div className="space-y-4">
                          <h3 className="font-metal text-lg border-b-2 border-black pb-2">Items</h3>
                          <div className="space-y-3">
                            {order.itemSummaries.map((item, index) => (
                              <OrderItemStepper
                                key={index}
                                currentStatus={item.itemStatus}
                                productTitle={item.productTitle}
                                productImage={item.productImage}
                                price={item.price}
                                sellerUsername={item.sellerUsername}
                                sellerIsLegitProfile={item.sellerIsLegitProfile}
                                orderId={order.orderId}
                                itemId={item.orderItemId}
                                hideProductInfo={false}
                              />
                            ))}
                          </div>
                        </div>

                       
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-6 mt-4 border-t border-gray-200">
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

                      {/* Status Action Buttons */}
                      {order.status === 'PENDING' && (
                        <div className="flex gap-3 pt-6 mt-4 border-t-2 border-black">
                          <Button size="sm" className="bg-black text-white hover:bg-gray-800 border-2 border-black font-gothic">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Process Order
                          </Button>
                        </div>
                      )}
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
            THE SELLER HERALD • Published by Community Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
