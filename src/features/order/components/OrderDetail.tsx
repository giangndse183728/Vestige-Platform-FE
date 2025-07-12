'use client';

import { useOrderDetail } from '@/features/order/hooks/useOrderDetail';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderStatus, EscrowStatus } from '@/features/order/schema';
import { formatVNDPrice, formatDate } from '@/utils/format';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ArrowLeft, 
  Calendar,  
  AlertCircle,
  MapPin,
  User,
  Shield,
  QrCode,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

const escrowStatusConfig = {
  HOLDING: {
    label: 'Holding',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Shield,
  },
  RELEASED: {
    label: 'Released',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  REFUNDED: {
    label: 'Refunded',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
  },
};

interface OrderDetailProps {
  orderId: number;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const { data: order, isLoading, error } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80">
        <div className="max-w-6xl mx-auto p-6">
          <div className="space-y-6">
            <Card variant="double" className="border-2 border-black">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80">
        <div className="max-w-6xl mx-auto p-6">
          <Card variant="double" className="border-2 border-black">
            <CardContent className="p-6 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-metal text-lg mb-2">Error loading order</h3>
              <p className="font-gothic text-gray-600 mb-4">Something went wrong while loading the order details.</p>
              <Button onClick={() => window.location.reload()} className="border-2 border-black">Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: OrderStatus) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getEscrowStatusIcon = (status: EscrowStatus) => {
    const config = escrowStatusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80">
      {/* Enhanced Herald Header */}
      <div className="border-t-4 border-b-4 border-black py-6 mb-8 mt-8 bg-white/90">
        <div className="text-center">
          <h1 className="font-metal text-5xl font-bold text-black tracking-widest mb-2">
            ORDER DETAILS HERALD
          </h1>
          <p className="font-gothic text-sm text-gray-600 tracking-widest">
            ESTABLISHED 2025 • ORDER #{order.orderId} EDITION
          </p>
          <div className="flex justify-center items-center gap-6 mt-3 text-xs text-gray-500">
            <span className="bg-black text-white px-3 py-1 font-metal">VOL. 1, NO. {order.orderId}</span>
            <span>•</span>
            <span>{formatDate(order.createdAt)}</span>
            <span>•</span>
            <span className="bg-red-900 text-white px-3 py-1 font-metal">{order.totalItems} ITEMS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/my-orders">
            <Button variant="outline" className="border-2 border-black font-gothic hover:bg-black hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>

        {/* Enhanced Order Summary Card */}
        <Card variant="double" className="border-2 border-black mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-gradient-to-r from-black to-gray-800 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Badge className={`${statusConfig[order.status].color} border-white font-metal`}>
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <span className="font-gothic text-sm text-white">
                  Order #{order.orderId}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300 font-gothic">Total Amount</div>
                <div className="text-3xl text-white font-metal">
                  {formatVNDPrice(order.totalAmount)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Items</div>
                <div className="font-bold font-metal text-2xl text-black">{order.totalItems}</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Shipping Fee</div>
                <div className="font-bold font-metal text-lg text-black">{formatVNDPrice(order.totalShippingFee)}</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Platform Fee</div>
                <div className="font-bold font-metal text-lg text-black">{formatVNDPrice(order.totalPlatformFee)}</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Sellers</div>
                <div className="font-bold font-metal text-2xl text-black">{order.uniqueSellers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Order Items by Seller */}
        <div className="space-y-8">
          {Object.entries(order.itemsBySeller).map(([sellerId, items]) => (
            <Card key={sellerId} variant="double" className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="border-b-2 border-black bg-gradient-to-r from-gray-100 to-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-metal text-xl text-black">{items[0].seller.username}</h3>
                      <p className="font-gothic text-sm text-gray-600">
                        {items[0].seller.isLegitProfile ? '✓ Verified Seller' : 'Seller'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 font-gothic">Seller Total</div>
                    <div className="font-bold font-metal text-xl text-red-900">
                      {formatVNDPrice(items.reduce((sum, item) => sum + item.price, 0))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column - Product Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-metal">P</span>
                      </div>
                      <h4 className="font-metal text-xl text-black">Product Details</h4>
                    </div>
                    {items.map((item) => (
                      <div key={item.orderItemId} className="border-2 border-gray-200 p-6 rounded-lg hover:border-black transition-colors">
                        <div className="flex gap-6">
                          <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 flex-shrink-0">
                            {item.product.primaryImageUrl ? (
                              <Image
                                src={item.product.primaryImageUrl}
                                alt={item.product.title}
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
                            <h5 className="font-bold text-lg font-metal mb-3 text-black">{item.product.title}</h5>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.product.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Condition</div>
                                <div className="font-medium text-sm font-metal">{item.product.condition}</div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Category</div>
                                <div className="font-medium text-sm font-metal">{item.product.categoryName}</div>
                              </div>
                              {item.product.size && (
                                <div className="bg-gray-50 p-3 rounded">
                                  <div className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Size</div>
                                  <div className="font-medium text-sm font-metal">{item.product.size}</div>
                                </div>
                              )}
                              {item.product.color && (
                                <div className="bg-gray-50 p-3 rounded">
                                  <div className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Color</div>
                                  <div className="font-medium text-sm font-metal">{item.product.color}</div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                              <div className="text-sm text-gray-500 font-gothic uppercase tracking-wider">Price</div>
                              <div className="text-2xl font-bold font-metal text-red-900">{formatVNDPrice(item.price)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column - Status & Transaction Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-black flex items-center justify-center">
                        <span className="text-white text-sm font-metal">S</span>
                      </div>
                      <h4 className="font-metal text-xl text-black">Status & Tracking</h4>
                    </div>
                    {items.map((item) => (
                      <div key={item.orderItemId} className="border-2 border-gray-200 p-6  hover:border-black transition-colors">
                        <div className="space-y-6">
                          {/* Status Badges */}
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2">
                              {getStatusIcon(item.status)}
                              <Badge className={`${statusConfig[item.status].color} font-metal`}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2 ">
                              {getEscrowStatusIcon(item.escrowStatus)}
                              <Badge className={`${escrowStatusConfig[item.escrowStatus].color} font-metal`}>
                                {escrowStatusConfig[item.escrowStatus].label}
                              </Badge>
                            </div>
                          </div>

                          {/* Transaction Details */}
                          {item.transaction && (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                              <h6 className="font-bold text-sm font-metal text-black border-b border-gray-300 pb-2">Transaction Details</h6>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500 font-gothic">Transaction ID:</span>
                                  <span className="font-medium font-metal bg-white px-3 py-1 rounded border">#{item.transaction.transactionId}</span>
                                </div>
                                {item.transaction.trackingNumber && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-gothic">Tracking:</span>
                                    <span className="font-medium font-metal bg-white px-3 py-1 rounded border">{item.transaction.trackingNumber}</span>
                                  </div>
                                )}
                                {item.transaction.shippedAt && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-gothic">Shipped:</span>
                                    <span className="font-medium text-sm font-metal bg-white px-3 py-1 rounded border">{formatDate(item.transaction.shippedAt)}</span>
                                  </div>
                                )}
                                {item.transaction.deliveredAt && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-gothic">Delivered:</span>
                                    <span className="font-medium text-sm font-metal bg-white px-3 py-1 rounded border">{formatDate(item.transaction.deliveredAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {item.notes && (
                            <div className="pt-4 border-t-2 border-gray-200">
                              <div className="text-sm text-gray-500 font-gothic uppercase tracking-wider mb-2">Notes</div>
                              <div className="font-medium text-sm font-metal bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">{item.notes}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Shipping Address */}
        {order.shippingAddress && (
          <Card variant="double" className="border-2 border-black mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-2 border-black bg-gradient-to-r from-gray-100 to-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-metal text-xl text-black">Shipping Address</h3>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <div className="space-y-2 font-gothic">
                  <div className="text-lg font-metal">{order.shippingAddress.addressLine1}</div>
                  {order.shippingAddress.addressLine2 && (
                    <div className="text-gray-600">{order.shippingAddress.addressLine2}</div>
                  )}
                  <div className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </div>
                  <div className="text-gray-600 font-medium">{order.shippingAddress.country}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Order Timeline */}
        <Card variant="double" className="border-2 border-black mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-metal text-xl text-black">Order Timeline</h3>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                <div className="flex-1">
                  <div className="font-bold font-metal text-lg text-black">Order Placed</div>
                  <div className="text-sm text-gray-600 font-gothic">{formatDate(order.createdAt)}</div>
                </div>
              </div>
              {order.stripePaymentIntentId && (
                <div className="flex items-center gap-6">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="flex-1">
                    <div className="font-bold font-metal text-lg text-black">Payment Processed</div>
                    <div className="text-sm text-gray-600 font-gothic">Stripe Payment Intent: {order.stripePaymentIntentId}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="mt-12 border-t-4 border-black pt-6 text-center bg-white/90 p-6 rounded-lg">
          <p className="font-gothic text-sm text-gray-500">
            ORDER DETAILS HERALD • Published by Community Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
