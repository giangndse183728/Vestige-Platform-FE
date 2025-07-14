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
import { useState } from "react";

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  currentSubscription?: any;
}

export function MembershipPlanCard({ plan, currentSubscription }: MembershipPlanCardProps) {
  const subscribeToPlan = useSubscribeToPlan();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const formatPrice = (price: number) => {
    return formatVNDPrice(price);
  };

  const getCardVariant = () => {
    switch (plan.requiredTrustTier) {
      case "RISING_SELLER":
        return "rising-seller";
      case "PRO_SELLER":
        return "pro-seller";
      case "ELITE_SELLER":
        return "elite-seller";
      default:
        return "default";
    }
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    subscribeToPlan.mutate(plan.planId);
  };

  const isCurrentPlan = currentSubscription?.plan?.id === plan.planId;
  const isActive = currentSubscription?.status === 'ACTIVE' && isCurrentPlan;

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
            disabled={subscribeToPlan.isPending || isActive}
            className={`w-full font-gothic py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              isActive 
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" 
                : plan.requiredTrustTier === "RISING_SELLER" 
                  ? "bg-red-600 hover:bg-red-700 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
                  : plan.requiredTrustTier === "PRO_SELLER"
                    ? "bg-red-800 hover:bg-red-900 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-red-900 hover:bg-red-950 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            } transition-all duration-300`}
          >
            {subscribeToPlan.isPending 
              ? "SUBSCRIBING..." 
              : isActive 
                ? "CURRENT PLAN" 
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
    </div>
  );
} 