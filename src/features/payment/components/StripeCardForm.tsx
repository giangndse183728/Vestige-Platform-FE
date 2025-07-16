import React from 'react';
import { Button } from '@/components/ui/button';

export const StripeCardForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 text-center">
        <p className="text-lg font-metal text-red-700">Stripe payment is no longer supported.</p>
        <p className="text-gray-600 mt-2">Please use PayOS or another available payment method.</p>
      </div>
      <Button disabled className="w-full bg-gray-400 text-white cursor-not-allowed">
        Pay Now
      </Button>
    </div>
  );
}; 