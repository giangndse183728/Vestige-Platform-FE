'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Star } from 'lucide-react';
import { Address } from '../schema';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => void;
  onSetDefault: (addressId: number) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-gothic text-gray-600">No addresses found. Add your first address!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((address) => (
        <Card variant='double' key={address.addressId} className="p-8 ">
          <div className="flex justify-between items-start mb-2">
            <div>
              {address.isDefault && (
                <div className="mb-4 inline-flex items-center gap-2 border-b-2 border-black pb-1">
                  <span className="font-metal text-xs tracking-[0.2em] text-red-900">PRIMARY</span>
                  <span className="text-xs font-gothic">•</span>
                  <span className="font-gothic text-xs italic">EST. {new Date().getFullYear()}</span>
                </div>
              )}
              <h3 className="font-metal text-lg">
                {address.addressLine1}
                {address.addressLine2 && <span>, {address.addressLine2}</span>}
              </h3>
              <p className="font-gothic text-gray-600">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="font-gothic text-gray-600">{address.country}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(address)}
                className="hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(address.addressId)}
                disabled={isDeleting}
                className="hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {!address.isDefault && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSetDefault(address.addressId)}
                  disabled={isSettingDefault}
                  className="hover:bg-gray-100"
                >
                  <Star className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 