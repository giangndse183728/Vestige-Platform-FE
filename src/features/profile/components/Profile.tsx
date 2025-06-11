'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Shield, Calendar, User, TrendingUp, Award, Edit3, Save, X, Camera } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { profileFormSchema, ProfileFormData } from '../schema';
import { ProfileSkeleton } from './ProfileSkeleton';
import { toast } from 'sonner';
import { useAddresses } from '../hooks/useAddresses';
import { AddressForm } from './AddressForm';
import { AddressList } from './AddressList';
import { AddressFormData, Address } from '../schema';
import { MotionDiv } from '@/components/animation/AnimatedWrapper';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    bio: null,
    profilePictureUrl: null
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { user, isLoading, error, updateProfile, isUpdating } = useProfile();
  const {
    addresses,
    isLoading: isLoadingAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isCreating,
    isUpdating: isUpdatingAddresses,
    isDeleting,
    isSettingDefault
  } = useAddresses();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    if (!user) return;
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender as "male" | "female" | "other" | "prefer-not-to-say" | null,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const validatedData = profileFormSchema.parse(editData);
      await updateProfile(validatedData);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string | null) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddingAddress(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleCancelAddress = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  const handleSubmitAddress = async (data: AddressFormData) => {
    if (editingAddress) {
      await updateAddress({ addressId: editingAddress.addressId, data });
    } else {
      await createAddress(data);
    }
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return <div className="p-6 text-center font-gothic text-red-600">Error loading profile: {error.message}</div>;
  }

  if (!user) {
    return <div className="p-6 text-center font-gothic">User data not available.</div>;
  }

  return (
    <div className="p-6 bg-[#f8f7f3]/80 min-h-screen">
      <div className="border-t-4 border-b-4 border-black py-4 mb-6">
        <div className="text-center">
          <h1 className="font-metal text-4xl font-bold text-black tracking-wider">
            THE PROFILE HERALD
          </h1>
          <p className="font-gothic text-sm text-gray-600 mt-1 tracking-widest">
            ESTABLISHED 2025 • MEMBER SPOTLIGHT EDITION
          </p>
          <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-500">
            <span>VOL. 1, NO. 1</span>
            <span>•</span>
            <span>{formatDate(new Date().toISOString())}</span>
            <span>•</span>
          </div>
        </div>
      </div>

     
      <div className="max-w-6xl mx-auto">
        <Card variant='stamp'>
      <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-100 h-80 bg-gray-200 border-3 border-darkred flex items-center justify-center">
                  {isEditing ? (
                    editData.profilePictureUrl ? (
                      <img 
                        src={editData.profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-gray-500" />
                    )
                  ) : (
                    user.profilePictureUrl ? (
                      <img 
                        src={user.profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-gray-500" />
                    )
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white border-2 border-black p-2 rounded-full hover:bg-gray-100">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mt-4 text-center">
                <h2 className="font-metal text-2xl text-black">{user.firstName} {user.lastName}</h2>
                <p className="font-gothic text-lg text-gray-600">@{user.username}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={user.isVerified ? "default" : "secondary"} 
                         className={user.isVerified ? "bg-green-600" : "bg-gray-500"}>
                    {user.isVerified ? "VERIFIED" : "PENDING"}
                  </Badge>
                  <Badge className="bg-green-600 text-white">
                    {user.accountStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-metal text-2xl  text-black border-b-2 border-black pb-1">
                  <span className="text-red-900">PROFILE  </span>
                  INFORMATION
                </h3>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" className="border-black text-black hover:bg-gray-100">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={isUpdating}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="border-black text-black hover:bg-gray-100">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">First Name</Label>
                      <p className="font-metal text-lg text-black">{user.firstName || "Not provided"}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Last Name</Label>
                      <p className="font-metal text-lg text-black">{user.lastName || "Not provided"}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Phone Number</Label>
                      <p className="font-metal text-lg text-black">{user.phoneNumber || "Not provided"}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Email</Label>
                      <p className="font-metal text-lg text-black">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Date of Birth</Label>
                      <p className="font-metal text-lg text-black">{user.dateOfBirth ? formatDate(user.dateOfBirth) : "Not provided"}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Gender</Label>
                      <p className="font-metal text-lg text-black">{user.gender || "Not provided"}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Joined Date</Label>
                      <p className="font-metal text-lg text-black">{formatDate(user.joinedDate)}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Bio</Label>
                      <p className="font-metal text-lg text-black">{user.bio || "No bio provided"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="font-gothic text-sm text-black">First Name</Label>
                      <Input 
                        value={editData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="border-black focus:border-black focus:ring-0"
                      />
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Last Name</Label>
                      <Input 
                        value={editData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="border-black focus:border-black focus:ring-0"
                      />
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Phone Number</Label>
                      <Input 
                        value={editData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value || null)}
                        className="border-black focus:border-black focus:ring-0"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Profile Picture URL</Label>
                      <Input 
                        value={editData.profilePictureUrl || ''}
                        onChange={(e) => handleInputChange('profilePictureUrl', e.target.value || null)}
                        className="border-black focus:border-black focus:ring-0"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-gothic text-sm text-black">Date of Birth</Label>
                      <Input 
                        type="date"
                        value={editData.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value || null)}
                        className="border-black focus:border-black focus:ring-0"
                      />
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Gender</Label>
                      <Select 
                        value={editData.gender || ''} 
                        onValueChange={(value) => handleInputChange('gender', value || null)}
                      >
                        <SelectTrigger className="border-black focus:border-black focus:ring-0">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="font-gothic text-sm text-black">Bio</Label>
                    <Textarea 
                      value={editData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value || null)}
                      className="border-black focus:border-black focus:ring-0 min-h-24"
                      placeholder="Tell us about yourself..."
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {(editData.bio?.length || 0)}/200 characters
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          </CardContent>
        </Card>

        <div className="border-2 border-black p-6 mt-6 my-8 bg-black/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h4 className="font-metal text-2xl font-bold text-black tracking-wider">
                ADDRESSES
              </h4>
              <div className="h-6 w-[1px] bg-black"></div>
              <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
            </div>
            {!isAddingAddress && (
             
                  <Button
                onClick={handleAddAddress}
                variant={'double'}
           
              >
                Add New Address
              </Button>
             
            )}
          </div>

          {isAddingAddress ? (
            <div className="border-2 border-black p-6">
              <h5 className="font-metal text-xl mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h5>
              <AddressForm
                initialData={editingAddress || undefined}
                onSubmit={handleSubmitAddress}
                onCancel={handleCancelAddress}
                isSubmitting={isCreating || isUpdatingAddresses}
              />
            </div>
          ) : (
            <AddressList
              addresses={addresses}
              onEdit={handleEditAddress}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
              isDeleting={isDeleting}
              isSettingDefault={isSettingDefault}
            />
          )}
        </div>

     
        <div className="border-2 border-black p-6">
          <h4 className="font-metal text-2xl font-bold text-black mb-6 border-b-2 border-black pb-2">
            ACTIVITY & STATISTICS
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="border border-black p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-metal text-lg font-bold text-black">SELLER RATING</h5>
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
                <div className="font-metal text-4xl font-bold text-black">{user.sellerRating}/5.0</div>
                <div className="font-gothic text-sm text-gray-600">Based on {user.sellerReviewsCount} reviews</div>
              </div>
             
            </div>

            <div className="border border-black p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-metal text-lg font-bold text-black">TRUST SCORE</h5>
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <div className="font-metal text-3xl font-bold text-black">{user.trustScore}/5.0</div>
                <div className="font-gothic text-sm text-gray-600">Community Trust Level</div>
              </div>
            </div>
          </div>

          {/* Transaction Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border border-black p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-metal text-2xl font-bold text-black">{user.successfulTransactions}</div>
              <div className="font-gothic text-sm text-gray-600 mb-3">SUCCESSFUL TRANSACTIONS</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.min((user.successfulTransactions / 50) * 100, 100).toFixed(0)}% to next milestone
              </div>
            </div>

            <div className="border border-black p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="font-metal text-2xl font-bold text-black">{user.totalProductsListed}</div>
              <div className="font-gothic text-sm text-gray-600 mb-3">TOTAL LISTINGS</div>
      
              <div className="text-xs text-gray-500 mt-1">
                {Math.min((user.totalProductsListed / 100) * 100, 100).toFixed(0)}% to next tier
              </div>
            </div>

            <div className="border border-black p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="font-metal text-2xl font-bold text-black">{user.activeProductsCount}</div>
              <div className="font-gothic text-sm text-gray-600 mb-3">ACTIVE LISTINGS</div>
          
              <div className="text-xs text-gray-500 mt-1">
                {((user.activeProductsCount / user.totalProductsListed) * 100).toFixed(0)}% of total listings
              </div>
            </div>
          </div>

          <div className="border border-black p-4">
            <h5 className="font-metal text-lg font-bold text-black mb-4">SALES PERFORMANCE</h5>
            <div className="flex items-center justify-between mb-2">
              <span className="font-gothic text-sm text-gray-600">Items Sold</span>
              <span className="font-metal text-sm font-bold text-black">{user.soldProductsCount}/{user.totalProductsListed}</span>
            </div>
          
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Success Rate: {((user.soldProductsCount / user.totalProductsListed) * 100).toFixed(1)}%</span>
              <span>Remaining: {user.totalProductsListed - user.soldProductsCount} items</span>
            </div>
          </div>

          <Separator className="my-6 bg-black" />
          <div className="text-sm font-gothic text-black">
            <p>
              <strong>Last Active:</strong> {formatDate(user.lastLoginAt)}
            </p>
            <p className="text-xs text-gray-600 italic mt-2">
              This member maintains an active presence and continues to contribute positively to our community.
            </p>
          </div>
        </div>


     
      </div>

      <div className="mt-8 border-t-2 border-black pt-4 text-center">
        <p className="font-gothic text-xs text-gray-500">
          THE PROFILE HERALD • Published by Community Editorial Board • All Rights Reserved
        </p>
      </div>
    </div>
  );
}; 