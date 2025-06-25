import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

function About() {
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
                src="/rick.png" 
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

          {/* Simplified Article */}
          <div className="font-gothic text-sm leading-relaxed">
            <p className="mb-4">
              The platform specializes in authenticated luxury brands and rare pieces, sourced directly from fashion enthusiasts. Beyond transactions, Vestige serves as a cultural hub for style inspiration and trend forecasting.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
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

          {/* Features Box */}
          <div className="border border-black bg-gray-50 p-4">
            <h3 className="text-lg font-metal text-red-800 mb-3">KEY FEATURES</h3>
            <ul className="space-y-2 font-gothic text-xs">
              <li className="flex items-start gap-2">
                <span className="text-red-800">•</span>
                <span>Authenticated luxury brands</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-800">•</span>
                <span>Secure transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-800">•</span>
                <span>Community marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-800">•</span>
                <span>Style inspiration feed</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-red-800 hover:bg-red-900 font-gothic" size="lg">
              JOIN THE REVOLUTION
            </Button>
            <Button variant="outline" className="w-full border-red-800 text-red-800 hover:bg-red-800 hover:text-white font-gothic" size="lg">
              EXPLORE MARKETPLACE
            </Button>
            <Button variant="ghost" className="w-full text-red-800 hover:bg-red-50 font-gothic" size="lg">
              FOLLOW ON INSTAGRAM
            </Button>
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