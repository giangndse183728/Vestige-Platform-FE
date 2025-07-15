import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipService } from "../services";
import { toast } from "sonner";

export const useSubscribeToPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: membershipService.subscribeToPlan,
    onSuccess: (data) => {
      toast.success("Redirecting to payment...");
      
      const paymentUrl = new URL(data.data);
      paymentUrl.searchParams.append('returnUrl', `${window.location.origin}/payment-success`);
      
      window.location.href = paymentUrl.toString();
      queryClient.invalidateQueries({ queryKey: ["membership", "subscription"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to subscribe to plan");
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: membershipService.cancelSubscription,
    onSuccess: () => {
      toast.success("Successfully canceled subscription!");
      queryClient.invalidateQueries({ queryKey: ["membership", "subscription"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel subscription");
    },
  });
}; 

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: membershipService.confirmPayment,
    onSuccess: () => {
      toast.success("Payment confirmed successfully!");
      queryClient.invalidateQueries({ queryKey: ["membership", "subscription"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Payment confirmation failed");
    },
  });
}; 