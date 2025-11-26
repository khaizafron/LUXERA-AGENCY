// src/components/whatsapp/PhonePreview.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function PhonePreview({ messages, botName }: { messages: { role: "user" | "ai"; text: string; time: string; id?: string }[]; botName: string; }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    // quick vibration animation on new message
    if (!reduce && frameRef.current) {
      frameRef.current.animate([{ transform: "translateY(0px)" }, { transform: "translateY(-4px)" }, { transform: "translateY(0px)" }], { duration: 220, easing: "ease-in-out" });
    }
  }, [messages]);

  return (
    <div className="rounded-xl bg-[#050506] border border-white/6 p-3 shadow-[inset_0_6px_30px_rgba(79,70,229,0.06)]">
      <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden" style={{ perspective: 800 }}>
        <div ref={frameRef} className="border border-white/6 rounded-xl overflow-hidden bg-gradient-to-b from-[#070707] to-[#020205]">
          <div className="flex items-center gap-3 p-3 border-b border-white/6 bg-black/30">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-black font-bold">{botName.charAt(0)}</div>
            <div className="flex-1">
              <div className="text-sm text-white">{botName}</div>
              <div className="text-xs text-white/60">Online • Last seen a few seconds ago</div>
            </div>
          </div>

          <div ref={containerRef} className="h-80 overflow-y-auto p-3 custom-scrollbar space-y-3">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <motion.div key={m.id ?? `m${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.18 }}>
                  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`${isUser ? "bg-cyan-500 text-black" : "bg-white/6 text-white"} px-3 py-2 rounded-lg max-w-[75%]`}>
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className="text-[10px] opacity-50 mt-1 text-right">{m.time}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="p-2 border-t border-white/6 bg-black/20 flex items-center gap-2">
            <input className="flex-1 px-3 py-2 rounded-md bg-transparent border border-white/6 text-white/80 placeholder:text-white/30" placeholder="Preview input (disabled)" disabled />
            <div className="text-xs text-white/50">Preview</div>
          </div>
        </div>
      </div>
    </div>
  );
}
