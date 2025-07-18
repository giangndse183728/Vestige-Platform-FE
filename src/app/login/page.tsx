"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';

import LoginForm from '@/features/auth/components/LoginForm';
import SignupForm from '@/features/auth/components/SignupForm';

const queryClient = new QueryClient();

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/loginBackground.jpg)',
          }}
        >
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${activeTab === 'signup' ? 'opacity-40' : 'opacity-90'}`} />
        </div>

        <div className={`w-full ${activeTab === 'signup' ? 'max-w-3xl' : 'max-w-md'} z-10 transition-all duration-500 ease-in-out`}>
          <Card
            variant='default'
            className="border-2 border-black/10 shadow-lg bg-white/95 rounded-none overflow-hidden"
          >
            {activeTab === 'login' && (
              <div className="text-center p-6 relative border-b border-black/10">
                <div className="absolute top-1 left-1 w-12 h-12 border-l-2 border-t-2 border-black/40"></div>
                <div className="absolute top-1 right-1 w-12 h-12 border-r-2 border-t-2 border-black/40"></div>
            
                <h1 
                  className="font-metal text-3xl relative mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleLogoClick}
                >
                  <span className="text-black">VES</span>
                  <span className="text-red-900">TIGE</span>
                </h1>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="h-px bg-red-800 flex-1 max-w-[60px]"></div>
                 
                  <p className="text-xs text-gray-600 uppercase tracking-widest">Member Access</p>
                  
                  <div className="h-px bg-red-800 flex-1 max-w-[60px]"></div>
                </div>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="text-center p-4 relative border-b border-black/10">
                <div className="absolute top-1 left-1 w-12 h-12 border-l-2 border-t-2 border-black/40"></div>
                <div className="absolute top-1 right-1 w-12 h-12 border-r-2 border-t-2 border-black/40"></div>
            
                <h1 
                  className="font-metal text-3xl relative mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleLogoClick}
                >
                  <span className="text-black">VES</span>
                  <span className="text-red-900">TIGE</span>
                </h1>
              </div>
            )}

            <CardContent className={`${activeTab === 'signup' ? 'p-8 pt-4' : 'p-6'}`}>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent rounded-none">
                  <TabsTrigger 
                    value="login" 
                    className="font-serif data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-800 rounded-none border-b border-black/10"
                  >
                    <span className="flex flex-col items-center">
                      <span>Sign In</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="font-serif data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-800 rounded-none border-b border-black/10"
                  >
                    <span className="flex flex-col items-center">
                      <span>Register</span>
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="signup">
                  <SignupForm />
                </TabsContent>
              </Tabs>
            </CardContent>
            
            {activeTab === 'login' && (
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between text-xs font-serif text-gray-500 border-t border-black/10 pt-2">
                  <div>VESTIGE © {new Date().getFullYear()}</div>
                  <div>All Rights Reserved</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  );
}
