"use client";
import { useTopLikedProducts } from '@/features/products/hooks/useTopProducts';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatVNDPrice } from '@/utils/format';
import { Heart } from 'lucide-react';

export default function TopLikedProductsList() {
  const { data, isLoading, error } = useTopLikedProducts();
  if (isLoading) return <div className="text-center text-gray-500 font-gothic">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-gothic">Failed to load products.</div>;
  if (!data || data.content.length === 0) return <div className="text-center text-gray-500 font-gothic">No liked products found.</div>;
  return (
    <ul className="">
      {data.content.slice(0, 3).map((product, idx, arr) => (
        <li
          key={product.productId}
          className={`flex items-center p-2 bg-white/80 hover:bg-gray-50 transition justify-between ${
            idx !== arr.length - 1 ? 'border-b-2 border-black' : ''
          }`}
        >
          <Link href={`/products/${product.slug}`} className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src={product.primaryImageUrl}
                alt={product.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-base text-black truncate">{product.title}</div>
              <div className="font-metal text-sm text-red-900">{formatVNDPrice(product.price)}</div>
            </div>
          </Link>
          <div className="flex items-center gap-1 font-gothic text-sm ml-4 min-w-[40px] justify-end">
            <Heart
              className="w-4 h-4 text-red-900 stroke-black"
              fill="#991b1b"
              strokeWidth={1}
            />
            <span>{product.likesCount ?? 0}</span>
          </div>
        </li>
      ))}
    </ul>
  );
} 