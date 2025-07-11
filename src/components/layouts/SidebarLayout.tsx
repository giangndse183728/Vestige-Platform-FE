'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  Store, 
  LogOut, 
  Settings,
  Bell,
  Heart,
  Package,
  Star
} from 'lucide-react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const SidebarSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-[#f8f7f3]">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-white border-r-3 border-black fixed h-full overflow-y-auto">
        {/* Header Skeleton */}
        <div className="border-b-2 border-black p-6">
          <div className="text-center">
            <Skeleton className="h-8 w-40 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto mt-2" />
          </div>
        </div>

        {/* User Info Skeleton */}
        <div className="p-6 border-b-2 border-black">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 border-2 border-black" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div className="p-4">
          <nav className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12 border-2 border-gray-300" />
            ))}
          </nav>
        </div>

        {/* Logout Button Skeleton */}
        <div className="p-4 border-t-2 border-black">
          <Skeleton className="w-full h-10 border-2 border-red-600" />
        </div>

        {/* Footer Skeleton */}
        <div className="p-4 border-t border-black">
          <Skeleton className="h-8 w-48 mx-auto" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="ml-80 flex-1 min-h-screen">
        <div className="p-6">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, currentPage = "Profile" }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(currentPage);
  const { user: userData, isLoading, error } = useProfile();
  const { logout, isLoggingOut } = useAuth();

  const navigationItems = [
    {
      id: 'home',
      label: 'Back to Home',
      icon: Home,
      href: '/',
      color: 'text-gray-600 hover:text-black'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      color: 'text-gray-600 hover:text-black'
    },
    {
      id: 'seller-center',
      label: 'Seller Center',
      icon: Store,
      href: '/seller-center',
      color: 'text-gray-600 hover:text-black'
    },
    {
      id: 'my-orders',
      label: 'My Orders',
      icon: Package,
      href: '/my-orders',
      color: 'text-gray-600 hover:text-black'
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      color: 'text-gray-600 hover:text-black'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/notifications',
      color: 'text-gray-600 hover:text-black'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600 hover:text-black'
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    setActiveItem(item.id);
    router.push(item.href);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  if (error || !userData) {
    return <div className="flex min-h-screen bg-[#f8f7f3] items-center justify-center w-full"><span className="font-gothic text-lg text-red-600">Failed to load user info</span></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f3]">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r-3 border-black fixed h-full overflow-y-auto">
        {/* Header */}
        <div className="border-b-2 border-black p-6">
          <div className="text-center">
            <h1 className="font-metal text-2xl font-bold text-black tracking-wider">
              DASHBOARD
            </h1>
            <p className="font-gothic text-xs text-gray-600 mt-1 tracking-widest">
              MEMBER CONTROL CENTER
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b-2 border-black">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 border-2 border-black flex items-center justify-center">
              {userData.profilePictureUrl ? (
                <Image
                  src={userData.profilePictureUrl}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-metal text-lg text-black">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="font-gothic text-sm text-gray-600">@{userData.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={userData.isVerified ? "default" : "secondary"} 
                  className={`text-xs ${userData.isVerified ? "bg-green-600" : "bg-gray-500"}`}
                >
                  {userData.isVerified ? "VERIFIED" : "PENDING"}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="font-gothic text-xs text-gray-600">
                    {userData.sellerRating ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-2 font-gothic text-sm transition-all duration-200 ${
                    isActive 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 hover:border-black hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-black">
          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={isLoggingOut}
            className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-gothic disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <div className="p-4 border-t border-black">
          <p className="font-gothic text-xs text-gray-500 text-center">
            © 2024 Vestige Platform<br />
            All Rights Reserved
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 flex-1">
        <main className="flex-1 relative z-10">
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-fixed opacity-95 pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout; 