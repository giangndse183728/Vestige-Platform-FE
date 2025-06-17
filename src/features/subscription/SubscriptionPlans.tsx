import { Button } from "@/components/ui/button";
import { Star, Zap, Crown, Users, ShoppingBag, Instagram } from "lucide-react";

export function SubscriptionPlans() {
  return (
    <div className="container mx-auto px-4 py-16 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-metal text-black-900 mb-4">CHOOSE YOUR PLAN</h1>
          <p className="font-gothic text-gray-600 text-lg max-w-2xl mx-auto">
            Join the Vestige community and unlock exclusive features tailored to your fashion journey
          </p>
          <div className="w-24 h-1 bg-red-800 mx-auto mt-6"></div>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="border-2 border-gray-400 bg-white transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gray-100 p-8 text-center border-b-2 border-gray-400">
              <Star className="w-12 h-12 text-gray-600 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-3xl font-metal text-gray-800 mb-2">BASIC EDITION</h3>
              <p className="font-gothic text-gray-600 mb-4">For Casual Fashion Enthusiasts</p>
              <div className="text-4xl font-metal mb-2">FREE</div>
              <p className="text-sm text-gray-500">Forever</p>
            </div>
            <div className="p-8">
              <div className="font-gothic text-sm space-y-4 mb-8">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-gray-400"></div>
                  <span>Browse All Fashion Items</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-gray-400"></div>
                  <span>Basic Search Filters</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-gray-400"></div>
                  <span>List Up to 5 Items</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400"></div>
                  <span>Standard Support</span>
                </div>
              </div>
              <Button variant="outline" className="w-full font-gothic border-gray-400 text-gray-600 hover:bg-gray-100 py-6 text-lg">
                START FREE
              </Button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="border-4 border-red-800 bg-white relative transform hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-6 py-2 font-gothic text-sm font-bold">
              MOST POPULAR
            </div>
            <div className="bg-red-800 text-white p-8 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-3xl font-metal mb-2">PRO EDITION</h3>
              <p className="font-gothic text-sm opacity-90 mb-4">For Fashion Enthusiasts</p>
              <div className="text-4xl font-metal mb-2">$9.99<span className="text-base font-gothic">/month</span></div>
              <p className="text-sm opacity-90">Billed annually</p>
            </div>
            <div className="p-8">
              <div className="font-gothic text-sm space-y-4 mb-8">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-800"></div>
                  <span>Everything in Basic Edition</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-800"></div>
                  <span>Advanced Search & Filters</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-800"></div>
                  <span>List Up to 50 Items</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-800"></div>
                  <span>Priority Customer Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-800"></div>
                  <span>Early Access to Drops</span>
                </div>
              </div>
              <Button className="w-full bg-red-800 hover:bg-red-900 font-gothic py-6 text-lg">
                SUBSCRIBE PRO
              </Button>
            </div>
          </div>

          {/* Elite Plan */}
          <div className="border-2 border-red-900 bg-white transform hover:scale-105 transition-transform duration-300">
            <div className="bg-red-900 text-white p-8 text-center">
              <Crown className="w-12 h-12 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-3xl font-metal mb-2">ELITE EDITION</h3>
              <p className="font-gothic text-sm opacity-90 mb-4">For Industry Professionals</p>
              <div className="text-4xl font-metal mb-2">$29.99<span className="text-base font-gothic">/month</span></div>
              <p className="text-sm opacity-90">Billed annually</p>
            </div>
            <div className="p-8">
              <div className="font-gothic text-sm space-y-4 mb-8">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-900"></div>
                  <span>Everything in Pro Edition</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-900"></div>
                  <span>Unlimited Listings</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-900"></div>
                  <span>VIP Customer Support</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-2 h-2 bg-red-900"></div>
                  <span>Exclusive Brand Partnerships</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-900"></div>
                  <span>Analytics Dashboard</span>
                </div>
              </div>
              <Button variant="outline" className="w-full font-gothic border-red-900 text-red-900 hover:bg-red-900 hover:text-white py-6 text-lg">
                SUBSCRIBE ELITE
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-metal text-black-900 mb-12">ALL PLANS INCLUDE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border-2 border-gray-200">
              <Users className="w-12 h-12 text-red-800 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-xl font-metal mb-2">Community Access</h3>
              <p className="font-gothic text-gray-600">Join our vibrant community of fashion enthusiasts</p>
            </div>
            <div className="p-6 border-2 border-gray-200">
              <ShoppingBag className="w-12 h-12 text-red-800 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-xl font-metal mb-2">Secure Transactions</h3>
              <p className="font-gothic text-gray-600">Safe and protected buying/selling experience</p>
            </div>
            <div className="p-6 border-2 border-gray-200">
              <Instagram className="w-12 h-12 text-red-800 mx-auto mb-4 stroke-[1.5]" />
              <h3 className="text-xl font-metal mb-2">Style Inspiration</h3>
              <p className="font-gothic text-gray-600">Discover trending styles and fashion insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 