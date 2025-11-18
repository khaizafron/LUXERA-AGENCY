import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "LUXERA AGENCY - AI Automation & Intelligence Solutions",
  description:
    "Transform your business with cutting-edge AI automation and intelligence solutions. Expert AI consulting, chatbots, process automation, and machine learning services.",
  keywords:
    "AI automation, artificial intelligence, machine learning, business intelligence, chatbots, process automation, AI consulting",
  authors: [{ name: "LUXERA AGENCY" }],
  openGraph: {
    title: "LUXERA AGENCY - AI Automation & Intelligence",
    description:
      "Transform your business with cutting-edge AI automation and intelligence solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {/* ⭐ FIXED: You MUST put scripts HERE (NOT inside <head>) */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />

      <body className="antialiased">
        <ErrorReporter />

        {/* Your Supabase script (kept exactly as you wrote it) */}
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{
            "appName": "YourApp",
            "version": "1.0.0",
            "greeting": "hi"
          }'
        />

        {children}
        <Toaster />
      </body>
    </html>
  );
}
