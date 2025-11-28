"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { GradientButton } from "@/components/ui/gradient-button";
import SplineHero from "@/components/ui/SplineHero";
import LogoBrushed from "@/components/ui/LogoBrushed";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="
        relative min-h-screen w-full 
        overflow-hidden 
        flex items-center 
        pt-20 md:pt-20
      "
    >

      {/* === TOP LEFT LOGO INSIDE HERO === */}
      <div className="absolute top-24 md:top-6 left-6 md:left-8 z-30 flex items-center space-x-2 md:space-x-3 select-none">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg overflow-hidden glow-cyan">
          <LogoBrushed size={40} className="md:w-12 md:h-12" />
        </div>

        <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">
           <span className="neon-gradient-text">LUXERA</span>
        </span>
      </div>

      {/* === FIXED SPLINE BACKGROUND === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="
            absolute top-0 left-0 
            w-[200%] md:w-[170%] lg:w-[150%] h-full 
            pointer-events-auto
          "
        >
          <SplineHero />
        </div>
      </div>

      {/* === LEFT SIDE GRADIENT === */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r 
          from-black/95 via-black/75 md:via-black/55 to-transparent
          pointer-events-none"
      />

      {/* === CONTENT COLUMN (Responsive Width) === */}
      <div
        className="
          relative z-20 
          w-full md:w-[45%]
          px-6 md:pl-12 md:pr-8 
          flex flex-col justify-center
          pointer-events-auto
        "
      >
        {/* TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-3 md:mb-4"
        >
          <span
            className="
              inline-flex items-center space-x-2 
              bg-[#00FFFF]/10 border border-[#00FFFF]/30 
              rounded-full px-3 py-1 md:px-4 md:py-1.5 
              text-[#00FFFF] text-xs md:text-sm
            "
          >
            <Sparkles size={12} className="md:w-3.5 md:h-3.5" />
            <span>AI-Powered Automation</span>
          </span>
        </motion.div>

        {/* HEADER (Responsive text sizing) */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
            font-bold mb-3 md:mb-4 leading-tight
          "
        >
          Transform Your Business with{" "}
          <span className="neon-gradient-text whitespace-nowrap inline-block">
            AI Intelligence
          </span>
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 max-w-md leading-relaxed"
        >
          Unlock unprecedented efficiency with LUXERA AGENCY's intelligent
          automation solutions. Build smarter, scale faster.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="flex flex-col sm:flex-row items-start gap-3"
        >
          <Link href="/dashboard" className="flex w-full sm:w-auto">
            <GradientButton className="text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3 flex items-center justify-center gap-2 leading-none w-full sm:w-auto">
              Start Your AI Journey
              <ArrowRight size={16} />
            </GradientButton>
          </Link>

          <GradientButton
            variant="variant"
            className="text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3 flex items-center justify-center gap-2 leading-none w-full sm:w-auto"
          >
            Watch Demo
          </GradientButton>
        </motion.div>
      </div>
    </section>
  );
}