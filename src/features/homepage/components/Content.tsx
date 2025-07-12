"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FadeUp, Marquee } from '../../../components/animation/AnimatedWrapper';
import { useTopViewedProducts } from '@/features/products/hooks/useTopViewedProducts';
import { useNewArrivals } from '@/features/products/hooks/useNewArrivals';
import { Product } from '@/features/products/schema';
import { formatVNDPrice } from '@/utils/format';
import { ProductCard } from '@/features/products/components/ProductCard';

export default function NewspaperSlider() {
  const router = useRouter();
  const { data: topViewedData, isLoading: isLoadingTopViewed, isError: isErrorTopViewed } = useTopViewedProducts();
  const [topViewedCurrentPage, setTopViewedCurrentPage] = useState(0);
  const topViewedProducts: Product[] = topViewedData?.content || [];
  const topViewedTotalPages = Math.ceil(topViewedProducts.length / 4);


  const { data: newArrivalsData, isLoading: isLoadingNewArrivals, isError: isErrorNewArrivals } = useNewArrivals();
  const [newArrivalsCurrentPage, setNewArrivalsCurrentPage] = useState(0);
  const newArrivalsProducts: Product[] = newArrivalsData?.content || [];
  const newArrivalsTotalPages = Math.ceil(newArrivalsProducts.length / 4);
  
  const topViewedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (topViewedTotalPages > 1) {
      topViewedIntervalRef.current = setInterval(() => {
        setTopViewedCurrentPage((prev) => (prev + 1) % topViewedTotalPages);
      }, 6000);
    }
    return () => {
      if (topViewedIntervalRef.current) clearInterval(topViewedIntervalRef.current);
    };
  }, [topViewedTotalPages]);

  const handleTopViewedPageChange = (index: number) => {
    setTopViewedCurrentPage(index);
    if (topViewedIntervalRef.current) clearInterval(topViewedIntervalRef.current);
    if (topViewedTotalPages > 1) {
      topViewedIntervalRef.current = setInterval(() => {
        setTopViewedCurrentPage((prev) => (prev + 1) % topViewedTotalPages);
      }, 6000);
    }
  };
  
  const handleNewArrivalsPageChange = (index: number) => {
    let newIndex = index;
    if (index < 0) {
      newIndex = newArrivalsTotalPages - 1;
    } else if (index >= newArrivalsTotalPages) {
      newIndex = 0;
    }
    setNewArrivalsCurrentPage(newIndex);
  };

  const handleCategoryClick = () => {
    router.push('/categories');
  };

  const renderTopViewedSlider = () => {
    if (isLoadingTopViewed) {
      return (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="font-serif mt-4">Loading Top Products...</p>
        </div>
      );
    }
    if (isErrorTopViewed) {
      return (
        <div className="text-center py-10 text-red-600">
          <p className="font-serif text-xl font-bold mb-2">Error Loading Products</p>
          <p className="font-mono text-sm">Could not fetch top-viewed products. Please try again later.</p>
        </div>
      );
    }
    if (topViewedProducts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="font-serif text-xl font-bold mb-2">No Products to Showcase</p>
          <p className="font-mono text-sm">There are currently no top-viewed products available.</p>
        </div>
      );
    }

    return (
      <>
        <div className="relative overflow-hidden border-2 border-black bg-white/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)]">
          <motion.div
            className="flex"
            animate={{ x: `-${topViewedCurrentPage * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {Array.from({ length: topViewedTotalPages }).map((_, pageIndex) => {
              const pageProducts = topViewedProducts.slice(pageIndex * 4, pageIndex * 4 + 4);
              return (
                <div key={pageIndex} className="grid w-full flex-shrink-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {pageProducts.map((product) => (
                    <div key={product.productId} className="border-r-2 border-black last:border-r-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              );
            })}
          </motion.div>
        </div>
        <FadeUp>
          <div className="flex items-center justify-between border-b-2 border-black p-4 bg-white mb-10">
            <button onClick={() => handleTopViewedPageChange((topViewedCurrentPage - 1 + topViewedTotalPages) % topViewedTotalPages)} className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group">
              <span className="mr-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">←</span>
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: topViewedTotalPages }).map((_, idx) => (
                <button key={idx} onClick={() => handleTopViewedPageChange(idx)} className={clsx("w-8 h-8 flex items-center justify-center transition-all duration-300 border", topViewedCurrentPage === idx ? "bg-black text-white font-gothic border-black" : "border-black/30 text-black/70 font-serif hover:border-black/60")} aria-label={`Go to page ${idx + 1}`}>
                  {idx + 1}
                </button>
              ))}
            </div>
            <button onClick={() => handleTopViewedPageChange((topViewedCurrentPage + 1) % topViewedTotalPages)} className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group">
              Next
              <span className="ml-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">→</span>
            </button>
          </div>
        </FadeUp>
      </>
    );
  };

  const renderNewArrivalsSlider = () => {
    if (isLoadingNewArrivals) {
        return (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="font-serif mt-4">Loading New Arrivals...</p>
          </div>
        );
      }
      if (isErrorNewArrivals) {
        return (
          <div className="text-center py-10 text-red-600">
            <p className="font-serif text-xl font-bold mb-2">Error Loading New Arrivals</p>
            <p className="font-mono text-sm">Could not fetch new arrivals. Please try again later.</p>
          </div>
        );
      }
      if (newArrivalsProducts.length === 0) {
        return (
          <div className="text-center py-10">
            <p className="font-serif text-xl font-bold mb-2">No New Arrivals</p>
            <p className="font-mono text-sm">There are currently no new products to show.</p>
          </div>
        );
      }

    return (
      <>
        <div className="relative overflow-hidden border-2 border-black bg-white/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)]">
          <motion.div
            className="flex"
            animate={{ x: `-${newArrivalsCurrentPage * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {Array.from({ length: newArrivalsTotalPages }).map((_, pageIndex) => {
              const pageProducts = newArrivalsProducts.slice(pageIndex * 4, pageIndex * 4 + 4);
              return (
                <div key={pageIndex} className="grid w-full flex-shrink-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {pageProducts.map((product) => (
                    <div key={product.productId} className="border-r-2 border-black last:border-r-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              );
            })}
          </motion.div>
        </div>
        <FadeUp>
          <div className="flex items-center justify-between border-b-2 border-black p-4 bg-white mb-10">
            <button onClick={() => handleNewArrivalsPageChange(newArrivalsCurrentPage - 1)} className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group">
              <span className="mr-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">←</span>
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: newArrivalsTotalPages }).map((_, idx) => (
                <button key={idx} onClick={() => handleNewArrivalsPageChange(idx)} className={clsx("w-8 h-8 flex items-center justify-center transition-all duration-300 border", newArrivalsCurrentPage === idx ? "bg-black text-white font-gothic border-black" : "border-black/30 text-black/70 font-serif hover:border-black/60")} aria-label={`Go to page ${idx + 1}`}>
                  {idx + 1}
                </button>
              ))}
            </div>
            <button onClick={() => handleNewArrivalsPageChange(newArrivalsCurrentPage + 1)} className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group">
              Next
              <span className="ml-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">→</span>
            </button>
          </div>
        </FadeUp>
      </>
    );
  };
  
  return (
    <section className="w-full relative overflow-hidden">
      <div className="container mx-auto relative z-10"> 
        <FadeUp delay={0.2}>
          <div className="flex flex-col items-center justify-center max-w-full mx-auto bg-white/60 backdrop-blur-3xs border-black p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
            <div className="font-serif italic font-bold text-xs text-black/60 tracking-wider uppercase mb-1">Volume III • Edition No. 21</div>
            <h2 className="font-metal text-5xl md:text-6xl text-black relative mb-4 text-center tracking-tight">
              Product Showcase
            </h2>
            <p className="font-serif text-center max-w-xl mx-auto text-black/70 leading-relaxed border-black/15 py-2">
              Discover our curated collection of exclusive designs crafted for the modern lifestyle.
              Each piece tells a unique story of craftsmanship and innovation.
            </p>
                          <div className="flex justify-center gap-4 mt-4">
                <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors" onClick={handleCategoryClick}>Top</button>
                <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors" onClick={handleCategoryClick}>Bottom</button>
                <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors" onClick={handleCategoryClick}>Outerwear</button>
                <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors" onClick={handleCategoryClick}>Footwear</button>
                <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors" onClick={handleCategoryClick}>Tailoring</button>
                <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors" onClick={handleCategoryClick}>Accessories</button>
              </div>
            <FadeUp delay={0.5}>
              <div className="mt-6 py-1 bg-black/10 backdrop-blur-sm">
                <Marquee text="/ Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish / Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish /" />
              </div>
            </FadeUp>
          </div>
        </FadeUp>
        
        {renderTopViewedSlider()}
      </div>

      <FadeUp delay={0.5}>
        <div className="my-6 py-1 bg-black/10 backdrop-blur-sm">
          <Marquee text="/ Brand-New / Up-To-Date / Lastest / New-Arrival / Just-In / Brand-New / Up-To-Date / Lastest / New-Arrival / Just-In /" />
        </div>
      </FadeUp>

      <div className="container mx-auto relative z-10">
        {renderNewArrivalsSlider()}
      </div>
    </section>
  );
}
