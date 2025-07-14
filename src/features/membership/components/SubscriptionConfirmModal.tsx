'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, CreditCard } from 'lucide-react';
import { MembershipPlan } from '../schema';
import { formatVNDPrice } from '@/utils/format';

interface SubscriptionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function SubscriptionConfirmModal({ 
  isOpen, 
  onClose, 
  plan, 
  onConfirm, 
  isLoading = false 
}: SubscriptionConfirmModalProps) {
  if (!plan) return null;

  const formatPrice = (price: number) => {
    return formatVNDPrice(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-600" />
            <div>
              <DialogTitle className="font-metal text-2xl">
                Subscribe to {plan.name}
              </DialogTitle>
              <DialogDescription className="font-gothic text-gray-600 mt-1">
                Confirm your subscription details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Plan Details Card */}
          <Card className="border-2 border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-metal text-xl text-black">{plan.name}</h3>
                  <p className="font-gothic text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-metal text-3xl text-black">{formatPrice(plan.price)}</div>
                  <div className="font-gothic text-sm text-gray-600">/month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Note */}
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 mb-6">
            <div className="flex items-start gap-2">
              <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-metal text-sm text-black mb-1">Payment Information</h5>
                <p className="font-gothic text-xs text-gray-700">
                  You'll be redirected to PayOS for secure payment processing. 
                  Your subscription will be activated immediately after successful payment.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-black text-black hover:bg-gray-100 font-gothic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 