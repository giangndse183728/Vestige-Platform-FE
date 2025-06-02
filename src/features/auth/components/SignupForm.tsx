// components/auth/SignupForm.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Lock, Phone, User, Users } from 'lucide-react';
import { DatePickerDemo } from "@/components/ui/date-picker";
import { signupSchema, SignupFormData } from '../schema';
import { useSignup } from "../hooks/useAuth";

export default function SignupForm() {
  const signup = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: SignupFormData) {
    try {
      await signup.mutateAsync(values);
    } catch (error) {
      console.error('Signup error:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <Card variant="decorated">
          <CardContent className="p-12">
            <div className="space-y-4">
              <div className="flex gap-8 items-start">
                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-serif text-base whitespace-nowrap">First Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                              <Input 
                                placeholder="First name" 
                                className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-800" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-serif text-base whitespace-nowrap">Last Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                              <Input 
                                placeholder="Last name" 
                                className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-800" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base whitespace-nowrap">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input 
                              placeholder="Enter username" 
                              className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-800" />
                      </FormItem>
                    )}
                  />
                </div>
             
                <div className="flex-1 space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base whitespace-nowrap">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input 
                              type="password" 
                              placeholder="Enter password" 
                              className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-800" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base whitespace-nowrap">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input 
                              type="password" 
                              placeholder="Confirm password" 
                              className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-800" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10"></div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="px-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input 
                              placeholder="your.name@example.com" 
                              className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-800" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-base whitespace-nowrap">Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input 
                              placeholder="(123) 456-7890" 
                              className="border-black/20 focus-visible:ring-red-800/20 rounded-none h-11 w-full pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-800" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-red-800 hover:bg-red-900 text-white/90 font-serif rounded-none h-12 text-lg"
          disabled={signup.isPending}
        >
          {signup.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}