"use client";

export default function NavGlassShellMobile({ children }) {
  return (
    <div
      className="
        w-full
        rounded-2xl
        px-3 py-2
        flex flex-col space-y-2
        backdrop-blur-xl
        bg-white/5
        border border-white/10
        shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.04)]
      "
    >
      {children}
    </div>
  );
}
