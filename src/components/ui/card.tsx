import * as React from "react"

import { cn } from "@/utils/cn";
import { Marquee } from "@/components/animation/AnimatedWrapper";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "decorated";
  subtitle?: React.ReactNode;
}

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: "default" | "decorated" | "decorated-image" | "stamp" | "double" | "rising-seller" | "pro-seller" | "elite-seller";
  contentPadding?: string;
}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  CardHeaderProps
>(({ className, variant = "default", subtitle, children, ...props }, ref) => {
  if (variant === "decorated") {
    return (
      <div
        ref={ref}
        className={cn("border-b border-black/10 p-4", className)}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CardTitle) {
            return <div className="font-serif text-xl">{child}</div>;
          }
          if (React.isValidElement(child) && child.type === CardDescription) {
            return <div className="text-sm text-gray-500 mt-1">{child}</div>;
          }
          return child;
        })}
        {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === CardTitle) {
          return <div className="font-serif text-xl">{child}</div>;
        }
        return child;
      })}
    </div>
  );
});

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant = "default", contentPadding, children, ...props }, ref) => {

  if (variant === "rising-seller") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300",
          className
        )}
        {...props}
        >

        <div className="bg-gradient-to-r from-red-900 to-red-950 text-white p-4 border-b-4 border-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-30"
               style={{
                 backgroundImage: `
                   linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 35%, transparent 40%),
                   linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 35%, transparent 40%)
                 `,
                 backgroundSize: '15px 15px'
               }}>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 z-2"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 z-2"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rotate-45 shadow-lg border-white border-4"></div>
              <h3 className="font-metal text-xl tracking-wider">RISING SELLER</h3>
              <div className="w-20 h-1 bg-gradient-to-br from-yellow-400 to-yellow-400 rotate-60 shadow-lg z-1"></div>
            </div>
            <div className="bg-black text-yellow-400 px-3 py-1 border-2 border-yellow-400 shadow-lg">
              <span className="font-metal text-sm tracking-wider font-bold">★ TIER 1</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-24 right-6 w-4 h-4 bg-red-900 z-30"></div>
        
        {/* Side accent stripes */}
 
        <div className="absolute right-0 top-20 bottom-8 w-1 bg-gradient-to-b from-yellow-500 to-yellow-600"></div>
        
        {/* Content area */}
        <div className="relative z-20 p-6 bg-white">
          <div className="border-l-4 border-red-700 pl-4 bg-gradient-to-br from-red-50 to-yellow-50 p-4 border border-red-200">
            {children}
          </div>
        </div>
        
        {/* Footer accent */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-red-600 via-yellow-500 via-black to-red-600"></div>
      </div>
    );
  }

  if (variant === "pro-seller") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-black to-gray-900 text-white p-5 border-b-6 border-black relative overflow-hidden">
          {/* Metal texture background */}
          <div className="absolute inset-0 opacity-40"
               style={{
                 backgroundImage: `
                   linear-gradient(45deg, transparent 20%, rgba(139,69,19,0.3) 25%, rgba(139,69,19,0.3) 30%, transparent 35%),
                   linear-gradient(-45deg, transparent 20%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 30%, transparent 35%),
                   radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 2px, transparent 2px)
                 `,
                 backgroundSize: '12px 12px, 12px 12px, 25px 25px'
               }}>
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-purple-800 z-2"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-purple-800 z-2"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 rotate-45 shadow-xl border-white border-4"></div>
              <h3 className="font-metal text-2xl tracking-wider">PRO SELLER</h3>
              <div className="w-20 h-1 bg-purple-700 rotate-60 shadow-xl z-1"></div>
            </div>
            
            <div className="bg-purple-700 text-white px-4 py-2 border-2 border-white shadow-xl">
              <span className="font-metal text-sm tracking-wider font-bold">★★ TIER 2</span>
            </div>
          </div>
        </div>

        
        {/* Corner Accents */}
        <div className="absolute top-26 right-3 w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rotate-45 z-30 shadow-xl"></div>
        <div className="absolute top-35 right-4 w-5 h-5 bg-black rotate-45 z-30 shadow-lg"></div>
       
        {/* Content area */}
        <div className="relative z-20 p-6 bg-white">
          <div className="border-l-6 border-purple-700 pl-6 bg-gradient-to-br from-purple-50 to-gray-50 p-6 border-2 border-purple-200">
            <div className="bg-white p-4 border border-purple-300 shadow-inner">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "elite-seller") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" ,
          className
        )}
        {...props}
      >
        {/* Main Header */}
        <div className="bg-gradient-to-r from-black via-red-900 to-black text-white p-6 border-b-8 border-black relative overflow-hidden">
          {/* Metal texture background */}
          <div className="absolute inset-0 opacity-40"
               style={{
                 backgroundImage: `
                   linear-gradient(45deg, transparent 15%, rgba(255,215,0,0.3) 20%, rgba(255,215,0,0.3) 25%, transparent 30%),
                   linear-gradient(-45deg, transparent 15%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 25%, transparent 30%),
                   radial-gradient(circle at 25% 75%, rgba(255,215,0,0.2) 3px, transparent 3px)
                 `,
                 backgroundSize: '10px 10px, 10px 10px, 30px 30px'
               }}>
          </div>
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 z-2"></div>
          <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 z-2"></div>
          
          <div className="relative text-center z-20">
            <div className="flex items-center justify-center space-x-6 ">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-lg"></div>
              <h3 className="font-metal text-5xl tracking-wider text-white ">ELITE SELLER</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-lg"></div>
            </div>
          
          </div>
        </div>

        {/* Elite Marquee Section */}
        <div className="relative bg-black border-t-2 border-b-2 border-yellow-500 overflow-hidden z-20">
          <Marquee 
            text="ELITE SELLER • MAXIMUM TIER • PREMIUM QUALITY • TOP RATED"
            speed={15}
            className="py-2"
            textClassName="mx-8 font-metal text-xs tracking-widest text-yellow-400"
            duplicates={6}
          />
        </div>

        <div className="absolute top-40 left-4 w-6 h-6 bg-red-900 border-2 border-yellow-500 border-4 z-30 shadow-xl rotate-45"></div>

        <div className="relative z-20 p-6 bg-white pb-8">
          
          <div className="border-l-8 border-red-900 pl-6">
            <div className="bg-gradient-to-br from-yellow-50 to-red-50 p-6 border-2 border-yellow-300/60 relative">
              <div className="absolute top-2 left-2 w-10 h-10 border-l-3 border-t-3 border-yellow-600/70"></div>
              <div className="absolute top-2 right-2 w-10 h-10 border-r-3 border-t-3 border-red-600/70"></div>
              <div className="absolute bottom-2 left-2 w-10 h-10 border-l-3 border-b-3 border-red-600/70"></div>
              <div className="absolute bottom-2 right-2 w-10 h-10 border-r-3 border-b-3 border-yellow-600/70"></div>
              
              <div className="bg-white p-6 border border-red-400/50 shadow-inner relative">   
                <div className="relative z-20">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elite Footer with Text */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black via-yellow-600 via-red-700 to-black h-8 z-30 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-yellow-400"></div>
            <span className="font-metal text-xs tracking-wider text-white">ELITE</span>
            <div className="w-1 h-1 bg-white rotate-45"></div>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rotate-45"></div>
            <span className="font-metal text-xs tracking-widest text-yellow-300">PREMIUM</span>
            <div className="w-2 h-2 bg-red-600 rotate-45"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-white rotate-45"></div>
            <span className="font-metal text-xs tracking-wider text-white">TIER</span>
            <div className="w-3 h-1 bg-red-600"></div>
          </div>
        </div>
      </div>
    );
  }
 
  if (variant === "stamp") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-black ",
          className
        )}
        style={{
          clipPath: `polygon(
            0% 8px, 8px 0%, 16px 8px, 24px 0%, 32px 8px, 40px 0%, 48px 8px, 56px 0%, 64px 8px, 72px 0%, 80px 8px, 88px 0%, 96px 8px, 100% 0%,
            calc(100% - 8px) 8px, 100% 16px, calc(100% - 8px) 24px, 100% 32px, calc(100% - 8px) 40px, 100% 48px, calc(100% - 8px) 56px, 100% 64px, calc(100% - 8px) 72px, 100% 80px, calc(100% - 8px) 88px, 100% 96px, calc(100% - 8px) 100%,
            calc(100% - 16px) calc(100% - 8px), calc(100% - 24px) 100%, calc(100% - 32px) calc(100% - 8px), calc(100% - 40px) 100%, calc(100% - 48px) calc(100% - 8px), calc(100% - 56px) 100%, calc(100% - 64px) calc(100% - 8px), calc(100% - 72px) 100%, calc(100% - 80px) calc(100% - 8px), calc(100% - 88px) 100%, calc(100% - 96px) calc(100% - 8px), 8px 100%, 0% calc(100% - 8px),
            8px calc(100% - 16px), 0% calc(100% - 24px), 8px calc(100% - 32px), 0% calc(100% - 40px), 8px calc(100% - 48px), 0% calc(100% - 56px), 8px calc(100% - 64px), 0% calc(100% - 72px), 8px calc(100% - 80px), 0% calc(100% - 88px), 8px calc(100% - 96px), 0% 8px
          )`
        }}
        {...props}
      >
        {/* Postmark stamp effect */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-20 pointer-events-none z-20">
          <div className="w-full h-full border-2 border-red-600 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold text-red-600">ID</div>
              <div className="text-xs text-red-600">2025</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 bg-[#f8f7f3] bg-white">
          <div className="border-1 border-black p-6 border-dashed bg-[#f8f7f3]">
          {children}
          </div>
        
        </div>
      </div>
    );
  }
  if (variant === "decorated") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-white/80 border border-black/10 z-0"></div>
        <div className="absolute inset-0 border-2 border-dashed border-black/10 m-4 z-0"></div>
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-10 h-10 z-30">
          <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-black/40"></div>
          <div className="absolute top-3 left-3 w-3 h-3 bg-red-800/80 rotate-45"></div>
        </div>
        <div className="absolute top-0 right-0 w-10 h-10 z-30">
          <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-black/40"></div>
          <div className="absolute top-3 right-3 w-3 h-3 bg-red-800/80 rotate-45"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-10 h-10 z-30">
          <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-black/40"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 bg-red-800/80 rotate-45"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-10 h-10 z-30">
          <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-black/40"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 bg-red-800/80 rotate-45"></div>
        </div>
        
        <div className="relative z-20 h-full w-full">
          {children}
        </div>
      </div>
    );
  }

  if (variant === "double") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-white/80 border border-red-900 z-0"></div>
        <div className="absolute inset-0 border-2 border-dashed border-black/10 m-4 z-0"></div>
        
        <div className="relative z-20 h-full w-full">
          {React.Children.map(children, child => {
            if (React.isValidElement<CardHeaderProps>(child) && child.type === CardHeader) {
              return React.cloneElement(child, {
                ...child.props,
                className: cn("border-b-2 border-black bg-red-900 text-black", child.props.className)
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forImage?: boolean;
}

const CardContent = React.forwardRef<
  HTMLDivElement,
  CardContentProps
>(({ className, forImage = false, ...props }, ref) => {
  if (forImage) {
    return (
      <div 
        ref={ref} 
        className={cn("absolute inset-4 z-40", className)} 
        {...props} 
      />
    );
  }
  
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  );
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }