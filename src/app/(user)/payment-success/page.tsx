'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, Star, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useConfirmPayment } from '@/features/membership/hooks/useMembershipActions';
import { toast } from 'sonner';

function PaymentSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmPayment();
  

  useEffect(() => {
    const code = searchParams.get('code');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');
    const cancel = searchParams.get('cancel');
  

    // Check if payment was cancelled
    if (cancel === 'true') {
      toast.error('Payment was cancelled');
      setTimeout(() => {
        router.push('/subscription');
      }, 3000);
      return;
    }

    // If all PayOS parameters are present, confirm the payment
    if (code && status && orderCode) {
      confirmPayment({
        code,
        status,
        orderCode
      }, {
        onSuccess: () => {
          const url = new URL(window.location.href);
          url.searchParams.delete('code');
          url.searchParams.delete('status');
          url.searchParams.delete('orderCode');
          url.searchParams.delete('cancel');
          url.searchParams.delete('id');
          window.history.replaceState({}, '', url.toString());
        },
        onError: () => {

        }
      });
    } 
  }, [searchParams, confirmPayment, router]);

  // Check if payment was cancelled
  const isCancelled = searchParams.get('cancel') === 'true';

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-metal text-2xl text-black mb-2">Payment Cancelled</h2>
          <p className="font-gothic text-gray-600 mb-4">Your payment was cancelled. You can try again anytime.</p>
          <Link href="/subscription">
            <Button className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Back to Subscription Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isConfirmingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Crown className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="font-metal text-2xl text-black mb-2">Confirming Payment</h2>
          <p className="font-gothic text-gray-600">Please wait while we process your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-10 mt-8">
        {/* Success Header */}
        <div className="text-center mb-8 mt-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="font-metal text-3xl text-black mb-2">Subscription Activated!</h1>
          <p className="font-gothic text-lg text-gray-600">
            Welcome to your premium membership. Your subscription has been successfully activated.
          </p>
         
        </div>

       

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/seller-center">
            <Button className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto">
              Go to Seller Center
            </Button>
          </Link>
          
          <Link href="/marketplace">
            <Button 
              variant="outline" 
              className="border-2 border-black text-black hover:bg-gray-100 font-gothic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
            >
              Browse Marketplace
            </Button>
          </Link>
          
          <Link href="/">
            <Button 
              variant="outline" 
              className="border-2 border-black text-black hover:bg-gray-100 font-gothic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="font-gothic text-lg">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessPageContent />
    </Suspense>
  );
} 