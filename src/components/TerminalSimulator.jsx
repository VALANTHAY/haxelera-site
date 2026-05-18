import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal } from 'lucide-react';

export default function TerminalSimulator() {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTypingIntro, setIsTypingIntro] = useState(true);
  const [introText, setIntroText] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const introLines = [
    '> Initializing Zero-Trust Protocol...',
    '> Secure connection established.',
    '> Welcome to HaxShell v2.4 — Type "help" for available commands.',
  ];

  // Intro typing animation
  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let current = '';

    const typeNext = () => {
      if (lineIdx >= introLines.length) {
        setIsTypingIntro(false);
        return;
      }

      if (charIdx < introLines[lineIdx].length) {
        current += introLines[lineIdx][charIdx];
        setIntroText(current);
        charIdx++;
        setTimeout(typeNext, 30 + Math.random() * 30);
      } else {
        current += '\n';
        setIntroText(current);
        lineIdx++;
        charIdx = 0;
        setTimeout(typeNext, 400);
      }
    };

    typeNext();
  }, []);

  const processCommand = useCallback((cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = '';

    switch (trimmedCmd) {
      case 'help':
        output = `Comandos disponibles:
  help        — Muestra esta ayuda
  status      — Estado del sistema de seguridad
  scan        — Escaneo de vulnerabilidades
  whoami      — Información de la sesión
  services    — Lista de servicios Haxelera
  clear       — Limpiar terminal
  contact     — Información de contacto`;
        break;
      case 'status':
        output = `╔══════════════════════════════════════╗
║  HAXELERA SECURITY STATUS REPORT    ║
╠══════════════════════════════════════╣
║  Firewall:       ██████████ ACTIVE  ║
║  Threat Level:   ▓░░░░░░░░░ LOW     ║
║  Endpoints:      247 monitored      ║
║  Last Incident:  None (72h)         ║
║  Uptime:         99.98%             ║
╚══════════════════════════════════════╝`;
        break;
      case 'scan':
        output = `[SCAN] Initiating perimeter scan...
[SCAN] Checking port 443... SECURE
[SCAN] Checking port 80... REDIRECTED → 443
[SCAN] Checking port 22... FILTERED
[SCAN] Checking port 3306... BLOCKED
[SCAN] DNS leak test... PASSED
[SCAN] SSL/TLS certificate... VALID (A+ rating)
[SCAN] ✅ 0 vulnerabilities found. System is secure.`;
        break;
      case 'whoami':
        output = `Session: guest@haxelera-public
Role: VISITOR
Access Level: READ-ONLY
IP: [REDACTED]
Encryption: AES-256-GCM
Protocol: Zero-Trust Verified`;
        break;
      case 'services':
        output = `Servicios de Haxelera Group:
  1. Desarrollo de Software a Medida
  2. Arquitectura DevOps & SRE
  3. Ciberseguridad Ofensiva & Defensiva
  4. Cloud Security & Modern Workplace
  5. Data, Analytics & IA Segura
  6. Auditoría & Cumplimiento TI`;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'contact':
        output = `📧 info@haxeleragroup.com
📱 +1 (809) 789-5432
🌐 haxeleragroup.com
💬 WhatsApp: Click the green button →`;
        break;
      case '':
        return;
      default:
        output = `haxshell: command not found: "${trimmedCmd}"\nType "help" for available commands.`;
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(currentInput);
      setCurrentInput('');
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, introText]);

  return (
    <section className="relative py-12 flex justify-center w-full px-6" style={{ overflow: 'hidden' }}>
      <div 
        className="glass-card w-full mx-auto relative overflow-hidden" 
        style={{ 
          maxWidth: '900px',
          border: '1px solid hsla(135, 25%, 55%, 0.2)', 
          padding: '0',
          backgroundColor: 'hsla(0,0%,0%,0.5)',
          borderRadius: '12px',
        }}
        onClick={focusInput}
      >
        {/* Terminal Header Bar */}
        <div 
          className="flex items-center gap-3 px-4 py-3" 
          style={{ 
            background: 'hsla(0,0%,100%,0.03)',
            borderBottom: '1px solid hsla(0,0%,100%,0.06)',
          }}
        >
          <div className="flex gap-2">
            <div style={{ backgroundColor: '#ef4444', width: '12px', height: '12px', borderRadius: '50%', opacity: 0.8 }}></div>
            <div style={{ backgroundColor: '#eab308', width: '12px', height: '12px', borderRadius: '50%', opacity: 0.8 }}></div>
            <div style={{ backgroundColor: '#22c55e', width: '12px', height: '12px', borderRadius: '50%', opacity: 0.8 }}></div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span className="text-xs font-mono tracking-widest flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
              <Terminal className="w-3 h-3" /> system@haxelera: ~
            </span>
          </div>
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={containerRef}
          className="font-mono text-sm leading-relaxed p-4 overflow-y-auto"
          style={{ 
            color: 'var(--primary)', 
            textShadow: '0 0 4px var(--primary-glow)',
            minHeight: '220px',
            maxHeight: '400px',
          }}
        >
          {/* Intro animation */}
          <pre className="whitespace-pre-wrap" style={{ margin: 0, fontFamily: 'inherit' }}>{introText}</pre>

          {/* Command history */}
          {history.map((entry, idx) => (
            <div key={idx} style={{ marginTop: '8px' }}>
              <div>
                <span style={{ color: 'var(--accent)' }}>guest@haxelera</span>
                <span style={{ color: 'var(--text-muted)' }}>:</span>
                <span style={{ color: '#60a5fa' }}>~</span>
                <span style={{ color: 'var(--text-muted)' }}>$ </span>
                <span style={{ color: 'var(--text-main)' }}>{entry.command}</span>
              </div>
              <pre className="whitespace-pre-wrap" style={{ margin: '4px 0 0 0', fontFamily: 'inherit', color: 'var(--primary)' }}>{entry.output}</pre>
            </div>
          ))}

          {/* Active input line */}
          {!isTypingIntro && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ color: 'var(--accent)' }}>guest@haxelera</span>
              <span style={{ color: 'var(--text-muted)' }}>:</span>
              <span style={{ color: '#60a5fa' }}>~</span>
              <span style={{ color: 'var(--text-muted)' }}>$ </span>
              <input 
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontFamily: 'monospace',
                  fontSize: 'inherit',
                  flex: 1,
                  padding: 0,
                  caretColor: 'var(--primary)',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
