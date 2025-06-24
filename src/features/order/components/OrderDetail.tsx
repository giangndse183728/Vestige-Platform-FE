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
      {/* Herald Header */}
      <div className="border-t-4 border-b-4 border-black py-4 mb-6 mt-8">
        <div className="text-center">
          <h1 className="font-metal text-4xl font-bold text-black tracking-wider">
            ORDER DETAILS HERALD
          </h1>
          <p className="font-gothic text-sm text-gray-600 mt-1 tracking-widest">
            ESTABLISHED 2025 • ORDER #{order.orderId} EDITION
          </p>
          <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-500">
            <span>VOL. 1, NO. {order.orderId}</span>
            <span>•</span>
            <span>{formatDate(order.createdAt)}</span>
            <span>•</span>
            <span>{order.totalItems} ITEMS</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/my-orders">
            <Button variant="outline" className="border-2 border-black font-gothic">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>

        {/* Order Summary Card */}
        <Card variant="double" className="border-2 border-black mb-6">
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
                <div className="text-sm text-gray-300 font-gothic">Total Amount</div>
                <div className="text-2xl text-white font-metal">
                  {formatVNDPrice(order.totalAmount)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 font-gothic">Items</div>
                <div className="font-medium font-metal">{order.totalItems}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 font-gothic">Shipping Fee</div>
                <div className="font-medium font-metal">{formatVNDPrice(order.totalShippingFee)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 font-gothic">Platform Fee</div>
                <div className="font-medium font-metal">{formatVNDPrice(order.totalPlatformFee)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1 font-gothic">Sellers</div>
                <div className="font-medium font-metal">{order.uniqueSellers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items by Seller */}
        <div className="space-y-6">
          {Object.entries(order.itemsBySeller).map(([sellerId, items]) => (
            <Card key={sellerId} variant="double" className="border-2 border-black">
              <CardHeader className="border-b-2 border-black bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-metal text-lg">{items[0].seller.username}</h3>
                      <p className="font-gothic text-sm text-gray-600">
                        {items[0].seller.isLegitProfile ? '✓ Verified Seller' : 'Seller'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 font-gothic">Seller Total</div>
                    <div className="font-medium font-metal">
                      {formatVNDPrice(items.reduce((sum, item) => sum + item.price, 0))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-yellow-50/20">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.orderItemId} className="border border-gray-200  p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 bg-gray-200 rounded overflow-hidden border border-gray-300 flex-shrink-0">
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
                          <h4 className="font-medium text-lg font-metal mb-2">{item.product.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{item.product.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-gothic">Condition</div>
                              <div className="font-medium text-sm ">{item.product.condition}</div>
                            </div>
                            {item.product.size && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1 font-gothic">Size</div>
                                <div className="font-medium text-sm ">{item.product.size}</div>
                              </div>
                            )}
                            {item.product.color && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1 font-gothic">Color</div>
                                <div className="font-medium text-sm ">{item.product.color}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-gothic">Category</div>
                              <div className="font-medium text-sm ">{item.product.categoryName}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              <Badge className={`${statusConfig[item.status].color}`}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {getEscrowStatusIcon(item.escrowStatus)}
                              <Badge className={`${escrowStatusConfig[item.escrowStatus].color}`}>
                                {escrowStatusConfig[item.escrowStatus].label}
                              </Badge>
                            </div>
                          </div>

                          {item.transaction && (
                            <div className=" p-3 ">
                              <h5 className="font-medium text-sm font-metal mb-2">Transaction Details</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <div className="text-xs text-gray-500 font-gothic">Transaction ID</div>
                                  <div className="font-medium font-metal">#{item.transaction.transactionId}</div>
                                </div>
                                {item.transaction.trackingNumber && (
                                  <div>
                                    <div className="text-xs text-gray-500 font-gothic">Tracking</div>
                                    <div className="font-medium font-metal">{item.transaction.trackingNumber}</div>
                                  </div>
                                )}
                                {item.transaction.shippedAt && (
                                  <div>
                                    <div className="text-xs text-gray-500 font-gothic">Shipped</div>
                                    <div className="font-medium text-sm font-metal">{formatDate(item.transaction.shippedAt)}</div>
                                  </div>
                                )}
                                {item.transaction.deliveredAt && (
                                  <div>
                                    <div className="text-xs text-gray-500 font-gothic">Delivered</div>
                                    <div className="font-medium text-sm font-metal">{formatDate(item.transaction.deliveredAt)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div>    
                            <div className="text-xs text-gray-500 font-gothic">Price</div>                
                            </div>
                            <div>
                             
                              <div className="text-xl font-metal text-red-900">{formatVNDPrice(item.price)}</div>
                            </div>
                            {item.notes && (
                              <div className="flex-1 ml-4">
                                <div className="text-xs text-gray-500 font-gothic">Notes</div>
                                <div className="font-medium text-sm font-metal">{item.notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <Card variant="double" className="border-2 border-black mt-6">
            <CardHeader className="border-b-2 border-black bg-gray-50">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="font-metal text-lg">Shipping Address</h3>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div >
                <div>{order.shippingAddress.addressLine1}</div>
                {order.shippingAddress.addressLine2 && (
                  <div>{order.shippingAddress.addressLine2}</div>
                )}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Timeline */}
        <Card variant="double" className="border-2 border-black mt-6">
          <CardHeader className="border-b-2 border-black bg-gray-50">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-metal text-lg">Order Timeline</h3>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium font-metal">Order Placed</div>
                  <div className="text-sm text-gray-600 font-gothic">{formatDate(order.createdAt)}</div>
                </div>
              </div>
              {order.stripePaymentIntentId && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium font-metal">Payment Processed</div>
                    <div className="text-sm text-gray-600 font-gothic">Stripe Payment Intent: {order.stripePaymentIntentId}</div>
                  </div>
                </div>
              )}
              {/* Add more timeline events based on order status */}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 border-t-2 border-black pt-4 text-center">
          <p className="font-gothic text-xs text-gray-500">
            ORDER DETAILS HERALD • Published by Community Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
