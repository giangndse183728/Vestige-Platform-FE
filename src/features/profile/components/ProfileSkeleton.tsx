import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const ProfileSkeleton = () => {
  return (
    <div className="p-6 bg-[#f8f7f3] min-h-screen">

      {/* Profile Section Skeleton */}
      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-black p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section Skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="w-100 h-80 border-4 border-black" />
              <div className="mt-4 text-center">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto mt-2" />
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* Profile Information Skeleton */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b border-black pb-2">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-black pb-2">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <div className="border-b border-black pb-2">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section Skeleton */}
        <div className="border-2 border-black p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          
          {/* Rating and Trust Scores Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border border-black p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-12 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="border border-black p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-12 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>

          {/* Transaction Statistics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-black p-4 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto mb-3" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-24 mx-auto mt-1" />
              </div>
            ))}
          </div>

          {/* Sales Performance Skeleton */}
          <div className="border border-black p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex justify-between mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <Separator className="my-6 bg-black" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-8 border-t-2 border-black pt-4 text-center">
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
    </div>
  );
}; 