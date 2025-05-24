
import ContinueExploring  from '@/components/ui/footer-section';

interface Brand {
  id: number;
  name: string;
  image: string;
  slug: string;
  colSpan?: string;
  rowSpan?: string;
  nestedItems?: Brand[];
  category?: string;
  description?: string;
}

// Proper bento grid data with varied sizes
const brandLayoutData: Brand[] = [
  {
    id: 1,
    name: 'Premium Wines',
    image: '/balen.jpg',
    slug: 'wines',
    colSpan: "col-span-2",
    rowSpan: "row-span-2",
    category: "FEATURED",
    description: "Curated selection from world-renowned vineyards"
  },
  {
    id: 2,
    name: 'Craft Gin',
    image: 'https://images.unsplash.com/photo-1504675099198-7023dd85f5a3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'gin',
    colSpan: "col-span-1",
    rowSpan: "row-span-2",
    category: "ARTISAN",
    description: "Small batch botanical spirits"
  },
  {
    id: 3,
    name: 'Single Malt Whiskey',
    image: 'https://images.unsplash.com/photo-1571104508999-893933ded431?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'whiskey',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    category: "AGED",
    description: "18 years in oak barrels"
  },
  {
    id: 4,
    name: 'Premium Vodka',
    image: 'https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'vodka',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    category: "PURE",
    description: "Crystal clear perfection from Nordic springs"
  },
  {
    id: 5,
    name: 'Aged Brandy',
    image: 'https://images.unsplash.com/photo-1693680501357-a342180f1946?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'brandy',
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
    category: "LUXURY",
    description: "Century-old tradition meets modern craftsmanship"
  },
  {
    id: 6,
    name: 'Craft Beer',
    image: 'https://images.unsplash.com/photo-1558642891-54be180ea339?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'beer',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    category: "LOCAL",
    description: "Brewed with passion in small batches"
  },

  {
    id: 7,
    name: 'Craft Beer',
    image: 'https://images.unsplash.com/photo-1558642891-54be180ea339?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'beer',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    category: "LOCAL",
    description: "Brewed with passion in small batches"
  },
  
  {
    id: 8,
    name: 'Rare Rum',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'rum',
    colSpan: "col-span-3",
    rowSpan: "row-span-2",
    category: "EXOTIC",
    description: "Caribbean treasure"
  },
  {
    id: 9,
    name: 'Champagne',
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'champagne',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    category: "CELEBRATION",
    description: "French elegance in every bubble"
  },
  {
    id: 10,
    name: 'Champagne',
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'champagne',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    category: "CELEBRATION",
    description: "French elegance in every bubble"
  }
];

const NewspaperBentoGrid = () => {

  const renderBrandItem = (brand: Brand) => (
    <div
      key={brand.id}
      className={`
        ${brand.colSpan} ${brand.rowSpan}
        group relative overflow-hidden  border-2 border-black
        cursor-pointer transform hover:scale-105 hover:z-20 hover:shadow-2xl
        transition-all duration-300 ease-out
      `}
    >
        
      {/* Image container with fixed dimensions - image adapts to card size */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src={brand.image} 
          alt={brand.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          style={{
            filter: 'sepia(15%) contrast(1.05) brightness(0.9) saturate(1.1)'
          }}
        />
        
           {/* Newspaper halftone pattern overlay */}
           <div 
          className="absolute inset-0 opacity-15 mix-blend-multiply"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139,69,19,0.8) 0.8px, transparent 0.8px),
              radial-gradient(circle at 75% 75%, rgba(160,82,45,0.6) 0.6px, transparent 0.6px)
            `,
            backgroundSize: '4px 4px, 6px 6px'
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold tracking-widest">
          {brand.category}
        </div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="font-serif font-bold text-xl md:text-2xl lg:text-3xl leading-tight mb-2">
            {brand.name}
          </h3>
          
          {/* Decorative underline */}
          <div className="mt-2 flex items-center">
            <div className="w-8 h-px bg-white mr-2"></div>
            <span className="text-xs tracking-widest font-sans">READ MORE</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full min-h-screen bg-gray-100/70 py-8 relative border-b-2 px-2">
    {/* Newspaper background texture */}
    <div 
      className="absolute inset-0 opacity-25"
      style={{
        backgroundImage: `
          linear-gradient(90deg, transparent 0px, transparent 79px, rgba(139,69,19,0.15) 80px, rgba(139,69,19,0.15) 82px, transparent 83px),
          linear-gradient(0deg, transparent 0px, transparent 19px, rgba(139,69,19,0.08) 20px, rgba(139,69,19,0.08) 21px, transparent 22px), 
          radial-gradient(circle at 20% 30%, rgba(139,69,19,0.03) 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, rgba(160,82,45,0.02) 1px, transparent 1px),
          radial-gradient(circle at 40% 80%, rgba(210,180,140,0.04) 2px, transparent 2px)
        `,
        backgroundSize: '240px 24px, 100% 24px, 60px 60px, 80px 80px, 120px 120px'
      }}
    />
  
    {/* Newspaper masthead */}
    <div className="container mx-auto px-4  mt-6 relative z-10">
      <div className="bg-white/50 border-l-2 border-r-2 border-t-2   p-4">
        {/* Header Section */}
        <div className="text-left border-b border-black pb-4 mb-2">
          
          {/* Main newspaper title */}
          <h1 className="font-metal  text-3xl md:text-4xl text-black leading-none mb-2">
              Brands Collection
          </h1>
          
          {/* Subtitle */}
          <div className="text-xs tracking-wide text-gray-600 font-medium">
            PREMIUM COLLECTION • CURATED EXCELLENCE
          </div>
        </div>
        
    
      </div>
    </div>
  
    <div className="container mx-auto px-4 relative z-10">
      {/* True Bento Grid - asymmetrical layout with fixed card sizes */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-[150px] md:auto-rows-[180px] lg:auto-rows-[200px]">
        {brandLayoutData.map(brand => renderBrandItem(brand))}
      </div>
    </div>
    
    {/* Newspaper footer */}
    <div className="px-4">
      <ContinueExploring/>
    </div>
  </section>
  );
};

export default NewspaperBentoGrid;