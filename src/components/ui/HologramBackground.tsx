// src/components/ui/HologramBackground.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function HologramBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, -120, 0], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-10%] bg-gradient-to-tr from-[#021026] via-[#06102b] to-[#0a0210] blur-3xl opacity-40"
      />
      <svg className="absolute right-[-10%] top-10 w-[800px] opacity-10" viewBox="0 0 800 800">
        <defs>
          <radialGradient id="g1">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="260" fill="url(#g1)" />
      </svg>
    </div>
  );
}
