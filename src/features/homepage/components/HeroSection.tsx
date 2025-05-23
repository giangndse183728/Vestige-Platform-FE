import { Suspense } from 'react';
import HeroSectionClient from './HeroSectionClient';

const featuredItems = [
  {
    image: "/banner.png",
    title: "DIGITAL COUTURE",
    subtitle: "Redefining Tomorrow"
  },
  {
    image: "/banner1.jpg",
    title: "VIRTUAL RUNWAY",
    subtitle: "Beyond Reality"
  },
  {
    image: "/banner3.jpg",
    title: "META FASHION",
    subtitle: "Limitless Expression"
  }
];

const heroSEOContent = {
  heading: "DIGITAL FASHION",
  description: "Where virtual expression meets innovative design. Explore our platform for digital fashion, virtual runway shows, and meta fashion concepts.",
  links: [
    { text: "Explore", url: "/explore" },
    { text: "Join", url: "/creators" }
  ]
};

const HeroSection = () => {
  return (
    <>
      <div style={{ display: 'none' }} aria-hidden="true">
        <h1>{heroSEOContent.heading}</h1>
        <p>{heroSEOContent.description}</p>
        <ul>
          {featuredItems.map((item, index) => (
            <li key={index}>
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
            </li>
          ))}
        </ul>
      </div>
      
      <Suspense fallback={<div className="w-full h-screen bg-[#f8f7f3]"></div>}>
        <HeroSectionClient 
          featuredItems={featuredItems} 
          heroSEOContent={heroSEOContent}
        />
      </Suspense>
    </>
  );
};

export default HeroSection;
