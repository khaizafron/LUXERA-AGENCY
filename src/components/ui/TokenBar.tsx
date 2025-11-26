// src/components/ui/TokenBar.tsx
"use client";
import React from "react";

export default function TokenBar({ tokens }: { tokens: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((tokens / 8000) * 100)));
  return (
    <div className="w-full">
      <div className="text-xs text-white/60 mb-1">Estimated tokens</div>
      <div className="w-full h-2 bg-white/6 rounded overflow-hidden">
        <div style={{ width: `${pct}%` }} className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500" />
      </div>
      <div className="text-xs text-white/60 mt-1">{tokens} tokens (~${(tokens/1000*0.03).toFixed(2)})</div>
    </div>
  );
}
