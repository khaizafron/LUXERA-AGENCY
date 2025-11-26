"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ width: 0, left: 0 });

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) {
      setUnderline({
        width: el.offsetWidth,
        left: el.offsetLeft,
      });
    }
  }, [active, tabs]);

  return (
    <div className="relative border-b border-white/10 pb-2">
      <div className="flex gap-3">
        {tabs.map((t) => (
          <button
            key={t}
            ref={(el) => (refs.current[t] = el)}
            onClick={() => onChange(t)}
            className={`px-5 py-2 rounded-md text-sm transition ${
              active === t
                ? "text-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <motion.div
        className="absolute bottom-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded"
        animate={{
          width: underline.width,
          x: underline.left,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      />
    </div>
  );
}
