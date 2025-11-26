// src/components/ui/RippleButton.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function RippleButton({ children, onClick, disabled = false, className = "" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      className={`rounded-md px-3 py-2 bg-white/5 border border-white/8 text-white hover:brightness-110 flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </motion.button>
  );
}
