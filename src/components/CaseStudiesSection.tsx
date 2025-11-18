"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCaseCard from "@/components/ui/glass-case-card";

export default function CaseStudiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const caseStudies = [
    {
      title: "E-Commerce Revolution",
      client: "Global Retail Corp",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      challenge: "Manual order processing causing delays and errors",
      solution: "AI-powered automation system with predictive analytics",
      results: [
        { icon: TrendingUp, label: "Efficiency Increase", value: "300%" },
        { icon: Clock, label: "Time Saved", value: "15hrs/day" },
        { icon: DollarSign, label: "Cost Reduction", value: "$2M/year" },
      ],
    },
    {
      title: "Healthcare Analytics",
      client: "MedTech Solutions",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      challenge: "Patient data analysis taking weeks to complete",
      solution: "Real-time AI analytics platform with ML predictions",
      results: [
        { icon: TrendingUp, label: "Accuracy Improvement", value: "95%" },
        { icon: Clock, label: "Analysis Time", value: "2 hours" },
        { icon: DollarSign, label: "ROI", value: "450%" },
      ],
    },
    {
      title: "Financial Forecasting",
      client: "Investment Partners Ltd",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      challenge: "Unpredictable market trends affecting portfolio",
      solution: "Advanced ML models for market prediction and risk analysis",
      results: [
        { icon: TrendingUp, label: "Prediction Accuracy", value: "92%" },
        { icon: Clock, label: "Response Time", value: "Real-time" },
        { icon: DollarSign, label: "Portfolio Growth", value: "78%" },
      ],
    },
  ];

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % caseStudies.length);
  const prevSlide = () =>
    setCurrentIndex((p) => (p - 1 + caseStudies.length) % caseStudies.length);

  const current = caseStudies[currentIndex];

  return (
    <section id="case-studies" ref={ref} className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Success <span className="neon-gradient-text">Stories</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real results from businesses that transformed with our AI solutions
          </p>
        </motion.div>

        <GlassCaseCard className="w-full">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT IMAGE */}
            <div
              className="h-64 md:h-full bg-cover bg-center rounded-2xl"
              style={{
                backgroundImage: `url(${current.image})`,
                filter: "brightness(0.75)",
              }}
            />

            {/* RIGHT CONTENT */}
            <div>
              <div className="text-sm text-[#D4AF37] mb-2">{current.client}</div>

              <h3 className="text-3xl font-bold mb-6">{current.title}</h3>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="text-[#00FFFF] font-semibold mb-2">
                    Challenge
                  </h4>
                  <p className="text-gray-300">{current.challenge}</p>
                </div>
                <div>
                  <h4 className="text-[#00FFFF] font-semibold mb-2">
                    Solution
                  </h4>
                  <p className="text-gray-300">{current.solution}</p>
                </div>
              </div>

              {/* ⭐ 3D FLOATING STATS */}
              <div className="grid grid-cols-3 gap-4 mb-8 [transform-style:preserve-3d]">
                {current.results.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={i}
                      className="
                        relative text-center rounded-xl bg-white/5 p-4
                        transition-all duration-300 shadow-lg
                        hover:shadow-[0_0_40px_rgba(0,255,255,0.25)]
                        [transform-style:preserve-3d]
                        group
                      "
                      style={{
                        transform: "translateZ(70px)", // ⭐ POP OUT EFFECT
                      }}
                    >
                      {/* ICON */}
                      <div
                        className="
                          w-10 h-10 mx-auto mb-2 rounded-full bg-white/10
                          flex items-center justify-center
                          transition-transform duration-300
                          group-hover:scale-110
                          [transform:translateZ(45px)]
                        "
                      >
                        <Icon className="text-[#00FFFF]" size={22} />
                      </div>

                      {/* VALUE */}
                      <div
                        className="
                          text-2xl font-bold neon-gradient-text mb-1
                          transition-transform duration-300
                          group-hover:scale-110
                          [transform:translateZ(55px)]
                        "
                      >
                        {r.value}
                      </div>

                      {/* LABEL */}
                      <div
                        className="
                          text-xs text-gray-400
                          transition-transform duration-300
                          group-hover:scale-105
                          [transform:translateZ(35px)]
                        "
                      >
                        {r.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NAVIGATION */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {caseStudies.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? "bg-[#00FFFF] w-8"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={prevSlide}
                    variant="outline"
                    size="icon"
                    className="border-[#00FFFF]/30 hover:bg-[#00FFFF]/10"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    onClick={nextSlide}
                    variant="outline"
                    size="icon"
                    className="border-[#00FFFF]/30 hover:bg-[#00FFFF]/10"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </GlassCaseCard>
      </div>
    </section>
  );
}
