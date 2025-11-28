"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";

export default function LiquidGlassMobile({
  // Optional: allow parent to control height if needed
  style,
}: {
  style?: React.CSSProperties;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return; // mobile only

    const mount = mountRef.current;
    if (!mount) return;

    let mounted = true;

    // Scene + camera (2D orthographic plane)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer: transparent so overlay can blend
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0); // transparent
    mount.appendChild(renderer.domElement);

    // Shader material (procedural noise, no external textures)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uStrength: { value: 0.14 }, // distortion strength
        uTint: { value: new THREE.Vector3(0.55, 0.66, 0.82) }, // subtle bluish tint
      },
    });

    // GLSL: simple hash + noise (iq's) and layered waves
    material.vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    material.fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uStrength;
      uniform vec3 uTint;

      // iq noise
      vec3 hash3(vec2 p) {
        vec3 q = vec3(dot(p, vec2(127.1,311.7)),
                      dot(p, vec2(269.5,183.3)),
                      dot(p, vec2(419.2,371.9)));
        return fract(sin(q)*43758.5453);
      }

      float noise(in vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);

        float a = dot(hash3(i + vec2(0.0,0.0)).xy, vec2(1.0));
        float b = dot(hash3(i + vec2(1.0,0.0)).xy, vec2(1.0));
        float c = dot(hash3(i + vec2(0.0,1.0)).xy, vec2(1.0));
        float d = dot(hash3(i + vec2(1.0,1.0)).xy, vec2(1.0));
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }

      void main() {
        vec2 uv = vUv;

        // Aspect correction
        vec2 aspect = uResolution.xy / min(uResolution.x, uResolution.y);
        uv = (uv - 0.5) * aspect + 0.5;

        // layered noise / waves
        float t = uTime * 0.45;

        float n1 = noise(uv * 3.0 + vec2(t * 0.6, -t * 0.3));
        float n2 = noise(uv * 6.0 + vec2(-t * 0.9, t * 0.5)) * 0.6;
        float n3 = noise(uv * 12.0 + vec2(t * 1.6, t * 0.3)) * 0.28;
        float n = n1 + n2 + n3;

        // displacement (fake refraction)
        vec2 disp = (n - 0.5) * uStrength;

        // color sampling is procedural (no screen sampling)
        float light = noise((uv + disp) * 2.0 + t * 0.2);
        vec3 base = uTint * (0.9 + light * 0.6);

        // subtle vignetting / shape hint
        float dist = distance(uv, vec2(0.5));
        float vign = smoothstep(0.95, 0.55, dist);

        // final color + alpha
        vec3 color = base * (0.9 + 0.2 * (1.0 - vign));
        float alpha = 0.36 * (1.0 - smoothstep(0.0, 0.9, dist));

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Fullscreen plane
    const geom = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geom, material);
    scene.add(quad);

    // Size helper
    const resize = () => {
      if (!mounted) return;
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
    };
    resize();

    // Animation loop
    let raf = 0;
    const loop = () => {
      material.uniforms.uTime.value += 0.016; // ~60fps step
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Resize observer to keep canvas matched to container
    const ro = new ResizeObserver(() => resize());
    ro.observe(mount);

    // Cleanup
    return () => {
      mounted = false;
      ro.disconnect();
      cancelAnimationFrame(raf);
      try {
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      } catch (e) {}
      geom.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // NOTE: this div must NOT clip (no overflow-hidden on parent),
  // and should be placed UNDER the rounded glass overlay (z-0)
  return (
    <div
      ref={mountRef}
      style={style}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
