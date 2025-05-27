"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FadeUp, Marquee } from '../../../components/animation/AnimatedWrapper';

const products = [
  {
    id: 1,
    title: "Premium Collection",
    headline: "EXCLUSIVE",
    description: "Exclusive designs for the modern lifestyle",
    price: "$129.99",
    image: "/rick.png",
    category: "New Arrivals"
  },
  {
    id: 2,
    title: "Seasonal Favorites",
    headline: "EDITOR'S PICK",
    description: "Trending items you don't want to miss this season",
    price: "$89.99",
    image: "/rick.png",
    category: "Featured"
  },
  {
    id: 3,
    title: "Limited Edition",
    headline: "LIMITED",
    description: "Unique pieces available for a short time only",
    price: "$149.99",
    image: "/rick.png",
    category: "Limited"
  },
  {
    id: 4,
    title: "New Arrivals",
    headline: "JUST IN",
    description: "Fresh designs just added to our catalog",
    price: "$109.99",
    image: "/rick.png",
    category: "New Arrivals"
  },
  {
    id: 5,
    title: "Best Sellers",
    headline: "POPULAR",
    description: "Our most popular items customers love",
    price: "$119.99",
    image: "/rick.png",
    category: "Featured"
  },
  {
    id: 6,
    title: "Architectural Pieces",
    headline: "CONCEPTUAL",
    description: "Bold designs with architectural influences",
    price: "$159.99",
    image: "/rick.png",
    category: "Limited"
  },
  {
    id: 7,
    title: "Monochrome Collection",
    headline: "ESSENTIAL",
    description: "Timeless monochrome pieces for any wardrobe",
    price: "$99.99",
    image: "/rick.png",
    category: "New Arrivals"
  },
  {
    id: 8,
    title: "Avant-Garde Selection",
    headline: "FORWARD",
    description: "Progressive designs pushing boundaries",
    price: "$179.99",
    image: "/rick.png",
    category: "Featured"
  },
];

