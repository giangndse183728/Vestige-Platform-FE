import axios from "@/libs/axios";
import { MembershipPlansResponse, membershipPlansResponseSchema, SubscriptionPaymentResponse, subscriptionPaymentResponseSchema, CurrentSubscriptionResponse, currentSubscriptionResponseSchema } from "./schema";

export const membershipService = {
  async getPlans(): Promise<MembershipPlansResponse> {
    const response = await axios.get("/memberships/plans");
    return membershipPlansResponseSchema.parse(response.data);
  },

  async subscribeToPlan(planId: number): Promise<SubscriptionPaymentResponse> {
    const response = await axios.post(`/memberships/subscription/${planId}`);
    return subscriptionPaymentResponseSchema.parse(response.data);
  },

  async confirmPayment(params: {
    code: string;
    status: string;
    orderCode: string;
  }): Promise<any> {
    const response = await axios.post("/payos/confirm-payment", {}, {
      params
    });
    return response.data;
  },

  async cancelSubscription(): Promise<void> {
    await axios.delete("/memberships/cancel");
  },

  async getCurrentSubscription(): Promise<CurrentSubscriptionResponse> {
    const response = await axios.get("/memberships/current");
    return currentSubscriptionResponseSchema.parse(response.data);
  },
}; 