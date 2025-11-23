"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { registerUser } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Loader2 } from "lucide-react";
import ShaderBackground from "@/components/ui/shader-background";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.error || !result.data) {
      toast.error(result.error ?? "Failed to register");
      return;
    }

    toast.success("Account created!");
    router.push("/login?registered=true");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* SAME SHADER BACKGROUND AS LOGIN */}
      <ShaderBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4 py-8"
      >
        <div className="glassmorphism p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Join <span className="neon-gradient-text">LUXERA</span>
            </h1>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Full Name
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Email Address
              </label>
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
              <label className="text-sm text-gray-300 mb-2 block">
                Password
              </label>
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

            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
              />
            </div>

            <GradientButton
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg font-semibold flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-500 font-semibold">
                Sign in here
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
