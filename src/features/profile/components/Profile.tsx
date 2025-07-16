'use client';

import React, { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, User, Edit3, Save, X, Camera } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { profileFormSchema, ProfileFormData } from '../schema';
import { ProfileSkeleton } from './ProfileSkeleton';
import { toast } from 'sonner';
import { useAddresses } from '../hooks/useAddresses';
import { AddressForm } from './AddressForm';
import { AddressList } from './AddressList';
import { AddressFormData, Address } from '../schema';
import { ActivityStats } from './ActivityStats';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import { StripeAccountSection } from '@/features/payment/components/StripeAccountSection';
import Image from 'next/image';
import { TrustTier, Gender, TRUST_TIER_LABELS, TRUST_TIER_DESCRIPTIONS } from '@/constants/enum';
import { TierProgress } from './TierProgress';
import { MembershipStatusCard } from '@/features/membership/components/MembershipStatusCard';
import { useImageUpload } from '@/hooks/useImageUpload';
import { z } from 'zod';

// Helper function to format gender display
const formatGenderDisplay = (gender: string | null | undefined): string => {
  if (!gender) return 'Not provided';
  
  switch (gender) {
    case Gender.MALE:
      return 'Male';
    case Gender.FEMALE:
      return 'Female';
    case Gender.OTHER:
      return 'Other';
    case Gender.PREFER_NOT_TO_SAY:
      return 'Prefer not to say';
    default:
      return gender;
  }
};

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
  const [previewTier, setPreviewTier] = useState<TrustTier | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { user, isLoading, error, updateProfile, isUpdating } = useProfile();
  const {
    addresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isCreating,
    isUpdating: isUpdatingAddresses,
    isDeleting,
    isSettingDefault
  } = useAddresses();

  const { uploadSingleImage, isUploading: isUploadingImage } = useImageUpload({
    folder: 'avatars',
    maxFileSize: 5 * 1024 * 1024 // 5MB
  });

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
      gender: user.gender,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const validatedData = profileFormSchema.parse(editData);
      setFormErrors({});
      await updateProfile(validatedData);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          fieldErrors[field] = err.message;
        });
        setFormErrors(fieldErrors);
        toast.error('Please fix the form errors');
      } else if (error instanceof Error) {
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

  const handleTierPreview = (tier: TrustTier) => {
    setPreviewTier(tier);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadSingleImage(file);
      
      if (result.success && result.url) {
        setEditData(prev => ({
          ...prev,
          profilePictureUrl: result.url
        }));
        toast.success('Profile picture uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

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
        return 'border-3 border-gray-600 shadow-lg';
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
        <Card variant={
          (previewTier || user?.trustTier) === TrustTier.ELITE_SELLER ? 'elite-seller' :
          (previewTier || user?.trustTier) === TrustTier.PRO_SELLER ? 'pro-seller' :
          (previewTier || user?.trustTier) === TrustTier.RISING_SELLER ? 'rising-seller' :
          (previewTier || user?.trustTier) === TrustTier.NEW_SELLER ? 'stamp' :
          'stamp'
        } className='mb-10'>
      <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className={`w-100 h-80 bg-gray-200 ${getProfilePictureBorder(previewTier || user?.trustTier || TrustTier.NEW_SELLER)} flex items-center justify-center relative overflow-hidden`}>
                  {isEditing ? (
                    editData.profilePictureUrl ? (
                      <Image 
                        src={editData.profilePictureUrl} 
                        alt="Profile" 
                        width={400}
                        height={320}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-24 h-24 text-gray-500" />
                    )
                  ) : (
                    user.profilePictureUrl ? (
                      <Image 
                        src={user.profilePictureUrl} 
                        alt="Profile" 
                        width={400}
                        height={320}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-24 h-24 text-gray-500" />
                    )
                  )}

                  {getProfilePictureAccents(previewTier || user?.trustTier || TrustTier.NEW_SELLER)}
                </div>
                {isEditing && (
                  <button 
                    className="absolute bottom-2 right-2 bg-red-900 border-2 border-red-600 p-2 rounded-full hover:bg-red-800 text-white shadow-lg disabled:opacity-50"
                    onClick={handleCameraClick}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                    <Camera className="w-4 h-4" />
                    )}
                  </button>
                )}
                
                {/* Hidden file input for image upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="font-metal text-2xl text-black">{user.firstName} {user.lastName}</h2>
                <p className="font-gothic text-lg text-gray-600">@{user.username}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={user.isVerified ? "default" : "secondary"} 
                         className={user.isVerified ? "bg-green-600 font-metal tracking-wider" : "bg-gray-500 font-metal tracking-wider"}>
                    {user.isVerified ? "VERIFIED" : "PENDING"}
                  </Badge>
                  <Badge className="bg-green-600 text-white font-metal tracking-wider">
                    {user.accountStatus}
                  </Badge>
                </div>
              </div>
              <div className={`
                    relative font-metal text-sm tracking-wider font-bold px-6 py-3 overflow-hidden mt-5
                    ${(previewTier || user.trustTier) === TrustTier.ELITE_SELLER ? 
                      'bg-gradient-to-r from-black via-red-900 to-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                      (previewTier || user.trustTier) === TrustTier.PRO_SELLER ? 
                      'bg-gradient-to-r from-black to-purple-900 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                      (previewTier || user.trustTier) === TrustTier.RISING_SELLER ? 
                      'bg-gradient-to-r from-red-800 to-red-900 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' :
                      'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
                  `}>
                    
                    <div className="relative z-10">
                      {TRUST_TIER_LABELS[(previewTier || user.trustTier) as TrustTier] || TRUST_TIER_LABELS[TrustTier.NEW_SELLER]}
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
                      <p className="font-metal text-lg text-black">{formatGenderDisplay(user.gender)}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Joined Date</Label>
                      <p className="font-metal text-lg text-black">{formatDate(user.joinedDate)}</p>
                    </div>
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Trust Tier</Label>
                      <p className="font-metal text-lg text-black">
                        {TRUST_TIER_DESCRIPTIONS[user.trustTier as TrustTier] || TRUST_TIER_DESCRIPTIONS[TrustTier.NEW_SELLER]}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="border-b border-black pb-2">
                      <Label className="font-gothic text-sm text-gray-600">Bio</Label>
                      <p className="font-serif text-lg text-black">{user.bio || "No bio provided"}</p>
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
                      {formErrors.firstName && <p className="text-xs text-red-600 mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Last Name</Label>
                      <Input 
                        value={editData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="border-black focus:border-black focus:ring-0"
                      />
                      {formErrors.lastName && <p className="text-xs text-red-600 mt-1">{formErrors.lastName}</p>}
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Phone Number</Label>
                      <Input 
                        value={editData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value || null)}
                        className="border-black focus:border-black focus:ring-0"
                        placeholder="+1 (555) 123-4567"
                      />
                      {formErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{formErrors.phoneNumber}</p>}
                    </div>
                    <div>
                      <Label className="font-gothic text-sm text-black">Profile Picture</Label>
                      <div className="flex items-center gap-2">
                      <Input 
                        value={editData.profilePictureUrl || ''}
                        onChange={(e) => handleInputChange('profilePictureUrl', e.target.value || null)}
                        className="border-black focus:border-black focus:ring-0"
                          placeholder="Upload image to set profile picture"
                          disabled
                        />
                        <button 
                          type="button"
                          className="p-2 bg-red-900 border-2 border-red-600 rounded-md hover:bg-red-800 text-white shadow-lg disabled:opacity-50"
                          onClick={handleCameraClick}
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-gothic text-sm text-black">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            size={"sm"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !editData.dateOfBirth && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editData.dateOfBirth ? (
                              format(new Date(editData.dateOfBirth), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={editData.dateOfBirth ? new Date(editData.dateOfBirth) : undefined}
                            onSelect={(date) => handleInputChange('dateOfBirth', date ? date.toISOString().split('T')[0] : null)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {formErrors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{formErrors.dateOfBirth}</p>}
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
                          <SelectItem value={Gender.MALE}>Male</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          <SelectItem value={Gender.OTHER}>Other</SelectItem>
                          <SelectItem value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.gender && <p className="text-xs text-red-600 mt-1">{formErrors.gender}</p>}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="font-gothic text-sm text-black">Bio</Label>
                    <Textarea 
                      value={editData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value || null)}
                      className="border-black focus:border-black focus:ring-0 min-h-24"
                      placeholder="Tell us about yourself..."
                      maxLength={250}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {(editData.bio?.length || 0)}/250 characters
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-10">
          {user && (
          <TierProgress
            currentTier={user.trustTier as TrustTier || TrustTier.NEW_SELLER}
            previewTier={previewTier || (user.trustTier as TrustTier) || TrustTier.NEW_SELLER}
            onTierPreview={handleTierPreview}
          />
        )}
        </div>
          </CardContent>
        </Card>

        <ActivityStats user={user}  />

        <div className="border-2 border-black p-6 mt-10 my-8 bg-black/10">
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

        <MembershipStatusCard className="mt-10" />

        <div className="mt-8 border-t-2 border-black pt-4 text-center">
          <p className="font-gothic text-xs text-gray-500">
            THE PROFILE HERALD • Published by Community Editorial Board • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}; 