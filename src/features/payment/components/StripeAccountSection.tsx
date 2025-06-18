'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, CheckCircle, XCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useStripeAccountStatus } from '../hooks/useStripeAccountStatus';
import { useStripeOnboard } from '../hooks/useStripeOnboard';
import { toast } from 'sonner';

export const StripeAccountSection = () => {
  const { 
    data: accountStatus, 
    isLoading, 
    error, 
    refetch 
  } = useStripeAccountStatus();
  
  const { mutate: startStripeOnboard, isPending: isStripeOnboarding } = useStripeOnboard();

  const handleRefresh = () => {
    refetch();
    toast.success('Account status refreshed');
  };

  const getStatusIcon = () => {
    if (!accountStatus?.hasAccount) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (accountStatus?.setupComplete) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (!accountStatus?.hasAccount) {
      return 'Not Connected';
    }
    if (accountStatus?.setupComplete) {
      return 'Fully Active';
    }
    return 'Setup Incomplete';
  };

  const getStatusColor = () => {
    if (!accountStatus?.hasAccount) {
      return 'bg-red-100 text-red-800';
    }
    if (accountStatus?.setupComplete) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  if (isLoading) {
    return (
      <div className="border-2 border-black p-6 mt-6 my-8 bg-black/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h4 className="font-metal text-2xl font-bold text-black tracking-wider">
              STRIPE ACCOUNT
            </h4>
            <div className="h-6 w-[1px] bg-black"></div>
            <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
          <span className="ml-2 font-gothic text-gray-600">Loading account status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 border-black p-6 mt-6 my-8 bg-black/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h4 className="font-metal text-2xl font-bold text-black tracking-wider">
              STRIPE ACCOUNT
            </h4>
            <div className="h-6 w-[1px] bg-black"></div>
            <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="font-gothic text-red-600">Failed to load account status</p>
          <p className="font-gothic text-sm text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-black p-6 mt-6 my-8 bg-black/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h4 className="font-metal text-2xl font-bold text-black tracking-wider">
            STRIPE ACCOUNT
          </h4>
          <div className="h-6 w-[1px] bg-black"></div>
          <span className="font-gothic text-sm text-gray-600 tracking-wider">SECTION</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {!accountStatus?.hasAccount && (
            <Button 
              onClick={() => startStripeOnboard()}
              disabled={isStripeOnboarding}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isStripeOnboarding ? 'Connecting...' : 'Connect Stripe'}
            </Button>
          )}
        </div>
      </div>

      <Card variant="decorated">
        <CardContent className="p-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h5 className="font-metal text-lg text-black">Account Status</h5>
                <Badge className={getStatusColor()}>
                  {getStatusText()}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {accountStatus?.hasAccount ? (
            <div className="space-y-4">
              {accountStatus.accountId && (
                <div className="flex justify-between items-center">
                  <span className="font-gothic text-sm text-gray-600">Account ID:</span>
                  <span className="font-mono text-sm text-black">{accountStatus.accountId}</span>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <span className="font-gothic text-sm text-gray-600">Account Created:</span>
                  <Badge variant="default">
                    Yes
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <span className="font-gothic text-sm text-gray-600">Setup Complete:</span>
                  <Badge variant={accountStatus.setupComplete ? "default" : "secondary"}>
                    {accountStatus.setupComplete ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {!accountStatus.setupComplete && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h6 className="font-metal text-sm text-yellow-800">Account Setup Incomplete</h6>
                      <p className="font-gothic text-sm text-yellow-700 mt-1">
                        Complete your Stripe account setup to enable payments and payouts.
                      </p>
                      <Button 
                        onClick={() => startStripeOnboard()}
                        disabled={isStripeOnboarding}
                        variant="outline"
                        size="sm"
                        className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Complete Setup
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h5 className="font-metal text-lg text-black mb-2">Connect Your Stripe Account</h5>
              <p className="font-gothic text-gray-600 mb-4">
                Connect your Stripe account to start accepting payments and managing your business.
              </p>
              <Button 
                onClick={() => startStripeOnboard()}
                disabled={isStripeOnboarding}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isStripeOnboarding ? 'Connecting...' : 'Connect Stripe Account'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 