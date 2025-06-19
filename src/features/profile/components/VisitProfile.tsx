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

interface PublicUserProfileProps {
  userId?: number;
}

export const PublicUserProfile: React.FC<PublicUserProfileProps> = ({ userId }) => {
  const params = useParams();
  const profileId = userId || parseInt(params?.id as string, 10);
  
  const { user, isLoading, error } = usePublicProfile(profileId);

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
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
    <div className="p-6 mt-8 bg-[#f8f7f3]/80 min-h-screen">
  

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <Card variant="stamp" className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image & Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="w-82 h-68 mx-auto bg-gray-200 border-4 border-black flex items-center justify-center mb-4 relative overflow-hidden">
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
                  </div>
                  
                  <h2 className="font-metal text-3xl text-black mb-2">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="font-gothic text-xl text-gray-600 mb-2">@{user.username}</p>
                  
                  <div className="space-x-2 mb-6">
                    <Badge variant={user.isVerified ? "default" : "secondary"} 
                           className={`${user.isVerified ? "bg-green-600" : "bg-gray-500"} text-white`}>
                      {user.isVerified ? "✓ VERIFIED MEMBER" : "PENDING VERIFICATION"}
                    </Badge>
                    <Badge className="bg-blue-600 text-white">
                        {user.accountStatus}
                      </Badge>
                 
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      onClick={handleContactUser}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleShareProfile}
                        variant="outline" 
                        className="flex-1 border-black text-black hover:bg-gray-100"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        onClick={handleReportUser}
                        variant="outline" 
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Stats & Info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Bio Section */}
                
                  {user.bio && (
                    <Card variant='decorated'>
                        <CardContent className='p-10'>
                      <h3 className="font-metal text-xl text-black mb-3 border-b border-black pb-1">
                        ABOUT THIS SELLER
                      </h3>
                      <p className="font-gothic text-gray-700 leading-relaxed">{user.bio}</p>
                      </CardContent>
                      </Card>
                  )}
             

                  {/* Rating & Trust Score */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant='double'>
                        <CardContent className='p-4 '>
                    <div className="border-2 border-black p-4 bg-yellow-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-metal text-lg  text-black">SELLER RATING</h4>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.floor(user.sellerRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : star <= user.sellerRating
                                  ? 'fill-yellow-200 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-metal text-3xl font-bold text-black">
                          {user.sellerRating.toFixed(1)}/5.0
                        </div>
                        <div className="font-gothic text-sm text-gray-600">
                          {user.sellerReviewsCount} reviews
                        </div>
                      </div>
                    </div>
                    </CardContent>
                    </Card>

                    <Card variant='double'>
                    <CardContent className='p-4 '>
                    <div className="border-2 border-black p-4 bg-green-50">
                   
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-metal text-lg text-black">TRUST SCORE</h4>
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-metal text-3xl font-bold text-black">
                          {user.trustScore.toFixed(1)}/5.0
                        </div>
                        <div className="font-gothic text-sm text-gray-600">Community Trust</div>
                      </div>
                    </div>
                    </CardContent>
                    </Card>
                  </div>

                  {/* Activity Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-black p-3 text-center bg-white">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <div className="font-metal text-xl font-bold text-black">
                        {user.successfulTransactions}
                      </div>
                      <div className="font-gothic text-xs text-gray-600">SALES</div>
                    </div>

                    <div className="border border-black p-3 text-center bg-white">
                      <Award className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                      <div className="font-metal text-xl font-bold text-black">
                        {user.totalProductsListed}
                      </div>
                      <div className="font-gothic text-xs text-gray-600">LISTINGS</div>
                    </div>

                    <div className="border border-black p-3 text-center bg-white">
                      <Calendar className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                      <div className="font-metal text-xl font-bold text-black">
                        {user.activeProductsCount}
                      </div>
                      <div className="font-gothic text-xs text-gray-600">ACTIVE</div>
                    </div>

                    <div className="border border-black p-3 text-center bg-white">
                      <Clock className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      <div className="font-metal text-xl  text-black">
                        {getTimeAgo(user.lastLoginAt)}
                      </div>
                      <div className="font-gothic text-xs text-gray-600">LAST SEEN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Sales Performance */}
        <div className="border-2 border-black p-6 bg-black/10">
          <h4 className="font-metal text-2xl text-black mb-6 border-b-2 border-black pb-2">
            SALES PERFORMANCE
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-black p-4 bg-white text-center">
              <div className="font-metal text-2xl font-bold text-green-600 mb-2">
                {((user.soldProductsCount / user.totalProductsListed) * 100).toFixed(1)}%
              </div>
              <div className="font-gothic text-sm text-gray-600">SUCCESS RATE</div>
              <div className="text-xs text-gray-500 mt-1">
                {user.soldProductsCount} of {user.totalProductsListed} items sold
              </div>
            </div>

            <div className="border border-black p-4 bg-white text-center">
              <div className="font-metal text-2xl font-bold text-blue-600 mb-2">
                {user.sellerReviewsCount}
              </div>
              <div className="font-gothic text-sm text-gray-600">TOTAL REVIEWS</div>
              <div className="text-xs text-gray-500 mt-1">
                From verified buyers
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-black" />
          
          <div className="text-center">
            <p className="font-gothic text-sm text-gray-600 italic">
              "Building trust through quality service and authentic connections with our community."
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t-2 border-black pt-4 text-center">
        <p className="font-gothic text-xs text-gray-500">
          THE MEMBER SPOTLIGHT • Community Profiles • All Rights Reserved
        </p>
      </div>
    </div>
  );
};