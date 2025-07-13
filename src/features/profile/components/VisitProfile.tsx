'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Shield, 
  Calendar, 
  User, 
  TrendingUp, 
  Award, 
  MessageSquare,
  Flag,
  Share2,
  Clock
} from 'lucide-react';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { PublicProfileSkeleton } from './VisitProfileSkeleton';
import { ActivityStats } from './ActivityStats';
import { TrustTier, TRUST_TIER_LABELS } from '@/constants/enum';

interface PublicUserProfileProps {
  userId?: number;
}

export const PublicUserProfile: React.FC<PublicUserProfileProps> = ({ userId }) => {
  const params = useParams();
  const profileId = userId || parseInt(params?.id as string, 10);
  
  const { user, isLoading, error } = usePublicProfile(profileId);

  const getProfilePictureBorder = (tier: TrustTier | string) => {
    switch (tier) {
      case TrustTier.NEW_SELLER:
        return 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] bg-gradient-to-br from-gray-200 to-white p-2';
      case TrustTier.RISING_SELLER:
        return 'border-6 border-black shadow-[12px_12px_0px_0px_rgba(220,38,38,0.4)] bg-gradient-to-br from-red-100 to-yellow-100 p-2';
      case TrustTier.PRO_SELLER:
        return 'border-8 border-black shadow-[12px_12px_0px_0px_rgba(126,34,206,0.5)] bg-gradient-to-br from-purple-100 to-gray-100 p-3';
      case TrustTier.ELITE_SELLER:
        return 'border-8 border-black shadow-[12px_12px_0px_0px_rgba(220,38,38,0.6)] bg-gradient-to-br from-yellow-200 via-red-100 to-black p-3';
      default:
        return 'border-4 border-black shadow-lg';
    }
  };

  const getProfilePictureAccents = (tier: TrustTier | string) => {
    switch (tier) {
      case TrustTier.NEW_SELLER:
        return (
          <>
            <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          </>
        );
      case TrustTier.RISING_SELLER:
        return (
          <>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-600 via-yellow-500 to-red-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-600 via-yellow-500 to-red-600"></div>
          </>
        );
      case TrustTier.PRO_SELLER:
        return (
          <>
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 via-black to-purple-600"></div>
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 via-black to-purple-600"></div>
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-purple-600 via-black to-purple-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-purple-600 via-black to-purple-600"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-dashed border-purple-400/50"></div>
          </>
        );
      case TrustTier.ELITE_SELLER:
        return (
          <>
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-400 via-red-600 via-black to-yellow-400"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-400 via-red-600 via-black to-yellow-400"></div>
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-b from-yellow-400 via-red-600 via-black to-yellow-400"></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-b from-yellow-400 via-red-600 via-black to-yellow-400"></div>
            <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-dashed border-yellow-500/60"></div>
          </>
        );
      default:
        return null;
    }
  };

  const handleContactUser = () => {
    // Navigate to messaging or contact form
    console.log('Contact user:', profileId);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  const handleReportUser = () => {
    // Open report modal
    console.log('Report user:', profileId);
  };

  if (isLoading) {
    return <PublicProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 bg-[#f8f7f3]/80 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-metal text-3xl text-red-600 mb-4">USER NOT FOUND</h1>
          <p className="font-gothic text-lg text-gray-600">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center font-gothic">User data not available.</div>
  }

  return (  
    <div className="p-2 sm:p-4 lg:p-6 mt-4 sm:mt-6 lg:mt-8 bg-[#f8f7f3]/80 min-h-screen">
  

      <div className="max-w-8xl mx-auto">
        {/* Hero Section */}
        <Card variant={
          user?.trustTier === TrustTier.ELITE_SELLER ? 'elite-seller' :
          user?.trustTier === TrustTier.PRO_SELLER ? 'pro-seller' :
          user?.trustTier === TrustTier.RISING_SELLER ? 'rising-seller' :
          user?.trustTier === TrustTier.NEW_SELLER ? 'stamp' :
          'stamp'
        } className="mb-4 sm:mb-6 lg:mb-8">
          <CardContent className="p-2 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Profile Image & Basic Info */}
              <div className="lg:col-span-4">
                <div className="text-center">
                    <div className="relative">
                      <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-100 lg:h-100 mx-auto bg-gray-200 ${getProfilePictureBorder(user?.trustTier || TrustTier.NEW_SELLER)} flex items-center justify-center mb-4 relative overflow-hidden`}>

                        {user.profilePictureUrl ? (
                          <Image 
                            src={user.profilePictureUrl} 
                            alt={`${user.firstName} ${user.lastName}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        ) : (
                          <User className="w-32 h-32 text-gray-500" />
                        )}

                        {/* Trust tier accents */}
                        {getProfilePictureAccents(user?.trustTier || TrustTier.NEW_SELLER)}
                      </div>
                    </div>
                  
                  <h2 className="font-metal text-xl sm:text-2xl lg:text-3xl text-black mb-2 mt-4 lg:mt-6">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="font-gothic text-lg sm:text-xl text-gray-600 mb-2">@{user.username}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant={user.isVerified ? "default" : "secondary"} 
                           className={`${user.isVerified ? "bg-green-600" : "bg-gray-500"} text-white font-metal tracking-wider`}>
                      {user.isVerified ? "✓ VERIFIED" : "PENDING"}
                    </Badge>
                    <Badge className="bg-blue-600 text-white font-metal tracking-wider">
                      {user.accountStatus}
                    </Badge>
                  </div>
                  

                  {/* Action Buttons */}
                  <div className="space-y-2 px-2 sm:px-0">
                    <Button 
                      onClick={handleContactUser}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleShareProfile}
                        variant="outline" 
                        className="flex-1 border-black text-black hover:bg-gray-100 text-xs sm:text-sm"
                      >
                        <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Share</span>
                        <span className="sm:hidden">Share</span>
                      </Button>
                      <Button 
                        onClick={handleReportUser}
                        variant="outline" 
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50 text-xs sm:text-sm"
                      >
                        <Flag className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Report</span>
                        <span className="sm:hidden">Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
                {user.bio && (
                    <Card variant='decorated' className='mt-3 sm:mt-5'>
                        <CardContent className='p-4 sm:p-6 lg:p-10'>
                      <h3 className="font-metal text-lg sm:text-xl text-black mb-2 sm:mb-3 border-b border-black pb-1">
                        ABOUT THIS SELLER
                      </h3>
                      <p className="font-gothic text-sm sm:text-base text-gray-700 leading-relaxed">{user.bio}</p>
                      </CardContent>
                      </Card>
                  )}
              </div>

              {/* Performance Metrics & Activity Stats */}
              <div className="lg:col-span-8 mt-6 lg:mt-0">
                <ActivityStats user={user} />
                <div className={`
                    relative font-metal text-xs sm:text-sm tracking-wider font-bold px-3 sm:px-6 py-2 sm:py-3 overflow-hidden mt-3 sm:mt-5 text-center
                    ${user.trustTier === TrustTier.ELITE_SELLER ? 
                      'bg-gradient-to-r from-black via-red-900 to-black text-white border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                      user.trustTier === TrustTier.PRO_SELLER ? 
                      'bg-gradient-to-r from-black to-purple-900 text-white border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                      user.trustTier === TrustTier.RISING_SELLER ? 
                      'bg-gradient-to-r from-red-800 to-red-900 text-white border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                      'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
                  `}>
                    
                    <div className="relative z-10">
                      {TRUST_TIER_LABELS[user.trustTier as TrustTier] || TRUST_TIER_LABELS[TrustTier.NEW_SELLER]}
                    </div>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>



      </div>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 border-t-2 border-black pt-3 sm:pt-4 text-center">
        <p className="font-gothic text-xs sm:text-sm text-gray-500 px-2">
          THE MEMBER SPOTLIGHT • Community Profiles • All Rights Reserved
        </p>
      </div>
    </div>
  );
};