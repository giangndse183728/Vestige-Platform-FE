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
          toast: "group font-gothic rounded-none border-none",
          title: "font-gothic text-base font-medium",
          description: "font-gothic text-sm",
          actionButton: "font-gothic bg-red-800 hover:bg-red-900 text-white/90",
          cancelButton: "font-gothic bg-gray-100 hover:bg-gray-200 text-gray-900",
          success: "!bg-green-100 !border-green-400 !text-green-800",
          error: "!bg-red-100 !border-red-400 !text-red-800",
          info: "!bg-blue-100 !border-blue-400 !text-blue-800",
          warning: "!bg-yellow-100 !border-yellow-400 !text-yellow-800",
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
