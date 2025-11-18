"use client";

import Image from "next/image";
import React from "react";

interface LogoBrushedProps {
  size?: number;          // Easily control size
  className?: string;     // Add glow, animation, styling
}

export default function LogoBrushed({
  size = 40,
  className = "",
}: LogoBrushedProps) {
  return (
    <Image
      src="/logo-luxera.svg"   // your SVG in public folder
      alt="Luxera Titanium Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
