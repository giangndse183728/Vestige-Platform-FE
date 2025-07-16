import { useMutation } from '@tanstack/react-query';
import { confirmPayment } from '../services';

interface ConfirmPaymentData {
  code: string;
  status: string;
  orderCode: string;
}

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: (data: ConfirmPaymentData) => confirmPayment(data),
    onError: (error) => {
      console.error('Error confirming payment:', error);
    },
  });
}; 