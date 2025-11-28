"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { ShinyButton } from "@/components/ui/shiny-button";
import { NeonButton } from "@/components/ui/neon-button";

import NavGlassShell from "@/components/ui/NavGlassShell";
import NavGlassItem from "@/components/ui/NavGlassItem";

import NavGlassSurfaceMobile from "@/components/ui/NavGlassSurfaceMobile";
import NavGlassItemMobile from "@/components/ui/NavGlassItemMobile";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { data: session, isPending, refetch } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const shellRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const navLinks = [
    { id: "home", href: "/#home", label: "Home" },
    { id: "about", href: "/#about", label: "About" },
    { id: "services", href: "/#services", label: "Services" },
    { id: "case-studies", href: "/#case-studies", label: "Case Studies" },
    { id: "contact", href: "/#contact", label: "Contact" },
  ];

  /* Smooth Scroll */
  const handleNavClick = (e: any, id: string, href: string) => {
    e?.preventDefault?.();
    setIsMobileMenuOpen(false);

    const el = document.getElementById(id);
    if (el) {
      setActiveSection(id);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(href);
  };

  /* Scroll detect */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Auto highlight observer */
  useEffect(() => {
    if (pathname !== "/" && !pathname.endsWith("/")) return;

    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    navLinks.forEach(link => {
      const el = document.getElementById(link.id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [pathname]);

  /* Floating indicator */
  const updateIndicator = () => {
    if (window.innerWidth < 768) return;
    const shell = shellRef.current;
    const link = linkRefs.current[activeSection];
    if (!shell || !link) {
      setIndicator(s => ({ ...s, visible: false }));
      return;
    }
    const sRect = shell.getBoundingClientRect();
    const lRect = link.getBoundingClientRect();
    setIndicator({
      left: lRect.left - sRect.left,
      width: lRect.width,
      visible: true,
    });
  };

  useEffect(() => {
    updateIndicator();
    const ro = new ResizeObserver(() => updateIndicator());
    if (shellRef.current) ro.observe(shellRef.current);

    window.addEventListener("scroll", updateIndicator, { passive: true });
    window.addEventListener("resize", updateIndicator);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateIndicator);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeSection, pathname]);

  /* Sign out */
  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) return toast.error("Failed to sign out");
    await refetch();
    toast.success("Signed out");
    router.push("/");
    setShowUserMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-xl py-2" : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center flex-1 justify-center">
          <div className="relative translate-x-6" ref={shellRef} style={{ minWidth: 480 }}>
            
            {/* Floating Indicator */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 4,
                left: indicator.left,
                width: indicator.width,
                height: 36,
                borderRadius: 999,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "left .33s, width .26s, opacity .26s",
                opacity: indicator.visible ? 1 : 0,
                pointerEvents: "none",
                zIndex: 20,
              }}
            />

            <NavGlassShell>
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  ref={el => (linkRefs.current[link.id] = el)}
                  onClick={e => handleNavClick(e, link.id, link.href)}
                  className="no-underline"
                >
                  <NavGlassItem active={activeSection === link.id}>
                    {link.label}
                  </NavGlassItem>
                </a>
              ))}
            </NavGlassShell>
          </div>
        </div>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center">
          {!isPending && session?.user ? (
            <div className="relative ml-4">
              <NavGlassShell>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      className="w-7 h-7 rounded-full object-cover border border-cyan-500/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border border-cyan-500/50">
                      <span className="text-xs font-bold text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">
                    {session.user.name}
                  </span>
                </button>
              </NavGlassShell>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-52 z-50">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-5 py-3.5 hover:bg-white/10 text-white border-b border-white/5"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm">Dashboard</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 px-5 py-3.5 hover:bg-white/10 text-white w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-4">
              <Link href="/login">
                <NeonButton variant="ghost">Login</NeonButton>
              </Link>
              <Link href="/register">
                <ShinyButton size="md">Get Started</ShinyButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white ml-3"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[900] pointer-events-auto">

          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-4"
            style={{
              top: `calc(env(safe-area-inset-top, 0px) + 10px)`,
              zIndex: 1100,
            }}
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
              <X size={22} className="text-white" />
            </div>
          </button>

          {/* Mobile nav container */}
          <div
            className="absolute left-0 w-full px-4 z-[950]"
            style={{ top: `calc(env(safe-area-inset-top, 0px) + 58px)` }}
          >
            <NavGlassSurfaceMobile>
              {navLinks.map(link => (
                <NavGlassItemMobile
                  key={link.id}
                  active={activeSection === link.id}
                  onClick={e => handleNavClick(e, link.id, link.href)}
                >
                  {link.label}
                </NavGlassItemMobile>
              ))}
            </NavGlassSurfaceMobile>

            {/* USER AREA */}
            <div className="mt-8">

              {/* LOGGED-IN USER */}
              {!isPending && session?.user ? (
                <>
                  {/* Profile Glass Card */}
                  <div
                    className="
                      w-full rounded-2xl p-4 flex items-center gap-4
                      border border-white/10
                      bg-white/[0.05]
                      backdrop-blur-xl
                      shadow-[0_8px_32px_rgba(0,0,0,0.45)]
                      animate-glassIn
                    "
                  >
                    <img
                      src={session.user.image!}
                      className="w-12 h-12 rounded-full object-cover border border-cyan-400/40"
                    />
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-white text-base font-semibold truncate">
                        {session.user.name}
                      </span>
                      <span className="text-gray-300 text-sm truncate">
                        {session.user.email}
                      </span>
                    </div>
                  </div>

                  {/* Buttons Glass Panel */}
                  <div
                    className="
                      mt-6 w-full rounded-2xl p-4 flex flex-col gap-3
                      border border-white/10
                      backdrop-blur-xl
                      bg-gradient-to-br from-white/[0.07] to-white/[0.03]
                      shadow-[0_6px_28px_rgba(0,0,0,0.45)]
                      animate-glassIn
                    "
                  >
                    <Link href="/dashboard" className="w-full">
                      <ShinyButton className="w-full py-5 text-base">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </ShinyButton>
                    </Link>

                    <NeonButton
                      variant="default"
                      className="w-full py-5 text-base"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </NeonButton>
                  </div>
                </>
              ) : (
                /* NOT LOGGED-IN USER */
                <div
                  className="
                    mt-4 w-full rounded-2xl p-4 flex flex-col gap-3
                    border border-white/10
                    backdrop-blur-xl
                    bg-gradient-to-br from-white/[0.07] to-white/[0.03]
                    shadow-[0_6px_28px_rgba(0,0,0,0.45)]
                    animate-glassIn
                  "
                >
                  <Link href="/login" className="w-full">
                    <NeonButton variant="default" className="w-full py-5 text-base">
                      Login
                    </NeonButton>
                  </Link>

                  <Link href="/register" className="w-full">
                    <ShinyButton className="w-full py-5 text-base bg-gradient-to-r from-purple-500 to-cyan-500">
                      Get Started
                    </ShinyButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
