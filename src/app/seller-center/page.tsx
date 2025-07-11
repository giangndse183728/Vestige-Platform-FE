'use client';

import { useState } from 'react';
import { CreateProduct } from '@/features/products/components/CreateProduct';
import { InventoryTab } from '@/features/products/components/InventoryTab';
import { CustomerOrdersTab } from '@/features/order/components/CustomerOrdersTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Plus } from 'lucide-react';

export default function SellerCenterPage() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="container mx-auto py-4 mt-1 overflow-hidden px-6">
      <div className="mb-8 text-center border-b-4 border-black pb-6">
        <h1 className="font-serif text-5xl font-bold text-black mb-2 tracking-wide">
          THE SELLER HERALD
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="border-l-2 border-r-2 border-black px-4 font-mono">
            SELLER DASHBOARD
          </span>
          <span className="font-mono">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="w-full ">
            <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-none border-2 ">
                <TabsTrigger 
                  value="inventory" 
                  className="font-serif data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-800 rounded-none border-b border-black/10 flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Inventory</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="font-serif data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-800 rounded-none border-b border-black/10 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Customer Orders</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="add-product" 
                  className="font-serif data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-800 rounded-none border-b border-black/10 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="space-y-6">
                <InventoryTab onSwitchToAddProduct={() => setActiveTab("add-product")} />
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <CustomerOrdersTab />
              </TabsContent>

              <TabsContent value="add-product" className="space-y-6">
                <CreateProduct />
              </TabsContent>
            </Tabs>
         
      </div>
    </div>
  );
}
