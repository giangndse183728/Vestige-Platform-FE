'use client';

import { MembershipPlanCard } from "./MembershipPlanCard";
import { useMembershipPlans } from "../hooks/useMembershipPlans";
import { Skeleton } from "@/components/ui/skeleton";


export function MembershipPlans() {
  const { data: plans, isLoading, error } = useMembershipPlans();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
                      <div className="mb-16">
            <div className="bg-red-900 text-white p-4 text-center mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="font-metal text-3xl tracking-wider flex items-center justify-center space-x-4">
                <div className="w-8 h-1 bg-white"></div>
                <span>MEMBERSHIP PLANS</span>
                <div className="w-8 h-1 bg-white"></div>
              </h1>
            </div>    
              <div className="text-center">
                <p className="text-gray-700 font-gothic font-bold uppercase tracking-wider">
                  Elevate your selling experience with our premium membership plans designed for fashion professionals
                </p>
              </div>
           
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[...Array(3)].map((_, i) => (
              <div key={i} className="border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Skeleton className="h-12 w-12 mx-auto mb-4" />
                  <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-12 w-full mb-8" />
                  <div className="space-y-4">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="bg-red-900 text-white p-4 text-center mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="font-metal text-3xl tracking-wider flex items-center justify-center space-x-4">
                  <div className="w-8 h-1 bg-white"></div>
                  <span>MEMBERSHIP PLANS</span>
                  <div className="w-8 h-1 bg-white"></div>
                </h1>
              </div>
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto text-center">
                <p className="font-gothic text-red-600 text-lg font-bold">
                  Failed to load membership plans. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <div className="bg-red-900 text-white p-4 text-center mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="font-metal text-3xl tracking-wider flex items-center justify-center space-x-4">
                  <div className="w-8 h-1 bg-white"></div>
                  <span>MEMBERSHIP PLANS</span>
                  <div className="w-8 h-1 bg-white"></div>
                </h1>
              </div>
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto text-center">
                <p className="font-gothic text-gray-600 text-lg font-bold">
                  No membership plans available at the moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

 
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 mt-5">
        <div className="max-w-8xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="bg-red-900 text-white p-4 text-center mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="font-metal text-3xl tracking-wider flex items-center justify-center space-x-4">
                <div className="w-8 h-1 bg-white"></div>
                <span>MEMBERSHIP PLANS</span>
                <div className="w-8 h-1 bg-white"></div>
              </h1>
            </div>
            
              <div className="text-center">
                <p className="text-gray-700 font-gothic font-bold uppercase tracking-wider">
                  Elevate your selling experience with our premium membership plans designed for fashion professionals
                </p>
              </div>
            
          </div>

          {/* Membership Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-8xl mx-auto">
            {sortedPlans.map((plan) => (
              <MembershipPlanCard 
                key={plan.planId} 
                plan={plan} 
              />
            ))}
          </div>

       
        </div>
      </div>
    </div>
  );
} 