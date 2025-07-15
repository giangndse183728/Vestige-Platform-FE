'use client';

import { useOrderDetail } from '@/features/order/hooks/useOrderDetail';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderStatus, OrderItemStatus, EscrowStatus, Buyer, orderItemStatusEnum } from '@/features/order/schema';
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
  Package,
  Warehouse,
  RotateCcw,
  Phone,
  Mail,
} from 'lucide-react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { OrderItemStepper } from './CustomerOrdersTab';
import { SellerReview } from '@/features/seller/components/SellerReview';
import React, { useRef, useState } from 'react';
import OrderTemplate from './OrderTemplate';

// Order status config (overall order)
const orderStatusConfig = {
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

// OrderItem status config (individual items)
const orderItemStatusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  AWAITING_PICKUP: {
    label: 'Awaiting Pickup',
    color: 'bg-orange-100 text-orange-800',
    icon: Package,
  },
  IN_WAREHOUSE: {
    label: 'In Warehouse',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Warehouse,
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
  const router = useRouter();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [showPdfTemplate, setShowPdfTemplate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const getOrderStatusIcon = (status: OrderStatus) => {
    const config = orderStatusConfig[status];
    if (!config) {
      return <AlertCircle className="w-4 h-4" />;
    }
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getOrderItemStatusIcon = (status: OrderItemStatus) => {
    const config = orderItemStatusConfig[status];
    if (!config) {
      return <AlertCircle className="w-4 h-4" />;
    }
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getEscrowStatusIcon = (status: EscrowStatus) => {
    const config = escrowStatusConfig[status];
    if (!config) {
      return <AlertCircle className="w-4 h-4" />;
    }
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setShowPdfTemplate(true);
    await new Promise(r => setTimeout(r, 100));
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    if (!pdfRef.current) { setIsDownloading(false); return; }
    const canvas = await html2canvas(pdfRef.current, { scale: 1.5 });
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Order_${order.orderId}.pdf`);
    setShowPdfTemplate(false);
    setIsDownloading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80">
  

      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="border-2 border-black font-gothic hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={handleDownloadPdf} 
            className="border-2 border-black font-gothic ml-4 min-w-[140px] flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            disabled={isDownloading || showPdfTemplate}
            variant="outline"
          >
            {isDownloading || showPdfTemplate ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 mr-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Generating...
              </span>
            ) : (
              'Download PDF'
            )}
          </Button>
        </div>

        {/* Enhanced Order Summary Card */}
        <Card variant="double" className="border-2 border-black mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-2 border-black bg-gradient-to-r from-black to-gray-800 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getOrderStatusIcon(order.status)}
                  <Badge className={`${orderStatusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'} border-white font-metal`}>
                    {orderStatusConfig[order.status]?.label || order.status}
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
                <div className="font-metal text-2xl text-black">{order.totalItems}</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Shipping Fee</div>
                <div className="font-metal text-lg text-black">{formatVNDPrice(order.totalShippingFee)}</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Platform Fee</div>
                <div className="font-metal text-lg text-black">{formatVNDPrice(order.totalPlatformFee)}</div>
              </div>
              <div className="text-center p-4 bg-white border-2 border-black shadow-sm">
                <div className="text-xs text-gray-500 mb-2 font-gothic uppercase tracking-wider">Sellers</div>
                <div className="font-metal text-2xl text-black">{order.uniqueSellers}</div>
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
                <div className="space-y-8">
                  {/* First Row - Product Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-metal">P</span>
                      </div>
                      <h4 className="font-metal text-xl text-black">Product Details</h4>
                    </div>
                    {items.map((item) => (
                      <div key={item.orderItemId} className="border-2 border-gray-200 p-6 hover:border-black transition-colors">
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
                            <h5 className=" text-lg font-metal mb-3 text-black">{item.product.title}</h5>
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
                  {/* Second Row - Status & Tracking */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-black flex items-center justify-center">
                        <span className="text-white text-sm font-metal">S</span>
                      </div>
                      <h4 className="font-metal text-xl text-black">Status & Tracking</h4>
                    </div>
                    {items.map((item) => {
                      // Map invalid status to a valid one for the stepper
                      let stepperStatus: OrderItemStatus;
                      if (orderItemStatusEnum.options.includes(item.status as any)) {
                        stepperStatus = item.status as OrderItemStatus;
                      } else {
                        stepperStatus = 'CANCELLED';
                      }
                      return (
                        <div key={item.orderItemId} className="border-2 border-gray-200 p-6 hover:border-black transition-colors">
                          <OrderItemStepper
                            currentStatus={stepperStatus}
                            productTitle={item.product.title}
                            productImage={item.product.primaryImageUrl}
                            price={item.price}
                            sellerUsername={items[0].seller.username}
                            sellerIsLegitProfile={items[0].seller.isLegitProfile}
                            orderId={order.orderId}
                            itemId={item.orderItemId}
                            hideProductInfo={true}
                          />
                         
                          {item.notes && (
                            <div className="pt-4 border-t-2 border-gray-200">
                              <div className="text-sm text-gray-500 font-gothic uppercase tracking-wider mb-2">Notes</div>
                              <div className="font-medium text-sm font-metal bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">{item.notes}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card variant="double" className="border-2 border-black mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
          <CardHeader className="border-b-2 border-black bg-gradient-to-r from-red-800 to-red-950 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-metal text-xl text-white">Buyer Information</h3>
                <p className="font-gothic text-sm text-blue-100">Customer details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-red-600" />
                  <span className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Full Name</span>
                </div>
                <div className=" font-gothic text-lg text-black">
                  {order.buyer.firstName} {order.buyer.lastName}
                </div>
                <div className="text-sm text-gray-600 font-gothic">@{order.buyer.username}</div>
              </div>
              
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Phone Number</span>
                </div>
                <div className=" font-gothic text-lg text-black">
                  {order.buyer.phoneNumber}
                </div>
              </div>
              
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-red-600" />
                  <span className="text-xs text-gray-500 font-gothic uppercase tracking-wider">Email Address</span>
                </div>
                <div className=" font-gothic text-lg text-black break-all">
                  {order.buyer.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Shipping Address */}
        {order.shippingAddress && (
          <Card variant="double" className="border-2 border-black mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-2 border-black bg-gradient-to-r from-blue-800 to-blue-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-metal text-xl text-white">Shipping Address</h3>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <div className="space-y-2 ">
                  <div className="text-lg">{order.shippingAddress.addressLine1}</div>
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

 

        {/* Enhanced Footer */}
        <div className="mt-12 border-t-4 border-black pt-6 text-center bg-white/90 p-6">
          {/* Seller Review Section */}
          <SellerReview transactionId={order.orderId} orderStatus={order.status} />
          <p className="font-gothic text-sm text-gray-500">
            ORDER DETAILS HERALD • Published by Community Editorial Board • All Rights Reserved
          </p>
        </div>

        {/* Hidden PDF Template for Export */}
        {order && (
          <div ref={pdfRef} style={{ display: showPdfTemplate ? 'block' : 'none' }}>
            <OrderTemplate order={order} />
          </div>
        )}
      </div>
    </div>
  );
}
