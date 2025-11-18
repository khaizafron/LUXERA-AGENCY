"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// ⭐ Your brushed titanium logo
import LogoBrushed from "@/components/ui/LogoBrushed";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Failed to sign out");
      return;
    }

    await refetch();
    toast.success("Signed out successfully");
    router.push("/");
    setShowUserMenu(false);
  };

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* LEFT — LOGO WITH TITANIUM BRUSHED EFFECT */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden glow-cyan">
            <LogoBrushed size={40} />
          </div>

          <span className="text-2xl font-bold text-white tracking-wide">
            LUXERA <span className="neon-gradient-text">AGENCY</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-[#00FFFF] transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}

          {/* USER MENU */}
          {!isPending && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-full
                  bg-gradient-to-r from-purple-500/20 to-cyan-500/20
                  border border-white/10 hover:border-cyan-500/50 transition-all group"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/50 group-hover:border-cyan-500 transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-2 border-cyan-500/50">
                    <span className="text-sm font-bold text-white">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <span className="text-sm font-medium">{session.user.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 glassmorphism rounded-lg border border-white/10 overflow-hidden">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-white/5 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-white/5 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // NOT LOGGED IN
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-[#00FFFF]">
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden glassmorphism mt-4 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-[#00FFFF] transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            {/* IF LOGGED IN */}
            {!isPending && session?.user ? (
              <>
                <div className="pt-4 border-t border-white/10 flex items-center space-x-3 mb-4">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-2 border-cyan-500/50">
                      <span className="text-lg font-bold text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-400">{session.user.email}</p>
                  </div>
                </div>

                <Link href="/dashboard">
                  <Button className="w-full mb-2 bg-gradient-to-r from-purple-500 to-cyan-500">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              // NOT LOGGED IN (mobile)
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>

                <Link href="/register">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
