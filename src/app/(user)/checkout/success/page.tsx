'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrderDetail } from '@/features/order/hooks/useOrderDetail';
import { OrderItemDetail } from '@/features/order/schema';
import { CheckCircle, Package, MapPin, Home, User, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useConfirmPayment } from '@/features/order/hooks/useConfirmPayment';
import { toast } from 'sonner';

function CheckoutSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const { mutate: confirmPayment } = useConfirmPayment();

  const { data: order, isLoading: isLoadingOrder, error } = useOrderDetail(orderId ? parseInt(orderId) : 0);

  useEffect(() => {
    const code = searchParams.get('code');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');
    const cancel = searchParams.get('cancel');

    if (cancel === 'true') {
      toast.error('Payment was cancelled');
      setTimeout(() => {
        router.push('/marketplace');
      }, 3000);
      return;
    }

    if (code && status && orderCode) {
      setIsConfirming(true);
      confirmPayment(
        { code, status, orderCode },
        {
          onSuccess: () => {
            setIsConfirming(false);
            setConfirmError(null);
    
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('status');
            url.searchParams.delete('orderCode');
            url.searchParams.delete('cancel');
            url.searchParams.delete('id');
            window.history.replaceState({}, '', url.toString());
          },
          onError: () => {
            setIsConfirming(false);
            setConfirmError('Payment confirmation failed.');
            setTimeout(() => {
              router.push('/marketplace');
            }, 3000);
          },
        }
      );
      return;
    }

    if (!isLoadingOrder) {
      setIsLoading(false);
    }
  }, [searchParams, confirmPayment, router, isLoadingOrder, orderId]);

  const isCancelled = searchParams.get('cancel') === 'true';

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-metal text-2xl text-black mb-2">Payment Cancelled</h2>
          <p className="font-gothic text-gray-600 mb-4">Your payment was cancelled. You can try again anytime.</p>
          <Link href="/marketplace">
            <Button className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="font-metal text-2xl text-black mb-2">Confirming Payment</h2>
          <p className="font-gothic text-gray-600">Please wait while we process your order payment...</p>
        </div>
      </div>
    );
  }

  if (confirmError) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-metal text-2xl text-black mb-2">Payment Failed</h2>
          <p className="font-gothic text-gray-600 mb-4">There was a problem confirming your payment. Please try again or contact support.</p>
          <Link href="/marketplace">
            <Button className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 className="font-metal text-3xl text-black mb-2">Order Confirmed!</h1>
        <p className="font-gothic text-lg text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/')} className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto">
            Go Home
          </Button>
          <Button onClick={() => router.push('/my-orders')} variant="outline" className="border-2 border-black text-black hover:bg-gray-100 font-gothic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto">
            Check Your Orders
          </Button>
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