"use client";

import GlassSurface from "./GlassSurface";

type NavGlassItemProps = {
  active?: boolean;
  children: React.ReactNode;
  // default = current desktop behavior
  variant?: "default" | "mobile";
};

export default function NavGlassItem({
  active,
  children,
  variant = "default",
}: NavGlassItemProps) {
  // ----------------------------
  // ORIGINAL DESKTOP BEHAVIOR
  // ----------------------------
  if (variant === "default") {
    // ACTIVE item = inner glass highlight
    if (active) {
      return (
        <GlassSurface
          width="auto"
          height={36}
          borderRadius={18}
          blur={10}
          opacity={0.85}
          brightness={60}
          backgroundOpacity={0.25}
          distortionScale={-80}
          redOffset={3}
          greenOffset={8}
          blueOffset={12}
          className="px-4 flex items-center justify-center text-white font-medium text-sm"
        >
          {children}
        </GlassSurface>
      );
    }

    // INACTIVE item = simple link (unchanged for laptop)
    return (
      <span className="px-4 py-1.5 text-sm text-gray-200 hover:text-cyan-400 transition">
        {children}
      </span>
    );
  }

  // ----------------------------
  // MOBILE VARIANT: always glass
  // ----------------------------
  const commonClass =
    "px-4 flex items-center justify-center text-sm whitespace-nowrap transition";

  if (active) {
    return (
      <GlassSurface
        width="auto"
        height={36}
        borderRadius={18}
        blur={10}
        opacity={0.9}
        brightness={65}
        backgroundOpacity={0.3}
        distortionScale={-80}
        redOffset={3}
        greenOffset={8}
        blueOffset={12}
        className={`${commonClass} text-white font-medium`}
      >
        {children}
      </GlassSurface>
    );
  }

  return (
    <GlassSurface
      width="auto"
      height={32}
      borderRadius={16}
      blur={8}
      opacity={0.7}
      brightness={55}
      backgroundOpacity={0.18}
      distortionScale={-60}
      redOffset={2}
      greenOffset={5}
      blueOffset={8}
      className={`${commonClass} text-gray-200 hover:text-cyan-400`}
    >
      {children}
    </GlassSurface>
  );
}
