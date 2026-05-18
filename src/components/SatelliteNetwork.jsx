import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';

export default function SatelliteNetwork() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof document !== 'undefined' && document.documentElement ? document.documentElement.scrollHeight : 800
  });

  const [ping, setPing] = useState(14);

  // Fluctuating Ping (Active Latency Sim)
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const nextPing = prev + change;
        // Bound between 10ms and 22ms for extreme high-performance look
        return Math.max(10, Math.min(22, nextPing));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Capture total page height and window width in real-time
  useEffect(() => {
    const updateDimensions = () => {
      const newWidth = window.innerWidth;
      const newHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
      
      setDimensions(prev => {
        // Speed Optimization: Skip state updates if the dimension change is negligible
        if (Math.abs(prev.width - newWidth) < 10 && Math.abs(prev.height - newHeight) < 15) {
          return prev;
        }
        return { width: newWidth, height: newHeight };
      });
    };

    // Initial run
    updateDimensions();

    // Use ResizeObserver on document.body to watch for any changes in page content height
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(document.body);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const w = dimensions.width;
  const h = dimensions.height;
  const startX = w - 80;
  const startY = 140;

  // Bezier Path 1: Deep left sweeping curve that loops down the page
  const getPath1 = () => {
    const p1 = { x: w * 0.15, y: h * 0.20 };
    const p2 = { x: w * 0.80, y: h * 0.45 };
    const p3 = { x: w * 0.10, y: h * 0.75 };
    const p4 = { x: w * 0.20, y: h * 0.98 };

    return `M ${startX} ${startY} 
            C ${startX - w * 0.4} ${startY + h * 0.05}, ${p1.x + w * 0.3} ${p1.y - h * 0.05}, ${p1.x} ${p1.y}
            C ${p1.x - w * 0.1} ${p1.y + h * 0.1}, ${p2.x - w * 0.3} ${p2.y - h * 0.1}, ${p2.x} ${p2.y}
            C ${p2.x + w * 0.1} ${p2.y + h * 0.1}, ${p3.x + w * 0.3} ${p3.y - h * 0.1}, ${p3.x} ${p3.y}
            C ${p3.x - w * 0.1} ${p3.y + h * 0.1}, ${p4.x - w * 0.1} ${p4.y - h * 0.05}, ${p4.x} ${p4.y}`;
  };

  // Bezier Path 2: Right side flow that curves towards the center and ends at bottom right
  const getPath2 = () => {
    const p1 = { x: w * 0.85, y: h * 0.25 };
    const p2 = { x: w * 0.25, y: h * 0.55 };
    const p3 = { x: w * 0.75, y: h * 0.80 };
    const p4 = { x: w * 0.80, y: h * 0.97 };

    return `M ${startX} ${startY} 
            C ${startX - w * 0.1} ${startY + h * 0.05}, ${p1.x - w * 0.1} ${p1.y - h * 0.05}, ${p1.x} ${p1.y}
            C ${p1.x + w * 0.1} ${p1.y + h * 0.1}, ${p2.x + w * 0.3} ${p2.y - h * 0.1}, ${p2.x} ${p2.y}
            C ${p2.x - w * 0.2} ${p2.y + h * 0.1}, ${p3.x - w * 0.2} ${p3.y - h * 0.1}, ${p3.x} ${p3.y}
            C ${p3.x + w * 0.1} ${p3.y + h * 0.1}, ${p4.x - w * 0.1} ${p4.y - h * 0.05}, ${p4.x} ${p4.y}`;
  };

  // Bezier Path 3: Elegant, gentle wave down the center
  const getPath3 = () => {
    const p1 = { x: w * 0.50, y: h * 0.30 };
    const p2 = { x: w * 0.45, y: h * 0.65 };
    const p3 = { x: w * 0.60, y: h * 0.96 };

    return `M ${startX} ${startY} 
            C ${startX - w * 0.2} ${startY + h * 0.08}, ${p1.x + w * 0.1} ${p1.y - h * 0.08}, ${p1.x} ${p1.y}
            C ${p1.x - w * 0.1} ${p1.y + h * 0.1}, ${p2.x - w * 0.1} ${p2.y - h * 0.1}, ${p2.x} ${p2.y}
            C ${p2.x + w * 0.1} ${p2.y + h * 0.1}, ${p3.x - w * 0.1} ${p3.y - h * 0.05}, ${p3.x} ${p3.y}`;
  };

  return (
    <div className="satellite-network-wrapper-absolute">
      {/* 
        The SVG container spans the entire scrollable height of the document.
        Its dimensions update dynamically, allowing curves to stretch to the end of the page.
      */}
      <svg 
        className="fiber-cables-svg-absolute" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: `${h}px`,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      >
        {/* Optimized: Heavy SVG blur filters removed for extreme performance boost */}

        {h > 150 && (
          <>
            {/* Cable 1: Left sweep */}
            <g>
              <path className="fiber-base" d={getPath1()} fill="none" stroke="hsla(135, 25%, 55%, 0.12)" strokeWidth="1.5" />
              <path className="fiber-data fiber-anim-0" d={getPath1()} fill="none" stroke="var(--primary)" strokeWidth="2" />
            </g>

            {/* Cable 2: Right sweep */}
            <g>
              <path className="fiber-base" d={getPath2()} fill="none" stroke="hsla(135, 25%, 55%, 0.12)" strokeWidth="1.5" />
              <path className="fiber-data fiber-anim-1" d={getPath2()} fill="none" stroke="var(--primary)" strokeWidth="2" />
            </g>

            {/* Cable 3: Center wave */}
            <g>
              <path className="fiber-base" d={getPath3()} fill="none" stroke="hsla(135, 25%, 55%, 0.12)" strokeWidth="1.5" />
              <path className="fiber-data fiber-anim-2" d={getPath3()} fill="none" stroke="var(--primary)" strokeWidth="2" />
            </g>
          </>
        )}
      </svg>

      {/* Brain Antenna Module with Latency HUD */}
      <div 
        className="satellite-dish-absolute"
        style={{
          position: 'absolute',
          top: '100px',
          right: '40px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div className="signal-ring signal-ring-1"></div>
        <div className="signal-ring signal-ring-2"></div>
        
        <div 
          className="dish-icon-container"
          style={{
            background: 'hsla(140, 15%, 8%, 0.85)',
            border: '1px solid var(--primary)',
            borderRadius: '50%',
            padding: '12px',
            boxShadow: '0 0 20px rgba(0, 255, 153, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '74px',
            height: '74px',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <Brain className="w-8 h-8 text-primary animate-pulse-slow" style={{ color: 'var(--primary)' }} />
          
          {/* Latency HUD Stats */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '8px',
              color: 'var(--primary)',
              textShadow: '0 0 4px rgba(0, 255, 153, 0.4)',
              fontWeight: 'bold',
              lineHeight: 1
            }}
          >
            {/* Pulsing Green LED */}
            <span 
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#00ff99',
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 0 4px #00ff99',
                animation: 'pulse-slow 1s infinite alternate'
              }}
            ></span>
            <span>{ping}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
