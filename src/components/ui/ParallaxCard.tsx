// src/components/ui/ParallaxCard.tsx
"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ParallaxCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [6, -6]);
  const rotateY = useTransform(x, [-30, 30], [-6, 6]);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        x.set((px - 0.5) * 30);
        y.set((py - 0.5) * 30);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, x, y }} className={`rounded-lg bg-white/6 border border-white/6 p-3 ${className}`}>
        {children}
      </motion.div>
    </div>
  );
}
