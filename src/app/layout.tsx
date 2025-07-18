'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Metal_Mania, Cinzel } from 'next/font/google';
import Script from "next/script";
import ChatSpeedDial from "@/features/chatbot/components/chat-speed-dial";
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { useState } from "react";
import { ROUTES_NO_LAYOUT } from "@/constants/routes";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});


const metalMania = Metal_Mania({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-metal-mania',
  display: 'swap',
  preload: true,
});


const cinzel = Cinzel({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const noLayout = ROUTES_NO_LAYOUT.includes(pathname)
    || pathname.startsWith("/admin")
    || pathname.startsWith("/order-details/")
    || pathname.startsWith("/shipper");

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/background.jpg" as="image" />
        <link rel="icon" type="image/png" href="/fav.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${metalMania.variable} ${cinzel.variable} antialiased text-gray-900 overlay-scroll`}>
      <QueryClientProvider client={queryClient}>
        {noLayout ? (
 
       <main className="flex-1 relative z-10">
       <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-fixed opacity-95 pointer-events-none"></div>
       <div className="relative z-10 ">
         {children}
       </div>
     </main>
          
        ) : (
          <div className="flex flex-col min-h-screen relative">
            <div className="fixed bottom-0 left-0 w-[150px] h-[150px] pointer-events-none z-20">
              <div className="absolute bottom-0 left-0 w-[3px] h-[60px] bg-gradient-to-t from-[rgba(190,0,0,0.8)] to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-[60px] h-[3px] bg-gradient-to-r from-[rgba(190,0,0,0.8)] to-transparent"></div>
            </div>
            <div className="fixed bottom-0 right-0 w-[150px] h-[150px] pointer-events-none z-20">
              <div className="absolute bottom-0 right-0 w-[3px] h-[60px] bg-gradient-to-t from-[rgba(190,0,0,0.8)] to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-[60px] h-[3px] bg-gradient-to-l from-[rgba(190,0,0,0.8)] to-transparent"></div>
            </div>
            
            <Navbar />
            
            <main className="flex-1 relative z-10">
              <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-fixed opacity-95 pointer-events-none"></div>
              <div className="relative z-10 py-8">
                {children}
              </div>
            </main>
            <Footer />
            <ChatSpeedDial />
          </div>
        )}
        
        <Script id="font-optimization" strategy="afterInteractive">
          {`
            if (document.fonts && document.fonts.ready) {
              document.fonts.ready.then(() => {
                const style = document.createElement('style');
                style.textContent = '@font-face { font-display: swap !important; }';
                document.head.appendChild(style);
              });
            }
          `}
        </Script>
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
         <Toaster />
      </body>
    </html>
  );
}
