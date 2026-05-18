import React, { useState, useEffect } from 'react';
import { ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const codeLines = [
    { text: "import { SecurityProtocol } from '@haxelera/core';", class: "code-import" },
    { text: "import { NeuralNetwork } from '@haxelera/ai';", class: "code-import" },
    { text: "", class: "" },
    { text: "async function initializeDefenses() {", class: "code-function" },
    { text: "  console.log('Initiating Secure Handshake...');", class: "code-string" },
    { text: "  await SecurityProtocol.bypassFirewall();", class: "code-method" },
    { text: "  ", class: "" },
    { text: "  const nodes = NeuralNetwork.scanPerimeter({", class: "code-keyword" },
    { text: "    depth: 'MAX_DEPTH',", class: "code-string" },
    { text: "    encryption: 'AES-256-GCM'", class: "code-string" },
    { text: "  });", class: "" },
    { text: "  ", class: "" },
    { text: "  if (nodes.isCompromised) {", class: "code-keyword" },
    { text: "    throw new Error('Vulnerability Detected!');", class: "code-error" },
    { text: "  }", class: "" },
    { text: "  ", class: "" },
    { text: "  return SecurityProtocol.grantAccess();", class: "code-keyword" },
    { text: "}", class: "" },
    { text: "", class: "" },
    { text: "// Executing root protocol...", class: "code-comment" }
  ];

  useEffect(() => {
    let currentLineIndex = 0;
    
    // Type out the lines one by one
    const typeLine = () => {
      if (currentLineIndex < codeLines.length) {
        setDisplayedLines(prev => [...prev, codeLines[currentLineIndex]]);
        currentLineIndex++;
        
        // Randomize typing speed slightly for realism (between 100ms and 300ms)
        const nextSpeed = Math.floor(Math.random() * 200) + 100;
        setTimeout(typeLine, nextSpeed);
      } else {
        // Once all lines are typed, wait a moment then grant access
        setTimeout(() => {
          setAccessGranted(true);
          
          // Wait to show "Access Granted" then start fade out
          setTimeout(() => {
            setIsFadingOut(true);
            
            // Wait for fade out animation to finish before unmounting
            setTimeout(() => {
              onComplete();
            }, 800); // matches the CSS transition duration
          }, 1500);
          
        }, 800);
      }
    };

    // Start typing after a short initial delay
    const initialDelay = setTimeout(typeLine, 500);
    return () => clearTimeout(initialDelay);
  }, [onComplete]);

  return (
    <div className={`preloader-container ${isFadingOut ? 'fade-out-up' : ''}`}>
      <div className="pc-monitor">
        {/* Monitor Header (macOS style) */}
        <div className="monitor-header">
          <div className="window-controls">
            <div className="control close"></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
          <div className="window-title">
            <TerminalIcon className="w-4 h-4" /> haxelera — bash
          </div>
        </div>
        
        {/* Monitor Screen / Code Editor */}
        <div className="monitor-screen font-mono">
          <div className="code-content">
            {displayedLines.map((line, idx) => (
              <div key={idx} className="code-line">
                <span className="line-number">{idx + 1}</span>
                <span className={`line-text ${line.class}`}>
                  {line.text}
                </span>
              </div>
            ))}
            
            {/* Blinking Cursor */}
            {!accessGranted && (
              <div className="code-line">
                <span className="line-number">{displayedLines.length + 1}</span>
                <span className="blinking-cursor"></span>
              </div>
            )}
          </div>

          {/* Access Granted Overlay */}
          {accessGranted && (
            <div className="access-granted-overlay">
              <ShieldCheck className="w-16 h-16 text-primary animate-pulse-slow mb-4" />
              <h2 className="font-heading font-extrabold text-3xl tracking-widest text-white mb-2">
                [ ACCESS GRANTED ]
              </h2>
              <p className="font-mono text-primary text-sm tracking-widest">
                SYSTEM INITIALIZED
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
