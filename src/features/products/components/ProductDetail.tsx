import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, Eye, Shield, User, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/hooks';
import { toast } from 'sonner';
import { useState } from 'react';
import { formatVNDPrice } from '@/utils/format';
import { ProductStatus, BLOCKED_PRODUCT_STATUSES, PRODUCT_STATUS_MESSAGES, ProductCondition } from '@/constants/enum';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginModal } from '@/components/ui/login-modal';

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const validImageUrl = product.images[0]?.imageUrl && isValidUrl(product.images[0].imageUrl) 
      ? product.images[0].imageUrl 
      : '/placeholder.png';

    addToCart({
      productId: product.productId,
      title: product.title,
      price: product.price,
      imageUrl: validImageUrl,
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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    router.push(`/checkout?productId=${product.productId}`);
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
      [ProductCondition.NEW]: 5,
      [ProductCondition.LIKE_NEW]: 4,
      [ProductCondition.USED_EXCELLENT]: 3,
      [ProductCondition.USED_GOOD]: 2,
      [ProductCondition.FAIR]: 1
    };
    return conditions[condition as ProductCondition] || 0;
  };

  return (
    <div className="container mx-auto py-8 mt-1 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[1/1] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
            {product.images.length > 0 && isValidUrl(product.images[selectedImageIndex].imageUrl) ? (
              <Image
                src={product.images[selectedImageIndex].imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Image
                  src="/file.svg"
                  alt="No image available"
                  fill
                  className="object-contain opacity-60 p-12"
                />
              </div>
            )}
            {product.hasDiscount && (
              <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
                {product.discountPercentage}% OFF
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-2 -translate-y-1/2 z-10 text-red-900 hover:bg-black/20"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2 z-10 text-red-900 hover:bg-black/20"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
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
                {isValidUrl(image.imageUrl) ? (
                  <Image
                    src={image.imageUrl}
                    alt={`${product.title} - Image ${image.displayOrder}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/file.svg"
                    alt="No image available"
                    fill
                    className="object-contain opacity-60 p-4"
                  />
                )}
              </div>
            ))}
            
            {Array.from({ length: Math.max(0, 4 - product.images.length) }).map((_, index) => (
              <div key={`placeholder-${index}`} className="relative aspect-[4/3] bg-gray-100 overflow-hidden border-2 border-black -mr-[2px] -mb-[2px]">
                <Image
                  src="/file.svg"
                  alt="No image available"
                  fill
                  className="object-contain opacity-60 p-4"
                />
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
                            <span className="text-sm font-medium tracking-wider">{product.size}</span>
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
                          product.status === ProductStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                          product.status === ProductStatus.INACTIVE ? 'bg-gray-100 text-gray-800' :
                          product.status === ProductStatus.DRAFT ? 'bg-yellow-100 text-yellow-800' :
                          product.status === ProductStatus.SOLD ? 'bg-blue-100 text-blue-800' :
                          product.status === ProductStatus.REPORTED ? 'bg-orange-100 text-orange-800' :
                          product.status === ProductStatus.BANNED ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status || ProductStatus.INACTIVE}
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
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-xl font-metal">Seller Information</h3>
                <Link href={`/users/${product.seller.userId}`} className="relative group">
                  <ExternalLink className="w-5 h-5 text-gray-500 hover:text-[var(--dark-red)] transition-colors cursor-pointer" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">View Profile</span>
                </Link>
              </div>
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
                          <User className="w-6 h-6 text-gray-400" />
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

            {/* Buy/Add to Cart Buttons - Only show if product is available */}
            {!BLOCKED_PRODUCT_STATUSES.includes(product.status as any) ? (
              <div className="flex flex-col ">
                <button 
                  className="w-full bg-[var(--dark-red)] text-white py-3 font-medium hover:bg-red-700 transition-colors border-2 border-black -mr-[2px] -mb-[2px]"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <Button 
                  variant="corner-red" 
                  disabled
                >
                  Add to Cart
                </Button>
              </div>
            ) : (
              <div className="p-5 bg-gray-100 border-2 border-black -mr-[2px] -mb-[2px] text-center">
                                 <p className="text-gray-600 font-medium">
                   {PRODUCT_STATUS_MESSAGES[product.status as keyof typeof PRODUCT_STATUS_MESSAGES] || 'This item is not available for purchase'}
                 </p>
              </div>
            )}

       
          </div>
        </div>
      </div>

      <LoginModal 
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="Login Required"
        description={`You need to be logged in to purchase "${product.title}". Please login or create an account to continue.`}
      />
    </div>
  );
} 