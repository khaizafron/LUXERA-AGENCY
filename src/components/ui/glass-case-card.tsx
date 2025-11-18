"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCaseCardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCaseCard = React.forwardRef<HTMLDivElement, GlassCaseCardProps>(
  ({ className, children, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

    const handleMove = (e: React.MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Smooth 3D rotation
      const rotateX = ((y - rect.height / 2) / rect.height) * -12;
      const rotateY = ((x - rect.width / 2) / rect.width) * 12;

      setRotation({ x: rotateX, y: rotateY });
    };

    const handleLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    return (
      <div
        ref={ref}
        className={cn("w-full [perspective:1800px]", className)}
        {...props}
      >
        {/* 3D CARD */}
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="
            relative rounded-[40px] overflow-hidden
            bg-gradient-to-br from-zinc-900 to-black
            shadow-2xl transition-all duration-300
            [transform-style:preserve-3d]
          "
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* GLASS FRONT LAYER */}
          <div
            className="
              absolute inset-0 rounded-[40px]
              bg-white/5 backdrop-blur-xl border border-white/10
              pointer-events-none
              [transform:translateZ(45px)]
            "
          />

          {/* FLOATING CIRCLES */}
          <div className="absolute top-0 right-0 pointer-events-none">
            {[160, 200, 240].map((size, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/5"
                style={{
                  width: size,
                  height: size,
                  top: 20 + i * 20,
                  right: 20 + i * 20,
                  transform: `translateZ(${40 + i * 40}px)`,
                  opacity: 0.08 - i * 0.015,
                }}
              />
            ))}
          </div>

          {/* REAL CONTENT */}
          <div className="relative p-10 z-[50] [transform:translateZ(80px)]">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

GlassCaseCard.displayName = "GlassCaseCard";
export default GlassCaseCard;
