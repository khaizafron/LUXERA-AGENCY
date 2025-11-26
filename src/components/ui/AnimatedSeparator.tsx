// src/components/ui/AnimatedSeparator.tsx
"use client";
import React from "react";

export default function AnimatedSeparator() {
  return (
    <div className="my-4">
      <div className="h-[1px] rounded bg-gradient-to-r from-[#06b6d4] via-[#7c3aed] to-[#4f46e5] opacity-20" />
    </div>
  );
}
