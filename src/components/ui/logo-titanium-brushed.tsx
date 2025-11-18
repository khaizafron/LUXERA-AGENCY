"use client";
import * as React from "react";

export default function LogoTitaniumBrushed(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width="1024"
      height="1024"
      role="img"
      aria-label="Titanium brushed L logo"
      {...props}
    >
      <defs>
        <filter id="brushedNoise" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0008 0.06" numOctaves="2" stitchTiles="stitch" result="turb"/>
          <feColorMatrix in="turb" type="matrix" values="1 0 0 0 -0.45 0 1 0 0 -0.45 0 0 1 0 -0.45 0 0 0 1 0" result="contrast"/>
          <feGaussianBlur in="contrast" stdDeviation="0.4" result="blur"/>
          <feComponentTransfer in="blur" result="alpha"><feFuncA type="table" tableValues="0 0.25"/></feComponentTransfer>
          <feBlend in="SourceGraphic" in2="alpha" mode="overlay"/>
        </filter>

        <filter id="brushedStreak" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0006 0.25" numOctaves="1" stitchTiles="stitch" result="n"/>
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55 0 0 0 0 0.55 0 0 0 0 0.55 0 0 0 1 0" result="lm"/>
          <feGaussianBlur in="lm" stdDeviation="0.35" result="g"/>
          <feComponentTransfer in="g" result="alphaMap"><feFuncA type="table" tableValues="0 0.6"/></feComponentTransfer>
          <feBlend in="SourceGraphic" in2="alphaMap" mode="overlay"/>
        </filter>

        <linearGradient id="metalGradBrushed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6f7f8"/>
          <stop offset="30%" stopColor="#d8dde0"/>
          <stop offset="60%" stopColor="#bfc5c9"/>
          <stop offset="100%" stopColor="#ededee"/>
        </linearGradient>

        <linearGradient id="sheenBr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25"/>
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>

        <clipPath id="logoClip">
          <path d="M200 140 L380 40 L380 780 L200 680 Z" />
          <path d="M420 60 L600 160 L600 520 L420 420 Z" />
          <path d="M420 440 L720 300 L720 420 L520 640 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#logoClip)">
        <rect x="0" y="0" width="1024" height="1024" fill="url(#metalGradBrushed)"/>
        <rect x="0" y="0" width="1024" height="1024" fill="black" opacity="0.06" filter="url(#brushedStreak)"/>
        <rect x="0" y="0" width="1024" height="1024" fill="black" opacity="0.12" filter="url(#brushedNoise)"/>
        <rect x="0" y="0" width="1024" height="1024" fill="url(#sheenBr)" opacity="0.85"/>
      </g>

      <g fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M200 140 L380 40 L380 780 L200 680 Z" />
        <path d="M420 60 L600 160 L600 520 L420 420 Z" />
        <path d="M420 440 L720 300 L720 420 L520 640 Z" />
      </g>
    </svg>
  );
}
