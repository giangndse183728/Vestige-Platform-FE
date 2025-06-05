"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/features/cart/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const { items, removeItem, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-metal mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button variant="corner-red" className="px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="flex mb-12 bg-white/80 border-l-5 border-red-800 p-2">
        <div className="relative ml-14">
          <h1 className="text-4xl font-metal">SHOPPING CART</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-black">
            {/* Header */}
            <div className="border-b-2 border-black p-4">
              <h2 className="text-xl font-metal">Your Items: {items.length} items</h2>
            </div>
            
            {/* Items List */}
            <div className="divide-y-2 divide-black">
              {items.map((item) => (
                <div key={item.productId} className="p-4">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 border-2 border-black">
                      <Image
                        src="/rick.png"
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <h3 className="text-lg font-serif font-bold">{item.title}</h3>
                          <div className="flex items-center justify-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="font-medium">By {item.seller.firstName} {item.seller.lastName}</span>
                            <span>•</span>
                            <span>{item.brand.name}</span>
                            <span>•</span>
                            <span>{item.category.name}</span>
                          </div>
                          {(item.size || item.color) && (
                            <div className="text-sm mt-1">
                              {item.size && <span className="font-medium">Size:</span>} {item.size}
                              {item.size && item.color && <span className="mx-2">•</span>}
                              {item.color && <span className="font-medium">Color:</span>} {item.color}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-xl font-metal text-[var(--dark-red)]">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <Card variant="decorated">
          <CardContent className="p-10">
            <h2 className="text-xl font-metal mb-6 border-b-2 border-black pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t-2 border-black pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-[var(--dark-red)]">${totalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button variant="corner-red" className="w-full">
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
