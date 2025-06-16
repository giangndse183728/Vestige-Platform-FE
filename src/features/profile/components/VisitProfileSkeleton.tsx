import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const PublicProfileSkeleton = () => {
  return (
    <div className="p-6 bg-[#f8f7f3]/80 min-h-screen">
      {/* Header Skeleton */}
      <div className="border-t-4 border-b-4 border-black py-4 mb-6">
        <div className="text-center">
          <Skeleton className="h-10 w-80 mx-auto mb-2" />
          <Skeleton className="h-4 w-60 mx-auto mb-2" />
          <Skeleton className="h-3 w-40 mx-auto" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Hero Section Skeleton */}
        <Card variant="stamp" className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image & Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <Skeleton className="w-64 h-64 mx-auto mb-4" />
                  <Skeleton className="h-8 w-48 mx-auto mb-2" />
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-6 w-40 mx-auto" />
                    <Skeleton className="h-6 w-32 mx-auto" />
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 flex-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Stats & Info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Bio Section Skeleton */}
                  <div className="border-2 border-black p-4 bg-white/50">
                    <Skeleton className="h-6 w-48 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>

                  {/* Rating & Trust Score Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-black p-4 bg-yellow-50">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-8 w-20 mx-auto mb-1" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>

                    <div className="border-2 border-black p-4 bg-green-50">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-8 w-20 mx-auto mb-1" />
                      <Skeleton className="h-4 w-28 mx-auto" />
                    </div>
                  </div>

                  {/* Activity Stats Skeleton */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="border border-black p-3 text-center bg-white">
                        <Skeleton className="w-6 h-6 mx-auto mb-1" />
                        <Skeleton className="h-6 w-8 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Information Skeleton */}
        <Card variant="stamp" className="mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border-b border-gray-300 pb-2">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border-b border-gray-300 pb-2">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Performance Skeleton */}
        <div className="border-2 border-black p-6 bg-black/10">
          <Skeleton className="h-8 w-48 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-black p-4 bg-white text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-1" />
                <Skeleton className="h-3 w-32 mx-auto" />
              </div>
            ))}
          </div>

          <div className="my-6">
            <Skeleton className="h-px w-full" />
          </div>
          
          <div className="text-center">
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-8 border-t-2 border-black pt-4 text-center">
        <Skeleton className="h-3 w-80 mx-auto" />
      </div>
    </div>
  );
};