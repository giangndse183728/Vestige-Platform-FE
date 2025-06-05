import Image from 'next/image';
import { Star, Heart, Eye, Truck, Shield, Clock, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Seller {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  isLegitProfile: boolean;
  sellerRating: number;
  sellerReviewsCount: number;
  successfulTransactions: number;
  joinedDate: string;
}

interface Category {
  categoryId: number;
  name: string;
  description: string;
}

interface Brand {
  brandId: number;
  name: string;
  logoUrl: string;
}

interface ProductImage {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface Product {
  productId: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  condition: string;
  size: string | null;
  color: string | null;
  authenticityConfidenceScore: number;
  shippingFee: number;
  status: string;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  seller: Seller;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  discountPercentage: number;
  hasDiscount: boolean;
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCondition = (condition: string) => {
    return condition.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container mx-auto py-8 mt-1 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
            {product.images.length > 0 ? (
              <Image
                src="/rick.png"
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-lg">No Image Available</span>
              </div>
            )}
            {product.hasDiscount && (
              <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
                {product.discountPercentage}% OFF
              </div>
            )}
          </div>
          <div className="grid grid-cols-4">
            {product.images.map((image) => (
              <div key={image.imageId} className="relative aspect-[4/3] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
                <Image
                  src="/rick.png"
                  alt={`${product.title} - Image ${image.displayOrder}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            
            {Array.from({ length: Math.max(0, 4 - product.images.length) }).map((_, index) => (
              <div key={`placeholder-${index}`} className="relative aspect-[4/3] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-sm">No Image</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-12">
        <Card variant='decorated' className='m-0'>
            <CardContent className='p-10 '>
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {product.viewsCount} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {product.likesCount} likes
              </span>
            </div>
          </div>
          

          <div className="space-y-2 mt-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-metal text-[var(--dark-red)]">
                ${product.price.toFixed(2)}
              </span>
              {product.hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">Shipping: ${product.shippingFee.toFixed(2)}</p>
          </div>
          </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="p-4 bg-white/90 backdrop-blur-sm border-2 border-black -mr-[2px] -mb-[2px]">
              <h3 className="font-medium text-xl mb-2 font-metal">Product Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Condition:</span> {formatCondition(product.condition)}</p>
                {product.size && <p><span className="text-gray-600">Size:</span> {product.size}</p>}
                {product.color && <p><span className="text-gray-600">Color:</span> {product.color}</p>}
                <p><span className="text-gray-600">Brand:</span> {product.brand.name}</p>
                <p><span className="text-gray-600">Category:</span> {product.category.name}</p>
              </div>
            </div>

            <div className="p-4 bg-white/90 backdrop-blur-sm border-2 border-black -mr-[2px] -mb-[2px]">
              <h3 className="font-medium text-xl mb-2 font-metal">Description</h3>
              <p className="text-sm text-gray-600 ">{product.description}</p>
            </div>

            <div className="p-4 bg-white/90 backdrop-blur-sm border-2 border-black -mr-[2px] -mb-[2px]">
              <h3 className="font-medium text-xl mb-2 font-metal">Seller Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-black">
                    {product.seller.profilePictureUrl ? (
                      <Image
                        src={product.seller.profilePictureUrl}
                        alt={`${product.seller.firstName} ${product.seller.lastName}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.seller.firstName} {product.seller.lastName}</span>
                      {product.seller.isLegitProfile && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Shield className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{product.seller.sellerRating} ({product.seller.sellerReviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <p>{product.seller.successfulTransactions} successful transactions</p>
                <p>Member since {formatDate(product.seller.joinedDate)}</p>
              </div>
            </div>

            <div className="flex flex-col ">
              <button className="w-full bg-[var(--dark-red)] text-white py-3 font-medium hover:bg-[var(--dark-red)]/90 transition-colors border-2 border-black -mr-[2px] -mb-[2px]">
                Buy Now
              </button>
              <Button variant="corner-red" >
                Add to Cart
              </Button>
              
              
              
            </div>

       
          </div>
        </div>
      </div>
    </div>
  );
} 