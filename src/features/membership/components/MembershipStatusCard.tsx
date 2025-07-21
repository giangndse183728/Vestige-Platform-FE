'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Calendar, CreditCard, CheckCircle, ExternalLink, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMySubscription } from '../hooks/useMembershipPlans';
import { useConfirmPayment } from '../hooks/useMembershipActions';
import { useMembershipPlans } from '../hooks/useMembershipPlans';
import { useSubscribeToPlan } from '../hooks/useMembershipActions';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { formatVNDPrice } from '@/utils/format';

interface MembershipStatusCardProps {
  className?: string;
}

export function MembershipStatusCard({ className = "" }: MembershipStatusCardProps) {
  const { data: mySubscription, refetch: refetchMySubscription, isLoading } = useMySubscription();
  const { data: plans = [] } = useMembershipPlans();
  const subscribeToPlan = useSubscribeToPlan();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmPayment();
  const searchParams = useSearchParams();
  
  // Confirmation dialog states
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('');

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
          refetchMySubscription();
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
  }, [searchParams, confirmPayment, refetchMySubscription]);

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

  const handleExtendClick = (planId: number, planName: string) => {
    setSelectedPlanId(planId);
    setSelectedPlanName(planName);
    setShowExtendDialog(true);
  };

  const handleUpgradeClick = (planId: number, planName: string) => {
    setSelectedPlanId(planId);
    setSelectedPlanName(planName);
    setShowUpgradeDialog(true);
  };

  const handleConfirmExtend = () => {
    if (selectedPlanId) {
      subscribeToPlan.mutate(selectedPlanId);
      setShowExtendDialog(false);
      setSelectedPlanId(null);
      setSelectedPlanName('');
    }
  };

  const handleConfirmUpgrade = () => {
    if (selectedPlanId) {
      subscribeToPlan.mutate(selectedPlanId);
      setShowUpgradeDialog(false);
      setSelectedPlanId(null);
      setSelectedPlanName('');
    }
  };

  const handleCancelDialog = () => {
    setShowExtendDialog(false);
    setShowUpgradeDialog(false);
    setSelectedPlanId(null);
    setSelectedPlanName('');
  };

  if (isLoading) {
    return (
      <div className={`border-2 border-black p-6 bg-black/10 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <Crown className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-metal text-xl text-black mb-2">Loading Subscription</h3>
            <p className="font-gothic text-gray-600">Please wait while we load your subscription status...</p>
          </div>
        </div>
      </div>
    );
  }
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

  const currentSubscription = mySubscription?.activeMembership;

  return (
    <div className={`border-2 border-black p-6 bg-black/10 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          
          <h4 className="font-metal text-2xl font-bold text-black tracking-wider">
            MEMBERSHIP STATUS
          </h4>
          <div className="h-6 w-[1px] bg-black"></div>
          <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
        </div>
     
      </div>

      {currentSubscription ? (
        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
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

      {/* Queued Memberships */}
      {mySubscription?.queuedMemberships && mySubscription.queuedMemberships.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6 md:justify-between w-full">
            <div className="flex items-center gap-4 flex-1">
              <h5 className="font-metal text-lg text-black">Upcoming/Queued Subscriptions</h5>
              {mySubscription.totalBoostsAvailable !== undefined && (
                <Badge className="bg-green-600 text-white font-gothic px-3 py-2 text-base rounded-none">
                  Total Boosts Available: {mySubscription.totalBoostsAvailable}
                </Badge>
              )}
            </div>
            {mySubscription.finalExpirationDate && (
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Calendar className="w-5 h-5 text-gray-700" />
                <span className="font-gothic text-sm text-gray-700">
                  Final Expiration Date:
                  <span className="font-bold ml-1">{formatDate(mySubscription.finalExpirationDate)}</span>
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySubscription.queuedMemberships.map((queued) => (
              <Card key={queued.id} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-6 h-6 text-gray-400" />
                      <div>
                        <h6 className="font-metal text-base text-black">{queued.plan?.name}</h6>
                        <p className="font-gothic text-xs text-gray-600">{queued.plan?.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-black font-metal tracking-wider">QUEUED</Badge>
                  </div>
                  <div className="flex flex-col gap-1 mb-2">
                    <span className="font-gothic text-xs text-gray-600">Start: {formatDate(queued.startDate)}</span>
                    <span className="font-gothic text-xs text-gray-600">End: {formatDate(queued.endDate)}</span>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 border">
                    <span className="font-gothic text-xs text-gray-700">This subscription will activate after your current plan ends.</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade/Extend Button Logic */}
      {(() => {
        if (!plans.length || !currentSubscription?.plan?.id) return null;
        // Sort plans by price (ascending) to determine which is higher
        const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
        const currentPlanIdx = sortedPlans.findIndex(p => p.planId === currentSubscription.plan.id);
        if (currentPlanIdx === -1) return null;
        const isHighestPlan = currentPlanIdx === sortedPlans.length - 1;
        const nextPlan = !isHighestPlan ? sortedPlans[currentPlanIdx + 1] : null;

        if (isHighestPlan) {
          // On highest plan, allow extend/subscribe again
          return (
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => handleExtendClick(currentSubscription.plan.id, currentSubscription.plan?.name || 'Current Plan')}
                disabled={subscribeToPlan.isPending}
              >
                {subscribeToPlan.isPending ? 'Processing...' : 'Extend Current Membership'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          );
        } else {
          // Not on highest plan, allow upgrade
          if (!nextPlan) return null;
          return (
            <div className="mt-4 flex justify-end gap-3">
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => handleUpgradeClick(nextPlan.planId, nextPlan.name)}
                disabled={subscribeToPlan.isPending}
              >
                {subscribeToPlan.isPending ? 'Processing...' : `Upgrade to ${nextPlan.name}`}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => handleExtendClick(currentSubscription.plan.id, currentSubscription.plan?.name || 'Current Plan')}
                disabled={subscribeToPlan.isPending}
              >
                {subscribeToPlan.isPending ? 'Processing...' : 'Extend Current Membership'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          );
        }
      })()}

      {/* Extend Confirmation Dialog */}
      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="font-metal text-xl text-black">
              Confirm Extension
            </DialogTitle>
            <DialogDescription className="font-gothic text-gray-600">
              Are you sure you want to extend your {selectedPlanName} membership? This will process a new payment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCancelDialog}
              className="border-2 border-black text-black hover:bg-gray-100 font-gothic"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmExtend}
              className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              disabled={subscribeToPlan.isPending}
            >
              {subscribeToPlan.isPending ? 'Processing...' : 'Confirm Extension'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="font-metal text-xl text-black">
              Confirm Upgrade
            </DialogTitle>
            <DialogDescription className="font-gothic text-gray-600">
              Are you sure you want to upgrade to {selectedPlanName}? This will process a new payment for the upgraded plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCancelDialog}
              className="border-2 border-black text-black hover:bg-gray-100 font-gothic"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpgrade}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              disabled={subscribeToPlan.isPending}
            >
              {subscribeToPlan.isPending ? 'Processing...' : 'Confirm Upgrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 