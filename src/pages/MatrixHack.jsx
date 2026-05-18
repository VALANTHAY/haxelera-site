import React, { useEffect, useRef, useState } from 'react';

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
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

// ── Terminal Typer ──────────────────────────────────────────────────
const COMMANDS = [
  '[SYSTEM] Initializing Haxelera.exe...',
  '[FIREWALL] Bypassing negativity...',
  '[ACCESS] Connecting a tu vida...',
  '[SUCCESS] Hackea el Sistema Successfully!',
  '[MESSAGE] "Hackea el Sistema, Usalo (Red Pill)',
  '         que el Sistema no hackee tu vida!"',
  '[HACK] "by Maxwell Valanthay" ;)',
];

function useTypewriter(lines, delayBetween = 1000, charDelay = 45) {
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let buffer = [];

    const tick = () => {
      if (lineIdx >= lines.length) return;

      if (charIdx === 0) {
        buffer = [...buffer, ''];
      }

      const current = lines[lineIdx];
      if (charIdx < current.length) {
        buffer = buffer.map((l, i) =>
          i === buffer.length - 1 ? l + current[charIdx] : l
        );
        setDisplayed([...buffer]);
        charIdx++;
        setTimeout(tick, charDelay);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(tick, delayBetween);
      }
    };

    const start = setTimeout(tick, 800);
    return () => clearTimeout(start);
  }, []);

  return displayed;
}

// ── Poem Lines ──────────────────────────────────────────────────────
const POEM_LINES = [
  'Que hoy sea solo hoy…',
  'sin el peso del ayer,',
  'sin la ansiedad del mañana.',
  '',
  'Celebra cada instante, tú puedes.',
  'abraza cada emoción con amor',
  'y vive con gratitud.',
  '',
  '¡Disfruta tu hoy! Sonríe, haz magia',
  'y deja que la vida te sorprenda.',
  'Si está fuera de tus manos, que esté fuera de tu cabeza.',
  'Cree, Confía y apuesta a ti, sé que puedes con todo.',
  '',
  'by Maxwell Valanthay :).',
];

// ── Main Page ───────────────────────────────────────────────────────
export default function MatrixHack() {
  const terminalLines = useTypewriter(COMMANDS, 900, 40);
  const [poemStarted, setPoemStarted] = useState(false);
  const [poemDisplayed, setPoemDisplayed] = useState([]);
  const poemRef = useRef(null);

  const startPoem = () => {
    if (poemStarted) return;
    setPoemStarted(true);
    setPoemDisplayed([]);

    let lineIdx = 0;
    let charIdx = 0;
    let buffer = [];

    const tick = () => {
      if (lineIdx >= POEM_LINES.length) return;

      if (charIdx === 0) {
        buffer = [...buffer, ''];
      }

      const current = POEM_LINES[lineIdx];

      if (charIdx < current.length) {
        buffer = buffer.map((l, i) =>
          i === buffer.length - 1 ? l + current[charIdx] : l
        );
        setPoemDisplayed([...buffer]);
        charIdx++;
        setTimeout(tick, 45);
      } else {
        lineIdx++;
        charIdx = 0;
        setTimeout(tick, 400);
      }
    };
    setTimeout(tick, 100);
  };

  // Auto-scroll poem container
  useEffect(() => {
    if (poemRef.current) {
      poemRef.current.scrollTop = poemRef.current.scrollHeight;
    }
  }, [poemDisplayed]);

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", background: 'black', color: '#00ff99', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Google Font for this page */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>

      {/* Matrix Rain Background */}
      <MatrixCanvas />

      {/* Terminal overlay (top-left) */}
      <div style={{
        position: 'absolute',
        top: '90px',
        left: '5%',
        width: '90%',
        maxHeight: '200px',
        padding: '20px',
        fontSize: '14px',
        color: '#00ff99',
        background: 'rgba(0, 0, 0, 0.85)',
        boxShadow: '0 0 18px #00ff99',
        borderRadius: '8px',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        zIndex: 10,
        border: '1px solid rgba(0,255,153,0.3)',
      }}>
        {/* Terminal header dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }}></span>
          <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.6 }}>haxelera@core:~</span>
        </div>
        {terminalLines.map((line, i) => (
          <div key={i} style={{ lineHeight: '1.7' }}>
            <span style={{ color: 'rgba(0,255,153,0.5)' }}>$ </span>{line}
            {i === terminalLines.length - 1 && (
              <span style={{ animation: 'blink-cursor 1s step-end infinite', borderLeft: '2px solid #00ff99', marginLeft: '2px' }}>&nbsp;</span>
            )}
          </div>
        ))}
      </div>

      {/* Main centered content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '280px 40px 60px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
          marginBottom: '28px',
          color: '#00ff99',
          textShadow: '0 0 20px #00ff99, 0 0 40px rgba(0,255,153,0.4)',
          letterSpacing: '3px',
        }}>
          ▓ HACKEA EL SISTEMA ▓
        </h1>

        {/* Poem Container */}
        <div
          ref={poemRef}
          style={{
            maxWidth: '720px',
            width: '100%',
            height: '320px',
            overflowY: 'auto',
            padding: '28px',
            borderRadius: '10px',
            background: 'rgba(0, 255, 153, 0.07)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 20px rgba(0, 255, 153, 0.4), inset 0 0 30px rgba(0,0,0,0.3)',
            border: '1px solid rgba(0,255,153,0.25)',
            marginBottom: '28px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#00ff99 transparent',
          }}
        >
          <pre style={{ fontSize: '1.05rem', textAlign: 'left', whiteSpace: 'pre-wrap', lineHeight: 1.9, color: '#00ff99', fontFamily: "'Share Tech Mono', monospace" }}>
            {poemDisplayed.length > 0
              ? poemDisplayed.join('\n')
              : <span style={{ opacity: 0.4 }}>{'> Presiona el botón para hackear el sistema...'}</span>
            }
          </pre>
        </div>

        {/* Button */}
        <button
          onClick={startPoem}
          disabled={poemStarted && poemDisplayed.length < POEM_LINES.length}
          style={{
            padding: '14px 36px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            fontFamily: "'Share Tech Mono', monospace",
            background: poemStarted ? 'rgba(0,255,153,0.2)' : '#00ff99',
            color: poemStarted ? '#00ff99' : 'black',
            border: '2px solid #00ff99',
            borderRadius: '50px',
            cursor: poemStarted ? 'default' : 'pointer',
            boxShadow: '0 0 25px rgba(0,255,153,0.6)',
            transition: 'all 0.3s ease',
            letterSpacing: '1px',
          }}
          onMouseEnter={e => {
            if (!poemStarted) {
              e.currentTarget.style.background = '#00cc88';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0,255,153,0.8)';
            }
          }}
          onMouseLeave={e => {
            if (!poemStarted) {
              e.currentTarget.style.background = '#00ff99';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,153,0.6)';
            }
          }}
        >
          {poemStarted ? '▶ Ejecutando...' : '⚡ Hackea el Sistema!'}
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.75rem', color: 'rgba(0,255,153,0.45)', letterSpacing: '1px' }}>
          HAXELERA GROUP — Sistema Iniciado
        </p>
      </div>

      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
