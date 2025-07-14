'use client';

import React from 'react';
import { TrustTier, TRUST_TIER_LABELS, TRUST_TIER_REQUIREMENTS } from '@/constants/enum';
import { ChevronRight } from 'lucide-react';

interface TierProgressProps {
  currentTier: TrustTier;
  previewTier: TrustTier;
  onTierPreview: (tier: TrustTier) => void;
}

const tierOrder: TrustTier[] = [
  TrustTier.NEW_SELLER,
  TrustTier.RISING_SELLER,
  TrustTier.PRO_SELLER,
  TrustTier.ELITE_SELLER
];

export const TierProgress: React.FC<TierProgressProps> = ({
  currentTier,
  previewTier,
  onTierPreview
}) => {
  const getTierBadgeStyle = (tier: TrustTier, isActive: boolean, isPreview: boolean) => {
    const baseStyle = "relative font-metal text-xs sm:text-sm tracking-wider font-bold px-3 sm:px-4 py-2 sm:py-3 cursor-pointer transition-all duration-300 border-2 sm:border-3 group";
    
    if (isPreview) {
      switch (tier) {
        case TrustTier.ELITE_SELLER:
          return `${baseStyle} bg-gradient-to-r from-black via-red-900 to-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105 ring-2 ring-yellow-400`;
        case TrustTier.PRO_SELLER:
          return `${baseStyle} bg-gradient-to-r from-black to-purple-900 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105 ring-2 ring-purple-400`;
        case TrustTier.RISING_SELLER:
          return `${baseStyle} bg-gradient-to-r from-red-800 to-red-900 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105 ring-2 ring-red-400`;
        default:
          return `${baseStyle} bg-gradient-to-r from-gray-800 to-gray-900 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-105 ring-2 ring-gray-400`;
      }
    } else if (isActive) {
      switch (tier) {
        case TrustTier.ELITE_SELLER:
          return `${baseStyle} bg-gradient-to-r from-black via-red-900 to-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
        case TrustTier.PRO_SELLER:
          return `${baseStyle} bg-gradient-to-r from-black to-purple-900 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
        case TrustTier.RISING_SELLER:
          return `${baseStyle} bg-gradient-to-r from-red-800 to-red-900 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
        default:
          return `${baseStyle} bg-gradient-to-r from-gray-800 to-gray-900 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`;
      }
    } else {    
      return `${baseStyle} bg-gray-300 text-gray-600 border-gray-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:bg-gray-200`;
    }
  };

  const renderTooltip = (tier: TrustTier) => {
    const requirements = TRUST_TIER_REQUIREMENTS[tier];
    
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs font-gothic rounded border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
        <div className="font-metal text-sm text-yellow-400 mb-1 tracking-wider">
          {TRUST_TIER_LABELS[tier]}
        </div>
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Trust Score:</span>
            <span className="text-white font-bold">{requirements.trustScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Sales:</span>
            <span className="text-white font-bold">{requirements.completedSales}</span>
          </div>
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    );
  };

  const currentTierIndex = tierOrder.indexOf(currentTier);

  return (
    <div className="mb-1">
      <h3 className="font-metal text-xl text-black mb-4 border-b-2 border-black pb-1 mb-5">
        <span className="text-red-900">TIER</span> PROGRESSION
      </h3>
      
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap ">
        {tierOrder.map((tier, index) => {
          const isActive = index <= currentTierIndex;
          const isPreview = tier === previewTier;
          
          return (
            <React.Fragment key={tier}>
              <div
                className={getTierBadgeStyle(tier, isActive, isPreview)}
                onClick={() => onTierPreview(tier)}
              >
                <div className="relative z-10">
                  {TRUST_TIER_LABELS[tier]}
                </div>
                {renderTooltip(tier)}
              </div>
              
              {index < tierOrder.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <p className="font-gothic text-xs sm:text-sm text-gray-600">
          {previewTier !== currentTier ? (
            <>
              <span className="text-blue-600 font-bold">PREVIEW MODE:</span> 
              <span className="ml-1">Click badges to preview different tiers • Hover for requirements</span>
            </>
          ) : (
            'Click badges to preview different tiers • Hover for requirements'
          )}
        </p>
      </div>
    </div>
  );
}; 