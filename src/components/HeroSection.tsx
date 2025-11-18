"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// NEW IMPORT
import { GradientButton } from "@/components/ui/gradient-button";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* TAGLINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center space-x-2 bg-[#00FFFF]/10 border border-[#00FFFF]/30 rounded-full px-6 py-2 text-[#00FFFF]">
              <Sparkles size={16} />
              <span>AI-Powered Automation</span>
            </span>
          </motion.div>

          {/* HEADER */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Transform Your Business with{" "}
            <span className="neon-gradient-text">AI Intelligence</span>
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Unlock unprecedented efficiency and innovation with LUXERA AGENCY's
            cutting-edge AI automation solutions. We turn complex challenges
            into intelligent, scalable systems.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* START YOUR AI JOURNEY */}
            <Link href="/dashboard" className="flex">
              <GradientButton className="text-lg px-8 py-6 flex items-center gap-3 leading-none">
                <span className="translate-y-[1px]">
                  Start Your AI Journey
                </span>
                <ArrowRight size={20} className="translate-y-[1px]" />
              </GradientButton>
            </Link>

            {/* WATCH DEMO (VARIANT BUTTON) */}
            <GradientButton
              variant="variant"
              className="text-lg px-8 py-6 flex items-center gap-2 leading-none"
            >
              Watch Demo
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
