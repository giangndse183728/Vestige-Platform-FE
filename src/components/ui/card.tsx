import * as React from "react"

import { cn } from "@/libs/cn";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: "default" | "decorated" | "decorated-image";
  contentPadding?: string;
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant = "default", contentPadding, children, ...props }, ref) => {
 

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

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "decorated";
  subtitle?: React.ReactNode;
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
    />
  );
})
CardHeader.displayName = "CardHeader"

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
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
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