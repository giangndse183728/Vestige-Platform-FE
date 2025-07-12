'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  MapPin, 
  User, 
  Camera, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  Truck
} from 'lucide-react';
import Image from 'next/image';
import { getPickupList, confirmDelivery } from '@/features/order/services';
import { PickupItem } from '@/features/order/schema';
import Link from 'next/link';

export default function DeliveryConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = Number(params.itemId);
  
  const [deliveryItem, setDeliveryItem] = useState<PickupItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getPickupList();
        const deliveryItem = response.data.find((item: PickupItem) => item.orderItemId === itemId);
        
        if (!deliveryItem) {
          setError('Delivery item not found');
          return;
        }
        
        if (deliveryItem.status !== 'OUT_FOR_DELIVERY') {
          setError('This item is not out for delivery');
          return;
        }
        
        setDeliveryItem(deliveryItem);
      } catch (err) {
        setError('Failed to load delivery details');
        console.error('Error fetching delivery details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchDeliveryDetails();
    }
  }, [itemId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleConfirmDelivery = async () => {
    if (photos.length === 0) {
      setError('Please take at least one photo as proof of delivery');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // In a real implementation, photos would be uploaded to Firebase first
      // For now, we'll use the data URLs directly
      await confirmDelivery(itemId, photos);
      
      // Show success and redirect
      router.push('/shipper/delivery?success=delivery-confirmed');
    } catch (err) {
      setError('Failed to confirm delivery');
      console.error('Error confirming delivery:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-black">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="font-gothic">Loading delivery details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !deliveryItem) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-gothic">{error || 'Delivery item not found'}</p>
            </div>
            <Link href="/shipper/delivery">
              <Button className="mt-4 border-2 border-black hover:bg-black hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Delivery Route
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/shipper/delivery">
          <Button variant="outline" size="sm" className="border-2 border-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="font-metal text-2xl font-bold">Confirm Delivery</h1>
      </div>

      {/* Delivery Details */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-metal text-xl">Delivery Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded border">
            <div className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {deliveryItem.product.primaryImageUrl ? (
                <Image
                  src={deliveryItem.product.primaryImageUrl}
                  alt={deliveryItem.product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-metal text-lg font-bold mb-2">{deliveryItem.product.title}</h3>
              <p className="font-gothic text-sm text-gray-600 mb-2">
                {deliveryItem.product.brandName} • {deliveryItem.product.condition}
              </p>
              <Badge className="bg-purple-100 text-purple-800 border-2 border-purple-200 font-metal">
                {deliveryItem.status}
              </Badge>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded border">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-gothic font-medium text-blue-800">
                {deliveryItem.seller.firstName} {deliveryItem.seller.lastName}
              </p>
              <p className="font-gothic text-sm text-blue-600">@{deliveryItem.seller.username}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded border">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-gothic font-medium text-green-800">Delivery Address</p>
              <p className="font-gothic text-sm text-green-600">
                {deliveryItem.order.shippingAddress.streetAddress}
              </p>
              <p className="font-gothic text-sm text-green-600">
                {deliveryItem.order.shippingAddress.city}, {deliveryItem.order.shippingAddress.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-metal text-xl flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Take Delivery Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="font-gothic text-gray-600">
              Take 1-2 photos as proof of delivery (e.g., package at buyer's door, or with buyer)
            </p>
            
            {/* Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-gothic text-sm text-gray-600 mb-4">
                Upload delivery photos
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="delivery-photo-upload"
              />
              <label htmlFor="delivery-photo-upload">
                <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white">
                  <Camera className="w-4 h-4 mr-2" />
                  Select Photos
                </Button>
              </label>
            </div>

            {/* Photo Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={photo}
                      alt={`Delivery Photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      onClick={() => removePhoto(index)}
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 w-6 h-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <p className="font-gothic text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Button */}
      <Card className="border-2 border-black">
        <CardContent className="p-6">
          <Button
            onClick={handleConfirmDelivery}
            disabled={photos.length === 0 || isProcessing}
            className="w-full bg-green-600 text-white hover:bg-green-700 border-2 border-green-600 font-metal text-lg py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirming Delivery...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Delivery
              </>
            )}
          </Button>
          <p className="font-gothic text-xs text-gray-600 text-center mt-2">
            This will mark the item as delivered and release the seller's payment
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 