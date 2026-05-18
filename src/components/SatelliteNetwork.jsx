import React, { useEffect, useState, useRef } from 'react';
import { Radio } from 'lucide-react';

export default function SatelliteNetwork() {
  const [targets, setTargets] = useState([]);
  const svgRef = useRef(null);

  // Function to find target elements and calculate paths
  const calculatePaths = () => {
    // Find all elements we want to connect to. Let's target service cards and product cards for now.
    const elements = Array.from(document.querySelectorAll('.glass-card'));
    
    // We only want a few connections to avoid clutter (e.g., first 4)
    const selectedElements = elements.slice(0, 4);

    const dishPos = {
      x: window.innerWidth - 60, // Top right corner offset
      y: 80
    };

    const newTargets = selectedElements.map((el, index) => {
      const rect = el.getBoundingClientRect();
      
      // Calculate attachment point (e.g., top-left corner of the card)
      // Since the SVG covers the whole document (absolute), we need coordinates relative to the document
      const endX = rect.left + window.scrollX + 20; 
      const endY = rect.top + window.scrollY + 20;
      
      // Control points for the Bezier curve
      const cp1X = dishPos.x - 150;
      const cp1Y = dishPos.y + 100;
      const cp2X = endX + (index % 2 === 0 ? 100 : -100);
      const cp2Y = endY - 150;

      const pathData = `M ${dishPos.x} ${dishPos.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

      return {
        id: `path-${index}`,
        d: pathData
      };
    });

    setTargets(newTargets);
  };

  useEffect(() => {
    // Initial calculation (need a slight delay for other components to render)
    const timeout = setTimeout(calculatePaths, 500);

    // Recalculate on resize
    window.addEventListener('resize', calculatePaths);

    // We also need to recalculate if the DOM changes, but for simplicity, 
    // resize and initial load should cover the main layout.
    // If the SVG is position: absolute covering the whole document, 
    // and the dish is also absolute, they scroll together.
    // If the dish is fixed, we would need to redraw on scroll.
    // We will make the dish and SVG absolute to the document body for better performance.

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', calculatePaths);
    };
  }, []);

  return (
    <div className="satellite-network-wrapper">
      {/* 
        The SVG container is absolute and covers the entire document height.
        This allows lines to connect elements throughout the page without recalculating on scroll.
      */}
      <svg 
        ref={svgRef}
        className="fiber-cables-svg" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-cable" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {targets.map((target, index) => (
          <g key={target.id}>
            {/* Base cable (dim) */}
            <path 
              className="fiber-base"
              d={target.d} 
              fill="none"
              stroke="hsla(135, 25%, 55%, 0.15)"
              strokeWidth="1.5"
            />
            {/* Animated data flow (bright, moving) */}
            <path 
              className={`fiber-data fiber-anim-${index % 3}`}
              d={target.d} 
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              filter="url(#glow-cable)"
            />
          </g>
        ))}
      </svg>

      {/* Satellite Dish Icon (Fixed relative to document top-right) */}
      <div className="satellite-dish-absolute">
        <div className="signal-ring signal-ring-1"></div>
        <div className="signal-ring signal-ring-2"></div>
        <div className="dish-icon-container">
          <Radio className="w-10 h-10 text-primary animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}
