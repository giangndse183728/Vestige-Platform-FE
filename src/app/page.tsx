import HeroSection from "@/features/homepage/components/HeroSection";
import SubHeroSection from "@/features/homepage/components/SubHeroSection";
import NewspaperSlider from "@/features/homepage/components/Content";
import { generateSEOMetadata } from "@/libs/seo";


export const metadata = generateSEOMetadata({
  title: "Vestige | The Platform for Fashion",
  description: "Where virtual expression meets innovative design. Explore our platform for digital fashion, virtual runway shows, and meta fashion concepts.",
  keywords: ["vestige", "fashion platform", "meta fashion"],
  image: {
    url: "/fashion-visual-1.jpg",
    width: 1200,
    height: 630,
    alt: "Digital Fashion Platform"
  }
});

export default function Homepage() {
  return (
    <div className="flex flex-col ">
      <main>
        <HeroSection/>
        <SubHeroSection/>
        <NewspaperSlider/>
      </main>
    </div>
  );
}
