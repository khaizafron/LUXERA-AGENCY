"use client";

import GlassSurface from "./GlassSurface";

export default function NavGlassShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlassSurface
      width="100%"
      height={44}
      borderRadius={28}
      blur={14}
      opacity={0.9}
      brightness={60}
      backgroundOpacity={0.15}
      distortionScale={-120}
      redOffset={5}
      greenOffset={10}
      blueOffset={20}
      className="backdrop-blur-xl flex items-center px-4"
    >
      <div className="flex items-center justify-between w-full h-full gap-3">
        {children}
      </div>
    </GlassSurface>
  );
}