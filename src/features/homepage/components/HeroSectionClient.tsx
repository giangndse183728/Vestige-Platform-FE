"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MotionDiv,
  MotionH2,
  AnimatedText,
  FadeUp,
  containerVariants,
} from '../../../components/animation/AnimatedWrapper';
import Link from 'next/link';
import Image from 'next/image';


interface FeaturedItem {
  image: string;
  title: string;
  subtitle: string;
}

interface HeroSEOContent {
  heading: string;
  description: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface HeroSectionClientProps {
  featuredItems: FeaturedItem[];
  heroSEOContent: HeroSEOContent;
}

const HeroSectionClient = ({ featuredItems, heroSEOContent }: HeroSectionClientProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [featuredItems.length]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden bg-[#f8f7f3] mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>
      
      
      {/* Main content */}
      <MotionDiv 
        className="relative z-10 w-full h-full flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container max-w-7xl mx-auto px-4">
          
       
          <div className="grid grid-cols-12 gap-6 items-center">
            
            {/* Left column */}
            <div className="col-span-12 md:col-span-5 xl:col-span-4 text-center md:text-left md:pr-10 relative z-20" ref={textRef}>
              <FadeUp >
                <motion.div 
                  className="mb-4 inline-block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                >
                  <h2 className="font-gothic tracking-[0.5em] uppercase text-[#333]/80 text-sm">The Platform</h2>
                  <motion.div 
                    className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ec1e1e] to-transparent mt-1"
                    animate={{ scaleX: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
              </FadeUp>
              
              <FadeUp >
                <h1 className="mb-6 relative">
                  <AnimatedText
                    as="span" 
                    className="font-metal text-6xl md:text-7xl xl:text-8xl tracking-tight text-[#111] block"
                    textColor="#111"
                    shadowColor="236,30,30"
                    shadowIntensity={0.3}
                    scale={[1, 1.02, 1]}
                    animationDuration={4}
                  >
                    {heroSEOContent.heading.split(' ')[0]}
                  </AnimatedText>
                  <AnimatedText
                    as="span" 
                    className="font-metal text-6xl md:text-7xl xl:text-8xl tracking-tight text-[#111] block -mt-2"
                    textColor="#111"
                    shadowColor="236,30,30"
                    shadowIntensity={0.3}
                    scale={[1, 1.02, 1]}
                    animationDuration={4}
                  >
                    {heroSEOContent.heading.split(' ')[1]}
                  </AnimatedText>
                  

                  <motion.div 
                    className="absolute -right-4 top-1/2 w-14 h-14 border border-[#111]"
                    animate={{ 
                      rotate: [0, 90],
                      borderColor: ["rgba(17,17,17,0.3)", "rgba(236,30,30,0.7)", "rgba(17,17,17,0.3)"]
                    }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  />
                </h1>
              </FadeUp>
              
              <FadeUp >
                <p className="font-gothic text-[#333]/80 uppercase text-sm tracking-wider mb-8 max-w-md">
                  {heroSEOContent.description.split('.')[0]}
                </p>
              </FadeUp>
              
              <FadeUp >
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {heroSEOContent.links.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href={link.url} 
                        className={`px-8 py-3 ${index === 0 ? 'bg-[#111] text-white hover:bg-[var(--dark-red)]' : 'border-2 border-[var(--dark-red)] text-[#111] hover:bg-[var(--dark-red)] hover:text-white'} font-gothic text-sm uppercase tracking-widest transition-colors duration-300`}
                      >
                        {link.text}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </FadeUp>
              
              <FadeUp className="mt-16 hidden md:block">
                <div className="flex flex-col items-start gap-4">
                  {featuredItems.map((_, idx) => (
                    <motion.button
                      key={idx}
                      className="group flex items-center"
                      onClick={() => setActiveIndex(idx)}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className={`h-[1px] w-6 ${idx === activeIndex ? 'bg-[#111]' : 'bg-[#111]/20 group-hover:bg-[#111]/40'} mr-3 transition-colors`}
                        animate={idx === activeIndex ? { width: 30 } : { width: 20 }}
                      />
                      <span className={`font-gothic text-xs uppercase tracking-wider ${idx === activeIndex ? 'text-[#111]' : 'text-[#111]/40 group-hover:text-[#111]/60'} transition-colors`}>
                        {`0${idx + 1}`}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </FadeUp>
            </div>
            
            {/* Right column */}
            <div className="col-span-12 md:col-span-7 xl:col-span-8 h-[50vh] md:h-[80vh] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                
                  <motion.div 
                    className="w-full h-full overflow-hidden relative"
                  >
              
                    <motion.div 
                      className="absolute top-[calc(5%-10px)] left-[calc(5%-10px)] w-20 h-20 border-t-2 border-l-2 border-[#111] z-30"
                      animate={{ rotate: [-1, 1, -1], x: [0, 3, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute bottom-[calc(5%-10px)] right-[calc(5%-10px)] w-20 h-20 border-b-2 border-r-2 border-[#111] z-30"
                      animate={{ rotate: [1, -1, 1], x: [0, -3, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    
            
                    <motion.div
                      className="absolute inset-[5%] border-2 border-[#111] overflow-hidden shadow-lg"
                      whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                      transition={{ duration: 0.4 }}
                    >
                      
                      <div className="absolute inset-0 border-[8px] border-[#111] z-20 pointer-events-none"></div>
                      <div className="absolute inset-[8px] border border-white z-20 pointer-events-none"></div>
                      
                      {/* Main image */}
                        <Image
                       width={800}
                       height={300}
                          src={featuredItems[activeIndex].image} 
                          alt={featuredItems[activeIndex].title} 
                          className="absolute inset-0 w-full h-full object-cover"
                          priority
                        />
                      
                      
                      <div className="absolute inset-0 bg-[#111]/10 mix-blend-multiply z-10"></div>
            
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 z-20 bg-[#111]"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <div className="p-6 pt-3 pb-3">
                          <div className="border-b border-white/20 pb-3 mb-3">
                            <span className="font-gothic text-xs uppercase text-white/60 tracking-widest">Featured Story</span>
                          </div>
                          
                          <MotionH2
                            className="font-serif text-3xl md:text-4xl text-white font-bold mb-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            {featuredItems[activeIndex].title}
                          </MotionH2>
                          
                          <motion.div 
                            className="flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            <motion.div 
                              className="h-[1px] w-12 bg-[#ec1e1e] mr-3"
                              animate={{ width: [12, 30, 12] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                            <p className="font-serif text-white/80">
                              {featuredItems[activeIndex].subtitle}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 md:hidden">
                {featuredItems.map((_, idx) => (
                  <button
                    key={idx}
                    className="w-2 h-2 rounded-full bg-[#111]/20 focus:outline-none"
                    onClick={() => setActiveIndex(idx)}
                  >
                    <motion.div
                      className="w-full h-full rounded-full bg-[#111]"
                      initial={{ scale: 0 }}
                      animate={{ scale: idx === activeIndex ? 1 : 0 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* footer */}
          <motion.div 
            className="absolute bottom-8 left-0 right-0 border-t-2 border-[#111]/70 pt-4 px-6 md:px-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                <motion.span 
                  className="font-serif italic text-xs md:text-sm text-[#111]/70"
                  whileHover={{ color: "#111" }}
                >
                  The Digital Fashion Chronicle
                </motion.span>
                <motion.div 
                  className="h-[1px] w-12 bg-[#111]/20 mx-4"
                  animate={{ width: [48, 60, 48] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                />
                <span className="font-gothic text-xs uppercase text-[#111]/70 tracking-wide">EST. 2023</span>
              </div>
              
              <motion.div 
                className="hidden md:flex items-center"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              >
                <span className="font-serif text-xs text-[#111]/70 tracking-wider">Exploring the future of style</span>
              </motion.div>
              
              <div className="flex items-center">
                <span className="font-gothic text-xs uppercase text-[#111]/70 tracking-wide mr-4">Vol. I</span>
                <motion.div 
                  className="font-serif font-bold text-sm text-[#111]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  MMXXIII
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </MotionDiv>
    </motion.div>
  );
};

export default HeroSectionClient; 