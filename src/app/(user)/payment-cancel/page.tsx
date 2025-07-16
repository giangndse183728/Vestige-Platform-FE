"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Remove all payment-related params from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("id");
    url.searchParams.delete("cancel");
    url.searchParams.delete("status");
    url.searchParams.delete("orderCode");
    window.history.replaceState({}, '', url.toString());
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="font-metal text-2xl text-black mb-2">Payment Cancelled</h2>
        <p className="font-gothic text-gray-600 mb-4">
          Your payment was cancelled. You can try again anytime.
        </p>
        <Button
          className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          onClick={() => router.push("/marketplace")}
        >
          Back to Marketplace
        </Button>
      </div>
    </div>
  );
} 