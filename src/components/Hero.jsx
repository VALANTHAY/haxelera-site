import React from 'react';
import { ArrowRight, ShieldCheck, Terminal, Network, Activity } from 'lucide-react';
import MatrixPoemWidget from './MatrixPoemWidget';

export default function Hero() {
  return (
    <section id="inicio" className="relative min-vh-100 flex items-center overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
      {/* Animated Team Background with Ken Burns effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/haxelera_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.18',
          mixBlendMode: 'luminosity',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          zIndex: 0,
          animation: 'kenburns 25s ease-in-out infinite alternate',
        }}
      ></div>

      {/* Background ambient lighting */}
      <div className="ambient-light ambient-light-sage"></div>
      <div className="ambient-light ambient-light-copper"></div>

      <div className="section-container grid md:grid-cols-2 gap-12 items-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', width: '100%' }}>
        {/* Left Side Copy */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left z-10 w-full">
          <div className="section-tag flex items-center gap-2 justify-center md:justify-start">
            <span className="pulse-dot"></span>
            SOC 24/7: Operaciones de Seguridad Activas
          </div>
          
          <h1 className="text-5xl font-extrabold font-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', lineHeight: '1.2', marginBottom: '24px' }}>
            <span style={{ display: 'block', marginBottom: '4px' }}>
              <span className="gradient-text-sage">Ingeniería de Software</span>
              <span className="text-white text-glow-sage" style={{ marginLeft: '0.4em' }}>de Alto Rendimiento.</span>
            </span>
            <span className="gradient-text-copper" style={{ display: 'block' }}>Ciberseguridad Blindada.</span>
          </h1>
          
          <p className="text-lg text-muted mb-8 font-body max-w-xl mx-auto md:mx-0" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '540px' }}>
            En Haxelera Group diseñamos y blindamos la infraestructura digital de las empresas más exigentes. Unimos el desarrollo de software a medida con perímetros de seguridad avanzados, creando ecosistemas resilientes de manera natural y fluida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start w-full sm:w-auto" style={{ display: 'flex', gap: '16px' }}>
            <a href="#software" className="btn-primary w-full sm:w-auto justify-center" style={{ display: 'flex', justifyContent: 'center' }}>
              Nuestros Servicios
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contacto" className="btn-secondary w-full sm:w-auto justify-center" style={{ display: 'flex', justifyContent: 'center' }}>
              Auditoría Gratuita
            </a>
          </div>

          {/* Core tech tags */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-12 pt-8 border-t border-white border-opacity-5 w-full" style={{ display: 'flex', gap: '24px', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid hsla(0, 0%, 100%, 0.05)', color: 'var(--text-dark)' }}>
            <div className="flex items-center gap-2 font-heading font-medium text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-primary" style={{ color: 'var(--primary)' }} />
              Zero Trust
            </div>
            <div className="flex items-center gap-2 font-heading font-medium text-xs uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-accent" style={{ color: 'var(--accent)' }} />
              DevSecOps
            </div>
            <div className="flex items-center gap-2 font-heading font-medium text-xs uppercase tracking-wider">
              <Network className="w-4 h-4 text-primary" style={{ color: 'var(--primary)' }} />
              IA Protegida
            </div>
          </div>
        </div>

        <div className="relative flex justify-center z-10 w-full">
          {/* Subtle outer tech circle glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full border border-white border-opacity-5 animate-spin-slow" style={{ borderStyle: 'dashed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          
          <MatrixPoemWidget />
        </div>
      </div>
    </section>
  );
}
