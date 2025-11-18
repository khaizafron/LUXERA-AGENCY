"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import LogoBrushed from "@/components/ui/LogoBrushed";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FluidGradient } from "@/components/ui/FluidGradient";
import { toast } from "sonner";
import { toast } from "sonner";

export function SignInCard({
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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    (async () => {
      setIsLoading(true);
      const result = await loginUser({ email, password });
      setIsLoading(false);

      if (result.error || !result.data) {
        setErrorMsg(result.error ?? "Invalid email or password.");
        return;
      }

      toast.success("Signed in successfully");
      router.push("/dashboard");
    })();
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-black">

      {/* ⭐ THE GRADIENT BACKGROUND */}
      <FluidGradient />

      {/* Card wrapper */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div className="w-full max-w-md relative" style={{ perspective: 1500 }}>
          <motion.div
            className="relative mx-auto"
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
          >
            <div className="relative group rounded-2xl shadow-2xl">

              {/* top border beam */}
              <div className="absolute -inset-[0.5px] rounded-2xl overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-0 left-0 h-[3px] w-[60%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70"
                  animate={{ left: ["-60%", "120%"] }}
                  transition={{ duration: 2.3, repeat: Infinity }}
                />
              </div>

              {/* glass card */}
              <div className="relative bg-black/45 backdrop-blur-xl rounded-2xl p-6 border border-white/5 overflow-hidden">

                {/* texture */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)",
                    backgroundSize: "30px 30px",
                  }}
                />

                {/* HEADER */}
                <div className="text-center mb-6 relative z-10">
                  <div className="mx-auto w-16 h-16 rounded-full border border-white/10 bg-black/30 flex items-center justify-center mb-3 overflow-hidden relative">
                    <div className="absolute inset-0 blur-lg opacity-40 bg-gradient-to-r from-cyan-400 to-yellow-400" />
                    <LogoBrushed className="w-10 h-10 relative z-10" />
                  </div>

                  <h1 className="text-xl font-bold text-white">{brandName}</h1>
                  <p className="text-xs text-white/60">{tagline}</p>
                </div>

                {/* FORM */}
                <form onSubmit={onSubmit} className="space-y-4 relative z-10">

                  {errorMsg && (
                    <p className="text-red-400 text-xs text-center">{errorMsg}</p>
                  )}

                  {/* email */}
                  <div className={`relative ${focusedInput === "email" ? "z-20" : ""}`}>
                    <Mail className={`absolute left-3 top-3 w-4 h-4 ${focusedInput === "email" ? "text-white" : "text-white/40"}`} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/5 placeholder:text-white/40 rounded-lg px-10 py-3 text-sm text-white outline-none focus:bg-white/10 transition"
                    />
                  </div>

                  {/* password */}
                  <div className={`relative ${focusedInput === "password" ? "z-20" : ""}`}>
                    <Lock className={`absolute left-3 top-3 w-4 h-4 ${focusedInput === "password" ? "text-white" : "text-white/40"}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/5 placeholder:text-white/40 rounded-lg px-10 py-3 pr-12 text-sm text-white outline-none focus:bg-white/10 transition"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/40">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* extras */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-white/60">
                      <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="h-4 w-4" />
                      Remember me
                    </label>
                    <Link href="/forgot-password" className="text-xs text-white/60 hover:text-white">
                      Forgot password?
                    </Link>
                  </div>

                  {/* button */}
                  <button type="submit" className="relative group/button w-full mt-2">
                    <div className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover/button:opacity-60 bg-white/10 transition" />
                    <div className="relative bg-white text-black font-semibold h-10 rounded-lg flex items-center justify-center">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </button>

                  {/* divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="text-xs text-white/40">or</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Google */}
                  <button className="w-full bg-white/5 border border-white/10 rounded-lg h-10 text-white/80 hover:border-white/20">
                    <span className="flex items-center justify-center gap-2">
                      G <span className="text-xs">Sign in with Google</span>
                    </span>
                  </button>

                  {/* footer */}
                  <p className="text-center text-xs text-white/60 mt-3">
                    Don’t have an account?
                    <Link href="/signup" className="text-white font-medium"> Sign up </Link>
                  </p>

                </form>

              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
