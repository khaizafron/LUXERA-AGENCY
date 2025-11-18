"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import LogoBrushed from "@/components/ui/LogoBrushed";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FluidGradient } from "@/components/ui/fluid-gradient";
import { toast } from "sonner";

export function SignUpCard({
  brandName = "Luxera",
  tagline = "Your AI Intelligence Solution",
}: {
  brandName?: string;
  tagline?: string;
}) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !password) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    setIsLoading(true);

    (async () => {
      setIsLoading(true);
      const result = await registerUser({
        name: fullName,
        email,
        password,
      });
      setIsLoading(false);

      if (result.error || !result.data) {
        setErrorMsg(result.error ?? "Failed to create account.");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/get-started");
    })();
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">

      {/* 🔥 FULLSCREEN FLUID BACKGROUND */}
      <div className="absolute inset-0 h-full w-full -z-10">
        <FluidGradient />
      </div>

      <div className="w-full max-w-md relative z-10" style={{ perspective: 1500 }}>
        <motion.div
          className="relative mx-auto"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <div className="relative group rounded-2xl shadow-2xl">

            {/* beam */}
            <div className="absolute -inset-[0.5px] rounded-2xl overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 left-0 h-[3px] w-[60%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70"
                animate={{ left: ["-60%", "120%"] }}
                transition={{ duration: 2.3, repeat: Infinity }}
              />
            </div>

            {/* card */}
            <div className="relative bg-black/45 backdrop-blur-xl rounded-2xl p-6 border border-white/5 overflow-hidden">

              {/* header */}
              <div className="text-center mb-6 relative z-10">
                <div className="mx-auto w-16 h-16 rounded-full border border-white/10 bg-black/30 flex items-center justify-center mb-3 overflow-hidden relative">
                  <div className="absolute inset-0 blur-lg opacity-40 bg-gradient-to-r from-cyan-400 to-yellow-300" />
                  <LogoBrushed className="w-10 h-10 relative z-10" />
                </div>

                <h1 className="text-xl font-bold text-white">{brandName}</h1>
                <p className="text-xs text-white/60">Create your account — {tagline}</p>
              </div>

              {/* form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">

                {errorMsg && <p className="text-red-400 text-xs text-center">{errorMsg}</p>}

                <input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 placeholder:text-white/40 rounded-lg px-4 py-3 text-sm text-white outline-none focus:bg-white/10 transition"
                />

                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 pl-10 py-3 rounded-lg text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/10 transition"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 pl-10 pr-12 py-3 rounded-lg text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/40"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button type="submit" className="relative group/button w-full mt-2">
                  <div className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover/button:opacity-60 bg-white/10 transition" />
                  <div className="relative bg-white text-black font-semibold h-10 rounded-lg flex items-center justify-center">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </button>

                <p className="text-center text-xs text-white/60 mt-3">
                  Already have an account?
                  <Link href="/get-started" className="text-white font-medium"> Sign in </Link>
                </p>
              </form>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
