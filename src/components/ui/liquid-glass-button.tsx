"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------
    LIQUID GLASS BUTTON
------------------------------------------------------- */

export const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-ring focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 text-primary",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 text-xs px-3",
        lg: "h-10 px-6",
        xl: "h-12 px-8",
        xxl: "h-14 px-10",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xxl",
    },
  }
)

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn("relative", liquidbuttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Liquid Glass Shadow */}
        <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),1px_1px_1px_-0.5px_rgba(0,0,0,0.6)]
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09)]
            transition-all" 
        />

        {/* Glass Blur */}
        <div
          className="absolute top-0 left-0 -z-10 h-full w-full rounded-md"
          style={{ backdropFilter: `url("#container-glass")` }}
        />

        {/* Content */}
        <div className="pointer-events-none z-10">{children}</div>

        <GlassFilter />
      </Comp>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

/* -------------------------------------------------------
    GLASS SVG FILTER
------------------------------------------------------- */

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="container-glass" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" />
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
    </svg>
  )
}

/* -------------------------------------------------------
    OPTIONAL METAL BUTTON
------------------------------------------------------- */

export const MetalButton = React.forwardRef<HTMLButtonElement, any>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-md px-6 py-2 font-semibold text-white bg-gradient-to-b from-neutral-300 to-neutral-600 shadow-md active:scale-95 transition-all",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
MetalButton.displayName = "MetalButton"
