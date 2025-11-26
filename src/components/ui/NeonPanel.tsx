// src/components/ui/NeonPanel.tsx
"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function NeonPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28 }}
      className={`rounded-2xl p-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 shadow-[0_10px_40px_rgba(79,70,229,0.06)] ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)" }} />
        {children}
      </div>
    </motion.div>
  );
}
