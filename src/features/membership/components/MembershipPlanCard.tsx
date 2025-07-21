'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { MembershipPlan } from "../schema";
import { useSubscribeToPlan } from "../hooks/useMembershipActions";
import { formatVNDPrice } from "@/utils/format";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginModal } from "@/components/ui/login-modal";
import { useEffect, useState } from "react";
import { useCurrentSubscription } from "../hooks/useMembershipPlans";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MembershipPlanCardProps {
  plan: MembershipPlan;
}

export function MembershipPlanCard({ plan }: MembershipPlanCardProps) {
  const subscribeToPlan = useSubscribeToPlan();
  const { isAuthenticated } = useAuth();
  const { data: currentSubscription } = isAuthenticated ? useCurrentSubscription() : { data: null };
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showActiveSubscriptionDialog, setShowActiveSubscriptionDialog] = useState(false);
  
  const formatPrice = (price: number) => {
    return formatVNDPrice(price);
  };

  const getCardVariant = () => {
    switch (plan.requiredTrustTier) {
      case "RISING_SELLER":
        return "rising-seller";
      case "PRO_SELLER":
        return "pro-seller";
      case "NEW_SELLER":
        return "new-seller";
      default:
        return "default";
    }
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    // If user has active subscription, show dialog instead of redirecting
    if (currentSubscription?.status === 'ACTIVE') {
      setShowActiveSubscriptionDialog(true);
      return;
    }
    // Show confirmation dialog instead of immediate subscription
    setShowConfirmDialog(true);
  };

  const handleConfirmSubscription = () => {
    subscribeToPlan.mutate(plan.planId);
    setShowConfirmDialog(false);
  };

  const handleCancelSubscription = () => {
    setShowConfirmDialog(false);
  };

  const handleGoToProfile = () => {
    setShowActiveSubscriptionDialog(false);
    router.push('/profile');
  };

  const handleCloseActiveSubscriptionDialog = () => {
    setShowActiveSubscriptionDialog(false);
  };

  // Hide Basic plan
  if (plan.name.toLowerCase() === 'basic') return null;

  return (
    <div className="relative">   
      <Card variant={getCardVariant()} className="">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <div className="text-4xl font-metal mb-2">
              {formatPrice(plan.price)}
              <span className="text-base font-gothic">/month</span>
            </div>
            <h3 className="text-2xl font-metal mb-2">{plan.name.toUpperCase()}</h3>
            <p className="font-gothic text-sm opacity-90 mb-4">{plan.description}</p>
            <Badge variant="outline" className="bg-white/20 text-black border-black/30">
              {plan.requiredTrustTier.replace("_", " ")}
            </Badge>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 py-3 border-b border-black/10">
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="font-serif">{plan.boostsPerMonth} boosts per month</span>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-black/10">
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="font-serif">{(plan.feeTier.feePercentage * 100).toFixed(1)}% platform fee</span>
            </div>
          
          </div>
          
          <Button 
            onClick={handleSubscribe}
            disabled={subscribeToPlan.isPending}
            className={`w-full font-gothic py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              plan.requiredTrustTier === "RISING_SELLER" 
                ? "bg-red-600 hover:bg-red-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                : plan.requiredTrustTier === "PRO_SELLER"
                  ? "bg-red-800 hover:bg-red-900 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  : plan.requiredTrustTier === "NEW_SELLER"
                    ? "bg-gray-200 text-black hover:bg-gray-300 "
                  : "bg-red-900 hover:bg-red-950"
            } transition-all duration-300`}
          >
            {subscribeToPlan.isPending 
              ? "SUBSCRIBING..." 
              : `SUBSCRIBE TO ${plan.name.toUpperCase()}`
            }
          </Button>
        </CardContent>
      </Card>

      <LoginModal 
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="Login Required"
        description={`You need to be logged in to subscribe to the ${plan.name} membership plan. Please login or create an account to continue.`}
      />

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="font-metal text-xl text-black">
              Confirm Subscription
            </DialogTitle>
            <DialogDescription className="font-gothic text-gray-600">
              Are you sure you want to subscribe to the {plan.name} plan for {formatPrice(plan.price)}/month? This will process a payment immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              className="border-2 border-black text-black hover:bg-gray-100 font-gothic"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              disabled={subscribeToPlan.isPending}
            >
              {subscribeToPlan.isPending ? 'Processing...' : 'Confirm Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showActiveSubscriptionDialog} onOpenChange={setShowActiveSubscriptionDialog}>
        <DialogContent className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle className="font-metal text-xl text-black">
              Active Subscription Found
            </DialogTitle>
            <DialogDescription className="font-gothic text-gray-600">
              You already have an active subscription to the {currentSubscription?.plan?.name || 'Premium'} plan. 
              Visit your profile to manage your subscription, upgrade, or extend your membership.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleCloseActiveSubscriptionDialog}
              className="border-2 border-black text-black hover:bg-gray-100 font-gothic"
            >
              Stay Here
            </Button>
            <Button
              onClick={handleGoToProfile}
              className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Go to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}   