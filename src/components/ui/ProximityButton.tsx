// src/components/ui/ProximityButton.tsx
"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ProximityButton({ onClick, className = "", label }: { onClick?: () => void; className?: string; label?: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const glow = useMotionValue(0);
  const scale = useTransform(glow, [0, 1], [1, 1.03]);

  return (
    <button
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        const dx = Math.abs(e.clientX - (rect.left + rect.width / 2));
        const dy = Math.abs(e.clientY - (rect.top + rect.height / 2));
        const d = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 200);
        glow.set(1 - d);
      }}
      onMouseLeave={() => glow.set(0)}
      onClick={() => onClick && onClick()}
      className={`relative overflow-hidden rounded-md px-4 py-2 border border-white/8 ${className}`}
      style={{ transformOrigin: "center" }}
    >
      <motion.div style={{ scale }} className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-10 blur-sm pointer-events-none" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}
