"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  Activity,
  MessageSquare,
  Mail,
  BarChart3,
  Workflow,
  Bot,
  FileText,
  TrendingUp,
  Calendar,
  Zap,
  Check,
  Crown,
  Sparkles,
  Rocket,
  ShoppingCart,
  Upload,
  Camera,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  features: string[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon?: string | null;
  monthlyLimit: number;
}

interface UsageSummary {
  serviceId: number;
  serviceName: string;
  category: string;
  monthlyLimit: number;
  usageCount: number;
  remainingUsage: number;
  percentageUsed: number;
}

interface UserSubscription {
  id: number;
  planId: number;
  status: string;
  startedAt: string;
  endsAt: string | null;
  userId?: string;
}

const iconMap: Record<string, any> = {
  MessageSquare,
  Mail,
  BarChart3,
  Workflow,
  Bot,
  FileText,
  Activity
};

const categoryColors: Record<string, string> = {
  Communication: "from-purple-500 to-pink-500",
  Analytics: "from-cyan-500 to-blue-500",
  Workflow: "from-green-500 to-emerald-500"
};

const planIcons: Record<string, any> = {
  Free: Zap,
  Starter: Sparkles,
  Pro: Crown,
  Enterprise: Rocket
};

const planColors: Record<string, string> = {
  Free: "from-gray-500 to-gray-600",
  Starter: "from-purple-500 to-pink-500",
  Pro: "from-cyan-500 to-blue-500",
  Enterprise: "from-amber-500 to-orange-500"
};

