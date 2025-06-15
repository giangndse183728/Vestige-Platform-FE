"use client";
import { motion, HTMLMotionProps } from 'framer-motion';
import { useEffect, useState, ReactNode, useRef } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  textColor?: string;
  shadowColor?: string;
  shadowIntensity?: number;
  animationDuration?: number;
  scale?: [number, number, number];
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

interface FadeProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: keyof typeof directionVariants;
  distance?: number;
  once?: boolean;
}

interface MarqueeProps {
  text?: string;
  speed?: number;
  className?: string;
  textClassName?: string;
  gap?: number;
  duplicates?: number;
}

interface ClientAnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  className?: string;
  animationType?: "fade" | "slideUp" | "slideDown" | "zoomIn";
}


export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;


export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const decorativeVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export const directionVariants = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
  scale: { scale: 0.95 },
};

export const FadeUp = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "", 
  direction = "up", 
  distance = 20,
  once = false
}: FadeProps) => {
  const initialPosition = direction === "up" ? { y: distance } : 
                          direction === "down" ? { y: -distance } :
                          direction === "left" ? { x: distance } :
                          direction === "right" ? { x: -distance } :
                          direction === "scale" ? { scale: 0.95 } : { y: distance };

  const animatePosition = direction === "up" || direction === "down" ? { y: 0 } :
                          direction === "left" || direction === "right" ? { x: 0 } :
                          direction === "scale" ? { scale: 1 } : { y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialPosition }}
      whileInView={{ opacity: 1, ...animatePosition }}
      viewport={{ once }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};


export const AnimatedText = ({ 
  children,
  className = "",
  textColor = "red-900",
  shadowColor = "102,0,0",
  shadowIntensity = 0.5,
  animationDuration = 3,
  scale = [1, 1.03, 1],
  as = "span"
}: AnimatedTextProps) => {
  const Component = motion[as];
  
  return (
    <Component 
      className={className}
      style={{ color: textColor }}
      animate={{
        scale: scale,
        textShadow: [
          `0 0 0px rgba(${shadowColor},0.3)`,
          `0 0 8px rgba(${shadowColor},${shadowIntensity})`,
          `0 0 0px rgba(${shadowColor},0.3)`
        ]
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </Component>
  );
};


export const Marquee = ({
  text = "",
  speed = 20,
  className = "relative overflow-hidden w-full py-4",
  textClassName = "mx-6 font-metal text-sm uppercase tracking-wider text-red-900",
  gap = 64,
  duplicates = 8
}: MarqueeProps) => {
  return (
    <div className={className}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ 
          x: [0, -2000] 
        }}
        transition={{
          ease: 'linear',
          duration: speed,
          repeat: Infinity,
          repeatType: 'loop'
        }}
        style={{ willChange: 'transform' }}
      >
        {[...Array(4)].map((_, setIndex) => (
          <div 
            key={`marquee-set-${setIndex}`}
            className="flex items-center shrink-0"
            style={{ gap: `${gap}px`, marginRight: `${gap}px` }}
          >
            {[...Array(duplicates)].map((_, i) => (
              <h1 key={`marquee-item-${setIndex}-${i}`} className={textClassName}>
                {text}
              </h1>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const ClientAnimatedSection = ({ 
  children, 
  className = "", 
  animationType = "fade",
  ...props 
}: ClientAnimatedSectionProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initialAnimationState = () => {
    switch (animationType) {
      case "slideUp":
        return { opacity: 0, y: 50 };
      case "slideDown":
        return { opacity: 0, y: -50 };
      case "zoomIn":
        return { opacity: 0, scale: 0.9 };
      default:
        return { opacity: 0 };
    }
  };

  const finalAnimationState = () => {
    switch (animationType) {
      case "slideUp":
      case "slideDown":
        return { opacity: 1, y: 0 };
      case "zoomIn":
        return { opacity: 1, scale: 1 };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.section
      className={className}
      initial={initialAnimationState()}
      animate={isMounted ? finalAnimationState() : initialAnimationState()}
      transition={{ duration: 0.7, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.section>
  );
};