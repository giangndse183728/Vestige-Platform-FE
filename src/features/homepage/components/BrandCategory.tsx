
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

const brandLayoutData: Brand[] = [
  {
    id: 1,
    name: 'Chrome Heart',
    image: '/chrome.jpg',
    slug: 'wines',
    colSpan: "col-span-2",
    rowSpan: "row-span-2",
    category: "FEATURED",
  },
  {
    id: 2,
    name: 'Balenciaga',
    image: '/balen.jpg',
    slug: 'gin',
    colSpan: "col-span-1",
    rowSpan: "row-span-2",
  },
  {
    id: 3,
    name: 'Adidas',
    image: '/adidas.jpg',
    slug: 'whiskey',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: 4,
    name: 'Nike',
    image: '/nike.webp',
    slug: 'vodka',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: 5,
    name: 'Rick Owens',
    image: '/rickowen.png',
    slug: 'brandy',
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    id: 6,
    name: 'Supreme',
    image: './sup.jpg',
    slug: 'beer',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },

  {
    id: 7,
    name: 'Louis Vuitton',
    image: 'lv.webp',
    slug: 'beer',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  
  {
    id: 8,
    name: 'Maison Margiela',
    image: '/maison.png',
    slug: 'rum',
    colSpan: "col-span-3",
    rowSpan: "row-span-2",
  },
  {
    id: 9,
    name: 'Raf Simons',
    image: '/raf.jpeg',
    slug: 'champagne',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: 10,
    name: 'Vetements',
    image: '/vete.webp',
    slug: 'champagne',
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
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
        
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src={brand.image} 
          alt={brand.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          style={{
            filter: 'sepia(15%) contrast(1.05) brightness(0.9) saturate(1.1)'
          }}
        />
        
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
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
  

    <div className="container mx-auto px-4  mt-6 relative z-10">
      <div className="bg-white/50 border-l-2 border-r-2 border-t-2   p-4">

        {/* Header Section */}
        <div className="text-left border-b border-black pb-4 mb-2">
          
          <h1 className="font-metal  text-3xl md:text-4xl text-black leading-none mb-2">
              Brands Collection
          </h1>
          
          <div className="text-xs tracking-wide text-gray-600 font-medium">
            PREMIUM COLLECTION • CURATED EXCELLENCE
          </div>
        </div>
        
    
      </div>
    </div>
  
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-[150px] md:auto-rows-[180px] lg:auto-rows-[200px]">
        {brandLayoutData.map(brand => renderBrandItem(brand))}
      </div>
    </div>
    
    <div className="px-4">
      <ContinueExploring/>
    </div>
  </section>
  );
};

export default NewspaperBentoGrid;