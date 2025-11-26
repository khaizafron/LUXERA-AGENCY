"use client";
import React from "react";

export default function PersonaSliders({ persona, onChange }: { persona: { tone: number; creativity: number; formality: number }; onChange: (p: any) => void }) {
  const Slider = ({ label, value, onChangeLocal }: { label: string; value: number; onChangeLocal: (n: number) => void }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-white/60">
        <div>{label}</div>
        <div>{value}</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChangeLocal(Number(e.target.value))}
        className="w-full accent-cyan-400"
      />
    </div>
  );

  return (
    <div className="space-y-3">
      <Slider label="Tone (warm ↔ direct)" value={persona.tone} onChangeLocal={(n) => onChange({ ...persona, tone: n })} />
      <Slider label="Creativity (low ↔ high)" value={persona.creativity} onChangeLocal={(n) => onChange({ ...persona, creativity: n })} />
      <Slider label="Formality (casual ↔ formal)" value={persona.formality} onChangeLocal={(n) => onChange({ ...persona, formality: n })} />
    </div>
  );
}
