'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressFormData } from '../schema';

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddressForm({ initialData, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [formData, setFormData] = React.useState<AddressFormData>({
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || '',
    isDefault: initialData?.isDefault || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="font-gothic text-sm text-black">Address Line 1</Label>
        <Input
          value={formData.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          className="border-black focus:border-black focus:ring-0"
          required
        />
      </div>

      <div>
        <Label className="font-gothic text-sm text-black">Address Line 2 (Optional)</Label>
        <Input
          value={formData.addressLine2 || ''}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
          className="border-black focus:border-black focus:ring-0"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-gothic text-sm text-black">City</Label>
          <Input
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="border-black focus:border-black focus:ring-0"
            required
          />
        </div>

        <div>
          <Label className="font-gothic text-sm text-black">State</Label>
          <Input
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="border-black focus:border-black focus:ring-0"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-gothic text-sm text-black">Postal Code</Label>
          <Input
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="border-black focus:border-black focus:ring-0"
            required
          />
        </div>

        <div>
          <Label className="font-gothic text-sm text-black">Country</Label>
          <Input
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="border-black focus:border-black focus:ring-0"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => handleChange('isDefault', checked as boolean)}
          className="border-black"
        />
        <Label htmlFor="isDefault" className="font-gothic text-sm text-black">
          Set as default address
        </Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-black text-black hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
} 