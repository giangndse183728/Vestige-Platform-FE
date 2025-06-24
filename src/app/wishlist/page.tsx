'use client';

import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/features/wishlist/store';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Product } from '@/features/products/schema';
import { format } from 'date-fns';
import { Marquee } from '@/components/animation/AnimatedWrapper';

export default function WishlistPage() {
    const wishlistStore = useWishlistStore();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    useEffect(() => {
        setWishlistItems(wishlistStore.wishlist);
        const unsubscribe = useWishlistStore.subscribe(
            (state) => setWishlistItems(state.wishlist)
        );
        return () => unsubscribe();
    }, [wishlistStore.wishlist]);

    if (wishlistItems.length === 0) {
        return (
            <div className="container mx-auto py-12 px-4 mt-10 sm:px-6 lg:px-8">
                <div className="relative border-b-4 border-black pb-8 text-center">
                    <h1 className="text-7xl font-metal tracking-widest">MY WISHLIST</h1>
                    <div className="flex justify-center mt-4 space-x-8">
                        <span className="text-sm font-metal">{format(new Date(), 'EEEE, MMMM d, yyyy').toUpperCase()}</span>
                    </div>
                </div>
                <div className=" py-1 bg-black/10 backdrop-blur-sm">
                    <Marquee text="/ Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish / Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish /" />
                </div>
                <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-xl font-serif text-gray-600">Your wishlist is currently empty.</p>
                    <p className="mt-2 text-gray-500">Start exploring and add some items you love!</p>
                </div>
            </div>
        );
    }

    const mainFeatured = wishlistItems[0];
    const sidebarStories = wishlistItems.slice(1, 5);
    const centerSpotlight = wishlistItems.slice(5, 8);
    const wideBanner = wishlistItems[8];
    const bottomGrid = wishlistItems.slice(9, 15);
    const remainingItems = wishlistItems.slice(15);

    return (
        <div className="container mx-auto px-2 py-8 mt-10 bg-black/10">
            <div className="max-w-8xl mx-auto">
                <div className=" relative border-b-4 border-black pb-8 text-center">
                    <h1 className="text-7xl font-metal tracking-widest">MY WISHLIST</h1>
                    <div className="flex justify-center mt-4 space-x-8">
                        <span className="text-sm font-metal text-red-900">{`${wishlistItems.length} ITEMS`}</span>
                        <span className="text-sm font-metal">•</span>
                        <span className="text-sm font-metal">{format(new Date(), 'EEEE, MMMM d, yyyy').toUpperCase()}</span>
                    </div>
                </div>
                <div className=" py-1 bg-black/10 backdrop-blur-sm">
                    <Marquee text="/ Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish / Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish /" />
                </div>
                <div className="space-y-8">

                    <section className="grid grid-cols-12 gap-6">
                        {mainFeatured && (
                            <div className="col-span-12 lg:col-span-8">
                                <ProductCard product={mainFeatured} />
                            </div>
                        )}
                        <div className="col-span-12 lg:col-span-4 space-y-4">
                            {sidebarStories.map((item) => (
                                <ProductCard key={item.productId} product={item} />
                            ))}
                        </div>
                    </section>

                    {/* Center Spotlight */}
                    {centerSpotlight.length > 0 && (
                        <section className="grid grid-cols-12 gap-4">
                            {centerSpotlight[0] && (
                                <div className="col-span-12 md:col-span-7">
                                    <ProductCard product={centerSpotlight[0]} />
                                </div>
                            )}
                            <div className="col-span-12 md:col-span-5 space-y-4">
                                {centerSpotlight.slice(1, 3).map((item) => (
                                    <ProductCard key={item.productId} product={item} />
                                ))}
                            </div>
                        </section>
                    )}

                    {wideBanner && (
                        <section>
                            <ProductCard product={wideBanner} />
                        </section>
                    )}

                    {bottomGrid.length > 0 && (
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bottomGrid.map((item) => (
                                <ProductCard key={item.productId} product={item} />
                            ))}
                        </section>
                    )}

                    {remainingItems.length > 0 && (
                        <section className="border-t-4 border-black mt-8 pt-8">
                            <h2 className="text-3xl font-metal text-center mb-8">More from your Wishlist</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {remainingItems.map((item) => (
                                    <ProductCard key={item.productId} product={item} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
