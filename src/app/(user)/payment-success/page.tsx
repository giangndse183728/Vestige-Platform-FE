'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Star, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useConfirmPayment } from '@/features/membership/hooks/useMembershipActions';
import { useCurrentSubscription } from '@/features/membership/hooks/useMembershipPlans';
import { toast } from 'sonner';

function PaymentSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmPayment();
  const { data: currentSubscription, refetch: refetchSubscription } = useCurrentSubscription();

  useEffect(() => {
    const code = searchParams.get('code');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');
    const cancel = searchParams.get('cancel');
    const id = searchParams.get('id');

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
          // Refetch subscription data after successful confirmation
          refetchSubscription();
          // Clean up URL parameters after processing
          const url = new URL(window.location.href);
          url.searchParams.delete('code');
          url.searchParams.delete('status');
          url.searchParams.delete('orderCode');
          url.searchParams.delete('cancel');
          url.searchParams.delete('id');
          window.history.replaceState({}, '', url.toString());
        },
        onError: () => {
          // Redirect back to subscription page on error
          setTimeout(() => {
            router.push('/subscription');
          }, 3000);
        }
      });
    } else {
      // If no payment parameters or incomplete parameters, redirect to subscription page
      router.push('/subscription');
    }
  }, [searchParams, confirmPayment, router, refetchSubscription]);

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
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="font-metal text-3xl text-black mb-2">Subscription Activated!</h1>
          <p className="font-gothic text-lg text-gray-600">
            Welcome to your premium membership. Your subscription has been successfully activated.
          </p>
          {currentSubscription && (
            <div className="mt-4">
              <Badge className="bg-green-600 text-white">
                <Crown className="w-4 h-4 mr-1" />
                {currentSubscription.plan?.name} Member
              </Badge>
            </div>
          )}
        </div>

        {/* Subscription Details Card */}
        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="font-metal text-2xl mb-2">Your Premium Benefits</h2>
              <p className="text-gray-600">Start enjoying all the premium features right away!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-gothic font-bold text-lg">Priority Support</h3>
                  <p className="text-gray-600">Get faster response times and dedicated support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-gothic font-bold text-lg">Exclusive Features</h3>
                  <p className="text-gray-600">Access to premium tools and early feature releases</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-gothic font-bold text-lg">Enhanced Listings</h3>
                  <p className="text-gray-600">Boost your product visibility with premium placement</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-gothic font-bold text-lg">Analytics & Insights</h3>
                  <p className="text-gray-600">Advanced analytics to grow your business</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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