import React from 'react';
import { Radio } from 'lucide-react';

export default function SatelliteNetwork() {
  return (
    <div className="satellite-network-wrapper-fixed">
      {/* 
        Fixed SVG overlay covering the screen.
        High performance since it doesn't recalculate on scroll.
      */}
      <svg 
        className="fiber-cables-svg-fixed" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-cable" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cable 1: Curving left and down */}
        <g>
          <path className="fiber-base" d="M calc(100vw - 60px) 100 C calc(100vw - 30vw) 20vh, calc(100vw - 60vw) 50vh, -100 80vh" fill="none" stroke="hsla(135, 25%, 55%, 0.15)" strokeWidth="1.5" />
          <path className="fiber-data fiber-anim-0" d="M calc(100vw - 60px) 100 C calc(100vw - 30vw) 20vh, calc(100vw - 60vw) 50vh, -100 80vh" fill="none" stroke="var(--primary)" strokeWidth="2" filter="url(#glow-cable)" />
        </g>

        {/* Cable 2: Sweeping down to bottom left */}
        <g>
          <path className="fiber-base" d="M calc(100vw - 60px) 100 C calc(100vw - 10vw) 40vh, 20vw 80vh, 10vw 120vh" fill="none" stroke="hsla(135, 25%, 55%, 0.15)" strokeWidth="1.5" />
          <path className="fiber-data fiber-anim-1" d="M calc(100vw - 60px) 100 C calc(100vw - 10vw) 40vh, 20vw 80vh, 10vw 120vh" fill="none" stroke="var(--primary)" strokeWidth="2" filter="url(#glow-cable)" />
        </g>

        {/* Cable 3: Dropping almost straight down */}
        <g>
          <path className="fiber-base" d="M calc(100vw - 60px) 100 C calc(100vw - 200px) 50vh, calc(100vw - 400px) 80vh, calc(100vw - 300px) 120vh" fill="none" stroke="hsla(135, 25%, 55%, 0.15)" strokeWidth="1.5" />
          <path className="fiber-data fiber-anim-2" d="M calc(100vw - 60px) 100 C calc(100vw - 200px) 50vh, calc(100vw - 400px) 80vh, calc(100vw - 300px) 120vh" fill="none" stroke="var(--primary)" strokeWidth="2" filter="url(#glow-cable)" />
        </g>

        {/* Cable 4: Crossing far left */}
        <g>
          <path className="fiber-base" d="M calc(100vw - 60px) 100 C 50vw 10vh, 10vw 30vh, -50 60vh" fill="none" stroke="hsla(135, 25%, 55%, 0.15)" strokeWidth="1.5" />
          <path className="fiber-data fiber-anim-0" d="M calc(100vw - 60px) 100 C 50vw 10vh, 10vw 30vh, -50 60vh" fill="none" stroke="var(--primary)" strokeWidth="2" filter="url(#glow-cable)" />
        </g>
      </svg>

      {/* Satellite Dish Icon */}
      <div className="satellite-dish-fixed">
        <div className="signal-ring signal-ring-1"></div>
        <div className="signal-ring signal-ring-2"></div>
        <div className="dish-icon-container">
          <Radio className="w-10 h-10 text-primary animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}
