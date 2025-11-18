'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<any>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />

      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />

      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px]"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
        >
          <div className="relative group">
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(255,255,255,0.03)",
                  "0 0 15px 5px rgba(255,255,255,0.05)",
                  "0 0 10px 2px rgba(255,255,255,0.03)"
                ],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            />

            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">

              <div className="text-center space-y-1 mb-5">
                <div className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">S</span>
                </div>

                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Welcome Back
                </h1>

                <p className="text-white/60 text-xs">
                  Sign in to continue to StyleMe
                </p>
              </div>

              {/* FORM */}
              <form className="space-y-4">
                <div className="space-y-3">
                  
                  {/* EMAIL */}
                  <div className="relative flex items-center">
                    <Mail className={`absolute left-3 w-4 h-4 text-white/40`} />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="w-full bg-white/5 border-transparent text-white pl-10 pr-3"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="relative flex items-center">
                    <Lock className={`absolute left-3 w-4 h-4 text-white/40`} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full bg-white/5 border-transparent text-white pl-10 pr-10"
                    />
                    <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer">
                      {showPassword
                        ? <Eye className="w-4 h-4 text-white/40" />
                        : <EyeClosed className="w-4 h-4 text-white/40" />
                      }
                    </div>
                  </div>

                </div>

                {/* SIGN IN BUTTON */}
                <button className="w-full h-10 bg-white text-black rounded-lg font-medium flex items-center justify-center gap-1">
                  Sign In
                  <ArrowRight className="w-3 h-3" />
                </button>

                {/* DIVIDER */}
                <div className="relative mt-2 mb-5 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="mx-3 text-xs text-white/40">or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* GOOGLE */}
                <button className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-lg flex items-center justify-center gap-2">
                  <span>G</span> Sign in with Google
                </button>

                {/* SIGN UP */}
                <p className="text-center text-xs text-white/60 mt-4">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-white font-medium">
                    Sign up
                  </Link>
                </p>

              </form>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
