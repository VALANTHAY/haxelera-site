import React, { useState, useRef, useEffect } from 'react';

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

export default function MatrixPoemWidget() {
  const [poemStarted, setPoemStarted] = useState(false);
  const [poemFinished, setPoemFinished] = useState(false);
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
      if (lineIdx >= POEM_LINES.length) {
        setPoemFinished(true);
        return;
      }

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

  useEffect(() => {
    if (poemRef.current) {
      poemRef.current.scrollTop = poemRef.current.scrollHeight;
    }
  }, [poemDisplayed]);

  return (
    <div className="relative w-full font-mono flex flex-col items-center z-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: '#00ff99', fontFamily: "'Share Tech Mono', monospace", textShadow: '0 0 15px rgba(0,255,153,0.3)' }}>
          HACKEA EL SISTEMA
        </h2>

        {/* Terminal/Poem Container */}
        <div
          ref={poemRef}
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '350px',
            overflowY: 'auto',
            padding: '24px',
            borderRadius: '12px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 153, 0.2)',
            boxShadow: '0 0 30px rgba(0, 255, 153, 0.1) inset, 0 10px 30px rgba(0,0,0,0.5)',
            marginBottom: '32px',
            fontFamily: "'Share Tech Mono', monospace",
            scrollbarWidth: 'thin',
            scrollbarColor: '#00ff99 transparent',
          }}
        >
          <pre style={{ fontSize: '1.05rem', textAlign: 'left', whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#00ff99', margin: 0 }}>
            {poemDisplayed.length > 0
              ? poemDisplayed.join('\n')
              : <span style={{ opacity: 0.4 }}>{'> Esperando ejecución del sistema...'}</span>
            }
            {poemStarted && !poemFinished && (
              <span style={{ animation: 'blink-cursor 1s step-end infinite' }}>_</span>
            )}
          </pre>
        </div>

        {/* Action Button */}
        <button
          onClick={startPoem}
          disabled={poemStarted}
          style={{
            padding: '12px 32px',
            fontSize: '1.1rem',
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 'bold',
            background: poemStarted ? 'rgba(0,255,153,0.1)' : 'rgba(0, 255, 153, 0.9)',
            color: poemStarted ? '#00ff99' : 'black',
            border: '1px solid #00ff99',
            borderRadius: '8px',
            cursor: poemStarted ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: poemStarted ? 'none' : '0 0 15px rgba(0,255,153,0.4)',
          }}
          onMouseEnter={e => {
            if (!poemStarted) {
              e.currentTarget.style.background = '#00ff99';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,153,0.6)';
            }
          }}
          onMouseLeave={e => {
            if (!poemStarted) {
              e.currentTarget.style.background = 'rgba(0, 255, 153, 0.9)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,153,0.4)';
            }
          }}
        >
          {poemStarted ? 'EJECUTANDO SCRIPT...' : 'INICIAR HACK'}
        </button>
      
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