// Map service names to dedicated pages
function getServiceRoute(service: Service): string | null {
  const name = service.name.toLowerCase();

  if (name.includes("whatsapp")) return "/dashboard/services/whatsapp";
  if (name.includes("email")) return "/dashboard/services/email";
  if (name.includes("analytic")) return "/dashboard/services/analytics";

  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [usageSummary, setUsageSummary] = useState<UsageSummary[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [isUpgrading, setIsUpgrading] = useState<number | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if no session
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Fetch dashboard data when session available
  useEffect(() => {
    if (session?.user) fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("bearer_token") || "";

      const [plansRes, servicesRes, subscriptionRes, usageRes] = await Promise.all([
        fetch("/api/subscription-plans", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }),
        fetch("/api/services", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }),
        fetch(`/api/user-subscriptions?userId=${session?.user?.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }),
        fetch(
          `/api/usage/summary?userId=${session?.user?.id}&month=${new Date()
            .toISOString()
            .slice(0, 7)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        )
      ]);

      const plans = plansRes.ok ? await plansRes.json() : [];
      const servicesData = servicesRes.ok ? await servicesRes.json() : [];
      const subscriptions = subscriptionRes.ok ? await subscriptionRes.json() : [];
      const usage = usageRes.ok ? await usageRes.json() : [];

      setSubscriptionPlans(Array.isArray(plans) ? plans : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setUsageSummary(Array.isArray(usage) ? usage : []);

      const active = Array.isArray(subscriptions)
        ? subscriptions.find((s: UserSubscription) => s.status === "active")
        : null;

      setUserSubscription(active || null);

      if (active) {
        const plan = (plans || []).find((p: SubscriptionPlan) => p.id === active.planId);
        setCurrentPlan(plan || (plans && plans[0]) || null);
      } else {
        setCurrentPlan((plans && plans[0]) || null);
      }
    } catch (err) {
      console.error("fetchDashboardData error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId: number) => {
    try {
      setIsUpgrading(planId);
      const token = localStorage.getItem("bearer_token") || "";

      if (userSubscription) {
        const res = await fetch(`/api/user-subscriptions/${userSubscription.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ planId, status: "active" })
        });

        if (!res.ok) throw new Error("Failed to update subscription");
      } else {
        const res = await fetch("/api/user-subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            planId,
            status: "active",
            startedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          })
        });

        if (!res.ok) throw new Error("Failed to create subscription");
      }

      toast.success("Plan updated successfully!");
      await fetchDashboardData();
    } catch (err) {
      console.error("handleUpgrade error:", err);
      toast.error("Upgrade failed");
    } finally {
      setIsUpgrading(null);
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid format");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be <2MB");
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        const token = localStorage.getItem("bearer_token") || "";

        const res = await fetch(`/api/users/${session?.user?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ image: base64 })
        });

        if (res.ok) {
          toast.success("Updated");
          await refetch?.();
          await fetchDashboardData();
        } else {
          toast.error("Failed to upload image");
        }
      } catch (err) {
        console.error("handleImageUpload error:", err);
        toast.error("Failed to upload image");
      } finally {
        setIsUploadingImage(false);
      }
    };

    reader.onerror = () => {
      setIsUploadingImage(false);
      toast.error("Failed to read file");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploadingImage(true);
      const token = localStorage.getItem("bearer_token") || "";

      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ image: null })
      });

      if (!res.ok) {
        toast.error("Failed");
      } else {
        toast.success("Removed");
        await refetch?.();
        await fetchDashboardData();
      }
    } catch (err) {
      console.error("handleRemoveImage error:", err);
      toast.error("Failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const totalUsage = usageSummary.reduce((s, u) => s + (u?.usageCount || 0), 0);
  const totalLimit = usageSummary.reduce((s, u) => s + (u?.monthlyLimit || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Profile Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back, <span className="neon-gradient-text">{session?.user?.name}</span>
            </h1>
            <p className="text-gray-400">Here's your automation usage overview</p>
          </motion.div>

          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {/* Back to Home Button */}
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Profile Picture Upload */}
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-xl border border-white/10">
              <div className="relative group">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500/50 group-hover:border-cyan-500 transition-all"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-2 border-cyan-500/50 group-hover:border-cyan-500 transition-all">
                    <span className="text-2xl font-bold text-white">
                      {session?.user?.name?.charAt(0)?.toUpperCase?.() ?? "U"}
                    </span>
                  </div>
                )}

                {/* Upload Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isUploadingImage ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  {session?.user?.image ? "Change" : "Upload"}
                </Button>

                {session?.user?.image && (
                  <Button
                    onClick={handleRemoveImage}
                    disabled={isUploadingImage}
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-red-400"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glassmorphism p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Usage</h3>
            <p className="text-3xl font-bold neon-gradient-text">
              {totalUsage.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              of {totalLimit.toLocaleString()} this month
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Active Services</h3>
            <p className="text-3xl font-bold neon-gradient-text">
              {usageSummary.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              of {services.length} available
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glassmorphism p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                Active
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Current Plan</h3>
            <p className="text-3xl font-bold neon-gradient-text">
              {currentPlan?.name || "Free"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ${currentPlan?.price || 0}/month
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            Your <span className="neon-gradient-text">Services</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const usage = usageSummary.find((u) => u.serviceId === service.id);
              const IconComponent =
                service.category === "Communication"
                  ? MessageSquare
                  : service.category === "Analytics"
                  ? BarChart3
                  : Workflow;
              const percentage = usage ? usage.percentageUsed : 0;
              const colorClass = categoryColors[service.category] || "from-gray-500 to-gray-600";
              const serviceRoute = getServiceRoute(service);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`glassmorphism p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group ${
                    serviceRoute ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={() => {
                    if (serviceRoute) router.push(serviceRoute);
                  }}
                  onKeyDown={(e) => {
                    if (serviceRoute && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      router.push(serviceRoute);
                    }
                  }}
                  role={serviceRoute ? "button" : undefined}
                  tabIndex={serviceRoute ? 0 : -1}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-r ${colorClass} rounded-lg opacity-80 group-hover:opacity-100 transition-opacity`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Usage Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Usage</span>
                      <span className="font-semibold">
                        {usage ? usage.usageCount.toLocaleString() : 0} /{" "}
                        {service.monthlyLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        {(percentage || 0).toFixed(1)}% used
                      </span>
                      <span className="text-gray-500">
                        {usage
                          ? usage.remainingUsage.toLocaleString()
                          : service.monthlyLimit.toLocaleString()}{" "}
                        remaining
                      </span>
                    </div>

                    {serviceRoute && (
                      <div className="pt-2 flex justify-end">
                        <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                          Open service
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing Plans Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your <span className="neon-gradient-text">Plan</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Scale your automation with flexible pricing options designed for every
              business stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan, index) => {
              const isCurrentPlan = currentPlan?.id === plan.id;
              const PlanIcon = planIcons[plan.name] || Zap;
              const colorClass = planColors[plan.name] || "from-gray-500 to-gray-600";
              const isPro = plan.name === "Pro";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative glassmorphism rounded-xl border transition-all duration-300 ${
                    isCurrentPlan
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 hover:border-white/20"
                  } ${isPro ? "scale-105" : ""}`}
                >
                  {/* Popular Badge */}
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-xs font-bold text-white">
                        POPULAR
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        CURRENT
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 bg-gradient-to-r ${colorClass} rounded-lg`}>
                        <PlanIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold neon-gradient-text">
                          ${plan.price}
                        </span>
                        <span className="text-gray-400">/month</span>
                      </div>
                      {plan.price === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Perfect to get started
                        </p>
                      )}
                      {plan.name === "Starter" && (
                        <p className="text-sm text-gray-500 mt-1">
                          For growing businesses
                        </p>
                      )}
                      {plan.name === "Pro" && (
                        <p className="text-sm text-gray-500 mt-1">
                          Most popular choice
                        </p>
                      )}
                      {plan.name === "Enterprise" && (
                        <p className="text-sm text-gray-500 mt-1">
                          Full automation ownership
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrentPlan || isUpgrading === plan.id}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        isCurrentPlan
                          ? "bg-white/5 text-gray-400 cursor-not-allowed"
                          : `bg-gradient-to-r ${colorClass} text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105`
                      }`}
                    >
                      {isUpgrading === plan.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : plan.name === "Enterprise" ? (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Buy Automation
                        </>
                      ) : currentPlan && plan.price > (currentPlan?.price ?? 0) ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          Upgrade Plan
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Select Plan
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              All plans include 24/7 support • Cancel anytime • No hidden fees
            </p>
          </motion.div>
        </motion.div>

        {/* Plan Details */}
        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glassmorphism p-8 rounded-xl border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-4">
              Current Plan:{" "}
              <span className="neon-gradient-text">{currentPlan.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300">
                  Features
                </h3>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-400">
                      <Zap className="w-4 h-4 text-cyan-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-center p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-white/5">
                  <p className="text-sm text-gray-400 mb-2">Monthly Price</p>
                  <p className="text-4xl font-bold neon-gradient-text mb-2">
                    ${currentPlan.price}
                  </p>
                  <p className="text-xs text-gray-500">Billed monthly</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
