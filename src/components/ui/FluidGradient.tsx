"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFBO } from "@react-three/drei";

// ================== SHADERS ==================

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec4 iMouse;
  uniform int iFrame;
  uniform sampler2D iPreviousFrame;
  uniform float uBrushSize;
  uniform float uBrushStrength;
  uniform float uFluidDecay;
  uniform float uTrailLength;
  uniform float uStopDecay;
  varying vec2 vUv;

  vec2 ur, U;

  float ln(vec2 p, vec2 a, vec2 b) {
    return length(p-a-(b-a)*clamp(dot(p-a,b-a)/dot(b-a,b-a),0.,1.));
  }

  vec4 t(vec2 v, int a, int b) {
    return texture2D(iPreviousFrame, fract((v+vec2(float(a),float(b)))/ur));
  }

  vec4 t(vec2 v) {
    return texture2D(iPreviousFrame, fract(v/ur));
  }

  void main() {
    U = vUv * iResolution;
    ur = iResolution.xy;

    if (iFrame < 1) {
      gl_FragColor = vec4(0.02, 0.0, 0.08, 1.0);
    } else {
      vec2 v = U;
      vec4 me = t(v);

      vec4 n = t(v, 0, 1),
           e = t(v, 1, 0),
           s = t(v, 0, -1),
           w = t(v, -1, 0);

      vec4 ne = 0.25 * (n + e + s + w);

      me = mix(t(v), ne, vec4(0.1, 0.1, 0.95, 0.0));
      me.xy *= uFluidDecay;
      me.z *= uTrailLength;

      if (iMouse.z > 0.0) {
        vec2 mp = iMouse.xy;
        vec2 mPrev = iMouse.zw;
        float q = ln(U, mp, mPrev);
        float falloff = exp(-0.00005 * q*q*q);
        me.xyw += falloff * vec3(mp - mPrev, 8.0);
      }

      gl_FragColor = clamp(me, -0.4, 0.4);
    }
  }
`;

const displayShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform sampler2D iFluid;

  uniform float uDistortionAmount;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;

  uniform float uColorIntensity;

  varying vec2 vUv;

  void main() {
    vec4 fluid = texture2D(iFluid, vUv);
    vec2 fluidVel = fluid.xy;

    vec2 uv = vUv;
    uv += fluidVel * 0.25 * uDistortionAmount;

    float m1 = sin(uv.x * 2.2 + iTime * 0.3) * 0.5 + 0.5;
    float m2 = sin(uv.y * 1.4 + iTime * 0.2) * 0.5 + 0.5;

    vec3 col = mix(uColor1, uColor2, m1);
    col = mix(col, uColor3, m2);
    col = mix(col, uColor4, m1 * m2 * 0.6);

    col *= uColorIntensity;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ================== CONFIG ==================

const config = {
  brushSize: 28,
  brushStrength: 0.55,
  distortionAmount: 1.8,
  fluidDecay: 0.985,
  trailLength: 0.82,
  stopDecay: 0.82,

  // ⭐ Perfect Purple/Black Premium Colors
  color1: "#060012",   // deep black-purple
  color2: "#3a0ca3",   // neon royal purple
  color3: "#7209b7",   // cyber purple
  color4: "#4cc9f0",   // cyan highlight

  colorIntensity: 1.3,
  lerpFactor: 0.12,
};

const hexToRgb = (hex: string) => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

// ================== FLUID SIM ==================

function FluidSimulation() {
  const { size, gl, camera } = useThree();
  const fluidMaterial = useRef<any>(null);
  const displayMaterial = useRef<any>(null);
  const fluidMeshRef = useRef<any>(null);
  const displayMeshRef = useRef<any>(null);

  const fboA = useFBO(size.width, size.height);
  const fboB = useFBO(size.width, size.height);

  const [curr, setCurr] = useState(fboA);
  const [prev, setPrev] = useState(fboB);
  const [frame, setFrame] = useState(0);

  const mouse = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const target = useRef({ x: 0, y: 0 });

  // mouse tracking
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      target.current.x = e.clientX - rect.left;
      target.current.y = rect.height - (e.clientY - rect.top);
    };
    gl.domElement.addEventListener("mousemove", move);
    return () => gl.domElement.removeEventListener("mousemove", move);
  }, [gl]);

  useFrame(({ gl, clock }) => {
    const time = clock.getElapsedTime();

    mouse.current.px = mouse.current.x;
    mouse.current.py = mouse.current.y;

    mouse.current.x += (target.current.x - mouse.current.x) * config.lerpFactor;
    mouse.current.y += (target.current.y - mouse.current.y) * config.lerpFactor;

    // update sim
    fluidMaterial.current.uniforms.iTime.value = time;
    fluidMaterial.current.uniforms.iFrame.value = frame;
    fluidMaterial.current.uniforms.iMouse.value.set(
      mouse.current.x,
      mouse.current.y,
      mouse.current.px,
      mouse.current.py
    );
    fluidMaterial.current.uniforms.iPreviousFrame.value = prev.texture;

    // render fluid
    gl.setRenderTarget(curr);
    gl.render(fluidMeshRef.current, camera);

    // render display
    displayMaterial.current.uniforms.iFluid.value = curr.texture;
    gl.setRenderTarget(null);
    gl.render(displayMeshRef.current, camera);

    // swap
    setCurr(prev);
    setPrev(curr);

    setFrame(f => f + 1);
  });

  const aspect = size.width / size.height;

  return (
    <>
      <mesh ref={fluidMeshRef}>
        <planeGeometry args={[2 * aspect, 2]} />
        <shaderMaterial
          ref={fluidMaterial}
          uniforms={{
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(size.width, size.height) },
            iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
            iFrame: { value: 0 },
            iPreviousFrame: { value: null },
            uBrushSize: { value: config.brushSize },
            uBrushStrength: { value: config.brushStrength },
            uFluidDecay: { value: config.fluidDecay },
            uTrailLength: { value: config.trailLength },
            uStopDecay: { value: config.stopDecay },
          }}
          vertexShader={vertexShader}
          fragmentShader={fluidShader}
        />
      </mesh>

      <mesh ref={displayMeshRef}>
        <planeGeometry args={[2 * aspect, 2]} />
        <shaderMaterial
          ref={displayMaterial}
          uniforms={{
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(size.width, size.height) },
            iFluid: { value: null },
            uDistortionAmount: { value: config.distortionAmount },
            uColorIntensity: { value: config.colorIntensity },
            uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
            uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
            uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
            uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
          }}
          vertexShader={vertexShader}
          fragmentShader={displayShader}
        />
      </mesh>
    </>
  );
}

// ================== ORTHO CAM ==================

function OrthoCam() {
  const { size, set } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    set({
      camera: new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0, 1),
    });
  }, [size, set]);
  return null;
}

// ================== WRAPPER ==================

export const FluidGradient = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const resize = () => setKey(k => k + 1);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <Canvas
      className="absolute inset-0 w-full h-full -z-10"
      gl={{ antialias: true }}
    >
      <OrthoCam />
      <FluidSimulation key={key} />
    </Canvas>
  );
};
