// components/auth/LoginForm.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Lock, Plus } from 'lucide-react';
import { loginSchema, LoginFormData } from "../schema";
import { useLogin } from "../hooks/useAuth";
import Image from 'next/image';

export default function LoginForm() {
  const login = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormData) {
    try {
      await login.mutateAsync(values);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card variant="decorated">
          <CardContent className="p-10">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input 
                          placeholder="your.name@example.com" 
                          className="border-black/20 focus-visible:ring-red-800/20 rounded-none pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="border-black/20 focus-visible:ring-red-800/20 rounded-none pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-700" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          icon={<Plus strokeWidth={3}/>}
          type="submit" 
          className="w-full bg-red-800 hover:bg-red-900 text-white/90 font-serif rounded-none mt-2"
          disabled={login.isPending}
        >
          {login.isPending ? 'Signing In...' : 'Sign In'}
        </Button>

        <Button 
          type="button"
          variant="outline"
          className="w-full border-black/20 hover:bg-gray-50 font-serif rounded-none flex items-center justify-center"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
          <span>Continue with Google</span>
        </Button>
      </form>
    </Form>
  );
}