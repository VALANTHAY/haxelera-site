import React from 'react';
import { ArrowRight, ShieldCheck, Terminal, Network, Activity } from 'lucide-react';

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
        <div className="flex flex-col items-start z-10">
          <div className="section-tag flex items-center gap-2">
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
          
          <p className="text-lg text-muted mb-8 font-body max-w-xl" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '540px' }}>
            En Haxelera Group diseñamos y blindamos la infraestructura digital de las empresas más exigentes. Unimos el desarrollo de software a medida con perímetros de seguridad avanzados, creando ecosistemas resilientes de manera natural y fluida.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#software" className="btn-primary">
              Nuestros Servicios
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contacto" className="btn-secondary">
              Auditoría Gratuita
            </a>
          </div>

          {/* Core tech tags */}
          <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white border-opacity-5" style={{ display: 'flex', gap: '24px', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid hsla(0, 0%, 100%, 0.05)', color: 'var(--text-dark)' }}>
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

        {/* Right Side Visual (Cybersecurity Dashboard Simulation) */}
        <div className="relative flex justify-center z-10">
          {/* Subtle outer tech circle glow */}
          <div className="absolute w-80 h-80 rounded-full border border-white border-opacity-5 animate-spin-slow" style={{ borderStyle: 'dashed' }}></div>
          
          <div className="glass-card w-full max-w-md p-6" style={{ width: '100%', maxWidth: '440px', border: '1px solid hsla(135, 25%, 55%, 0.12)' }}>
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white border-opacity-5" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsla(0, 0%, 100%, 0.05)', paddingBottom: '12px' }}>
              <div className="flex items-center gap-2" style={{ display: 'flex', gap: '6px' }}>
                <span className="w-3 h-3 rounded-full bg-red-500 bg-opacity-30" style={{ background: 'hsla(0, 80%, 50%, 0.25)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 bg-opacity-30" style={{ background: 'hsla(45, 80%, 50%, 0.25)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                <span className="w-3 h-3 rounded-full bg-green-500 bg-opacity-30" style={{ background: 'hsla(135, 80%, 50%, 0.25)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-dark)', fontSize: '0.75rem' }}>hax-core-sentry.sh</span>
            </div>

            {/* Dashboard Stats */}
            <div className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'col', gap: '16px' }}>
              <div className="flex justify-between items-center bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-5" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'hsla(0,0%,100%,0.02)', borderRadius: '8px', border: '1px solid hsla(0,0%,100%,0.04)' }}>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} />
                  <div>
                    <div className="text-xs text-muted" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>INTEGRIDAD DEL SISTEMA</div>
                    <div className="font-heading font-bold text-sm tracking-wide">ESTABLE - 99.98%</div>
                  </div>
                </div>
                <div className="text-xs text-primary font-mono font-bold" style={{ color: 'var(--primary)' }}>OK</div>
              </div>

              <div className="flex justify-between items-center bg-white bg-opacity-5 p-3 rounded-lg border border-white border-opacity-5" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'hsla(0,0%,100%,0.02)', borderRadius: '8px', border: '1px solid hsla(0,0%,100%,0.04)' }}>
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-accent" style={{ color: 'var(--accent)' }} />
                  <div>
                    <div className="text-xs text-muted" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PERÍMETRO DE RED</div>
                    <div className="font-heading font-bold text-sm tracking-wide">ACTIVO - ZERO TRUST</div>
                  </div>
                </div>
                <div className="text-xs text-accent font-mono font-bold" style={{ color: 'var(--accent)' }}>SECURE</div>
              </div>

              {/* Pseudo-Code Console Screen */}
              <div className="font-mono text-xs p-4 rounded-lg bg-black bg-opacity-30 border border-white border-opacity-5 text-left flex flex-col gap-1.5" style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid hsla(0,0%,100%,0.04)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <div className="text-primary font-semibold" style={{ color: 'var(--primary)' }}>$ hax_firewall --status</div>
                <div>&gt; Checking internal secure socket layers... [PASS]</div>
                <div>&gt; Loading organic load balancer routing... [OK]</div>
                <div className="text-accent" style={{ color: 'var(--accent)' }}>&gt; Warning: IP 192.168.1.104 rejected at secure gate [ISOLATED]</div>
                <div>&gt; System secure-by-design integrity: [100% SECURE]</div>
              </div>

              {/* Progress bar simulation */}
              <div className="flex flex-col gap-1.5" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="flex justify-between text-xs font-heading font-medium" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Monitoreo de Amenazas</span>
                  <span className="text-primary" style={{ color: 'var(--primary)' }}>Completo</span>
                </div>
                <div className="w-full h-1.5 bg-white bg-opacity-5 rounded-full overflow-hidden" style={{ width: '100%', height: '6px', background: 'hsla(0,0%,100%,0.05)', borderRadius: '100px' }}>
                  <div className="h-full bg-primary" style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '100px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
