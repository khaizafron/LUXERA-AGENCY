"use client";

export default function SplineIframeBackground() {
  return (
    <div
      className="absolute inset-0 -z-50 overflow-hidden pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      <iframe
        src="https://my.spline.design/orb-GgfBz8OUtawn3GLab54jpm3V/"
        frameBorder="0"
        allow="autoplay"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none",
          filter: "blur(4px) saturate(0.8)",
          opacity: 0.38,
        }}
      />
    </div>
  );
}
