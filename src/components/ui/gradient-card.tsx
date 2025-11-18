"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GradientCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  className = "",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotation({
      x: -(y / rect.height) * 5,
      y: (x / rect.width) * 5,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-[32px] overflow-hidden p-8 ${className}`}
      style={{
        backgroundColor: "#0e131f",
        transformStyle: "preserve-3d",
        boxShadow:
          "0 -10px 100px 10px rgba(78, 99, 255, 0.25), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
      }}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Overlay Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(2px)",
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
          rotateX: -rotation.x * 0.2,
          rotateY: -rotation.y * 0.2,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Dark base background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #000 0%, #000 70%)",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3"
        style={{
          background: `
              radial-gradient(ellipse at bottom right, rgba(172, 92, 255, 0.7) -10%, rgba(79,70,229,0) 70%),
              radial-gradient(ellipse at bottom left, rgba(56,189,248,0.7) -10%, rgba(79,70,229,0) 70%)
            `,
          filter: "blur(40px)",
        }}
      />

      {/* Children content */}
      <div className="relative z-40 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
};
