'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import ImageWithFallback from '@/components/ui/image-fallback';
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

const ITEMS_PER_PAGE = 20;

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
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <Skeleton className="h-96 w-full mb-4" />
            </div>
            <div className="col-span-4 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
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

  // Complex layout distribution
  const mainFeatured = displayedItems[0];
  const sidebarStories = displayedItems.slice(1, 6);
  const breakingNews = displayedItems.slice(5, 7);
  const centerSpotlight = displayedItems.slice(7, 10);
  const bottomGrid = displayedItems.slice(10, 15);
  const finalRow = displayedItems.slice(15);

  return (
    <div className="container mx-auto px-2 py-8 mt-8 bg-black/10">
      <div className="max-w-8xl mx-auto">
        <div className="mb-12 relative border-b-6 border-black pb-8">
          <div className="text-center mb-2 p-4 ">
            <div className="relative inline-block ">
   
      
              <h1 className="text-7xl font-metal tracking-widest">THE DAILY EDITORIAL</h1>
            
           
            <div className="flex justify-center mt-4 space-x-8">
              <span className="text-sm font-metal">VOLUME XCIV</span>
              <span className="text-sm font-metal">•</span>
              <span className="text-sm font-metal">{format(new Date(), 'EEEE, MMMM d, yyyy').toUpperCase()}</span>
              <span className="text-sm font-metal">•</span>
              <span className="text-sm font-metal">INTERNATIONAL EDITION</span>
              </div>
         
           
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="relative w-[350px]">
              <Input 
                type="text" 
                placeholder="Search archives..." 
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
            <div className="flex gap-2">
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">ALL</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">FASHION</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">LIFESTYLE</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">CULTURE</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">ART</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">OPINION</Button>
              <Button variant="outline" className="font-metal border-2 border-black hover:bg-red-900 hover:text-white text-xs px-3 py-2">WORLD</Button>
            </div>
          </div>
        </div>

        {/* Complex Multi-Section Layout */}
        <div className="space-y-8">
          
          {/* Main Feature + Sidebar Complex */}
          <section className="grid grid-cols-12 gap-6">
            {/* Main Featured Story - 8 columns */}
            {mainFeatured && (
              <div className="col-span-8">
                <div className="relative border-4 border-black bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <div className="absolute top-4 left-4 bg-red-900 text-white px-3 py-1 font-metal text-xs z-10">
                    FEATURED
                  </div>
                  {mainFeatured.image && (
                    <div className="relative h-80 border-b-4 border-black">
                      <ImageWithFallback
                        src={mainFeatured.image}
                        alt={mainFeatured.title}
                        fill
                        sizes="66vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-lg font-metal text-red-800 uppercase tracking-wider">{mainFeatured.source}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(mainFeatured.pubDate), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <a href={mainFeatured.link} target="_blank" rel="noopener noreferrer" className="block group">
                      <h2 className="font-gothic text-5xl mb-6 leading-tight group-hover:text-red-800 transition-colors">
                        {mainFeatured.title}
                      </h2>
                    </a>
                    <p className="text-gray-700 text-xl leading-relaxed mb-6">
                      {mainFeatured.description.replace(/<[^>]*>/g, '').substring(0, 300)}...
                    </p>
                    <a href={mainFeatured.link} target="_blank" rel="noopener noreferrer" className="text-red-800 hover:text-red-900 font-metal text-lg">
                      Continue Reading →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Stories - 4 columns */}
            <div className="col-span-4 space-y-4">
              <div className="bg-black text-white p-2 text-center">
                <h3 className="font-metal text-sm tracking-wider">TODAY'S HIGHLIGHTS</h3>
              </div>
              {sidebarStories.map((item, index) => (
                <article key={index} className="relative p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-900"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-900"></div>
                  <div className="flex gap-3">
                    {item.image && (
                      <div className="relative w-20 h-20 border border-black flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="text-xs font-metal text-red-800 uppercase">{item.source}</span>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                        <h4 className="font-gothic text-sm leading-tight group-hover:text-red-800 transition-colors line-clamp-3">
                          {item.title}
                        </h4>
                      </a>
                      <span className="text-xs text-gray-400">
                        {format(new Date(item.pubDate), 'MMM d')}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Breaking News Strip */}
          {breakingNews.length > 0 && (
            <section className="bg-red-900 text-white p-4 border-4 border-black">
              <div className="flex items-center gap-6">
                <div className="bg-white text-red-900 px-4 py-2 font-metal text-sm font-bold">
                  BREAKING
                </div>
                <div className="flex-1 grid grid-cols-2 gap-8">
                  {breakingNews.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline font-gothic text-sm">
                        {item.title.substring(0, 80)}...
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Center Spotlight - Asymmetric Grid */}
          {centerSpotlight.length >= 3 && (
            <section className="grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <article className="relative h-full border-3 border-black bg-white p-6">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-red-900"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-red-900"></div>
                  <div className="bg-black text-white px-3 py-1 inline-block mb-4">
                    <span className="font-metal text-xs">SPOTLIGHT</span>
                  </div>
                  {centerSpotlight[0].image && (
                    <div className="relative h-48 mb-4 border-2 border-black">
                      <ImageWithFallback
                        src={centerSpotlight[0].image}
                        alt={centerSpotlight[0].title}
                        fill
                        sizes="58vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <span className="text-sm font-metal text-red-800 uppercase ">{centerSpotlight[0].source}</span>
                    <a href={centerSpotlight[0].link} target="_blank" rel="noopener noreferrer" className="block group">
                      <h3 className="font-gothic text-2xl leading-tight group-hover:text-red-800 transition-colors">
                        {centerSpotlight[0].title}
                      </h3>
                    </a>
                    <p className="text-gray-600 line-clamp-4">
                      {centerSpotlight[0].description.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </article>
              </div>
              <div className="col-span-5 space-y-4">
                {centerSpotlight.slice(1, 3).map((item, index) => (
                  <article key={index} className="border-2 border-black p-4 bg-gray-50 h-[calc(50%-0.5rem)]">
                    <div className="flex gap-3 h-full">
                      {item.image && (
                        <div className="relative w-24 h-24 border border-black flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-metal text-red-800 uppercase">{item.source}</span>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                            <h4 className="font-gothic text-lg leading-tight group-hover:text-red-800 transition-colors line-clamp-3">
                              {item.title}
                            </h4>
                          </a>
                          <p className="text-gray-600 line-clamp-4">
                      {centerSpotlight[0].description.replace(/<[^>]*>/g, '')}
                    </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {format(new Date(item.pubDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Six-Column Complex Grid */}
          {bottomGrid.length >= 5 && (
            <section className="grid grid-cols-12 gap-3">
              {/* Large left item */}
              <article className="col-span-4 row-span-2 relative border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute top-2 right-2 bg-red-900 text-white px-2 py-1 text-xs font-metal">
                  EXCLUSIVE
                </div>
                {bottomGrid[0].image && (
                  <div className="relative h-48 border-b-2 border-black">
                    <ImageWithFallback
                      src={bottomGrid[0].image}
                      alt={bottomGrid[0].title}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-xs font-metal text-red-800 uppercase">{bottomGrid[0].source}</span>
                  <a href={bottomGrid[0].link} target="_blank" rel="noopener noreferrer" className="block group">
                    <h4 className="mt-2 font-gothic text-xl leading-tight group-hover:text-red-800 transition-colors mb-2">
                      {bottomGrid[0].title}
                    </h4>
                  </a>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {bottomGrid[0].description.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              </article>

              {/* Medium items */}
              {bottomGrid.slice(1, 3).map((item, index) => (
                <article key={index} className="col-span-4 border border-black p-3 bg-gray-50">
                  {item.image && (
                    <div className="relative h-32 mb-3 border border-black">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-metal text-red-800 uppercase">{item.source}</span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(item.pubDate), 'MMM d')}
                      </span>
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                      <h5 className="mt-2 font-gothic text-sm leading-tight group-hover:text-red-800 transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                    </a>
                    <p className="text-gray-600 text-xs line-clamp-3">
                      {item.description.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </article>
              ))}

              {/* Small items */}
              {bottomGrid.slice(3, 6).map((item, index) => (
                <article key={index} className="col-span-4 border border-gray-300 p-3 bg-white">
                  {item.image && (
                    <div className="relative h-24 mb-2 border border-black">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-metal text-red-800 uppercase">{item.source}</span>
                      <span className="text-xs text-gray-400">
                        {format(new Date(item.pubDate), 'MMM d')}
                      </span>
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                      <h6 className="mt-2 font-gothic text-xs leading-tight group-hover:text-red-800 transition-colors line-clamp-2">
                        {item.title}
                      </h6>
                    </a>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {item.description.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Final Row - Varied Columns */}
          {finalRow.length > 0 && (
            <section className="grid grid-cols-12 gap-4">
              <div className="col-span-3 space-y-3">
                <div className="bg-black text-white p-2 text-center">
                  <h3 className="font-metal text-xs">BRIEF</h3>
                </div>
                {finalRow.slice(0, 2).map((item, index) => (
                  <article key={index} className="border border-black p-3 bg-white">
                    {item.image && (
                      <div className="relative h-20 mb-2 border border-black">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-metal text-red-800 uppercase">{item.source}</span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(item.pubDate), 'MMM d')}
                        </span>
                      </div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                        <h6 className="mt-2 font-gothic text-xs leading-tight group-hover:text-red-800 transition-colors line-clamp-3">
                          {item.title}
                        </h6>
                      </a>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="col-span-6">
                {finalRow[2] && (
                  <article className="border-2 border-black p-4 bg-white h-full">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {finalRow[2].image && (
                        <div className="relative border border-black">
                          <ImageWithFallback
                            src={finalRow[2].image}
                            alt={finalRow[2].title}
                            fill
                            sizes="25vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="text-sm font-metal text-red-800 uppercase">{finalRow[2].source}</span>
                          <a href={finalRow[2].link} target="_blank" rel="noopener noreferrer" className="block group">
                            <h4 className="mt-2 font-gothic text-xl leading-tight group-hover:text-red-800 transition-colors">
                              {finalRow[2].title}
                            </h4>
                          </a>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-4">
                            {finalRow[2].description.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {format(new Date(finalRow[2].pubDate), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </article>
                )}
              </div>
              
              <div className="col-span-3 space-y-3">
                <div className="bg-red-900 text-white p-2 text-center">
                  <h3 className="font-metal text-xs">OPINION</h3>
                </div>
                {finalRow.slice(3, 5).map((item, index) => (
                  <article key={index} className="border-2 border-red-900 p-3 bg-red-50">
                    {item.image && (
                      <div className="relative h-20 mb-2 border border-black">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-metal text-red-800 uppercase">{item.source}</span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(item.pubDate), 'MMM d')}
                        </span>
                      </div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                        <h6 className="font-gothic text-xs leading-tight group-hover:text-red-800 transition-colors line-clamp-2">
                          {item.title}
                        </h6>
                      </a>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Load More */}
        {currentPage * ITEMS_PER_PAGE < feeds.flatMap((feed: FeedData) => feed.items).length && (
          <div className="text-center mt-16 border-t-4 border-black pt-8">
            <Button 
              onClick={loadMore}
              variant="outline"
              className="font-gothic px-12 py-6 text-xl border-4 border-black hover:bg-red-800 hover:text-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            >
              Load More Stories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}