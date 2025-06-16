import { ProductList } from "@/features/products/components/ProductList";
import { generateSEOMetadata } from "@/libs/seo";

export const metadata = generateSEOMetadata({
  title: "Marketplace | VESTIGE",
  description: "Explore and shop fashion items from the VESTIGE community. Find outfits, accessories, and more from verified users.",
  keywords: ["marketplace", "fashion", "vestige", "shop", "style", "outfits"],
  image: {
    url: "/banner.png",
    width: 1200,
    height: 630,
    alt: "VESTIGE Fashion Marketplace"
  }
});


export default function ProductsPage() {
  return (
    <main className="mt-24">
      <ProductList />
    </main>
  );
}