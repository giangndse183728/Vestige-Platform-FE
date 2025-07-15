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
    const sidebarStories = wishlistItems.slice(1, 2);
    const normalGrid = wishlistItems.slice(5);

    return (
        <div className="container mx-auto py-8 mt-10 bg-black/10">
            <div className="max-w-8xl mx-auto">
                <div className="relative border-b-4 border-black pb-8 text-center">
                    <h1 className="text-7xl font-metal tracking-widest">MY WISHLIST</h1>
                    <div className="flex justify-center mt-4 space-x-8">
                        <span className="text-sm font-metal text-red-900">{`${wishlistItems.length} ITEMS`}</span>
                        <span className="text-sm font-metal">•</span>
                        <span className="text-sm font-metal">{format(new Date(), 'EEEE, MMMM d, yyyy').toUpperCase()}</span>
                    </div>
                </div>
                <div className="py-1 bg-black/10 backdrop-blur-sm">
                    <Marquee text="/ Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish / Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish /" />
                </div>
                <div className="">
                    <section className="grid grid-cols-12 h-full ">
                        {mainFeatured && (
                            <div className="col-span-12 lg:col-span-6 flex">
                                <div className="w-full aspect-square">
                                    <ProductCard product={mainFeatured} />
                                </div>
                            </div>
                        )}
                        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                            {sidebarStories.map((item) => (
                                <div key={item.productId} >
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>
                
                    </section>
                    {normalGrid.length > 0 && (
                        <section>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                                {normalGrid.map((item) => (
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
