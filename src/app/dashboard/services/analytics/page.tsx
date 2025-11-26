"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, ScatterChart, Scatter, Legend, Cell
} from "recharts";
import {
  Download,
  Upload,
  FileSpreadsheet,
  Sparkles,
  BrainCircuit,
  Play,
  Save,
  FileText,
  Code,
  LayoutDashboard,
  Table as TableIcon,
  ChevronRight,
  Maximize2,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

// --- Types ---
type Tab = "data" | "visualize" | "python";

interface DataPoint {
  [key: string]: any;
}

// --- Mock Data ---
const MOCK_SALES_DATA = [
  { date: "2024-01", region: "North", sales: 4000, profit: 2400, customers: 150, product: "Electronics" },
  { date: "2024-02", region: "North", sales: 3000, profit: 1398, customers: 120, product: "Electronics" },
  { date: "2024-03", region: "South", sales: 2000, profit: 9800, customers: 300, product: "Furniture" },
  { date: "2024-04", region: "South", sales: 2780, profit: 3908, customers: 200, product: "Furniture" },
  { date: "2024-05", region: "East",  sales: 1890, profit: 4800, customers: 180, product: "Clothing" },
  { date: "2024-06", region: "East",  sales: 2390, profit: 3800, customers: 210, product: "Clothing" },
  { date: "2024-07", region: "West",  sales: 3490, profit: 4300, customers: 240, product: "Electronics" },
  { date: "2024-08", region: "West",  sales: 4200, profit: 5100, customers: 280, product: "Clothing" }
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("data");

  const [dataset, setDataset] = useState<DataPoint[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState("");

  const [pythonCode, setPythonCode] = useState(
    `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("dataset.csv")

corr = df['sales'].corr(df['profit'])
print(f"Sales-Profit Correlation: {corr}")

anomalies = df[df['profit'] > 8000]
print(f"Found {len(anomalies)} high-profit transactions.")`
  );

  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunningCode, setIsRunningCode] = useState(false);

  // --- File upload (Fake CSV loader) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);

    setTimeout(() => {
      setDataset(MOCK_SALES_DATA);
      setActiveTab("visualize");
      generateInsights(MOCK_SALES_DATA);
    }, 800);
  };

  const loadSampleData = () => {
    setFileName("sales_Q1_2024.csv");
    setDataset(MOCK_SALES_DATA);
    setActiveTab("visualize");
    generateInsights(MOCK_SALES_DATA);
  };

  // --- AI Insights (Mock fallback, same style as EmailConfig) ---
  const generateInsights = async (data: any[]) => {
    setIsAnalyzing(true);

    await new Promise((r) => setTimeout(r, 1200));

    const text = `
### 📊 Dataset Summary
- Records: ${data.length}
- Fields: ${Object.keys(data[0]).join(", ")}

### 🔗 Key Correlations
- Sales ↗ Profit correlation: **0.85**
- High margins detected in South region Furniture category.

### 🚨 Anomalies
- Extreme profit spike in March (South): $9,800 profit on $2,000 sales.

### 📈 Recommendation
- Increase marketing in South region Furniture.
- Validate March transaction for error/fraud.
`;

    setAiInsights(text);
    setIsAnalyzing(false);
  };

  // --- Python Execution (Simulated) ---
  const runPythonScript = async () => {
    setIsRunningCode(true);
    setConsoleOutput("");

    await new Promise((r) => setTimeout(r, 1200));

    setConsoleOutput(
      `Sales-Profit Correlation: 0.4128
Found 1 high-profit transactions.
[System] Plot generated: profit_distribution.png`
    );

    setIsRunningCode(false);
  };

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="flex flex-col h-full min-h-[700px]">

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("data")}
            className={`px-4 py-2 text-sm flex items-center gap-2 ${
              activeTab === "data"
                ? "bg-white/10 text-white border-b-2 border-cyan-500"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <TableIcon size={16} /> Data Source
          </button>

          <button
            onClick={() => setActiveTab("visualize")}
            disabled={dataset.length === 0}
            className={`px-4 py-2 text-sm flex items-center gap-2 ${
              activeTab === "visualize"
                ? "bg-white/10 text-white border-b-2 border-cyan-500"
                : "text-gray-400 hover:bg-white/5"
            } ${dataset.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <LayoutDashboard size={16} /> Visualizations
          </button>

          <button
            onClick={() => setActiveTab("python")}
            disabled={dataset.length === 0}
            className={`px-4 py-2 text-sm flex items-center gap-2 ${
              activeTab === "python"
                ? "bg-white/10 text-white border-b-2 border-cyan-500"
                : "text-gray-400 hover:bg-white/5"
            } ${dataset.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Code size={16} /> Python Sandbox
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Save size={18} />
          </button>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden">

        {/* DATA SOURCE TAB */}
        {activeTab === "data" && (
          <div className="h-full flex flex-col items-center justify-center p-8">
            {!dataset.length ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl border-2 border-dashed border-white/20 rounded-3xl p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors bg-black/20"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-cyan-400" />
                </div>

                <h3 className="text-2xl font-bold mb-2">Upload your dataset</h3>
                <p className="text-gray-400 mb-8">Drag & drop CSV or Excel files</p>

                <div className="flex gap-4">
                  <label className="cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 rounded-xl font-bold text-white shadow-lg">
                    Browse Files
                    <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    onClick={loadSampleData}
                    className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10"
                  >
                    Load Sample
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <FileSpreadsheet className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold">{fileName}</h3>
                      <p className="text-xs text-gray-400">{dataset.length} rows • CSV</p>
                    </div>
                  </div>

                  <button onClick={() => setDataset([])} className="text-red-400 hover:underline text-sm">
                    Remove
                  </button>
                </div>

                <div className="flex-1 overflow-auto border border-white/10 rounded-xl bg-black/20">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-gray-400 font-medium sticky top-0">
                      <tr>
                        {Object.keys(dataset[0]).map((key) => (
                          <th key={key} className="px-4 py-3 capitalize">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {dataset.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          {Object.values(row).map((v: any, i) => (
                            <td key={i} className="px-4 py-3">{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setActiveTab("visualize")}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg"
                  >
                    Proceed <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VISUALIZE TAB */}
        {activeTab === "visualize" && (
          <div className="h-full flex flex-col lg:flex-row gap-6 overflow-y-auto pr-2">

            {/* Left Charts */}
            <div className="w-full lg:w-2/3 space-y-6">

              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${dataset.reduce((a, b) => a + b.sales, 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400">Total Profit</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${dataset.reduce((a, b) => a + b.profit, 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400">Avg Margin</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {(
                      (dataset.reduce((a, b) => a + b.profit, 0) /
                        dataset.reduce((a, b) => a + b.sales, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>

              {/* Main Trend */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-[350px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold">Sales & Profit Trends</h3>
                  <Maximize2 size={16} className="text-gray-500" />
                </div>

                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={dataset}>
                    <defs>
                      <linearGradient id="sA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>

                      <linearGradient id="sB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: "#111" }} />
                    <Legend />

                    <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fill="url(#sA)" />
                    <Area type="monotone" dataKey="profit" stroke="#06b6d4" fill="url(#sB)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Secondary Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-[300px]">
                  <h3 className="font-bold mb-4">Regional Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dataset} dataKey="sales" nameKey="region" outerRadius={80} label>
                        {dataset.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#111" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-[300px]">
                  <h3 className="font-bold mb-4">Customers vs Sales</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="customers" stroke="#666" />
                      <YAxis dataKey="sales" stroke="#666" />
                      <Tooltip contentStyle={{ backgroundColor: "#111" }} />
                      <Scatter data={dataset} fill="#10b981" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE AI PANEL */}
            <div className="w-full lg:w-1/3 bg-[#121212] border-l border-white/10 pl-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <BrainCircuit className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Data Interpreter
                </h3>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  <p className="text-sm text-gray-400 animate-pulse">Analyzing...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 overflow-y-auto pr-2 space-y-4"
                >
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h4 className="font-bold text-purple-200 text-sm">AI Insights</h4>
                    </div>

                    <div
                      className="text-sm text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: aiInsights
                          .replace(/\n/g, "<br/>")
                          .replace(/### (.*)/g, '<h5 class="text-cyan-400 font-bold mt-4 mb-2">$1</h5>')
                      }}
                    />
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="font-bold text-white text-sm mb-3">Recommended Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" />
                        Focus on South region Furniture (huge margins).
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-400">
                        <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5" />
                        Validate anomaly in March 2024.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* PYTHON SANDBOX */}
        {activeTab === "python" && (
          <div className="h-full flex flex-col lg:flex-row gap-6">

            <div className="w-full lg:w-2/3 flex flex-col">
              <div className="bg-[#1E1E1E] rounded-t-xl p-3 flex items-center justify-between border border-white/10 border-b-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs text-gray-400 font-mono">analysis_script.py</span>
                </div>

                <button
                  onClick={runPythonScript}
                  disabled={isRunningCode}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2"
                >
                  {isRunningCode ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Run Script
                </button>
              </div>

              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                className="flex-1 bg-[#0A0A0A] text-gray-300 font-mono text-sm p-4 border border-white/10 border-t-0 rounded-b-xl resize-none"
              />
            </div>

            <div className="w-full lg:w-1/3 flex flex-col gap-4">

              <div className="flex-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-white/5 p-3 border-b border-white/10">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">Console Output</h3>
                </div>

                <div className="flex-1 p-4 font-mono text-xs text-green-400 overflow-y-auto">
                  {consoleOutput ? (
                    <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                  ) : (
                    <span className="text-gray-600 italic">// Output will appear here...</span>
                  )}
                </div>
              </div>

              <div className="h-40 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center text-center">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Generated Plots</p>
                  <div className="w-24 h-20 border border-dashed border-gray-600 rounded flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
