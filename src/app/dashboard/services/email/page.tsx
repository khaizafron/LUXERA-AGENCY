"use client";

import React, { useState } from "react";
import {
  Mail,
  FileText,
  Send,
  RefreshCw,
  LayoutTemplate,
  Plus,
  Clock,
  Trash2,
  Download,
  BarChart3,
  Sparkles,
  Paperclip,
  Eye,
  MousePointer2,
  XOctagon
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// ---------------- TYPES ----------------

type Tab = "documents" | "campaigns" | "analytics";

interface Template {
  id: string;
  name: string;
  icon: any;
  fields: {
    key: string;
    label: string;
    type: "text" | "number" | "date";
  }[];
  promptContext: string;
}

// ---------------- TEMPLATE DATA ----------------

const TEMPLATES: Template[] = [
  {
    id: "offer-letter",
    name: "Offer Letter",
    icon: FileText,
    fields: [
      { key: "candidateName", label: "Candidate Name", type: "text" },
      { key: "role", label: "Role Title", type: "text" },
      { key: "salary", label: "Annual Salary", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" }
    ],
    promptContext: "Write a formal, exciting job offer letter."
  },
  {
    id: "invoice",
    name: "Invoice",
    icon: LayoutTemplate,
    fields: [
      { key: "clientName", label: "Client Name", type: "text" },
      { key: "service", label: "Service Rendered", type: "text" },
      { key: "amount", label: "Amount ($)", type: "number" },
      { key: "dueDate", label: "Due Date", type: "date" }
    ],
    promptContext: "Generate a professional invoice breakdown structure."
  },
  {
    id: "contract",
    name: "Service Agreement",
    icon: FileText,
    fields: [
      { key: "clientName", label: "Client Name", type: "text" },
      { key: "duration", label: "Duration", type: "text" },
      { key: "scope", label: "Scope of Work", type: "text" }
    ],
    promptContext: "Draft a legal service agreement contract."
  }
];

const ANALYTICS_DATA = [
  { day: "Mon", openRate: 45, clickRate: 12 },
  { day: "Tue", openRate: 52, clickRate: 15 },
  { day: "Wed", openRate: 48, clickRate: 14 },
  { day: "Thu", openRate: 61, clickRate: 22 },
  { day: "Fri", openRate: 55, clickRate: 18 },
  { day: "Sat", openRate: 35, clickRate: 8 },
  { day: "Sun", openRate: 30, clickRate: 5 }
];

// ============ PAGE COMPONENT ============

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("documents");

  // Document state
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [generatedDocContent, setGeneratedDocContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedDocs, setSavedDocs] = useState<
    { id: string; name: string; type: string }[]
  >([]);

  // Campaign builder
  const [campaignSteps, setCampaignSteps] = useState<
    { id: number; type: "email" | "wait"; content?: string; delay?: string; attachment?: string }[]
  >([
    { id: 1, type: "email", content: "Welcome to the team!", attachment: "" },
    { id: 2, type: "wait", delay: "2 days" },
    { id: 3, type: "email", content: "Getting started guide" }
  ]);

  const [testEmail, setTestEmail] = useState("");

  // ---------------- AI GENERATION ----------------

  const handleGenerateDoc = async () => {
    setIsGenerating(true);

    try {
      // Mock generator (use real Gemini endpoint later)
      await new Promise((r) => setTimeout(r, 1000));
      const text = `
${selectedTemplate.name.toUpperCase()} — DRAFT

Dear ${docFormData.candidateName || docFormData.clientName || "Client"},

Here is your generated ${selectedTemplate.name.toLowerCase()} document preview.

Details:
• Role/Service: ${docFormData.role || docFormData.service || "N/A"}
• Amount/Salary: ${docFormData.salary || docFormData.amount || "N/A"}

— Generated Preview —
      `;
      setGeneratedDocContent(text.trim());
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDocument = () => {
    if (!generatedDocContent) return;

    const newDoc = {
      id: Date.now().toString(),
      name:
        selectedTemplate.name +
        " - " +
        (docFormData.candidateName || docFormData.clientName || "Draft"),
      type: "PDF"
    };

    setSavedDocs([...savedDocs, newDoc]);
    setActiveTab("campaigns");
  };

  const inputClass =
    "w-full bg-[#1A1D24] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors placeholder:text-gray-500";

  return (
    <div className="flex flex-col h-full min-h-[650px]">

      {/* ---------------- TABS ---------------- */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${
              activeTab === "documents"
                ? "border-purple-500 text-purple-400 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileText size={16} />
            Document Studio
          </button>

          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${
              activeTab === "campaigns"
                ? "border-purple-500 text-purple-400 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Send size={16} />
            Campaign Builder
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${
              activeTab === "analytics"
                ? "border-purple-500 text-purple-400 bg-white/5"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <BarChart3 size={16} />
            Deliverability
          </button>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="flex-1 overflow-hidden">

        {/* DOCUMENT STUDIO */}
        {activeTab === "documents" && (
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2 custom-scrollbar h-full">

              {/* Templates */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Select Template
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setGeneratedDocContent("");
                      }}
                      className={`p-3 rounded-xl border transition-all text-left ${
                        selectedTemplate.id === t.id
                          ? "bg-purple-500/20 border-purple-500/50 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <t.icon size={20} className="mb-2" />
                      <div className="text-xs font-bold">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4 bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Document Details
                </h3>

                {selectedTemplate.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={docFormData[field.key] || ""}
                      onChange={(e) =>
                        setDocFormData({
                          ...docFormData,
                          [field.key]: e.target.value
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                ))}

                <button
                  onClick={handleGenerateDoc}
                  disabled={isGenerating}
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 rounded-lg 
                  flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
                >
                  {isGenerating ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  Generate with AI
                </button>
              </div>
            </div>

            {/* RIGHT SIDE / PREVIEW */}
            <div className="w-full lg:w-2/3 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Live Preview (PDF Style)
                </h3>

                {generatedDocContent && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDocument}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-2"
                    >
                      <Paperclip size={14} />
                      Save & Use in Campaign
                    </button>

                    <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-2">
                      <Download size={14} />
                      PDF
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-white text-black p-8 rounded-lg overflow-y-auto font-serif shadow-xl">
                {generatedDocContent ? (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {generatedDocContent}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText size={48} className="mb-4" />
                    <p>Fill the details and click Generate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CAMPAIGN BUILDER */}
        {activeTab === "campaigns" && (
          <div className="flex flex-col lg:flex-row gap-6 h-full">

            {/* Steps */}
            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Welcome Sequence</h3>
                <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/20">
                  Active
                </button>
              </div>

              {/* Timeline */}
              <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-0 before:bottom-0 before:w-px before:bg-white/10">

                {campaignSteps.map((step, idx) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`absolute -left-[2.1rem] w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#0A0A0A] ${
                        step.type === "email" ? "bg-purple-500" : "bg-gray-600"
                      }`}
                    >
                      {step.type === "email" ? (
                        <Mail size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-sm">
                          {step.type === "email"
                            ? `Email #${Math.ceil((idx + 1) / 2)}`
                            : "Delay"}
                        </h4>

                        <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {step.type === "email" ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            defaultValue={step.content}
                            className={`${inputClass} py-2`}
                          />

                          {/* Attachment */}
                          <div className="flex items-center gap-2">
                            <select
                              defaultValue={step.attachment || ""}
                              className="bg-[#1A1D24] text-xs text-white border border-white/10 rounded p-1.5"
                            >
                              <option value="">No Attachment</option>
                              {savedDocs.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                  {doc.name} ({doc.type})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Wait for</span>
                          <input
                            type="text"
                            defaultValue={step.delay}
                            className="w-24 bg-[#1A1D24] border border-white/10 rounded p-1 text-sm text-center text-white focus:border-purple-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm">
                  <div className="w-6 h-6 rounded-full border border-dashed flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  Add Step
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Test Automation */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">
                  Test Automation
                </h3>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmail}
                    placeholder="test@example.com"
                    onChange={(e) => setTestEmail(e.target.value)}
                    className={inputClass}
                  />
                  <button className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg">
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* Trigger Settings */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">
                  Trigger Settings
                </h3>

                <div className="space-y-2 text-sm text-gray-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span>When new lead added</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>On form submission</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Open Rate */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-purple-300">Open Rate</span>
                  <Eye size={16} className="text-purple-400" />
                </div>
                <div className="text-2xl font-bold">48.5%</div>
                <div className="text-[10px] text-purple-300/70">+5% vs last week</div>
              </div>

              {/* Click Rate */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-blue-300">Click Rate</span>
                  <MousePointer2 size={16} className="text-blue-400" />
                </div>
                <div className="text-2xl font-bold">14.2%</div>
                <div className="text-[10px] text-blue-300/70">High engagement</div>
              </div>

              {/* Bounce Rate */}
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-red-300">Bounce Rate</span>
                  <XOctagon size={16} className="text-red-400" />
                </div>
                <div className="text-2xl font-bold">1.8%</div>
                <div className="text-[10px] text-red-300/70">Healthy domain</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex-1 min-h-[300px]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Engagement Trend (7 Days)
              </h3>

              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#333" }} />

                  <Area
                    type="monotone"
                    dataKey="openRate"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorOpen)"
                  />

                  <Area
                    type="monotone"
                    dataKey="clickRate"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorClick)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
