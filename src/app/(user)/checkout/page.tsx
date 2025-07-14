'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCreateOrder } from '@/features/order/hooks/useCreateOrder';
import { useAddresses } from '@/features/profile/hooks/useAddresses';
import { CreateOrderData, Order } from '@/features/order/schema';
import { useProductDetail } from '@/features/products/hooks/useProductDetail';
import { toast } from 'sonner';
import { MapPin, CreditCard, UserCircle, Shield, Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CompactStripeStatus } from '@/features/payment/components/CompactStripeStatus';
import { Elements } from '@stripe/react-stripe-js';
import { StripeCardForm, stripePromise } from '@/features/payment/components/StripeCardForm';
import { AddressForm } from '@/features/profile/components/AddressForm';
import { AddressList } from '@/features/profile/components/AddressList';
import { AddressFormData, Address } from '@/features/profile/schema';
import { Input } from '@/components/ui/input';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [orderData, setOrderData] = useState<CreateOrderData>({
    items: [],
    shippingAddressId: 0,
    paymentMethod: 'STRIPE_CARD',
    notes: ''
  });

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Vietnam',
    isDefault: false
  });

  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { addresses, isLoading: isLoadingAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress, isCreating, isUpdating: isUpdatingAddresses, isDeleting, isSettingDefault } = useAddresses();
  const { data: product, isLoading: isLoadingProduct } = useProductDetail(productId || '');

  useEffect(() => {
    if (addresses && addresses.length > 0 && orderData.shippingAddressId === 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setOrderData(prev => ({
          ...prev,
          shippingAddressId: defaultAddress.addressId
        }));
      }
    }
  }, [addresses, orderData.shippingAddressId]);

  useEffect(() => {
    if (productId) {
      setOrderData(prev => ({
        ...prev,
        items: [{ productId: parseInt(productId), notes: '' }]
      }));
    }
  }, [productId]);

  const handleItemNotesChange = (notes: string) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => ({ ...item, notes }))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderData.shippingAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    // Create the order first
    createOrder(orderData, {
      onSuccess: (order: Order) => {
        toast.success('Order created successfully!');
        setCreatedOrder(order);
        if (orderData.paymentMethod === 'STRIPE_CARD') {
          setShowPaymentForm(true);
        } else {
          // For COD orders
          router.push(`/checkout/success?orderId=${order.orderId}`);
        }
      },
      onError: (error) => {
        toast.error('Failed to create order. Please try again.');
        console.error('Order creation error:', error);
      }
    });
  };

  const handlePaymentSuccess = () => {
    if (createdOrder) {
      router.push(`/checkout/success?orderId=${createdOrder.orderId}`);
    }
  };

  const handleInputChange = (field: keyof CreateOrderData, value: any) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Vietnam',
      isDefault: false
    });
    setIsAddingAddress(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressFormData({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsAddingAddress(true);
  };

  const handleCancelAddress = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
    setAddressFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Vietnam',
      isDefault: false
    });
  };

  const handleAddressFieldChange = (field: keyof AddressFormData, value: string | boolean) => {
    setAddressFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAddress = async (data: AddressFormData) => {
    if (editingAddress) {
      await updateAddress({ addressId: editingAddress.addressId, data });
    } else {
      await createAddress(data);
    }
    setIsAddingAddress(false);
    setEditingAddress(null);
    setAddressFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Vietnam',
      isDefault: false
    });
  };

  if (isLoadingProduct || !product) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <p className="font-gothic text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show payment form if order was created and payment method is Stripe
  if (showPaymentForm && createdOrder && orderData.paymentMethod === 'STRIPE_CARD') {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80">
        <div className="max-w-2xl mx-auto p-6 mt-8">
          <Card variant="double">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="font-metal text-2xl mb-2">Complete Payment</h2>
                <p className="text-gray-600">Order #{createdOrder.orderId}</p>
              </div>

              <Elements stripe={stripePromise}>
                <StripeCardForm
                  order={createdOrder}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>

              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentForm(false)}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Back to Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isProcessing = isCreatingOrder;

  return (
    <div className="min-h-screen bg-[#f8f7f3]/80">
      <div className="max-w-8xl mx-auto p-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Summary */}
              <Card variant="double">
                <CardContent className="p-10">
                  <h3 className="font-metal text-lg mb-6">Product Details</h3>

                  {/* Product Image and Basic Info */}
                  <div className="flex gap-6 mb-6">
                    <div className="relative w-70 h-70 bg-gray-100 border-2 border-black flex-shrink-0">
                      <Image
                        src={product.images[0]?.imageUrl || '/rick.png'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-xl mb-2">{product.title}</h4>
                      <p className="text-lg font-metal text-red-900 mb-4">${product.price.toFixed(2)}</p>

                      {/* Product Details Table */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                        <table className="w-full text-sm">
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-700 w-1/3">Brand</td>
                              <td className="px-3 py-2">{product.brand.name}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="px-3 py-2 bg-gray-50 font-medium text-gray-700">Category</td>
                              <td className="px-3 py-2">{product.category.name}</td>
                            </tr>
                            {product.size && (
                              <tr className="border-b border-gray-100">
                                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-700">Size</td>
                                <td className="px-3 py-2">{product.size}</td>
                              </tr>
                            )}
                            {product.color && (
                              <tr>
                                <td className="px-3 py-2 bg-gray-50 font-medium text-gray-700">Color</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border border-gray-300 rounded" style={{ backgroundColor: product.color.toLowerCase() }} />
                                    <span>{product.color}</span>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Item Notes */}

                    </div>
                  </div>

                  {/* Seller Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-metal text-md mb-4">Seller Information</h4>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black">
                        {product.seller.profilePictureUrl ? (
                          <Image
                            src={product.seller.profilePictureUrl}
                            alt={`${product.seller.firstName} ${product.seller.lastName}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-lg">{product.seller.firstName} {product.seller.lastName}</span>
                          {product.seller.isLegitProfile && (
                            <span className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded">
                              <Shield className="w-4 h-4" />
                              Verified Seller
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>{product.seller.sellerRating} ({product.seller.sellerReviewsCount} reviews)</span>
                          </div>
                          <span>•</span>
                          <span>{product.seller.successfulTransactions} successful transactions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card variant="stamp">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-900" />
                      <h3 className="font-metal text-lg">Shipping Address</h3>
                    </div>
                    {!isAddingAddress && (
                      <Button
                        onClick={handleAddAddress}
                        variant="outline"
                        size="sm"
                        className="border-2 border-black text-black hover:bg-gray-100 font-gothic text-xs"
                      >
                        Add New Address
                      </Button>
                    )}
                  </div>

                  {isAddingAddress ? (
                    <div className="border-2 border-black p-6">
                      <h5 className="font-metal text-xl mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h5>
                      <div className="space-y-4">
                        {/* Country Selection */}
                        <div>
                          <Label className="font-gothic text-sm text-black">Country</Label>
                          <Select
                            value={addressFormData.country}
                            onValueChange={(value) => handleAddressFieldChange('country', value)}
                          >
                            <SelectTrigger className="border-black focus:border-black focus:ring-0">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2 border-black">
                              <SelectItem value="Vietnam">Vietnam</SelectItem>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="Australia">Australia</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Address Fields */}
                        <div>
                          <Label className="font-gothic text-sm text-black">Address Line 1</Label>
                          <Input
                            value={addressFormData.addressLine1}
                            onChange={(e) => handleAddressFieldChange('addressLine1', e.target.value)}
                            className="border-black focus:border-black focus:ring-0"
                            placeholder="Enter your address"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-gothic text-sm text-black">City</Label>
                            <Input
                              value={addressFormData.city}
                              onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                              className="border-black focus:border-black focus:ring-0"
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <Label className="font-gothic text-sm text-black">State</Label>
                            <Input
                              value={addressFormData.state}
                              onChange={(e) => handleAddressFieldChange('state', e.target.value)}
                              className="border-black focus:border-black focus:ring-0"
                              placeholder="Enter state"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="font-gothic text-sm text-black">Postal Code</Label>
                          <Input
                            value={addressFormData.postalCode}
                            onChange={(e) => handleAddressFieldChange('postalCode', e.target.value)}
                            className="border-black focus:border-black focus:ring-0"
                            placeholder="Enter postal code"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelAddress}
                            className="border-black text-black hover:bg-gray-100"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleSubmitAddress(addressFormData)}
                            className="bg-black text-white hover:bg-gray-800"
                            disabled={isCreating || isUpdatingAddresses}
                          >
                            {isCreating || isUpdatingAddresses ? 'Saving...' : 'Save Address'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isLoadingAddresses ? (
                        <div className="text-center py-4">Loading addresses...</div>
                      ) : addresses && addresses.length > 0 ? (
                        <div className="space-y-3">
                          {addresses.map((address) => (
                            <div
                              key={address.addressId}
                              className={`p-4 border-2 cursor-pointer transition-all ${orderData.shippingAddressId === address.addressId
                                ? 'border-red-900 bg-red-50'
                                : 'border-black hover:border-gray-600'
                                }`}
                              onClick={() => handleInputChange('shippingAddressId', address.addressId)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{address.addressLine1}</p>
                                  {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                                  <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} {address.postalCode}
                                  </p>
                                  <p className="text-sm text-gray-600">{address.country}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {address.isDefault && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      Default
                                    </span>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditAddress(address);
                                    }}
                                    className="text-gray-500 hover:text-black"
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No addresses found. Please add an address to continue.
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes Section */}
              <Card variant="double">
                <CardContent className="p-8">
                  <h3 className="font-metal text-lg mb-4">Order Notes</h3>
                  <Label htmlFor="item-notes" className="block mb-2 font-medium">Add any notes or special instructions for the seller (optional):</Label>
                  <Textarea
                    id="item-notes"
                    placeholder="Add any notes or special instructions for the seller..."
                    value={orderData.items[0]?.notes || ''}
                    onChange={e => handleItemNotesChange(e.target.value)}
                    className="w-full min-h-[80px] border-gray-300 focus:border-black focus:ring-0"
                  />
                </CardContent>
              </Card>

              {/* Stripe Banking Section */}
              <Card variant="double" className="border-2 border-black">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h3 className="font-metal text-lg">Stripe Banking Setup</h3>
                    </div>
                    <Link href="/profile">
                      <button
                        type="button"
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Go to Profile to Setup
                      </button>
                    </Link>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Complete Your Banking Setup</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Set up your Stripe banking account to receive payments and manage your business finances securely.
                        </p>
                        <div className="text-xs text-blue-600">
                          • Secure payment processing<br />
                          • Direct bank transfers<br />
                          • Business account management
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card variant="decorated">
                <CardContent className="p-10">
                  <h3 className="font-metal text-lg mb-4">Order Summary</h3>
                  <div className="space-y-4">

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Product Price:</span>
                        <span>${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>$0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-metal text-lg">
                        <span>Total:</span>
                        <span className="text-red-900">${product.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Selected Address */}
                    {orderData.shippingAddressId > 0 && addresses && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-sm mb-2">Shipping to:</h4>
                        {addresses.find(addr => addr.addressId === orderData.shippingAddressId) && (
                          <div className="text-xs text-gray-600">
                            <p>{addresses.find(addr => addr.addressId === orderData.shippingAddressId)?.addressLine1}</p>
                            <p>{addresses.find(addr => addr.addressId === orderData.shippingAddressId)?.city}, {addresses.find(addr => addr.addressId === orderData.shippingAddressId)?.state}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment Method */}
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-sm mb-2">Payment Method:</h4>
                      <Select
                        value={orderData.paymentMethod}
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      >
                        <SelectTrigger className="border-black focus:border-black focus:ring-0 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                          <SelectItem value="STRIPE_CARD">Stripe Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {orderData.paymentMethod === 'STRIPE_CARD' && (
                      <div className="pt-4 border-t border-gray-200">
                        <CompactStripeStatus />
                      </div>
                    )}

                    <div className="pt-4 space-y-3">
                      <Button
                        type="submit"
                        disabled={isProcessing || !orderData.shippingAddressId}
                        className="w-full text-white bg-red-900 hover:bg-red-800"
                        onClick={handleSubmit}
                      >
                        {isProcessing ? 'Processing...' : 'Checkout'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full border-black text-black hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
