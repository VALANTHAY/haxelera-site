import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Cloud, Briefcase, ShieldCheck } from 'lucide-react';

const AnimatedCounter = ({ value, suffix = '', label, sub }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/,/g, ''));
    if (isNaN(end)) return;

    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div 
      className="glass-card flex flex-col justify-between items-center text-center p-6"
      style={{
        background: 'hsla(0,0%,100%,0.02)',
        border: '1px solid hsla(0,0%,100%,0.04)',
        borderRadius: '16px',
        padding: '28px',
        minHeight: '180px'
      }}
    >
      <div 
        className="font-heading font-extrabold text-4xl tracking-tight mb-2 gradient-text-dual"
        style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div>
        <div className="font-heading font-bold text-sm text-white mb-2" style={{ fontSize: '0.9rem' }}>
          {label}
        </div>
        <div className="font-body text-xs text-muted" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

export default function Metrics() {
  const statCards = [
    { value: '2', suffix: ' Veces', label: 'Tech Partner del Año', sub: 'Reconocimiento regional por calidad' },
    { value: '99', suffix: '%', label: 'Tasa de Satisfacción', sub: 'Compromiso absoluto con el cliente' },
    { value: '1000', suffix: 'K+', label: 'Cuentas Migradas', sub: 'A infraestructuras seguras en la Nube' },
    { value: '500', suffix: '+', label: 'Proyectos Exitosos', sub: 'Transformación digital garantizada' }
  ];

  const milestones = [
    {
      year: '2015',
      title: 'Partner Estratégico de Infraestructura',
      description: 'Nos convertimos en un Partner estratégico permitiendo la adopción masiva de herramientas de nube y ciberseguridad, logrando despliegues locales sobre cientos de miles de asientos.'
    },
    {
      year: '2018',
      title: 'Dominio y Certificaciones (Gold Nivel)',
      description: 'Nuestra competencia Gold Cloud Platform demuestra la experiencia en acelerar la adopción en la Nube, modernización de Data Centers e infraestructura híbrida. Además, alcanzamos el nivel Gold DevOps asegurando las mejores prácticas de desarrollo y Gold Data Analytics para transformar la toma de decisiones.'
    },
    {
      year: 'Actualidad',
      title: 'Expansión Global y Seguridad Zero-Trust',
      description: 'Consolidando nuestra presencia en el mercado de Estados Unidos, República Dominicana y Guatemala, proveemos consultoría tecnológica del más alto nivel enfocados en la satisfacción total de nuestros clientes empresariales.'
    }
  ];

  return (
    <section className="relative py-24" style={{ overflow: 'hidden' }}>
      <div className="section-container">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {statCards.map((stat, idx) => (
            <AnimatedCounter key={idx} value={stat.value} suffix={stat.suffix} label={stat.label} sub={stat.sub} />
          ))}
        </div>

        {/* History Timeline */}
        <div className="grid md:grid-cols-12 gap-12 items-start" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
          {/* Timeline Title Card */}
          <div className="md:col-span-5 flex flex-col items-start text-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="section-tag">
              NUESTRO HISTORIAL DE ÉXITO
            </div>
            <h3 className="section-title font-heading font-bold text-white mb-6">
              El Equipo de Especialistas en la <span className="gradient-text-sage">Nube</span>
            </h3>
            <p className="font-body text-muted leading-relaxed mb-6" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Nuestro equipo se especializa en las mejores herramientas tecnológicas disponibles, con el objetivo de ofrecer soluciones óptimas a sus necesidades. "Tu solución es nuestro compromiso."
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-white bg-opacity-5 border-opacity-5" style={{ display: 'flex', gap: '12px', background: 'hsla(0,0%,100%,0.02)', border: '1px solid hsla(0,0%,100%,0.04)', borderRadius: '12px', padding: '16px' }}>
              <Award className="w-8 h-8 text-copper" style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div className="font-body text-xs text-left" style={{ color: 'var(--text-main)', fontSize: '0.75rem' }}>
                <span className="font-bold">Galardonados:</span> Hemos sido premiados por la calidad y responsabilidad que caracteriza a nuestro equipo.
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="md:col-span-7 flex flex-col gap-10 text-left" style={{ display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>
            {milestones.map((ms, idx) => (
              <div 
                key={idx}
                className="relative pl-8 border-l border-white border-opacity-10 group"
                style={{
                  borderLeft: '2px solid hsla(0,0%,100%,0.08)',
                  paddingLeft: '24px',
                  position: 'relative'
                }}
              >
                {/* Visual timeline circle indicator */}
                <div 
                  className="absolute w-4 h-4 rounded-full border bg-black transition-all duration-300 group-hover:scale-125"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'var(--bg-color)',
                    borderColor: idx === 1 ? 'var(--accent)' : 'var(--primary)',
                    borderWidth: '2px',
                    left: '-7px',
                    top: '6px',
                    boxShadow: idx === 1 ? '0 0 8px var(--accent)' : '0 0 8px var(--primary)'
                  }}
                ></div>

                {/* Milestone year */}
                <div 
                  className="font-heading font-extrabold text-xl mb-2"
                  style={{
                    color: idx === 1 ? 'var(--accent)' : 'var(--primary)',
                    fontSize: '1.25rem'
                  }}
                >
                  {ms.year}
                </div>

                {/* Milestone copy */}
                <h4 className="font-heading font-bold text-lg text-white mb-2" style={{ fontSize: '1.1rem' }}>
                  {ms.title}
                </h4>
                <p className="font-body text-muted leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {ms.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