export default function NewspaperSlider() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(products.length / 4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalPages]);

  const handleDotClick = (index: number) => {
    setCurrentPage(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);
  };

  return (
    <section className="w-full  relative overflow-hidden">
      <div className="container mx-auto relative z-10"> 
        
        <FadeUp delay={0.2}>
          <div className="flex flex-col items-center justify-center max-w-full mx-auto bg-white/60 backdrop-blur-3xs  border-black p-8 relative overflow-hidden">
            {/*  background */}
            <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />
            
            <div className="font-serif italic font-bold text-xs text-black/60 tracking-wider uppercase mb-1">Volume III • Edition No. 21</div>
            <h2 className="font-metal text-5xl md:text-6xl text-black relative mb-4 text-center tracking-tight">
              Product Showcase
            </h2>
           
          
            <p className="font-serif text-center max-w-xl mx-auto text-black/70 leading-relaxed  border-black/15 py-2">
              Discover our curated collection of exclusive designs crafted for the modern lifestyle.
              Each piece tells a unique story of craftsmanship and innovation.
            </p>

            {/* Category Filter Placeholder */}
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors">Top</button>
              <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors">Bottom</button>
              <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors">Outerwear</button>
              <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors">Footwear</button>
              <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors">Tailoring</button>
              <button className="px-4 py-2 border border-black text-black text-sm font-metal uppercase hover:bg-black hover:text-white transition-colors">Accessories</button>
              
              {/* Add more categories as needed */}
            </div>

            <FadeUp delay={0.5}>
          <div className="mt-6 py-1 bg-black/10 backdrop-blur-sm">
            <Marquee text="Trending / Viral / On Fire / Buzzing / In vouge / Hot / Stylish" />
          </div>
        </FadeUp>
            
          </div>
        </FadeUp>
        
        
        <div className="relative overflow-hidden border-2 border-black shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] min-h-[550px] bg-white/95 ">
         
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const startIdx = pageIndex * 4;
            const pageProducts = products.slice(startIdx, startIdx + 4);
            
            return (
              <motion.div
                key={pageIndex}
                className="absolute top-0 left-0  w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ 
                  opacity: currentPage === pageIndex ? 1 : 0,
                  x: currentPage === pageIndex ? 0 : "100%" 
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  zIndex: currentPage === pageIndex ? 10 : 1,
                  display: Math.abs(currentPage - pageIndex) <= 1 ? "grid" : "none"
                }}
              >
                {pageProducts.map((product, idx) => (
                  <FadeUp 
                    key={product.id} 
                    delay={0.2 + idx * 0.1}
                    className={clsx(
                      "group relative bg-white/90 backdrop-blur-sm overflow-hidden",
                      "border-black",
                      (idx % 4 !== 3) && "border-r-2",
                    )}
                  >
                    <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
                      {product.headline}
                    </div>
                    
                    <div className="relative h-80 overflow-hidden bg-gray-100 border border-black/10">
                      <Image 
                        src={product.image} 
                        alt={product.title}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                      />
                     
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-3 border-b border-black/10 pb-1">
                        <span className="text-[var(--dark-red)] mr-2">—</span>
                        <span className="font-gothic text-xs uppercase tracking-wider text-black/80">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold mb-3 leading-tight">{product.title}</h3>
                      <p className="text-black/70 text-sm mb-5 font-serif">{product.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-black/10 pt-3">
                        <span className="font-metal text-[var(--dark-red)]">{product.price}</span>
                        <Link 
                          href={`/products/${product.id}`}
                          className="group-hover:underline text-sm font-serif flex items-center hover:text-[var(--dark-red)] transition-colors"
                        >
                          View Details
                          <motion.span 
                            className="inline-block ml-1"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                          >→</motion.span>
                        </Link>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </motion.div>
            );
          })}
          
        </div>
        
        
        <FadeUp >
          <div className="flex items-center justify-between border-b-2 border-black p-4 bg-white mb-10">
            <button 
              onClick={() => handleDotClick((currentPage - 1 + totalPages) % totalPages)}
              className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group"
            >
              <span className="mr-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">←</span>
              Previous
            </button>
            
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={clsx(
                    "w-8 h-8 flex items-center justify-center transition-all duration-300 border",
                    idx === currentPage 
                      ? "bg-black text-white font-gothic border-black" 
                      : "border-black/30 text-black/70 font-serif hover:border-black/60"
                  )}
                  aria-label={`Go to page ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handleDotClick((currentPage + 1) % totalPages)}
              className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group"
            >
              Next
              <span className="ml-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">→</span>
            </button>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.5}>
          <div className="my-6 py-1 bg-black/10 backdrop-blur-sm">
            <Marquee text="Brand-New / Up-To-Date / Lastest / New-Arrival / Just-In / " />
          </div>
        </FadeUp>

      <div className="container mx-auto relative z-10"> 
          
        <div className="relative overflow-hidden border-2 border-black shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] min-h-[550px] bg-white/95 ">
         
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const startIdx = pageIndex * 4;
            const pageProducts = products.slice(startIdx, startIdx + 4);
            
            return (
              <motion.div
                key={pageIndex}
                className="absolute top-0 left-0  w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ 
                  opacity: currentPage === pageIndex ? 1 : 0,
                  x: currentPage === pageIndex ? 0 : "100%" 
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                  zIndex: currentPage === pageIndex ? 10 : 1,
                  display: Math.abs(currentPage - pageIndex) <= 1 ? "grid" : "none"
                }}
              >
                {pageProducts.map((product, idx) => (
                  <FadeUp 
                    key={product.id} 
                    delay={0.2 + idx * 0.1}
                    className={clsx(
                      "group relative bg-white/90 backdrop-blur-sm overflow-hidden",
                      "border-black",
                      (idx % 4 !== 3) && "border-r-2",
                    )}
                  >
                    <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-black text-white text-xs font-metal uppercase shadow-sm">
                      {product.headline}
                    </div>
                    
                    <div className="relative h-80 overflow-hidden bg-gray-100 border border-black/10">
                      <Image 
                        src={product.image} 
                        alt={product.title}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                      />
                     
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-3 border-b border-black/10 pb-1">
                        <span className="text-[var(--dark-red)] mr-2">—</span>
                        <span className="font-gothic text-xs uppercase tracking-wider text-black/80">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold mb-3 leading-tight">{product.title}</h3>
                      <p className="text-black/70 text-sm mb-5 font-serif">{product.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-black/10 pt-3">
                        <span className="font-metal text-[var(--dark-red)]">{product.price}</span>
                        <Link 
                          href={`/products/${product.id}`}
                          className="group-hover:underline text-sm font-serif flex items-center hover:text-[var(--dark-red)] transition-colors"
                        >
                          View Details
                          <motion.span 
                            className="inline-block ml-1"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                          >→</motion.span>
                        </Link>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </motion.div>
            );
          })}
          
        </div>
        
        
        <FadeUp >
          <div className="flex items-center justify-between border-b-2 border-black p-4 bg-white mb-10">
            <button 
              onClick={() => handleDotClick((currentPage - 1 + totalPages) % totalPages)}
              className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group"
            >
              <span className="mr-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">←</span>
              Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={clsx(
                    "w-8 h-8 flex items-center justify-center transition-all duration-300 border",
                    idx === currentPage 
                      ? "bg-black text-white font-gothic border-black" 
                      : "border-black/30 text-black/70 font-serif hover:border-black/60"
                  )}
                  aria-label={`Go to page ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handleDotClick((currentPage + 1) % totalPages)}
              className="font-gothic text-sm uppercase flex items-center hover:text-[var(--dark-red)] transition-colors group"
            >
              Next
              <span className="ml-2 w-8 h-8 flex items-center justify-center border border-black/40 group-hover:bg-[var(--dark-red)]/5 transition-colors">→</span>
            </button>
          </div>
        </FadeUp>
        
      </div>
    </section>
  );
}
