"use client";

import Link from "next/link";
import { Menu, X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMasthead, setShowMasthead] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show masthead when scrolling up or at top, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY <= 0) {
        setShowMasthead(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setShowMasthead(false);
      }
      
      lastScrollY = currentScrollY;
    };

    const throttledHandleScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  return (
    <motion.nav 
      className="w-full fixed z-50 bg-white/80 backdrop-blur-md border-b-2 border-black"
      initial={false}
    >
      <div className="h-1 w-full bg-[#660000]/80"></div>
      
      {/* Glassmorphism decorative elements */}
      <div className="absolute top-12 left-16 w-32 h-32 bg-[#660000]/10 rounded-full blur-2xl"></div>
      <div className="absolute top-8 right-16 w-24 h-24 bg-black/5 rounded-full blur-xl"></div>
      
      {/* Masthead - Magazine Style Header with Glassmorphism */}
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
              <h1 className="font-metal text-4xl sm:text-5xl tracking-wider uppercase text-center  inline-block relative">
                <span className="text-black">VES</span>
                <span className="text-[#660000]">TIGE</span>
                <span className="absolute -top-2 -right-2 text-[#660000] text-xs">®</span>
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
        {/* Main navbar content */}
        <div className="flex justify-between items-center h-16 border-b border-black/20">
          {/* Black line decoration on left */}
          <div className="hidden md:block w-16 h-[1px] bg-black/60"></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 mx-auto ">
            {[
              { name: "SHOP", path: "/shop" },
              { name: "DESIGNERS", path: "/designers" },
              { name: "COLLECTIONS", path: "/collections" },
              { name: "EDITORIAL", path: "/editorial" },
              { name: "ABOUT", path: "/about" }
            ].map((item, index) => (
              <Link
                key={item.name}
                href={item.path}
                className="group relative px-2 py-1 text-black hover:text-[#660000] transition-colors font-gothic tracking-widest text-xs"
              >
                <span className="relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#660000] group-hover:w-full transition-all duration-300"></span>
                </span>
                {index < 4 && (
                  <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-black/40">/</span>
                )}
              </Link>
            ))}
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-black/80 hover:text-[#660000] ">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-black/80 hover:text-[#660000] ">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 text-black/80 hover:text-[#660000] ">
              <User className="h-5 w-5" />
            </button>
            <button className="p-2 text-black/80 hover:text-[#660000] relative ">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#660000]/90  text-white text-[10px] flex items-center justify-center font-medium shadow-sm">3</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 text-black/80 hover:text-[#660000]"
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
                  { name: "SHOP", path: "/shop" },
                  { name: "DESIGNERS", path: "/designers" },
                  { name: "COLLECTIONS", path: "/collections" },
                  { name: "EDITORIAL", path: "/editorial" },
                  { name: "ABOUT", path: "/about" }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="flex items-center py-3 text-black hover:text-[#660000] border-b border-black/10 font-gothic"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-[#660000]">—</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              {/* User controls */}
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-black/10">
                <Link href="/wishlist" className="flex items-center text-black hover:text-[#660000]">
                  <Heart className="h-5 w-5 mr-2" />
                  <span className="font-gothic">Wishlist</span>
                </Link>
                <Link href="/account" className="flex items-center text-black hover:text-[#660000]">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-gothic">Account</span>
                </Link>
                <Link href="/cart" className="flex items-center text-black hover:text-[#660000]">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  <span className="font-gothic">Cart (3)</span>
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