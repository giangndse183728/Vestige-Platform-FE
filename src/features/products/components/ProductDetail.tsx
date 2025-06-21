import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, Eye, Shield, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/hooks';
import { toast } from 'sonner';
import { useState } from 'react';
import { formatVNDPrice } from '@/utils/format';

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
  const addToCart = useCartStore((state) => state.addItem);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({
      productId: product.productId,
      title: product.title,
      price: product.price,
      imageUrl: product.images[0]?.imageUrl || '/rick.png',
      size: product.size || null,
      color: product.color || null,
      seller: {
        username: product.seller.username,
        firstName: product.seller.firstName,
        lastName: product.seller.lastName,
      },
      brand: {
        name: product.brand.name,
      },
      category: {
        name: product.category.name,
      },
    });
    toast.success('Added to cart');
  };

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

  const getConditionHearts = (condition: string) => {
    const conditions = {
      'NEW': 5,
      'LIKE_NEW': 4,
      'USED_EXCELLENT': 3,
      'USED_GOOD': 2,
      'FAIR': 1
    };
    return conditions[condition as keyof typeof conditions] || 0;
  };

  return (
    <div className="container mx-auto py-8 mt-1 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[1/1] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
            {product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex].imageUrl}
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
            {product.images.map((image, index) => (
              <div 
                key={image.imageId} 
                className={`relative aspect-[4/3] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px] cursor-pointer transition-all ${
                  selectedImageIndex === index ? 'ring-2 ring-[var(--dark-red)]' : ''
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.imageUrl}
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
                {formatVNDPrice(product.price)}
              </span>
              {product.hasDiscount && (
                <span className="text-lg text-gray-500 line-through">
                  {formatVNDPrice(product.originalPrice)}
                </span>
              )}
            </div>
          
          </div>
          </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="p-5 bg-white/90 backdrop-blur-sm border-2 border-black -mr-[2px] -mb-[2px]">
              <h3 className="font-metal text-lg mb-3">Product Details</h3>
              <div className="grid grid-cols-2 divide-x divide-gray-500">
                <div className="pr-3">
                  <div className="grid grid-cols-1 divide-y divide-gray-500">
                    <div className="py-2">
                      <div className="text-xs text-gray-500 mb-1">Condition</div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((heart) => (
                          <Heart
                            key={heart}
                            className={`w-4 h-4 ${
                              heart <= getConditionHearts(product.condition)
                                ? 'fill-red-900 text-[var(--dark-red)] '
                                : 'text-gray-500'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium ml-2">{formatCondition(product.condition)}</span>
                      </div>
                    </div>
                    {product.color && (
                      <div className="py-2">
                        <div className="text-xs text-gray-500 mb-1">Color</div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3  border border-black-500 border-3 rotate-45" style={{ backgroundColor: product.color.toLowerCase() }} />
                          <div className="text-sm font-medium">{product.color}</div>
                        </div>
                      </div>
                    )}
                    {product.size && (
                      <div className="py-2">
                        <div className="text-xs text-gray-500 mb-1">Size</div>
                        <div className="flex items-center">
                          <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-sm">
                            <span className="text-sm font-medium tracking-wider">{product.size}US</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pl-3">
                  <div className="grid grid-cols-1 divide-y divide-gray-500">
                    <div className="py-2">
                      <div className="text-xs text-gray-500 mb-1">Brand</div>
                      <div className="text-sm font-medium">{product.brand.name}</div>
                    </div>
                    <div className="py-2">
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="text-sm font-medium">{product.category.name}</div>
                    </div>
                    <div className="py-2">
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-sm text-xs font-medium ${
                          product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          product.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                          product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status || 'INACTIVE'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/90 backdrop-blur-sm border-2 border-black -mr-[2px] -mb-[2px]">
              <h3 className="font-medium text-xl mb-2 font-metal">Description</h3>
              <p className="text-sm text-gray-600 ">{product.description}</p>
            </div>

            <div className="p-5 bg-white/90 backdrop-blur-sm border-2 border-black -mr-[2px] -mb-[2px]">
              <h3 className="font-medium text-xl mb-2 font-metal">Seller Information</h3>
              <Link 
                href={`/users/${product.seller.userId}`}
                className="block hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
              >
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
              </Link>
            </div>

            <div className="flex flex-col ">
              <button 
                className="w-full bg-[var(--dark-red)] text-white py-3 font-medium hover:bg-red-700 transition-colors border-2 border-black -mr-[2px] -mb-[2px]"
                onClick={() => router.push(`/checkout?productId=${product.productId}`)}
              >
                Buy Now
              </button>
              <Button 
                variant="corner-red" 
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              
              
              
            </div>

       
          </div>
        </div>
      </div>
    </div>
  );
} 