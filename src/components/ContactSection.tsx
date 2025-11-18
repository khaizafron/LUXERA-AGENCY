"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { GradientButton } from "@/components/ui/gradient-button";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const RECAPTCHA_SITE_KEY = "6LcAOw8sAAAAAExsW9S9olrC5JHGQOyJbDXYNWVF";

  // Load Recaptcha script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => console.log("[RECAPTCHA] Loaded");
    script.onerror = () => console.error("[RECAPTCHA] FAILED");
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!window.grecaptcha) {
        toast.error("Recaptcha failed to load.");
        return;
      }

      console.log("[RECAPTCHA] executing...");
      const recaptchaToken = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: "contact" }
      );

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        message: formData.message.trim(),
        recaptchaToken,
      };

      console.log("[API] sending to /api/contact", payload);

      //  🔥 FIXES EVERYTHING → send to your backend only
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("[API Response]", data);

      if (!res.ok || !data.ok) {
        toast.error("Message failed to send.");
        return;
      }

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (err) {
      console.error("FORM ERROR:", err);
      toast.error("Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "khai@luxera.com",
      link: "mailto:khai@luxera.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+60 11 2694 1552",
      link: "tel:+601126941552",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Kuala Lumpur, Malaysia",
      link: "#",
    },
  ];

  return (
    <section id="contact" ref={ref} className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Get In <span className="neon-gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Ready to transform your business with AI? Let’s talk about your goals.
          </p>
        </motion.div>

        {/* BODY */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold mb-8">Let's Talk</h3>

            <div className="space-y-6 mb-8">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <LiquidGlassCard key={i} clickable className="p-4 rounded-xl group">
                    <a href={info.link} className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#00FFFF]/10 rounded-lg flex items-center justify-center">
                        <Icon className="text-[#00FFFF]" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{info.label}</p>
                        <p className="text-white font-medium">{info.value}</p>
                      </div>
                    </a>
                  </LiquidGlassCard>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />

              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isSubmitting}
              />

              <Input
                type="text"
                placeholder="Company Name (Optional)"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                disabled={isSubmitting}
              />

              <Textarea
                placeholder="Tell us about your project…"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={5}
                disabled={isSubmitting}
              />

              <GradientButton
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={20} />
                  </>
                )}
              </GradientButton>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
