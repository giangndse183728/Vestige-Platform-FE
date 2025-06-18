import { InventoryTab } from '@/features/products/components/InventoryTab';

export default function MyProductsPage() {
  return (
    <div className="container mx-auto py-4 mt-1 overflow-hidden px-6">
      <div className="mb-8 text-center border-b-4 border-black pb-6">
        <h1 className="font-serif text-5xl font-bold text-black mb-2 tracking-wide">
          MY PRODUCTS
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="border-l-2 border-r-2 border-black px-4 font-mono">
            INVENTORY
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

      <InventoryTab />
    </div>
  );
} 