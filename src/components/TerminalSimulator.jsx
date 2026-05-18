import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export default function TerminalSimulator() {
  const [text, setText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const lines = [
    '> Initializing Zero-Trust Protocol...',
    '> Scanning network perimeter for vulnerabilities...',
    '> 0 threats detected in active endpoints.',
    '> Secure connection established.',
    '> Awaiting command_'
  ];

  useEffect(() => {
    if (lineIndex < lines.length) {
      if (charIndex < lines[lineIndex].length) {
        const timeout = setTimeout(() => {
          setText((prev) => prev + lines[lineIndex][charIndex]);
          setCharIndex(charIndex + 1);
        }, 40 + Math.random() * 40);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setText((prev) => prev + '\n');
          setLineIndex(lineIndex + 1);
          setCharIndex(0);
        }, 600);
        return () => clearTimeout(timeout);
      }
    }
  }, [lineIndex, charIndex, lines]);

  return (
    <section className="relative py-12 flex justify-center w-full px-6" style={{ overflow: 'hidden' }}>
      <div 
        className="glass-card max-w-4xl w-full mx-auto relative group overflow-hidden" 
        style={{ 
          border: '1px solid hsla(135, 25%, 55%, 0.2)', 
          padding: '24px',
          backgroundColor: 'hsla(0,0%,0%,0.4)'
        }}
      >
        <div className="flex items-center gap-3 border-b border-white border-opacity-10 pb-4 mb-4" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" style={{ backgroundColor: '#ef4444' }}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" style={{ backgroundColor: '#eab308' }}></div>
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" style={{ backgroundColor: '#22c55e' }}></div>
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs font-mono text-muted tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Terminal className="w-3 h-3" /> system@haxelera: ~
            </span>
          </div>
        </div>
        
        <div className="font-mono text-sm leading-loose whitespace-pre-wrap min-h-[160px]" style={{ color: 'var(--primary)', textShadow: '0 0 5px var(--primary-glow)' }}>
          {text}
          <span className="animate-pulse">_</span>
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-1000" style={{ backgroundColor: 'var(--primary)' }}></div>
      </div>
    </section>
  );
}
