import { GradientButton } from "@/components/ui/gradient-button";
import { ArrowRight } from "lucide-react";

export default function GradientButtonDemo() {
  return (
    <div className="flex gap-8">
      <GradientButton>Get Started</GradientButton>
      <GradientButton variant="variant">Watch Demo</GradientButton>
      <GradientButton asChild>
        <a href="/dashboard" className="inline-flex items-center gap-2">
          Start Your AI Journey <ArrowRight />
        </a>
      </GradientButton>
    </div>
  );
}
