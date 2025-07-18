"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group font-gothic"
      toastOptions={{
        classNames: {
          toast: "group font-gothic !rounded-none !border-2 !border-black !bg-white !shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
          title: "font-gothic text-base font-medium",
          description: "font-gothic text-sm",
          actionButton: "font-gothic bg-red-800 hover:bg-red-900 text-white/90",
          cancelButton: "font-gothic bg-gray-100 hover:bg-gray-200 text-gray-900",
          success: "!bg-white !text-green-800",
          error: "!bg-white !text-red-800",
          info: "!bg-white !text-blue-800",
          warning: "!bg-white !text-yellow-800",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
