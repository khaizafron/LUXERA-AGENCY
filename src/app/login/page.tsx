"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Loader2 } from "lucide-react";

/**
 * We wrap the parts using useSearchParams() in a Suspense boundary.
 * This prevents Next.js from crashing during prerender.
 */
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending, refetch } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isPending && session?.user) router.push("/dashboard");
  }, [session, isPending, router]);

  // Registration success toast
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Account created! Please login.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginUser({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.error || !result.data) {
      toast.error(result.error ?? "Invalid email or password");
      return;
    }

    toast.success("Login successful!");
    await refetch();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glassmorphism p-8 rounded-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to <span className="neon-gradient-text">LUXERA</span>
            </h1>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
              />
            </div>

            {/* 🔵 Gradient Sign In Button */}
            <GradientButton
              type="submit"
              variant="variant"
              disabled={isLoading}
              className="w-full h-12 text-lg font-semibold flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don’t have an account?{" "}
              <Link href="/register" className="text-cyan-500 font-semibold">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
