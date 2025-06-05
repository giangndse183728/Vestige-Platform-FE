'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import Image from 'next/image';
import { Input } from "@/components/ui/input";

interface EditorialItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image: string | null;
  source: string;
}

interface FeedData {
  source: string;
  items: EditorialItem[];
  error?: string;
}

const ITEMS_PER_PAGE = 5;

export default function EditorialPage() {
  const [feeds, setFeeds] = useState<FeedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedItems, setDisplayedItems] = useState<EditorialItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch('/api/editorial');
        const data = await response.json();
        
        if (data.success) {
          setFeeds(data.data);
          const allItems = data.data.flatMap((feed: FeedData) => feed.items);
          const shuffledItems = allItems.sort(() => Math.random() - 0.5);
          setDisplayedItems(shuffledItems.slice(0, ITEMS_PER_PAGE));
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch editorial content');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const loadMore = () => {
    const allItems = feeds.flatMap((feed: FeedData) => feed.items);
    const shuffledItems = allItems.sort(() => Math.random() - 0.5);
    const nextPage = currentPage + 1;
    const newItems = shuffledItems.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedItems(newItems);
    setCurrentPage(nextPage);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-32">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="space-y-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-14">
                <Skeleton className="h-82 w-[600px]" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-32">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-gothic mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 relative">
          <div className="flex items-center justify-between">
            <div className="relative">
              <h1 className="text-5xl font-metal tracking-wider">EDITORIAL</h1>
              <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-red-900"></div>
              <div className="absolute -top-6 -right-6 w-8 h-8 border-t-2 border-r-2 border-red-900"></div>
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-b-2 border-l-2 border-red-900"></div>
              <div className="absolute -bottom-6 -right-6 w-8 h-8 border-b-2 border-r-2 border-red-900"></div>
            </div>
            <div className="relative w-[400px]">
              <Input 
                type="text" 
                placeholder="Search editorials..." 
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-black focus:border-red-900 focus:ring-red-900"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white">
                All
              </Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white">
                Fashion
              </Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white">
                Lifestyle
              </Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white">
                Culture
              </Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white">
                Art
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-16">
          {displayedItems.map((item, index) => (
            <article key={index} className="flex items-center gap-14 border-b border-black-200 pb-16">
              {item.image && (
                <div className="w-[600px] relative h-82 border-2 border-black bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_25%,rgba(0,0,0,0.02)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                  
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
              )}
              <div className="flex-1 relative p-2 bg-white/50">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-black"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-black"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-black"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-black"></div>
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <span className="text-md font-metal text-red-800 uppercase tracking-wider">{item.source}</span>
                    <span className="text-sm text-gray-500 ml-4">
                      {format(new Date(item.pubDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <h2 className="font-gothic text-2xl mb-4 group-hover:text-red-800 transition-colors">
                      {item.title}
                    </h2>
                  </a>
                  <div className="relative min-h-[160px]">
                    <p className="text-gray-700 line-clamp-4">
                      {item.description.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="absolute bottom-0 right-0">
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-800 hover:text-red-900 font-metal"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {currentPage * ITEMS_PER_PAGE < feeds.flatMap((feed: FeedData) => feed.items).length && (
          <div className="text-center mt-16">
            <Button 
              onClick={loadMore}
              variant="outline"
              className="font-gothic px-8 py-6 text-lg hover:bg-red-800 hover:text-white transition-colors"
            >
              Load More Stories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
