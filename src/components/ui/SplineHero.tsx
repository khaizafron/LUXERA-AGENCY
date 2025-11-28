"use client";

import React, { useEffect, useRef } from "react";

export default function SplineHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Logic to block the "Wheel" event from reaching Spline
    // We use { capture: true } to catch the event on the way DOWN the DOM tree,
    // before the Spline Viewer (which is a child) ever sees it.
    const container = containerRef.current;
    
    const stopWheelPropagation = (e: WheelEvent) => {
      // This stops the event from reaching the Spline Canvas children.
      // Since the Spline Canvas never sees it, it can't "preventDefault" it.
      // Therefore, the browser performs the default action: SCROLLING THE PAGE.
      e.stopPropagation();
    };

    if (container) {
      // capture: true is the secret sauce here.
      container.addEventListener("wheel", stopWheelPropagation, { capture: true });
    }

    // 2. Standard Spline Script Injection
    if (!document.querySelector("script[data-spline-viewer]")) {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@splinetool/viewer@1.12.3/build/spline-viewer.js";
      script.type = "module";
      script.async = true;
      script.setAttribute("data-spline-viewer", "1");
      document.head.appendChild(script);
    }

    const viewer = document.createElement("spline-viewer");
    viewer.setAttribute(
      "url",
      "https://prod.spline.design/bb4xs9mGaQ-RmeYf/scene.splinecode"
    );
    viewer.style.width = "100%";
    viewer.style.height = "100%";
    
    // We keep pointerEvents auto so you can DRAG/ORBIT the model
    viewer.style.pointerEvents = "auto"; 

    if (container) {
      container.innerHTML = "";
      container.appendChild(viewer);
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener("wheel", stopWheelPropagation, { capture: true });
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      // We ensure the container itself can catch the event
      style={{ pointerEvents: "auto" }}
    />
  );
}