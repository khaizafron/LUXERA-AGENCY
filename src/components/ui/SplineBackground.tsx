function SplineBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load script once
    if (!document.querySelector("script[data-spline-viewer]")) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@splinetool/viewer@1.12.3/build/spline-viewer.js";
      script.type = "module";
      script.async = true;
      script.setAttribute("data-spline-viewer", "1");
      document.head.appendChild(script);
    }

    const removeWatermark = () => {
      const viewer = document.querySelector("spline-viewer");
      if (!viewer) return;

      const shadow = viewer.shadowRoot;
      if (!shadow) return;

      // NEW watermark element name in latest Spline viewer
      const ui = shadow.querySelector("spline-viewer-ui");
      if (ui) {
        ui.remove();
        console.log("Spline viewer watermark removed (UI element).");
      }

      // OLD fallback selectors
      const logo = shadow.querySelector("#logo, .logo, .watermark, [part='logo']");
      if (logo) logo.remove();
    };

    // keep trying until removed
    const interval = setInterval(removeWatermark, 200);

    // stop trying after 5s
    setTimeout(() => clearInterval(interval), 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <div ref={containerRef} className="w-full h-full" />

      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,10,0.4), rgba(0,0,8,0.85))",
        }}
      />
    </div>
  );
}
