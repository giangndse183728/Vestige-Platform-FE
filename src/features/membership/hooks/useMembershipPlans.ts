import { useQuery } from "@tanstack/react-query";
import { membershipService } from "../services";
import { MembershipPlan } from "../schema";

export const useMembershipPlans = () => {
  return useQuery({
    queryKey: ["membership", "plans"],
    queryFn: membershipService.getPlans,
    select: (data) => data.data,
  });
};

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ["membership", "subscription"],
    queryFn: membershipService.getCurrentSubscription,
    select: (data) => data.data,
  });
};

export const useMySubscription = () => {
  return useQuery({
    queryKey: ["membership", "my-subscription"],
    queryFn: membershipService.getMySubscription,
    select: (data) => data.data,
  });
}; 