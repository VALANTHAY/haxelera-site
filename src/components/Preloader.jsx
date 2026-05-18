import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

// ── Matrix Rain Canvas ──────────────────────────────────────────────
function MatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff99';
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      columns = Math.floor(canvas.width / fontSize);
      while (drops.length < columns) drops.push(1);

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
}

// ── Preloader Component ─────────────────────────────────────────────
const COMMANDS = [
  '[SYSTEM] Initializing Haxelera.exe...',
  '[FIREWALL] Bypassing negativity...',
  '[ACCESS] Connecting  tu Experiencia...',
  '[SUCCESS] Experiencia  Successfully!',
  '[MESSAGE] "Haz de esta tu mejor Experiencia, Piensa diferente.',
  '         Disfruta en momento, la vida es bella!"',
  '> HAXELERA™',
  '> by Maxwell Valanthay',
];

export default function Preloader({ onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let buffer = [];

    const delayBetween = 600;
    const charDelay = 30;

    const tick = () => {
      if (lineIdx >= COMMANDS.length) {
        // Finished typing
        setTimeout(() => {
          setAccessGranted(true);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => onComplete(), 800); // Wait for fade out
          }, 1500);
        }, 500);
        return;
      }

      if (charIdx === 0) {
        buffer = [...buffer, ''];
      }

      const current = COMMANDS[lineIdx];
      if (charIdx < current.length) {
        buffer = buffer.map((l, i) =>
          i === buffer.length - 1 ? l + current[charIdx] : l
        );
        setDisplayedLines([...buffer]);
        charIdx++;
        setTimeout(tick, charDelay);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(tick, delayBetween);
      }
    };

    const start = setTimeout(tick, 500);
    return () => clearTimeout(start);
  }, [onComplete]);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'black',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
        fontFamily: "'Share Tech Mono', monospace"
      }}
    >
      <MatrixCanvas />

      {/* Main Title Above Terminal */}
      <div style={{
        position: 'absolute',
        top: '15%',
        width: '100%',
        textAlign: 'center',
        zIndex: 10,
        animation: 'fade-in 1s ease'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
          fontWeight: 'bold', 
          letterSpacing: '2px', 
          textShadow: '0 0 15px #00ff99', 
          color: '#ffffff', 
          margin: 0 
        }}>
          BIENVENIDO A HAXELERA GROUP
        </h1>
      </div>

      {/* Terminal Window */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '90%',
        maxWidth: '700px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '1px solid rgba(0, 255, 153, 0.3)',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 255, 153, 0.2)',
        overflow: 'hidden',
        padding: '24px'
      }}>
        {/* Terminal Header */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
          <span style={{ marginLeft: '12px', fontSize: '13px', color: '#00ff99', opacity: 0.6 }}>Haxelera Group — bash</span>
        </div>

        {/* Terminal Body */}
        <div style={{ color: '#00ff99', fontSize: '15px', lineHeight: '1.8' }}>
          {displayedLines.map((line, i) => (
            <div key={i}>
              <span style={{ opacity: 0.5 }}>$ </span>{line}
            </div>
          ))}
          
          {/* Blinking Cursor */}
          {!accessGranted && (
            <div>
              <span style={{ opacity: 0.5 }}>$ </span>
              <span style={{ animation: 'blink-cursor 1s step-end infinite', borderLeft: '2px solid #00ff99' }}>&nbsp;</span>
            </div>
          )}

          {/* Access Granted Message */}
          {accessGranted && (
            <div style={{ marginTop: '24px', textAlign: 'center', animation: 'fade-in 0.5s ease' }}>
              <ShieldCheck style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: '#00ff99' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', textShadow: '0 0 10px #00ff99' }}>
                [ ACCESS GRANTED ]
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
