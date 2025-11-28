"use client";

import LiquidGlassMobile from "./LiquidGlassMobile";

export default function NavGlassSurfaceMobile({ children }: { children: React.ReactNode }) {
  return (
    // parent wrapper: relative, NOT overflow-hidden (so canvas isn't clipped)
    <div className="relative w-full">
      {/* Layer A: the WebGL canvas (underneath). z-0 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* give the shader the same size as the visible glass area */}
        <LiquidGlassMobile />
      </div>

      {/* Layer B: the rounded glass UI overlay (menu) */}
      <div
        className="
          relative z-10
          mx-auto
          w-full
          rounded-[22px]
          px-4 py-4
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          shadow-[0_8px_26px_rgba(0,0,0,0.45)]
        "
        // keep overflow visible — we are not clipping the shader
      >
        <div className="relative z-20 flex flex-col space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}
