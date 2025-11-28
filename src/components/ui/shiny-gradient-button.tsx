"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ShinyGradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  gradientClass: string; // <-- your "from-purple-500 to-pink-500"
}

export function ShinyGradientButton({
  children,
  onClick,
  disabled = false,
  className = "",
  gradientClass,
}: ShinyGradientButtonProps) {
  return (
    <>
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .shiny-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          padding: 0;
          cursor: pointer;
          isolation: isolate;
        }

        .shiny-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: conic-gradient(
            from var(--angle),
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent 80%
          );
          animation: spin 3s linear infinite;
          z-index: 0;
        }

        .shiny-inner {
          position: relative;
          z-index: 2;
        }

        @keyframes spin {
          to {
            --angle: 360deg;
          }
        }
      `}</style>

      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "shiny-wrapper w-full py-3 px-4 font-semibold transition-all active:scale-95",
          disabled && "opacity-40 cursor-not-allowed",
          className
        )}
      >
        <div
          className={cn(
            "shiny-inner w-full h-full rounded-[10px] flex items-center justify-center gap-2 text-white bg-gradient-to-r",
            gradientClass
          )}
        >
          {children}
        </div>
      </button>
    </>
  );
}
