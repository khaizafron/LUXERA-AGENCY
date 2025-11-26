"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Sparkles,
  Smartphone,
  Play,
  Wifi,
  ShieldCheck,
  Send,
  Users,
  TrendingUp,
  Clock,
  ArrowLeft,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// UI SYSTEM
import NeonPanel from "@/components/ui/NeonPanel";
import MagneticTabs from "@/components/ui/MagneticTabs";
import ParallaxCard from "@/components/ui/ParallaxCard";
import AnimatedSeparator from "@/components/ui/AnimatedSeparator";
import TokenBar from "@/components/ui/TokenBar";

// WhatsApp components
import PersonaSliders from "@/components/whatsapp/PersonaSliders";
import PhonePreview from "@/components/whatsapp/PhonePreview";

// FINAL UNIFIED BUTTONS
import { ShinyButton } from "@/components/ui/shiny-button";
import { buttonVariants, NeonButton } from "@/components/ui/neon-button";

// -----------------------------------------------------------------------------
// Background
// -----------------------------------------------------------------------------

function SplineBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.querySelector("script[data-spline-viewer]")) {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@splinetool/viewer@1.12.3/build/spline-viewer.js";
      script.type = "module";
      script.async = true;
      script.setAttribute("data-spline-viewer", "1");
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (customElements.get("spline-viewer")) {
        clearInterval(interval);

        if (!containerRef.current) return;

        containerRef.current.innerHTML = "";

        const viewer = document.createElement("spline-viewer");
        viewer.setAttribute(
          "url",
          "https://prod.spline.design/Tf-vr8l31pqs7zZ3/scene.splinecode"
        );

        viewer.style.width = "100%";
        viewer.style.height = "100%";
        viewer.style.pointerEvents = "none";
        viewer.style.display = "block";
        viewer.style.opacity = "1";
        viewer.style.transform = "scale(1.35) translateY(8%)";
        viewer.style.transformOrigin = "center";

        containerRef.current.appendChild(viewer);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Fake analytics data
// -----------------------------------------------------------------------------

const ANALYTICS_DATA = [
  { name: "Mon", leads: 42, conversions: 8 },
  { name: "Tue", leads: 58, conversions: 12 },
  { name: "Wed", leads: 45, conversions: 10 },
  { name: "Thu", leads: 63, conversions: 18 },
  { name: "Fri", leads: 85, conversions: 24 },
  { name: "Sat", leads: 72, conversions: 20 },
  { name: "Sun", leads: 50, conversions: 14 },
];

// -----------------------------------------------------------------------------
// MAIN PAGE
// -----------------------------------------------------------------------------

export default function WhatsAppServicePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "persona" | "connect" | "test" | "analytics"
  >("persona");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Do you have this shirt in Medium?",
      time: "10:42 AM",
      id: "m0",
    },
  ]);

  const [config, setConfig] = useState({
    botName: "Support Agent Beta",
    businessType: "E-commerce Fashion",
    description: "Handle customer returns and sizing questions.",
    llmModel: "gemini-1.5-flash",
    phoneNumberId: "",
    accessToken: "",
    generatedPrompt:
      "You are a helpful assistant for a fashion store. Be polite and concise.",
    status: "draft",
  });

  const [persona] = useState({
    tone: 60,
    creativity: 40,
    formality: 50,
  });

  const [tokenEstimate] = useState(1200);

  // ---------------------------------------------------------------------------
  // Prompt generator
  // ---------------------------------------------------------------------------

  const handleGeneratePrompt = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setConfig((p) => ({
        ...p,
        generatedPrompt: `Support agent for ${p.businessType}. Task: ${p.description}. Tone ${persona.tone}, Creativity ${persona.creativity}, Formality ${persona.formality}.`,
      }));
      setIsGenerating(false);
    }, 600);
  };

  // ---------------------------------------------------------------------------
  // Chat test
  // ---------------------------------------------------------------------------

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((p) => [
      ...p,
      { role: "user", text: chatInput, time: now, id: `u${Date.now()}` },
      { role: "ai", text: "...", time: "", id: `l${Date.now()}` },
    ]);

    setChatInput("");

    setTimeout(() => {
      setMessages((p) =>
        p.map((m) =>
          m.text === "..."
            ? {
                ...m,
                text: "Medium available. Suggest measuring chest/waist.",
                time: now,
              }
            : m
        )
      );
    }, 900);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      <SplineBackground />

      <div className="relative z-10">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8 p-6">
          <div className="flex items-center gap-4">
            <NeonButton
              variant="ghost"
              size="md"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft size={16} /> Back
            </NeonButton>

            <div>
              <h1 className="text-3xl font-bold text-white">
                WhatsApp Automation
              </h1>
              <p className="text-sm text-white/60">
                Build. Test. Deploy intelligent WhatsApp agents.
              </p>
            </div>
          </div>

          <ShinyButton size="md" onClick={() => alert("Deploy preview!")}>
            <Play size={16} /> Deploy (Preview)
          </ShinyButton>
        </header>

        {/* TABS */}
        <div className="px-6 mb-6">
          <MagneticTabs
            tabs={["persona", "connect", "test", "analytics"]}
            active={activeTab}
            onChange={(t) => setActiveTab(t as any)}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-10">
          {/* LEFT PANEL */}
          <div className="space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {activeTab === "persona" && (
                <motion.div
                  key="persona"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="space-y-4"
                >
                  <NeonPanel>
                    <div className="space-y-4">
                      {/* Inputs */}
                      <label className="text-sm text-white/60">Bot Name</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                        value={config.botName}
                        onChange={(e) =>
                          setConfig((p) => ({ ...p, botName: e.target.value }))
                        }
                      />

                      <label className="text-sm text-white/60">
                        Business Type
                      </label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                        value={config.businessType}
                        onChange={(e) =>
                          setConfig((p) => ({
                            ...p,
                            businessType: e.target.value,
                          }))
                        }
                      />

                      <label className="text-sm text-white/60">
                        Bot Description
                      </label>
                      <textarea
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                        value={config.description}
                        onChange={(e) =>
                          setConfig((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                      />

                      <AnimatedSeparator />

                      <PersonaSliders
                        persona={persona}
                        onChange={() => {}}
                      />

                      <div className="flex items-center gap-3">
                        <ShinyButton
                          size="md"
                          onClick={handleGeneratePrompt}
                        >
                          <Sparkles size={16} />
                          {isGenerating
                            ? "Generating..."
                            : "Generate Prompt"}
                        </ShinyButton>

                        <NeonButton
                          size="md"
                          variant="default"
                          className="ml-8"
                          onClick={() =>
                            setConfig((p) => ({
                              ...p,
                              generatedPrompt: "",
                            }))
                          }
                        >
                          Clear
                        </NeonButton>
                      </div>

                      <label className="text-sm text-white/60">
                        Generated Prompt
                      </label>
                      <textarea
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs font-mono"
                        value={config.generatedPrompt}
                        onChange={(e) =>
                          setConfig((p) => ({
                            ...p,
                            generatedPrompt: e.target.value,
                          }))
                        }
                      />

                      <TokenBar tokens={tokenEstimate} />
                    </div>
                  </NeonPanel>
                </motion.div>
              )}

              {activeTab === "connect" && (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                >
                  <NeonPanel>
                    <div className="space-y-4">
                      <label className="text-sm text-white/60">
                        Phone Number ID
                      </label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                        value={config.phoneNumberId}
                        onChange={(e) =>
                          setConfig((p) => ({
                            ...p,
                            phoneNumberId: e.target.value,
                          }))
                        }
                      />

                      <label className="text-sm text-white/60">
                        Access Token
                      </label>
                      <input
                        type="password"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                        value={config.accessToken}
                        onChange={(e) =>
                          setConfig((p) => ({
                            ...p,
                            accessToken: e.target.value,
                          }))
                        }
                      />

                      <div className="flex items-center gap-3">
                        <NeonButton
                          size="md"
                          variant="solid"
                          onClick={() => {
                            setIsVerifying(true);
                            setTimeout(() => {
                              setConfig((p) => ({
                                ...p,
                                status: "active",
                              }));
                              setIsVerifying(false);
                            }, 900);
                          }}
                          className="flex-1"
                        >
                          <Wifi size={16} />
                          {isVerifying
                            ? "Verifying..."
                            : "Verify Connection"}
                        </NeonButton>

                        <NeonButton
                          size="md"
                          variant="default"
                          onClick={() =>
                            setConfig((p) => ({
                              ...p,
                              status:
                                p.status === "active" ? "draft" : "active",
                            }))
                          }
                        >
                          Toggle
                        </NeonButton>
                      </div>

                      {config.status === "active" && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-300 flex items-center gap-2">
                          <ShieldCheck size={16} /> Connected Successfully
                        </div>
                      )}
                    </div>
                  </NeonPanel>
                </motion.div>
              )}

              {activeTab === "test" && (
                <motion.div
                  key="test"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                >
                  <NeonPanel>
                    <div className="h-64 rounded overflow-y-auto custom-scrollbar p-3 space-y-3">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[78%] px-3 py-2 rounded-lg text-sm ${
                              msg.role === "user"
                                ? "bg-cyan-600 text-black"
                                : "bg-white/10 text-gray-200 border border-white/10"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-[10px] opacity-60 mt-1 text-right">
                              {msg.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                        placeholder="Type here..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                      />

                      <NeonButton
                        size="md"
                        variant="solid"
                        onClick={handleSendMessage}
                      >
                        <Send size={16} />
                      </NeonButton>
                    </div>
                  </NeonPanel>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                >
                  <NeonPanel>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <ParallaxCard>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Users size={14} /> Leads
                        </div>
                        <p className="text-white text-xl font-bold">415</p>
                      </ParallaxCard>

                      <ParallaxCard>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <TrendingUp size={14} /> Conversion
                        </div>
                        <p className="text-white text-xl font-bold">18%</p>
                      </ParallaxCard>

                      <ParallaxCard>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Clock size={14} /> AVG Response
                        </div>
                        <p className="text-white text-xl font-bold">1.2s</p>
                      </ParallaxCard>
                    </div>

                    <div className="h-48 rounded p-2 bg-white/5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ANALYTICS_DATA}>
                          <defs>
                            <linearGradient
                              id="colorLeads"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="20%"
                                stopColor="#22d3ee"
                                stopOpacity={0.6}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22d3ee"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          <XAxis dataKey="name" stroke="#999" />
                          <YAxis stroke="#999" />
                          <Tooltip />

                          <Area
                            type="monotone"
                            dataKey="leads"
                            stroke="#06b6d4"
                            fillOpacity={1}
                            fill="url(#colorLeads)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </NeonPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="col-span-2 space-y-4">
            <NeonPanel className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg text-white font-semibold flex items-center gap-2">
                    <Smartphone size={18} /> WhatsApp Live Preview
                  </h2>
                  <p className="text-xs text-white/60">
                    Simulate conversations and test personas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-white/60">Active Model</div>
                  <div className="text-sm px-3 py-1 rounded bg-white/5 border border-white/10">
                    {config.llmModel}
                  </div>
                </div>
              </div>

              <AnimatedSeparator />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <PhonePreview
                    messages={messages}
                    botName={config.botName}
                  />
                </div>

                <div className="col-span-1 flex flex-col gap-3">
                  <NeonPanel className="p-3">
                    <div className="text-sm text-white/60 mb-2">
                      Preview Controls
                    </div>

                    <select
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-2 text-white"
                      onChange={(e) => {
                        const now = new Date().toLocaleTimeString();
                        const v = e.target.value;

                        if (v === "angry") {
                          setMessages((m) => [
                            ...m,
                            {
                              role: "user",
                              text: "This item arrived damaged!",
                              time: now,
                              id: `sc-${Date.now()}`,
                            },
                          ]);
                          setActiveTab("test");
                        }

                        if (v === "sizing") {
                          setMessages((m) => [
                            ...m,
                            {
                              role: "user",
                              text: "What size should I order for 100cm chest?",
                              time: now,
                              id: `sc-${Date.now()}`,
                            },
                          ]);
                          setActiveTab("test");
                        }
                      }}
                    >
                      <option value="">Choose scenario</option>
                      <option value="sizing">Sizing question</option>
                      <option value="angry">Damaged item</option>
                      <option value="followup">Order Follow-up</option>
                    </select>
                  </NeonPanel>

                  <NeonPanel className="p-3">
                    <div className="text-sm text-white/60 mb-2">
                      Quick Actions
                    </div>

                    <div className="flex flex-col gap-3">
                      <NeonButton
                        size="md"
                        variant="default"
                        onClick={() =>
                          setMessages([
                            {
                              role: "ai",
                              text: "Welcome to the test chat!",
                              time: new Date().toLocaleTimeString(),
                              id: `m-${Date.now()}`,
                            },
                          ])
                        }
                      >
                        Reset Preview
                      </NeonButton>

                      <ShinyButton
                        size="md"
                        onClick={() => alert("Bot deployed!")}
                      >
                        <Play size={16} />  Deploy Bot
                      </ShinyButton>
                    </div>
                  </NeonPanel>

                  <NeonPanel className="p-3">
                    <div className="text-sm text-white/60 mb-2">
                      Persona Snapshot
                    </div>

                    <div className="text-xs text-white/70">
                      Tone: {persona.tone} — Creativity:{" "}
                      {persona.creativity} — Formality: {persona.formality}
                    </div>

                    <div className="mt-2">
                      <small className="text-xs text-white/50">
                        Preview prompt:
                      </small>
                      <pre className="text-xs text-white/60 mt-2 whitespace-pre-wrap">
                        {config.generatedPrompt.slice(0, 300) +
                          (config.generatedPrompt.length > 300
                            ? "..."
                            : "")}
                      </pre>
                    </div>
                  </NeonPanel>
                </div>
              </div>

              <AnimatedSeparator />

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs text-white/60">Estimate</div>
                  <div className="text-sm font-semibold text-white">
                    ~{tokenEstimate} tokens
                  </div>
                </div>

                <div className="w-60">
                  <TokenBar tokens={tokenEstimate} />
                </div>

                <div className="w-48">
                  <ShinyButton
                    size="md"
                    onClick={() =>
                      alert("Bot deployment flow started")
                    }
                  >
                    <Play size={14} /> Deploy Bot
                  </ShinyButton>
                </div>
              </div>
            </NeonPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
