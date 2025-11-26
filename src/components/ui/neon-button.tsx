"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

// 🔥 Sizes aligned with your system (sm / md / lg)
const buttonVariants = cva(
  "relative group rounded-full border text-center flex items-center justify-center gap-2 font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 text-white",
        solid:
          "bg-blue-500 hover:bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/30",
        ghost:
          "bg-transparent border-transparent hover:bg-white/10 text-white",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  neon?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, neon = true, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {/* TOP glowing line */}
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-px w-3/4 mx-auto opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-transparent via-blue-500 to-transparent",
            neon ? "block" : "hidden"
          )}
        />

        {/* Button Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>

        {/* BOTTOM glowing line */}
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px w-3/4 mx-auto opacity-30 group-hover:opacity-60 transition-all duration-500 bg-gradient-to-r from-transparent via-blue-500 to-transparent",
            neon ? "block" : "hidden"
          )}
        />
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export { buttonVariants };
