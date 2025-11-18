"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Bot,
  Database,
  LineChart,
  Sparkles,
  Workflow,
  Shield,
} from "lucide-react";
import { GradientCard } from "@/components/ui/gradient-card";

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const services = [
    {
      icon: Bot,
      title: "AI Chatbots",
      description:
        "Intelligent conversational agents that engage customers 24/7",
      features: [
        "Natural Language Processing",
        "Multi-language Support",
        "Context Awareness",
      ],
    },
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Streamline operations with intelligent workflow automation",
      features: ["Task Automation", "Integration APIs", "Custom Workflows"],
    },
    {
      icon: Database,
      title: "Data Analytics",
      description: "Transform raw data into actionable business insights",
      features: [
        "Predictive Analytics",
        "Real-time Dashboards",
        "Custom Reports",
      ],
    },
    {
      icon: LineChart,
      title: "Business Intelligence",
      description: "Make data-driven decisions with advanced analytics",
      features: [
        "Market Analysis",
        "Competitor Insights",
        "Trend Forecasting",
      ],
    },
    {
      icon: Sparkles,
      title: "Machine Learning",
      description: "Custom ML models tailored to your business needs",
      features: [
        "Model Training",
        "Algorithm Optimization",
        "Deployment Support",
      ],
    },
    {
      icon: Shield,
      title: "AI Security",
      description: "Protect your systems with AI-powered security solutions",
      features: ["Threat Detection", "Anomaly Detection", "Risk Assessment"],
    },
  ];

  return (
    <section id="services" ref={ref} className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Our <span className="neon-gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive AI solutions designed to revolutionize your business
            operations
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative"
              >
                {/* GradientCard WRAPPER */}
                <GradientCard
                  className={`transition-transform duration-300 ${
                    hoveredIndex === index ? "scale-[1.04]" : "scale-100"
                  }`}
                >
                  {/* ICON */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00FFFF] to-[#D4AF37] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-black" size={32} />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00FFFF] transition-colors">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-400 mb-6">{service.description}</p>

                  {/* FEATURES */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-300"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </GradientCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
