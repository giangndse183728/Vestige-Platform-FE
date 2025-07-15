import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { MotionDiv } from "../animation/AnimatedWrapper"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        double:
          "relative border-2 border-black rounded-none px-[10px] py-[20px] pt-[25px] bg-transparent text-black transition-all cursor-pointer after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:right-[4px] after:bottom-[4px] after:border-2 after:border-gray-500 after:-z-[1] after:transition-all hover:after:border-[rgb(150,1,1)]",
        date:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "corner-red":
          "relative border-2 border-black rounded-none bg-white text-black transition-all cursor-pointer h-[50px] min-h-[50px] px-6 before:content-[''] before:absolute before:top-[4px] before:left-[4px] before:w-[10px] before:h-[10px] before:border-t-2 before:border-l-2 before:border-red-800 before:transition-all hover:before:top-[8px] hover:before:left-[8px] after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:w-[10px] after:h-[10px] after:border-t-2 after:border-r-2 after:border-red-800 after:transition-all hover:after:top-[8px] hover:after:right-[8px] [&>span]:before:content-[''] [&>span]:before:absolute [&>span]:before:bottom-[4px] [&>span]:before:left-[4px] [&>span]:before:w-[10px] [&>span]:before:h-[10px] [&>span]:before:border-b-2 [&>span]:before:border-l-2 [&>span]:before:border-red-800 [&>span]:before:transition-all hover:[&>span]:before:bottom-[8px] hover:[&>span]:before:left-[8px] [&>span]:after:content-[''] [&>span]:after:absolute [&>span]:after:bottom-[4px] [&>span]:after:right-[4px] [&>span]:after:w-[10px] [&>span]:after:h-[10px] [&>span]:after:border-b-2 [&>span]:after:border-r-2 [&>span]:after:border-red-800 [&>span]:after:transition-all hover:[&>span]:after:bottom-[8px] hover:[&>span]:after:right-[8px]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9  px-3",
        lg: "h-11  px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const buttonContent = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </span>
      </Comp>
    )

    if (variant === "double") {
      return (
        <MotionDiv
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {buttonContent}
        </MotionDiv>
      )
    }

    return buttonContent
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
