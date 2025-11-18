"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MiniGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MiniGlassCard = React.forwardRef<HTMLDivElement, MiniGlassProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group h-[120px] w-full rounded-2xl [perspective:900px]",
          className
        )}
        {...props}
      >
        <div
          className="
            relative h-full w-full rounded-2xl bg-gradient-to-br from-zinc-900 to-black
            shadow-xl transition-all duration-500 ease-out
            [transform-style:preserve-3d]
            group-hover:[transform:rotate3d(1,1,0,20deg)]
            group-hover:shadow-[rgba(0,0,0,0.4)_20px_35px_20px_-20px]
          "
        >
          {/* glass overlay */}
          <div
            className="
              absolute inset-0 rounded-2xl border border-white/10 
              bg-white/5 backdrop-blur-md
              [transform:translate3d(0,0,35px)]
            "
          />

          {/* floating circles */}
          <div className="absolute top-0 right-0">
            {[40, 60, 80].map((size, i) => (
              <div
                key={i}
                className="absolute bg-white/10 rounded-full"
                style={{
                  width: size,
                  height: size,
                  top: 4 + i * 6,
                  right: 4 + i * 6,
                  opacity: 0.08,
                  transform: `translate3d(0,0,${20 + i * 20}px)`,
                }}
              />
            ))}
          </div>

          {/* content */}
          <div
            className="
              absolute inset-0 z-10 flex flex-col items-center justify-center px-2 text-center
              [transform:translate3d(0,0,55px)]
            "
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

MiniGlassCard.displayName = "MiniGlassCard";
export default MiniGlassCard;
