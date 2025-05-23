import Link from 'next/link';
import {
  ClientAnimatedSection,
  MotionDiv,
  MotionH2,
  MotionP,
  containerVariants,
  decorativeVariants,
  FadeUp,
  Marquee,
  AnimatedText
} from '../../../components/animation/AnimatedWrapper';
import { Button } from '../../../components/ui/button';
import { ContinueExploring } from '@/components/ui/footer-section';

const SubHeroSection = () => {
  return (
    <ClientAnimatedSection className="w-full bg-white/50 pb-5 px-4 border-b relative overflow-hidden">

      {/* Simpler decorative elements with clean fade animation */}
      <MotionDiv
        className="absolute -top-20 -left-20 w-90 h-90 bg-[#960000]/50 rounded-full blur-3xl"
        variants={decorativeVariants}
        initial="hidden"
        animate="visible"
      />
      <MotionDiv
        className="absolute -bottom-40 -right-20 w-96 h-96 bg-[#960000]/40 rounded-full blur-3xl"
        variants={decorativeVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      />

      <MotionDiv
        className="container mx-auto relative z-10 px-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Magazine-style grid layout with black borders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-2 border-black backdrop-blur-md">

          {/* Left column - Video Hero (8 columns on md) */}
          <FadeUp className="md:col-span-8 relative bg-[#f8f8f8]/80 border-r-2 border-black min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden backdrop-blur-sm">

            {/* Video element */}
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              playsInline
              muted
              style={{ objectFit: 'cover' }}
            >
              <source src="/heliot.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <MotionDiv
              className="absolute top-0 left-0 border-b border-r border-black w-16 h-16 backdrop-blur-sm bg-white/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <MotionDiv
                className="absolute top-6 left-6 border border-black w-16 h-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              <MotionDiv
                className="absolute top-[24px] left-[24px] h-[1px] bg-black z-50"
                initial={{ width: 0 }}
                animate={{ width: 180 }}
                transition={{ delay: 1, duration: 0.5 }}
              />

              {/* Vertical Line */}
              <MotionDiv
                className="absolute top-[24px] left-[24px] w-[1px] bg-black z-50"
                initial={{ height: 0 }}
                animate={{ height: 120 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
            </MotionDiv>

            <FadeUp delay={0.4} className="absolute top-6 right-6 flex flex-col items-end z-20">
              <span className="font-metal text-xs text-white bg-black/50 backdrop-blur-sm px-3 py-1">HELIOT EMIL</span>
            </FadeUp>

            <FadeUp delay={0.6} className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black/50 p-6 border-t border-white/20">
              <MotionH2
                className="font-metal text-3xl md:text-4xl text-white mb-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                WINTER 2023 COLLECTION
              </MotionH2>
              <MotionDiv
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="h-[1px] w-12 bg-white mr-3"></div>
                <p className="font-serif italic text-white/90">Deconstructed elegance meets futuristic minimalism</p>
              </MotionDiv>
            </FadeUp>
          </FadeUp>

          <div className="md:col-span-4 flex flex-col">
            {/* Top section - Feature Article */}
            <FadeUp delay={0.2} className="p-6 border-b-2 border-black backdrop-blur-md bg-white/80 relative">
              <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-black"></div>

              <div className="flex items-center mb-4">
                <div className="w-8 h-[1px] bg-[#660000] mr-3"></div>
                <h3 className="font-gothic text-xs text-black/80 uppercase tracking-widest">Featured Article</h3>
              </div>

              <MotionH2
                className="font-serif text-2xl md:text-3xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                The Future of Fashion: Sustainable Luxury
              </MotionH2>
              <MotionP
                className="font-serif text-black/70 mb-4 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                {"Exploring how designer brands are embracing responsibility without compromising on aesthetics or quality. The new wave of sustainable luxury is redefining fashion future."}
              </MotionP>

              <FadeUp delay={0.2}>
                <Link
                  href="/collection"
                  className="inline-flex items-center group"
                  aria-label="Collection"
                >
                  <span className="font-gothic text-sm uppercase mr-2 text-[#660000]">Collection</span>
                  <span className="h-[1px] w-5 bg-[#660000] group-hover:w-8 transition-all duration-300"></span>
                </Link>

              </FadeUp>
            </FadeUp>

            {/* Middle section - 25% OFF retained with improved animation */}
            <FadeUp delay={0.3} className="p-6 border-b-2 border-black bg-transparent relative overflow-hidden">
              <MotionDiv
                className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#960000]/10 rounded-full blur-xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Using the new AnimatedText component */}
              <div className="text-center relative z-10">
                <AnimatedText
                  as="h3"
                  className="font-metal text-2xl md:text-3xl text-[#660000] mb-4"
                  shadowIntensity={0.6}
                >
                  25% OFF
                </AnimatedText>

                <p className="font-gothic text-sm uppercase tracking-widest mb-4">Limited Edition Pieces</p>
                <div className="h-[1px] w-16 bg-black/30 mx-auto mb-4"></div>
                <p className="font-serif italic text-black/70 mb-6">
                  Enter code <span className="font-bold not-italic">LEGACY25</span> at checkout
                </p>

                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="double"
                    className="font-gothic text-sm uppercase tracking-widest"
                    asChild
                    size={'lg'}
                    
                  >
                    <a href="/shop/limited-edition">Shop Now</a>
                  </Button>
                </MotionDiv>
              </div>
            </FadeUp>

            {/* Bottom section - New Arrivals */}
            <FadeUp delay={0.2} className="p-6 flex-1 flex flex-col justify-center backdrop-blur-md bg-white/70 relative">
              <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l border-black/60"></div>

              <div className="mb-6">
                <h4 className="font-gothic text-xs uppercase tracking-widest mb-2">New Arrivals</h4>
                <div className="h-[1px] w-12 bg-[#660000]"></div>
              </div>

              <ul className="space-y-4">
                {['Avant-Garde Blazers', 'Architectural Accessories', 'Deconstructed Denim', 'Monochrome Essentials'].map((item, index) => (
                  <FadeUp
                    key={index}
                    delay={0.3 + index * 0.1}
                  >
                    <div className="flex items-center">
                      <span className="text-[#660000] mr-3">—</span>
                      <Link href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`} className="font-serif text-black/80 hover:text-[#660000]">
                        {item}
                      </Link>
                    </div>
                  </FadeUp>
                ))}
              </ul>

              <FadeUp delay={0.7}>
                <Link href="/shop/new-arrivals" className="mt-6 inline-flex items-center self-start group">
                  <span className="font-gothic text-sm uppercase mr-2">View All New Arrivals</span>
                  <MotionDiv
                    className="text-[#660000]"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
                  >→</MotionDiv>
                </Link>
              </FadeUp>
            </FadeUp>
          </div>
        </div>

  
      </MotionDiv>
      <FadeUp delay={0.5}>
          <div className="my-6 py-3 bg-black/10 backdrop-blur-sm">
            <Marquee text="Avant-Garde • Minimalist • Contemporary • Sustainable • Limited Edition • Premium • Exclusive • Architectural •" />
          </div>
        </FadeUp>

        <ContinueExploring issueNumber={25} delay={0.6} />
    </ClientAnimatedSection>
  );
};

export default SubHeroSection;