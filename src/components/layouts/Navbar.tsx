"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Heart, User, ShoppingBag, LogOut, UserCircle, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCartStore } from "@/features/cart/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMasthead, setShowMasthead] = useState(true);
  const { isAuthenticated, logout, isLoading, user } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setShowMasthead(isHomePage && window.scrollY === 0);
  }, [pathname, isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowMasthead(isHomePage && currentScrollY === 0);
    };

    const throttledHandleScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [isHomePage]);

  const renderAuthUI = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className="w-8 h-8" />
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-black/80 hover:text-red-900">
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent variant="double" align="end" className="w-64">
            {/* User Info Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-black/10 mb-2">
              <div className="w-12 h-12 overflow-hidden border-2 border-black bg-gray-200 flex items-center justify-center">
                {user?.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="font-metal text-base text-black truncate">{user?.username}</div>
                <div className="text-xs text-gray-600 font-gothic break-all truncate">{user?.email}</div>
              </div>
            </div>
            {/* Profile Tab */}
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer font-gothic font-semibold text-black">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {/* My Orders Tab */}
            <DropdownMenuItem asChild>
              <Link href="/my-orders" className="flex items-center cursor-pointer font-gothic text-black">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            {/* Seller Center Tab */}
            <DropdownMenuItem asChild>
              <Link href="/seller-center" className="flex items-center cursor-pointer font-gothic text-black">
                <Store className="mr-2 h-4 w-4" />
                <span>Seller Center</span>
              </Link>
            </DropdownMenuItem>
            {/* Logout */}
            <DropdownMenuItem 
              onClick={() => logout()}
              className="flex items-center cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link 
        href="/login" 
        className="px-3 py-1 border border-black text-black text-xs font-metal hover:bg-black hover:text-white transition-colors"
      >
        LOGIN
      </Link>
    );
  };

  const renderMobileAuthUI = () => {
    if (isLoading) {
      return (
        <div className="flex items-center">
          <Skeleton className="w-20 h-6" />
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-black hover:text-red-900">
              <User className="h-5 w-5 mr-2" />
              <span className="font-gothic">Account</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* Profile Tab */}
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer font-gothic font-semibold text-black">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {/* My Orders Tab */}
            <DropdownMenuItem asChild>
              <Link href="/my-orders" className="flex items-center cursor-pointer font-gothic text-black">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            {/* Seller Center Tab */}
            <DropdownMenuItem asChild>
              <Link href="/seller-center" className="flex items-center cursor-pointer font-gothic text-black">
                <Store className="mr-2 h-4 w-4" />
                <span>Seller Center</span>
              </Link>
            </DropdownMenuItem>
            {/* Logout */}
            <DropdownMenuItem 
              onClick={() => logout()}
              className="flex items-center cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link 
        href="/login" 
        className="px-3 py-1.5 text-black/80 hover:text-red-900 font-gothic tracking-widest text-xs border border-black/20 hover:border-red-900/50 transition-colors"
      >
        LOGIN
      </Link>
    );
  };

  return (
    <motion.nav 
      className="w-full fixed z-50 bg-white/80 backdrop-blur-md border-b-2 border-black"
      initial={false}
    >
      <div className="h-1 w-full bg-red-900/80"></div>
    
      <div className="absolute top-12 left-16 w-32 h-32 bg-red-900/10 rounded-full blur-2xl"></div>
      <div className="absolute top-8 right-16 w-24 h-24 bg-black/5 rounded-full blur-xl"></div>
      
      <motion.div
        className="overflow-hidden"
        animate={{ 
          height: showMasthead ? "auto" : 0,
          opacity: showMasthead ? 1 : 0,
          marginBottom: showMasthead ? 0 : 0
        }} 
        transition={{
          height: {
            duration: 0.35,
            ease: [0.1, 0.9, 0.2, 1]
          },
          opacity: { 
            duration: showMasthead ? 0.3 : 0.15
          }
        }}
      >
        <div className="container mx-auto py-6 px-50 border-b border-black/40 relative">
          <div className="flex items-center justify-between text-center relative z-10">
            <p className="text-xs uppercase tracking-widest mb-3 font-gothic">Beyond The Trends</p>

            {/* Centered Title */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 group">
              <h1 className="font-metal text-4xl sm:text-5xl tracking-wider uppercase text-center inline-block relative">
                <span className="text-black">VES</span>
                <span className="text-red-900">TIGE</span>
                <span className="absolute -top-2 -right-2 text-red-900 text-xs">®</span>
              </h1>
            </Link>

            <p className="text-xs uppercase tracking-widest mt-3 font-serif italic">EST. MMXV - 2025</p>
          </div>
        </div>
      </motion.div>

      {/* Main navbar content */}
      <motion.div 
        className="container mx-auto px-4 lg:px-6 relative z-10"
        animate={{ 
          y: showMasthead ? 0 : 5,
          transition: {
            duration: 0.35,
            ease: [0.1, 0.9, 0.2, 1]
          }
        }}
      >
        <div className="flex justify-between items-center h-16 border-b border-black/20">
          {/* Black line decoration and brand name */}
          <div className="hidden md:flex items-center">
            <div className="w-16 h-[1px] bg-black/60"></div>
            <motion.div
              className="ml-4"
              animate={{
                opacity: showMasthead ? 0 : 1,
                x: showMasthead ? -20 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.1, 0.9, 0.2, 1]
              }}
            >
              <Link href="/" className="group">
                <h1 className="font-metal text-xl tracking-wider uppercase inline-block relative">
                  <span className="text-black">VES</span>
                  <span className="text-red-900">TIGE</span>
                  <span className="absolute -top-1 -right-1 text-red-900 text-[8px]">®</span>
                </h1>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 mx-auto">
            {[
              { name: "MARKETPLACE", path: ROUTES.MARKETPLACE},
              { name: "DESIGNERS", path: ROUTES.DESIGNERS },
              { name: "CATEGORY", path: ROUTES.CATEGORIES },
              { name: "EDITORIAL", path: ROUTES.EDITORIAL },
              { name: "SUBSCRIPTION", path: ROUTES.SUBSCRIPTION }
            ].map((item, index) => (
              <Link
                key={item.name}
                href={item.path}
                className="group relative px-2 py-1 text-black hover:text-red-900 transition-colors font-gothic tracking-widest text-xs"
              >
                <span className="relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-900 group-hover:w-full transition-all duration-300"></span>
                </span>
                {index < 4 && (
                  <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-black/40">/</span>
                )}
              </Link>
            ))}
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <>
              <button className="p-2 text-black/80 hover:text-red-900">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/wishlist" className=" text-black/80 hover:text-red-900 relative">
              <button className="p-2 text-black/80 hover:text-red-900">
                <Heart className="h-5 w-5" />
              </button>
              </Link>
              <div className="p-2 text-black/80 hover:text-red-900 relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-900/90 text-white text-[10px] flex items-center justify-center font-medium shadow-sm">
                  {totalItems || 0}
                </span>
                </div>
              {renderAuthUI()}
            </>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 text-black/80 hover:text-red-900"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Navigation with Glassmorphism */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-md border-t border-black/10 shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-black/60" />
                </div>
                <input
                  type="search"
                  placeholder="Search products, designers..."
                  className="py-2 pl-10 pr-4 w-full bg-black/5 backdrop-blur-sm border border-black/20 text-black placeholder-black/60 focus:outline-none focus:border-black/40 rounded-none"
                />
              </div>
              
              {/* Mobile menu items */}
              <div className="space-y-0">
                {[
                  { name: "MARKETPLACE", path: ROUTES.MARKETPLACE },
                  { name: "DESIGNERS", path: ROUTES.DESIGNERS },
                  { name: "CATEGORY", path: ROUTES.CATEGORIES },
                  { name: "EDITORIAL", path: ROUTES.EDITORIAL },
                  { name: "SUBSCRIPTION", path: ROUTES.SUBSCRIPTION }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="flex items-center py-3 text-black hover:text-red-900 border-b border-black/10 font-gothic"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-red-900">—</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              {/* User controls */}
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-black/10">
                <Link href="/wishlist" className="flex items-center text-black hover:text-red-900">
                  <Heart className="h-5 w-5 mr-2" />
                  <span className="font-gothic">Wishlist</span>
                </Link>
                {renderMobileAuthUI()}
                <Link href="/cart" className="flex items-center text-black hover:text-red-900">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  <span className="font-gothic">Cart {totalItems > 0 && `(${totalItems})`}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;