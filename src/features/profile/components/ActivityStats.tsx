import React from 'react';
import { Star, Shield, Calendar, TrendingUp, Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ActivityStatsProps {
  user: {
    sellerRating: number;
    sellerReviewsCount: number;
    trustScore: number;
    successfulTransactions: number;
    totalProductsListed: number;
    activeProductsCount: number;
    soldProductsCount: number;
    lastLoginAt: string;
  };
}

const ActivityCharts = ({ user }: { user: ActivityStatsProps['user'] }) => {
  const performanceData = [
    { name: 'Success Rate', value: ((user.soldProductsCount / user.totalProductsListed) * 100) || 0 },
    { name: 'Active Rate', value: ((user.activeProductsCount / user.totalProductsListed) * 100) || 0 },
    { name: 'Trust Score', value: (user.trustScore / 5) * 100 },
    { name: 'Seller Rating', value: (user.sellerRating / 5) * 100 },
  ];

  const listingData = [
    { name: 'Active', value: user.activeProductsCount },
    { name: 'Sold', value: user.soldProductsCount },
    { name: 'Remaining', value: user.totalProductsListed - user.soldProductsCount },
  ];

  const COLORS = ['#2c3e50', '#8e44ad', '#2980b9'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="border border-black p-4 md:col-span-2">
        <h5 className="font-metal text-lg text-black mb-4">PERFORMANCE METRICS</h5>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
              <Bar dataKey="value" fill="#2c3e50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-black p-4">
        <h5 className="font-metal text-lg text-black mb-4">LISTING DISTRIBUTION</h5>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={listingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#2c3e50"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {listingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const ActivityStats = ({ user }: ActivityStatsProps) => {
  return (
    <div className="border-2 border-black p-6">
      <h4 className="font-metal text-2xl font-bold text-black mb-6 border-b-2 border-black pb-2">
        ACTIVITY & STATISTICS
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="border border-black p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-metal text-lg text-black">SELLER RATING</h5>
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
            <h5 className="font-metal text-lg text-black">TRUST SCORE</h5>
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-center">
            <div className="font-metal text-3xl font-bold text-black">{user.trustScore}/5.0</div>
            <div className="font-gothic text-sm text-gray-600">Community Trust Level</div>
          </div>
        </div>
      </div>

      <ActivityCharts user={user} />

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
  );
}; 