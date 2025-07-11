"use client";

import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Instagram, Facebook, ShoppingBag, UserPlus } from "lucide-react";

function About() {
  const router = useRouter();

  const handleJoinRevolution = () => {
    router.push('/login');
  };

  const handleExploreMarketplace = () => {
    router.push('/marketplace');
  };

  return (
    <div className="mx-auto my-8 max-w-8xl px-6 bg-white/80">
      {/* Newspaper Header */}
      <div className="border-t-3 border-b-1 border-black mb-8">
        <div className="text-center py-6 border-b-1 border-black">
          <h1 className="text-6xl font-metal tracking-wider text-red-900 mb-2">BEHIND THE SCENES</h1>
          <div className="flex justify-center items-center gap-8 text-sm font-gothic">
            <span>EST. 2024</span>
            <span className="border-l border-r border-black px-4">FASHION • STREETWEAR • COMMUNITY</span>
            <span>GENERATION Z EDITION</span>
          </div>
        </div>
      </div>

      {/* Main Article Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Story */}
        <div className="lg:col-span-2 border-r border-black pr-8">
          <div className="mb-6">
            <h2 className="text-4xl font-metal leading-tight text-black-800 mb-2">
              Inside Vestige - The Gen Z Fashion Revolution
            </h2>
            <div className="flex items-center gap-4 text-sm font-gothic text-gray-600 mb-4 border-b border-black pb-2">
              <span>By Fashion Desk</span>
              <span>•</span>
              <span>Special Report</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <img 
                className="w-full border-2 border-black mb-3" 
                src="/team.jpg" 
                alt="Vestige Fashion Platform" 
              />
              <p className="text-xs font-gothic text-gray-500 italic text-center">
                The new marketplace for Gen Z fashion enthusiasts
              </p>
            </div>
            <div className="font-gothic text-sm leading-relaxed">
              <p className="mb-4 drop-cap">
                <span className="float-left text-6xl font-metal leading-none pr-2 pt-1 text-red-800">V</span>
                estige has emerged as the revolutionary fashion marketplace capturing Generation Z's attention. This community-driven platform transforms how young consumers buy, sell, and discover premium streetwear.
              </p>
              <p className="mb-4">
                From Rick Owens to Balenciaga, Vestige connects fashion enthusiasts seeking authenticity. With 50,000+ active users and 25,000+ listings, it's proven that fashion is a cultural movement.
              </p>
            </div>
          </div>

          {/* Article Content */}
          <div className="font-gothic text-sm leading-relaxed mb-8">
            <p className="mb-4">
              The platform specializes in authenticated luxury brands and rare pieces, sourced directly from fashion enthusiasts. Beyond transactions, Vestige serves as a cultural hub for style inspiration and trend forecasting.
            </p>
          </div>

          {/* Key Features Section - Redesigned */}
          <div className="border-2 border-black bg-gradient-to-br from-red-50 via-white to-red-50 p-8 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-metal text-red-800 mb-2">PLATFORM HIGHLIGHTS</h3>
              <div className="w-24 h-1 bg-red-800 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <div className="border-2 border-black bg-white p-6 h-full hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-800 border-2 border-black flex items-center justify-center mr-4">
                      <span className="text-white font-metal text-xl">✓</span>
                    </div>
                    <h4 className="font-metal text-lg text-black">AUTHENTICATED LUXURY</h4>
                  </div>
                  <p className="font-gothic text-sm text-gray-700 leading-relaxed">
                    Every piece is verified by our expert team. From Balenciaga to Rick Owens, we guarantee authenticity.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="border-2 border-black bg-white p-6 h-full hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-800 border-2 border-black flex items-center justify-center mr-4">
                      <span className="text-white font-metal text-xl">🔒</span>
                    </div>
                    <h4 className="font-metal text-lg text-black">SECURE TRANSACTIONS</h4>
                  </div>
                  <p className="font-gothic text-sm text-gray-700 leading-relaxed">
                    Advanced payment protection and escrow services ensure safe buying and selling for all users.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="border-2 border-black bg-white p-6 h-full hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-800 border-2 border-black flex items-center justify-center mr-4">
                      <span className="text-white font-metal text-xl">👥</span>
                    </div>
                    <h4 className="font-metal text-lg text-black">COMMUNITY DRIVEN</h4>
                  </div>
                  <p className="font-gothic text-sm text-gray-700 leading-relaxed">
                    Connect with fashion enthusiasts, share style inspiration, and discover emerging trends.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="border-2 border-black bg-white p-6 h-full hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,0.2)] transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-800 border-2 border-black flex items-center justify-center mr-4">
                      <span className="text-white font-metal text-xl">💎</span>
                    </div>
                    <h4 className="font-metal text-lg text-black">CURATED COLLECTIONS</h4>
                  </div>
                  <p className="font-gothic text-sm text-gray-700 leading-relaxed">
                    Discover rare pieces and limited editions curated by fashion experts and style influencers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sticky top-20 self-start space-y-8">
          {/* Quick Stats Box */}
          <Card variant="decorated">
          <div className=" p-10">
            <h3 className="text-xl font-metal text-red-800 mb-3 text-center border-b border-black pb-2">
              VESTIGE STATS
            </h3>
            <div className="space-y-3 font-gothic text-sm">
              <div className="flex justify-between border-b border-black pb-1">
                <span>Active Users:</span>
                <span className="font-bold text-red-800">50K+</span>
              </div>
              <div className="flex justify-between border-b border-black pb-1">
                <span>Items Listed:</span>
                <span className="font-bold text-red-800">25K+</span>
              </div>
              <div className="flex justify-between">
                <span>Successful Trades:</span>
                <span className="font-bold text-red-800">100K+</span>
              </div>
            </div>
          </div>
          </Card>

          {/* Call to Action Section */}
          <div className="border-2 border-black bg-gradient-to-b from-red-50 to-white p-6">
            <h3 className="text-xl font-metal text-red-800 mb-4 text-center">
              JOIN THE MOVEMENT
            </h3>
            
            {/* Primary Actions */}
            <div className="space-y-3 mb-6">
              <Button 
                onClick={handleJoinRevolution}
                className="w-full bg-red-800 hover:bg-red-900 font-gothic border-2 border-red-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" 
                size="lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                JOIN THE REVOLUTION
              </Button>
              
              <Button 
                onClick={handleExploreMarketplace}
                variant="outline" 
                className="w-full border-2 border-red-800 text-red-800 hover:bg-red-800 hover:text-white font-gothic shadow-[4px_4px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(220,38,38,0.3)] transition-all" 
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                EXPLORE MARKETPLACE
              </Button>
            </div>

            {/* Social Media Section */}
            <div className="border-t border-black pt-4">
              <p className="text-sm font-gothic text-center text-gray-600 mb-3">
                FOLLOW US FOR DAILY DROPS
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="https://www.instagram.com/vestige.house/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white font-gothic transition-all group-hover:shadow-[3px_3px_0px_0px_rgba(236,72,153,0.3)]" 
                    size="sm"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    INSTAGRAM
                  </Button>
                </Link>
                
                <Link 
                  href="https://www.facebook.com/profile.php?id=61577693459247" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-gothic transition-all group-hover:shadow-[3px_3px_0px_0px_rgba(37,99,235,0.3)]" 
                    size="sm"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    FACEBOOK
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="border-3 border-red-900 bg-white relative"></div>
      <SubscriptionPlans />

      {/* Newspaper Footer */}
      <div className="mt-12 border-t-2 border-red-800 pt-4 text-center">
        <p className="font-gothic text-xs text-gray-500">
          © 2024 The Vestige Times • All Rights Reserved • Fashion News & Updates Daily
        </p>
      </div>
    </div>
  );
}

export default About;