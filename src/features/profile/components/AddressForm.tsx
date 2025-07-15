'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressFormData } from '../schema';

interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: any[];
}

interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: any[];
}

interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}

const countries = [
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'China', label: 'China' },
  { value: 'India', label: 'India' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Other', label: 'Other' }
];

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddressForm({ initialData, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState('');
  const [formData, setFormData] = React.useState<AddressFormData>({
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || '',
    isDefault: initialData?.isDefault || false
  });

  useEffect(() => {
    if (formData.country === 'Vietnam') {
      fetch('https://provinces.open-api.vn/api/p/')
        .then(response => response.json())
        .then(data => setProvinces(data))
        .catch(error => console.error('Error fetching provinces:', error));
    }
  }, [formData.country]);

  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.name === selectedProvince);
      if (province) {
        fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
          .then(response => response.json())
          .then(data => setDistricts(data.districts))
          .catch(error => console.error('Error fetching districts:', error));
      }
    }
  }, [selectedProvince, provinces]);

  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find(d => d.name === selectedDistrict);
      if (district) {
        fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
          .then(response => response.json())
          .then(data => setWards(data.wards))
          .catch(error => console.error('Error fetching wards:', error));
      }
    }
  }, [selectedDistrict, districts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      addressLine1: [streetAddress, selectedWard, selectedDistrict, selectedProvince]
        .filter(Boolean)
        .join(', ')
    };
    onSubmit(finalData);
  };

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedWard('');
    setFormData(prev => ({
      ...prev,
      city: value
    }));
    updateAddressLine();
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard('');
    updateAddressLine();
  };

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
    updateAddressLine();
  };

  const handleStreetAddressChange = (value: string) => {
    setStreetAddress(value);
    const address = value;
    const ward = selectedWard;
    const district = selectedDistrict;
    const city = selectedProvince;

    const formattedAddress = [address, ward, district, city]
      .filter(Boolean)
      .join(', ');

    setFormData(prev => ({
      ...prev,
      addressLine1: formattedAddress,
      city: formData.country === 'Vietnam' ? selectedProvince : prev.city
    }));
  };

  const updateAddressLine = () => {
    const address = streetAddress;
    const ward = selectedWard;
    const district = selectedDistrict;
    const city = selectedProvince;

    const formattedAddress = [address, ward, district, city]
      .filter(Boolean)
      .join(', ');

    setFormData(prev => ({
      ...prev,
      addressLine1: formattedAddress,
      city: formData.country === 'Vietnam' ? selectedProvince : prev.city
    }));
  };

  const handleCountryChange = (value: string) => {
    handleChange('country', value);
    if (value !== 'Vietnam') {
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      setStreetAddress('');
      setFormData(prev => ({
        ...prev,
        city: '',
        state: '',
        addressLine1: ''
      }));
    }
  };

  const getAddressPreview = () => {
    if (formData.country !== 'Vietnam') {
      return formData.addressLine1;
    }

    const parts = [];
    if (streetAddress) parts.push(streetAddress);
    if (selectedWard) parts.push(selectedWard);
    if (selectedDistrict) parts.push(selectedDistrict);
    if (selectedProvince) parts.push(selectedProvince);

    return parts.length > 0 ? parts.join(', ') : 'No address entered yet';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="font-gothic text-sm text-black">Country</Label>
        <Select
          value={formData.country}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="border-black focus:border-black focus:ring-0">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-black">
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.country === 'Vietnam' ? (
        <>
          <div>
            <Label className="font-gothic text-sm text-black">City/Province</Label>
            <Select
              value={selectedProvince}
              onValueChange={handleProvinceChange}
              required
            >
              <SelectTrigger className="border-black focus:border-black focus:ring-0">
                <SelectValue placeholder="Select city/province" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-black">
                {provinces.map((province) => (
                  <SelectItem key={province.code} value={province.name}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvince && (
            <div>
              <Label className="font-gothic text-sm text-black">District</Label>
              <Select
                value={selectedDistrict}
                onValueChange={handleDistrictChange}
                required
              >
                <SelectTrigger className="border-black focus:border-black focus:ring-0">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-black">
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedDistrict && (
            <div>
              <Label className="font-gothic text-sm text-black">Ward</Label>
              <Select
                value={selectedWard}
                onValueChange={handleWardChange}
                required
              >
                <SelectTrigger className="border-black focus:border-black focus:ring-0">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-black">
                  {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.name}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="font-gothic text-sm text-black">Address</Label>
            <Input
              value={streetAddress}
              onChange={(e) => handleStreetAddressChange(e.target.value)}
              className="border-black focus:border-black focus:ring-0"
              required
            />
          </div>

          <div className="mt-4 p-4 border-2 border-black rounded-md bg-gray-50">
            <Label className="font-gothic text-sm text-black mb-2 block">Address Preview</Label>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {getAddressPreview()}
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <Label className="font-gothic text-sm text-black">Address Line 1</Label>
            <Input
              value={formData.addressLine1}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
              className="border-black focus:border-black focus:ring-0"
              required
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

          <div className="mt-4 p-4 border-2 border-black rounded-md bg-gray-50">
            <Label className="font-gothic text-sm text-black mb-2 block">Address Preview</Label>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {getAddressPreview()}
            </p>
          </div>
        </>
      )}

      <div>
        <Label className="font-gothic text-sm text-black">Postal Code</Label>
        <Input
          value={formData.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          className="border-black focus:border-black focus:ring-0"
          required
        />
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