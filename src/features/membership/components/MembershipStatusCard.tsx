'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Calendar, CreditCard, CheckCircle, ExternalLink, DollarSign } from 'lucide-react';
import { useCurrentSubscription } from '../hooks/useMembershipPlans';
import { useConfirmPayment } from '../hooks/useMembershipActions';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { formatVNDPrice } from '@/utils/format';

interface MembershipStatusCardProps {
  className?: string;
}

export function MembershipStatusCard({ className = "" }: MembershipStatusCardProps) {
  const { data: currentSubscription, refetch: refetchSubscription } = useCurrentSubscription();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmPayment();
  const searchParams = useSearchParams();

  // Handle PayOS payment confirmation
  useEffect(() => {
    const code = searchParams.get('code');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');
    const cancel = searchParams.get('cancel');

    // Check if payment was cancelled
    if (cancel === 'true') {
      toast.error('Payment was cancelled');
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
        }
      });
    }
  }, [searchParams, confirmPayment, refetchSubscription]);

  const formatPrice = (price: number) => {
    return formatVNDPrice(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-600';
      case 'expired':
        return 'bg-gray-600';
      case 'pending':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'ACTIVE';
      case 'cancelled':
        return 'CANCELLED';
      case 'expired':
        return 'EXPIRED';
      case 'pending':
        return 'PENDING';
      default:
        return 'UNKNOWN';
    }
  };

  if (isConfirmingPayment) {
    return (
      <div className={`border-2 border-black p-6 bg-black/10 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-metal text-xl text-black mb-2">Confirming Payment</h3>
            <p className="font-gothic text-gray-600">Please wait while we process your subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 border-black p-6 bg-black/10 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-600" />
          <h4 className="font-metal text-2xl font-bold text-black tracking-wider">
            MEMBERSHIP STATUS
          </h4>
          <div className="h-6 w-[1px] bg-black"></div>
          <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
        </div>
        <Link href="/subscription">
          <Button
            variant="outline"
            className="border-2 border-black text-black hover:bg-gray-100 font-gothic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Manage Plans
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {currentSubscription ? (
        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-600" />
                <div>
                  <h5 className="font-metal text-xl text-black">
                    {currentSubscription.plan?.name || 'Premium Member'}
                  </h5>
                  <p className="font-gothic text-gray-600">
                    {currentSubscription.plan?.description || 'Active subscription'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(currentSubscription.status)} text-white font-metal tracking-wider`}>
                  {getStatusText(currentSubscription.status)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-gothic text-sm text-gray-600">
                  Started: {formatDate(currentSubscription.startDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-gothic text-sm text-gray-600">
                  Ends: {formatDate(currentSubscription.endDate)}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-gothic text-sm text-gray-700">
                  Active subscription with premium benefits
                </span>
              </div>
         
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-gray-400" />
          </div>
          <h5 className="font-metal text-xl text-black mb-2">No Active Subscription</h5>
          <p className="font-gothic text-gray-600 mb-6">
            Unlock premium features and elevate your selling experience
          </p>
          
          <Link href="/subscription">
            <Button className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              View Subscription Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 