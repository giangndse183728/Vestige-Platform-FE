import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { Order } from '@/features/order/schema';
import { useConfirmPayment } from '@/features/order/hooks/useConfirmPayment';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pktest');

interface StripeCardFormProps {
  order: Order;
  onPaymentSuccess: () => void;
}

export const StripeCardForm: React.FC<StripeCardFormProps> = ({ order, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      toast.error('Card element not found. Please refresh the page.');
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(order.metadata?.clientSecret || '', {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setCardError(error.message || 'Payment failed');
      toast.error(`Payment failed: ${error.message}`);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      confirmPayment({
        orderId: order.orderId,
        stripePaymentIntentId: order.stripePaymentIntentId || '',
        clientSecret: order.metadata?.clientSecret || ''
      }, {
        onSuccess: () => {
          toast.success('Payment confirmed successfully!');
          onPaymentSuccess();
        },
        onError: (error) => {
          toast.error('Payment confirmation failed. Please contact support.');
          console.error('Payment confirmation error:', error);
          onPaymentSuccess(); 
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Card Information</Label>
        <div className="p-4 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  fontFamily: 'system-ui, sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  ':-webkit-autofill': {
                    color: '#424770',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
            onChange={(event) => {
              if (event.error) {
                setCardError(event.error.message);
              } else {
                setCardError('');
              }
            }}
          />
        </div>
        {cardError && (
          <p className="text-sm text-red-600">{cardError}</p>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Test Card Numbers:</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p>• Visa: 4242 4242 4242 4242</p>
          <p>• Mastercard: 5555 5555 5555 4444</p>
          <p>• Any future date for expiry</p>
          <p>• Any 3-digit CVC</p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || isConfirmingPayment || !!cardError}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
      >
        {isProcessing || isConfirmingPayment ? 'Processing Payment...' : 'Pay Now'}
      </Button>
    </form>
  );
}; 