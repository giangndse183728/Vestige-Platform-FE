'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrderDetail } from '@/features/order/hooks/useOrderDetail';
import { OrderItemDetail } from '@/features/order/schema';
import { CheckCircle, Package, MapPin, Home, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

function CheckoutSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isLoading, setIsLoading] = useState(true);

  const { data: order, isLoading: isLoadingOrder, error } = useOrderDetail(orderId ? parseInt(orderId) : 0);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }
    
    if (!isLoadingOrder) {
      setIsLoading(false);
    }
  }, [orderId, isLoadingOrder, router]);

  if (isLoading || isLoadingOrder) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <p className="font-gothic text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <p className="font-gothic text-lg text-red-600">Error loading order details</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); 
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80">
      <div className="max-5xl mx-auto p-6 mt-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="font-metal text-3xl text-black mb-2">Order Confirmed!</h1>
          <p className="font-gothic text-lg text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <div className="mt-4">
            <Badge className="bg-green-600 text-white">
              Order #{order.orderId}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card variant="double">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-red-900" />
                  <h2 className="font-metal text-xl">Order Summary</h2>
                </div>
                
                <div className="space-y-4">
                  {order.orderItems.map((item: OrderItemDetail) => (
                    <div key={item.orderItemId} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="relative w-20 h-20 bg-gray-100 border border-gray-300 flex-shrink-0">
                        <Image
                          src={item.product.primaryImageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{item.product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Size: {item.product.size}</span>
                          <span>Color: {item.product.color}</span>
                          <span>Condition: {item.product.condition}</span>
                        </div>
                        <div className="mt-2">
                          <span className="font-metal text-lg text-red-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          

            {/* Shipping Address */}
            <Card variant="decorated">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-red-900" />
                  <h3 className="font-metal text-lg">Shipping Address</h3>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card variant="decorated">
                <CardContent className="p-6">
                  <h3 className="font-metal text-lg mb-4">Order Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Order ID:</span>
                      <span className="font-medium">#{order.orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Order Date:</span>
                      <span>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Items:</span>
                      <span>{order.totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sellers:</span>
                      <span>{order.uniqueSellers}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span className="text-green-600">
                          {order.totalShippingFee === 0 ? 'Free' : formatCurrency(order.totalShippingFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platform Fee:</span>
                        <span>{formatCurrency(order.totalPlatformFee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-metal text-lg">
                        <span>Total:</span>
                        <span className="text-red-900">
                          {formatCurrency(order.totalAmount + order.totalShippingFee + order.totalPlatformFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button asChild className="w-full bg-red-900 hover:bg-red-800 text-white">
                      <Link href="/profile" className="flex items-center justify-center">
                        <User className="w-4 h-4 mr-2" />
                        Go to Profile
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-black text-black hover:bg-gray-100">
                      <Link href="/marketplace" className="flex items-center justify-center">
                        <Home className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessPageContent />
    </Suspense>
  );
} 