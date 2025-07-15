'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useStripeAccountStatus } from '../hooks/useStripeAccountStatus';
import { useStripeOnboard } from '../hooks/useStripeOnboard';

export const CompactStripeStatus = () => {
  const { 
    data: accountStatus, 
    isLoading, 
    error 
  } = useStripeAccountStatus();
  
  const { mutate: startStripeOnboard, isPending: isStripeOnboarding } = useStripeOnboard();

  const getStatusIcon = () => {
    if (isLoading) return null;
    if (!accountStatus?.hasAccount) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (accountStatus?.setupComplete) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Loading...';
    if (!accountStatus?.hasAccount) {
      return 'Not Connected';
    }
    if (accountStatus?.setupComplete) {
      return 'Active';
    }
    return 'Setup Incomplete';
  };

  const getStatusColor = () => {
    if (isLoading) return 'bg-gray-100 text-gray-800';
    if (!accountStatus?.hasAccount) {
      return 'bg-red-100 text-red-800';
    }
    if (accountStatus?.setupComplete) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  if (error) {
    return (
      <div className="text-center py-2">
        <p className="text-xs text-red-600">Failed to load Stripe status</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">Stripe:</span>
        <Badge className={`text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
      {getStatusIcon()}
        
        {!isLoading && !accountStatus?.hasAccount && (
          <Button 
            onClick={() => startStripeOnboard()}
            disabled={isStripeOnboarding}
            size="sm"
            className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
          >
            {isStripeOnboarding ? 'Connecting...' : 'Connect'}
          </Button>
        )}
        
        {!isLoading && accountStatus?.hasAccount && !accountStatus?.setupComplete && (
          <Button 
            onClick={() => startStripeOnboard()}
            disabled={isStripeOnboarding}
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Setup
          </Button>
        )}
      </div>
    </div>
  );
}; 